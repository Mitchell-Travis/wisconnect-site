"""Run backend regressions sequentially against disposable schemas and local Mailpit."""
import subprocess
import sys


CHECKS = (
    "request_limits", "rate_limits", "auth", "foundation", "sessions",
    "applications", "application_invitations", "businesses", "inquiries",
    "contact", "newsletter", "reports", "team",
)


def main():
    for name in CHECKS:
        print(f"Running backend.check_{name}", flush=True)
        subprocess.run([sys.executable, "-m", f"backend.check_{name}"],
                       check=True, timeout=180)
    print(f"PASS: all {len(CHECKS)} backend suites.", flush=True)


if __name__ == "__main__":
    main()
