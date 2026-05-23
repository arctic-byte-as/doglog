## MailHog (local SMTP testing)

Install and run MailHog for locally capturing email links sent by NextAuth:

1. Homebrew (macOS):

```bash
brew update
brew install mailhog
mailhog
```

MailHog's web UI will be available at http://localhost:8025 and SMTP at localhost:1025.

2. Docker:

```bash
docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

3. Configure `.env`:

Set the SMTP host/port to MailHog in `.env`:

```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="Norse Paw <no-reply@norsepaw.test>"
```

After this, sign-in email links from `/login` will appear in the MailHog UI.
