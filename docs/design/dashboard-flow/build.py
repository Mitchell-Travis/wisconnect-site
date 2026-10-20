"""Build the offline review board. Standard library only; no application changes."""
import base64
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def uri(path, mime):
    return f"data:{mime};base64," + base64.b64encode(Path(path).read_bytes()).decode()

data = json.loads((ROOT / "research.json").read_text())
for reference in data["references"]:
    reference["image"] = uri(ROOT / "dist/assets" / reference["file"], "image/webp")
html = (ROOT / "template.html").read_text()
html = html.replace("/* EMBED_CSS */", (ROOT / "style.css").read_text() + "\n" + (ROOT / "ui.css").read_text())
html = html.replace("/* EMBED_JS */", (ROOT / "app.js").read_text() + "\n" + (ROOT / "ui.js").read_text())
html = html.replace("/* EMBED_LOGO */", uri(ROOT.parents[2] / "public/assets/logo-horizontal.webp", "image/webp"))
html = html.replace("/* EMBED_FONT */", uri(ROOT / "dist/assets/InterVariable.woff2", "font/woff2"))
html = html.replace("/* EMBED_DATA */", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"))
(ROOT / "dist/index.html").write_text(html)
(ROOT / "WisConnect-Dashboard-Blueprint.html").write_text(html)
print(f"Built {ROOT / 'dist/index.html'} ({len(html.encode()):,} bytes)")

# Account journey companion, with only inspected Mobbin references embedded.
account_refs = [{"title": "Square · Sign in", "file": "account-square-login.jpg", "mime": "image/jpeg", "url": "https://mobbin.com/screens/91fca814-76a0-4e1c-8f4c-80b79ab778b3", "take": "Inspected 13 October 2026: visible password label, nearby recovery link, one primary action and a separate brand panel."}]
for key in ["square-recovery", "square-email", "attio-invite"]:
    ref = next(x for x in data["references"] if x["id"] == key)
    account_refs.append({"title": ref["brand"] + " · " + ref["flow"], "url": ref["url"], "take": ref["take"], "image": ref["image"]})
for ref in account_refs:
    if "file" in ref:
        ref["image"] = uri(ROOT / "dist/assets" / ref.pop("file"), ref.pop("mime"))
account = (ROOT / "account-template.html").read_text()
for marker, value in {
    "/* ACCOUNT_CSS */": (ROOT / "account.css").read_text(),
    "/* ACCOUNT_JS */": (ROOT / "account.js").read_text(),
    "/* ACCOUNT_FONT */": uri(ROOT / "dist/assets/InterVariable.woff2", "font/woff2"),
    "/* ACCOUNT_LOGO */": uri(ROOT.parents[2] / "public/assets/logo-horizontal.webp", "image/webp"),
    "/* ACCOUNT_REFS */": json.dumps(account_refs, ensure_ascii=False).replace("</", "<\\/"),
}.items():
    account = account.replace(marker, value)
(ROOT / "WisConnect-Account-Flow.html").write_text(account)
(ROOT / "dist/WisConnect-Account-Flow.html").write_text(account)
(ROOT / "dist/WisConnect-Dashboard-Blueprint.html").write_text(html)
print(f"Built account review ({len(account.encode()):,} bytes)")
