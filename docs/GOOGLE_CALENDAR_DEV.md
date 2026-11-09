# Google Calendar connection — Dev

Trainer entry point: Services → Consultations → Google Calendar & Meet connection (`/services/consultations/google`). This phase connects an account, checks access to its primary calendar and removes the locally saved connection. It does not create appointments, Meet links, invitations or notifications.

## Google configuration

A dedicated Norse Paw Calendar Dev web OAuth client is used, separate from Supabase production sign-in. Calendar API must be enabled; the connecting Google account must be included as a test user while the Google project is External/Testing.

Registered redirect URI:
`https://doglog-development-tectrap-projects.vercel.app/api/integrations/google/callback`

Requested scopes: OpenID/email to verify and display the selected Google account; `https://www.googleapis.com/auth/calendar.events.owned` for future consultation events on the trainer's own calendar. Google consent is requested with offline access and account selection. Calendar access checking reads only the `accessRole` field of an events-list response; event content is neither returned nor stored.

## Server configuration

Ignored local `.env` and isolated Vercel doglog-development Preview branch `feature/google-calendar-dev`:

- `GOOGLE_CALENDAR_CLIENT_ID`
- `GOOGLE_CALENDAR_CLIENT_SECRET`
- `GOOGLE_CALENDAR_ENCRYPTION_KEY` — random 32-byte key, base64 encoded; preserve it to read saved connections.
- `GOOGLE_CALENDAR_ENABLED=true`
- `GOOGLE_CALENDAR_REDIRECT_URI` — exact callback above.

`scripts/deploy-google-calendar-dev.cjs` checks project/DB/redirect identities and deploys with `--env NAME`, reading values from the child process environment rather than placing secrets in command-line arguments. Configuration is scoped to that deployment. It prints only a deployment URL/status and refuses production. Shared project Preview environment variables are not changed. No secrets belong in screenshots, source files, git or logs. Keep a private backup of the encryption key.

The integration fails closed if configuration is absent. OAuth is separate from Supabase sign-in, so the existing production login client and secret are unaffected. No production deployment or database migration is included.

## Security and storage

Trainer-scoped AppContent keys store AES-256-GCM encrypted access/refresh tokens and pending PKCE data. Context-bound authenticated encryption prevents moving encrypted records between trainers or purposes. OAuth state uses a random nonce, same-browser HttpOnly/Secure/SameSite=Lax cookie, an authenticated trainer/user binding, 10-minute expiry, PKCE S256, and an atomic single-use exchange reservation. A cancelled/replaced/disconnected exchange cannot recreate a connection afterward. Google ID tokens are verified with Google's server library before storing account identity, and Calendar permission/refresh access is required.

Connect/check/disconnect actions are authenticated POST routes with exact configured same-origin checks. Browser responses contain only safe status or an authorization URL. Callback errors are generic and redirect only to the fixed configured origin, with no-store/no-referrer. Connection checks update only the same stored version, preventing late refreshes from restoring disconnected tokens.

Disconnect deletes saved credentials and pending authorization in NorsePaw. It leaves events unchanged and does not revoke Google-wide project permissions, because the same Google Cloud project also hosts existing login credentials. Users can remove permissions through their Google account settings separately.

Testing-mode Google grants may expire after seven days; reconnect when required. Moving to production and changing Google's publishing/verification configuration is a separate release.

## Verification

`node --test tests/*.test.cjs` and `npm run build` cover local regressions, encryption/context/tamper protection, origin/role checks, offline PKCE parameters, replay/expiry/user/trainer binding, safe status, connection checking and disconnect races. Google requests are mocked in unit tests; live account authorization requires the owner to choose their account and consent in the Dev UI.
