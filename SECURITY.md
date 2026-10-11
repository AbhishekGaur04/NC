# Security notes

## Implemented in this repository

- No secrets or API keys are required by the frontend. `.env` files are ignored by Git.
- Checkout fields are length-limited and validated before an order message is generated.
- Lock identifiers use `crypto.randomUUID()` when available.
- Vercel responses include CSP, HSTS, clickjacking, MIME-sniffing, referrer, permissions, and cross-origin policies.
- User-facing flows display generic errors rather than exception details.

## Important deployment boundary

This project is currently a static client-only storefront. The in-memory inventory lock and the WhatsApp order handoff are UX features, not security controls. Before accepting real payments or personal data, add a server-side API that:

- authenticates users and admins with a real identity provider and 2FA for admins;
- validates ownership server-side and enforces row-level authorization;
- verifies webhook signatures and performs atomic stock/order transactions;
- keeps secrets server-side, applies rate limits, and stores uploads in a private bucket with type/size limits;
- produces backups and regularly tests restore procedures.

Never treat a browser-supplied user ID, price, stock level, or order status as authoritative.
