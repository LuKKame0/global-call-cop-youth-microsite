# Engineering Standards

## Code organization

1. **Surface-specific UI** lives in `sites/marketing/` (static) or `components/` (React).
2. **Business logic** lives in `lib/` — never in route handlers beyond parsing/response.
3. **API routes** validate with Zod, delegate to `lib/`, return `{ ok: boolean }` JSON.
4. **Email** always goes through `lib/email/` — no direct Resend calls in routes.

## Branding

Source of truth: `branding/BRANDING.md`

| Token | Light | Dark |
|-------|-------|------|
| Blue | `#37ABFA` | same |
| Green | `#61C879` | same |
| Pink | `#FF91FE` | same |
| Orange | `#FF460D` | same |
| Page bg | `#F7F7F8` | `#050505` |
| Text | `#101014` | `#F4F4F5` |

- CSS variables: `app/globals.css` (framework), `sites/marketing/styles.css` (marketing)
- Theme key: `localStorage.tgc-theme`, default **`light`**
- Email templates: light shell in `lib/email/templates/shell.ts`

## Security

- Rate limiting on `/api/*` via `middleware.ts`
- Auth guard on `/dashboard`, `/org`, `/admin`
- CSP + HSTS in `next.config.ts`
- Sanitize user input in `lib/security/sanitize.ts` for submissions
- Never commit `.env.local` or secrets

## Forms & email

Every public form must:

1. Define a Zod schema in `lib/forms/`
2. Have a dedicated email module with **applicant confirmation** + **internal notification**
3. Use `INTERNAL_NOTIFY_EMAILS` env (not hardcoded lists in new code)

## Testing

- Unit/integration: Vitest (`npm test`)
- Type safety: `npm run typecheck`
- Lint: `npm run lint`
- Format: Prettier (`npm run format:check`)

Add tests for new Zod schemas and email text generation when behavior is non-trivial.

## Git & commits

- Conventional, imperative commit messages
- One logical change per commit
- Do not commit `public/marketing/` if generated at build (included via prebuild)

## Accessibility

- Marketing HTML: semantic landmarks, skip links, aria labels on modals
- React: keyboard nav in wizard, focus management, sufficient contrast in light mode

## Performance

- Marketing: static assets, minimal JS, defer non-critical scripts
- Framework: code-split heavy dashboard routes; prefer Server Components where possible

## Adding a new partner funnel

1. Create HTML page in `sites/marketing/`
2. Add route rewrite in `middleware.ts` if clean URL needed
3. Add `lib/forms/<name>-schema.ts`
4. Add `lib/email/marketing/<name>.ts`
5. Add `app/api/<name>/route.ts`
6. Wire form `data-endpoint="/api/<name>"`
7. Document in `docs/ARCHITECTURE.md`
