# MidCoast Web Co — Website Security Baseline

Apply this baseline to every new client website unless the project has stricter requirements.

## 1. Hosting and transport
- HTTPS only in production.
- Use Vercel-managed TLS/SSL or an equivalent managed certificate platform.
- Start HSTS at `max-age=86400; includeSubDomains` during rollout.
- After confirming all domain/subdomain traffic is HTTPS-only, increase HSTS to a long duration. Only add `preload` after deliberate verification.

## 2. Required response headers
Every public route should set:
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (or a CSP `frame-ancestors` policy where embedding is intentionally required)
- `Referrer-Policy: strict-origin-when-cross-origin`
- A restrictive `Permissions-Policy`

CSP should default to same-origin resources and explicitly allow only required third-party origins. Avoid `unsafe-eval`. Avoid `unsafe-inline` unless a framework requirement has been assessed and a nonce/hash strategy is not practical.

## 3. Secrets
- Never place private API keys, passwords, service tokens or private credentials in browser code.
- Store server-side secrets in Vercel Environment Variables or the relevant deployment secret store.
- `.env`, `.env.*`, `.vercel/`, logs and local editor files must be ignored by Git.
- Commit an `.env.example` containing names/placeholders only when developers need to know required variables.
- Treat anything prefixed `VITE_` as public because Vite exposes it to browser bundles.

## 4. Repositories and access
- Require strong unique passwords and 2FA/passkeys for GitHub, Vercel, domain registrar, DNS provider and business email.
- Keep client data and credentials out of repositories.
- Prefer private repositories where public source access provides no business benefit.
- Review collaborator access periodically and remove unused access.
- Enable dependency/security alerts where supported.

## 5. Dependencies
- Keep dependency versions current.
- Use lockfiles for application projects.
- Run vulnerability checks before launch and after major dependency changes.
- Remove unused packages and scripts.

## 6. Forms and APIs
Before any real enquiry/contact form is connected:
- Validate and normalize all input server-side.
- Enforce field length limits and accepted formats.
- Add bot/spam protection.
- Rate-limit submission endpoints.
- Do not trust hidden fields or browser-side validation.
- Return generic errors to users; keep technical detail in server logs.
- Restrict CORS to required origins rather than `*` for private APIs.

## 7. File uploads
If a client site accepts images/documents:
- Enforce maximum file sizes and upload counts.
- Allowlist required file extensions and MIME types.
- Generate server-side filenames rather than trusting submitted names.
- Store uploads outside executable application paths.
- Do not render unknown user uploads inline.
- Consider malware scanning for higher-risk or authenticated systems.

## 8. Data minimisation
- Collect only information needed for the enquiry/service.
- Avoid putting personal information into URLs or analytics events.
- Do not log passwords, tokens, full payment data or unnecessary customer information.

## 9. Static-first architecture
For brochure/local-business sites, prefer static pages with no database/admin panel unless a real business requirement justifies one. Every backend, plugin, CMS login and API increases the attack surface.

## 10. Pre-launch security check
Before launch verify:
1. HTTPS works and HTTP redirects correctly.
2. Security headers are present on the live domain.
3. CSP produces no required-resource violations.
4. No secrets exist in the current repo or build output.
5. `.env` patterns are ignored.
6. Forms are server-validated, rate-limited and bot-protected.
7. Upload controls are enforced if uploads exist.
8. Dependencies have been checked for known vulnerabilities.
9. GitHub/Vercel/domain/DNS accounts use 2FA/passkeys.
10. A known-good version can be redeployed quickly.

## 11. Incident response
If a compromise is suspected:
1. Preserve evidence/logs before deleting anything where practical.
2. Revoke and rotate exposed credentials immediately.
3. Disable the vulnerable endpoint/integration.
4. Redeploy from a known-good commit.
5. Review Git history and deployment logs for the entry point.
6. Patch the cause, not only the visible symptom.
7. Notify affected parties where contractual or legal obligations apply.

This baseline is a minimum. Sites with authentication, ecommerce, customer portals, databases, payments, sensitive information or privileged administration require a project-specific security review.
