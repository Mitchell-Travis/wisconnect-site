"""Network-free checks for body limits, including streams without Content-Length."""

import unittest

from .app.request_limits import RequestBodyLimitMiddleware, body_limit


class RequestLimitChecks(unittest.IsolatedAsyncioTestCase):
    async def exercise(self, chunks, *, path="/auth/login", headers=(), method="POST"):
        sent, downstream = [], []
        consumed = 0

        async def receive():
            nonlocal consumed
            message = chunks[consumed]
            consumed += 1
            return message

        async def send(message):
            sent.append(message)

        async def endpoint(scope, receive, send):
            downstream.append(await receive())

        scope = {"type": "http", "path": path, "method": method, "headers": list(headers)}
        await RequestBodyLimitMiddleware(endpoint)(scope, receive, send)
        return sent, downstream, consumed

    def chunk(self, body, more=False):
        return {"type": "http.request", "body": body, "more_body": more}

    async def test_exact_limits_preserve_bytes_for_every_route_family(self):
        for path, limit in [("/auth/login", 8192), ("/newsletter/subscribe", 8192),
                            ("/contact", 16384), ("/auth/contact-inquiries/12", 16384), ("/introductions", 20480),
                            ("/auth/applications/12", 20480), ("/auth/businesses/12", 32768)]:
            with self.subTest(path=path):
                self.assertEqual(body_limit(path), limit)
                body = b"x" * limit
                sent, downstream, count = await self.exercise(
                    [self.chunk(body[:10], True), self.chunk(body[10:])], path=path)
                self.assertEqual(sent, [])
                self.assertEqual(downstream, [self.chunk(body)])
                self.assertEqual(count, 2)

    async def test_declared_oversize_rejected_without_read(self):
        for length in [b"8193", b"00008193", b"9" * 5000]:
            sent, downstream, count = await self.exercise([], headers=[(b"content-length", length)])
            self.assertEqual(sent[0]["status"], 413)
            self.assertEqual(downstream, [])
            self.assertEqual(count, 0)

    async def test_chunked_overflow_stops_reading_before_remaining_body(self):
        sent, downstream, count = await self.exercise([
            self.chunk(b"x" * 8192, True), self.chunk(b"x", True), self.chunk(b"unread tail")])
        self.assertEqual(sent[0]["status"], 413)
        self.assertEqual(downstream, [])
        self.assertEqual(count, 2)

    async def test_actual_bytes_checked_even_with_understated_length(self):
        sent, downstream, _ = await self.exercise(
            [self.chunk(b"x" * 8193)], headers=[(b"content-length", b"1")])
        self.assertEqual(sent[0]["status"], 413)
        self.assertEqual(downstream, [])

    async def test_malformed_or_duplicate_length_rejected(self):
        for headers in [[(b"content-length", b"-1")], [(b"content-length", b"invalid")],
                        [(b"content-length", b"1"), (b"content-length", b"2")]]:
            sent, downstream, count = await self.exercise([], headers=headers)
            self.assertEqual(sent[0]["status"], 400)
            self.assertEqual(downstream, [])
            self.assertEqual(count, 0)

    async def test_disconnect_does_not_run_endpoint(self):
        sent, downstream, _ = await self.exercise([
            self.chunk(b"incomplete", True), {"type": "http.disconnect"}])
        self.assertEqual((sent, downstream), ([], []))

    async def test_empty_request_accepted(self):
        sent, downstream, _ = await self.exercise([self.chunk(b"")], headers=[(b"content-length", b"0")])
        self.assertEqual(sent, [])
        self.assertEqual(downstream, [self.chunk(b"")])

    async def test_unrelated_and_read_requests_pass_through(self):
        chunk = self.chunk(b"x", True)
        for kwargs in [{"path": "/assets/test"}, {"method": "GET"}, {"method": "OPTIONS"}]:
            sent, downstream, count = await self.exercise([chunk], **kwargs)
            self.assertEqual((sent, downstream, count), ([], [chunk], 1))


if __name__ == "__main__":
    unittest.main()
