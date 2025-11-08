# Password Protection

This project uses [`next-password-protect`](https://github.com/instantcommerce/next-password-protect) to gate the application behind a simple password prompt. The integration is intended for staging and preview deployments rather than production-grade authentication.

## Configuration

- `NEXT_PASSWORD_PROTECT_PASSWORD` — required. The password users must enter. Set this in the deployment environment or in a local `.env.local` file (never commit real secrets).
- `PASSWORD_PROTECT` — optional. Defaults to `"true"`. Set to `"false"` to disable the password gate during development.

After changing either variable, restart the dev server so Next.js picks up the new values.


