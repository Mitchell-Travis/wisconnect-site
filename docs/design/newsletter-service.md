# Newsletter signup service

The homepage uses a clean white invitation with Mitchell’s supplied gold ribbon sculpture, continuous page rails and an integrated email signup beneath the main message. No Mobbin reference artwork or photography is shipped in this section.

## What is built

- PostgreSQL subscriber storage (migration `0003_newsletter`) separate from membership accounts.
- `POST /newsletter/subscribe` accepts an email plus affirmative consent. Addresses are normalized and unique. An atomic resend claim prevents duplicate email under concurrent requests and limits resends to once per minute.
- Confirmation emails contain a 24-hour, single-use confirmation link and an unsubscribe link. Only SHA-256 token hashes are stored. Confirmation and unsubscribe require an explicit POST action, so an email scanner following a link cannot change the subscription.
- `POST /newsletter/confirm` activates the address; `POST /newsletter/unsubscribe` cancels pending or active subscriptions. Resubscribing requires confirmation again.
- `GET /auth/newsletter-subscribers` is restricted to existing administrators. It defaults to confirmed subscribers, supports `status=pending|subscribed|unsubscribed` and cursor pagination via `before`, and never returns tokens. This is an API endpoint; a dashboard newsletter screen and campaign editor are not part of this increment.
- The signup form preserves the address on failure, announces feedback, and shows “Check your inbox” only after the server accepts the request. A duplicate address gets the same generic response.

## Local startup

Use the project’s normal PostgreSQL/Mailpit environment:

```sh
npm run auth:up
npm run db:migrate
npm run dev:api
npm run dev
npm run newsletter:check
```

Open `http://localhost:3000/#join`. Email is captured at `http://localhost:8025`; no mail is delivered externally. The API uses the existing local pilot boundary: explicit `WISCONNECT_LOCAL_AUTH=1`, loopback clients, trusted host/origin and the custom request header. The launcher sets the opt-in flag. The database URL is configurable through `DATABASE_URL`; `.env` is not automatically loaded by the Python launcher.

On 12 October, Docker was unavailable on this machine. For review, an isolated PostgreSQL 17 cluster was created at `/tmp/wisconnect-newsletter-pg` using the official Postgres.app 2.9.6 binaries mounted at `/tmp/wisconnect-postgres-mount`. It listens on 127.0.0.1:5432 with the normal development database credentials. Mailpit 1.29.0 runs from `/tmp/wisconnect-mailpit/mailpit`, bound only to 127.0.0.1:1025/8025, with data at `/tmp/wisconnect-mailpit/messages.db`. These are temporary preview services, not production storage; no previous database was replaced. Stop the preview PostgreSQL process with its `pg_ctl -D /tmp/wisconnect-newsletter-pg stop` before starting Docker on the same port. The normal compose volume remains the intended persistent local environment.

Downloads: [Postgres.app](https://postgresapp.com/downloads.html), [Mailpit 1.29.0](https://github.com/axllent/mailpit/releases/tag/v1.29.0).

## Hosting boundary

GitHub Pages hosts static files and cannot run this API. The hosted form is clearly marked “coming soon” and disabled; it never sends visitors’ addresses to localhost. The API and email links are deliberately local-only in this increment.

Before public activation: host the API and persistent PostgreSQL database, configure HTTPS and the approved frontend origin, connect a verified email sender, replace local confirmation URLs, add production rate limiting/monitoring/backups and agree the subscriber retention policy. Keep authentication boundaries intact. Broadcast delivery needs unsubscribe links and must select only currently confirmed subscribers. No campaigns are sent by this service yet.

## Verification

`npm run newsletter:check` runs against an owned disposable PostgreSQL schema and Mailpit messages. It covers migrations, validation, request boundaries, concurrent duplicate signup, hashed tokens, single-use confirmation, expiry, unsubscribe/resubscribe, SMTP failure/retry, admin-only listing and throttling. It deletes only the schema and mail it creates. Existing contact and authentication integration checks also passed.
