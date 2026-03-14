# EKIOBA Security Architecture

## Recommended Security Structure

```text
[ Next.js Frontend ] --> HTTPS --> [ Django/FastAPI Backend ] --> TLS --> [ CockroachDB ]
         |                                |                                |
   Auth via JWT/OAuth2              Secrets via GCP SM              RBAC + TLS certs
```

## Control Layers

### 1. Frontend to Backend (HTTPS)
- Enforce HTTPS only for all public endpoints.
- Use JWT/OAuth2 access tokens in `Authorization: Bearer <token>`.
- Store access tokens in secure HTTP-only cookies when possible.
- Configure CORS allowlists to only trusted frontend origins.

### 2. Backend Authentication and Authorization
- Use OAuth2/OIDC provider (Google, Auth0, Firebase Auth, or equivalent).
- Validate JWT signature, issuer (`iss`), audience (`aud`), and expiry (`exp`) on every protected request.
- Apply route-level authorization by role/permission claims.
- Keep payment endpoints idempotent and log signed transaction references only.

### 3. Secrets Management (GCP Secret Manager)
- Keep keys/tokens out of code and `.env` in production.
- Store blockchain and app secrets in Secret Manager:
  - `TON_API_KEY`
  - `SOLANA_RPC_URL`
  - `DJANGO_SECRET_KEY`
  - `COCKROACHDB_STORE_URL`
  - `COCKROACHDB_HOTELS_URL`
- Grant least-privilege access via `roles/secretmanager.secretAccessor` to runtime service accounts only.

### 4. Backend to Database (TLS)
- Use CockroachDB with TLS enabled in production.
- Use `sslmode=require` or stronger (`verify-full` where certificates are managed).
- Restrict network access to database endpoints by private networking/VPC rules.

### 5. Database Security (RBAC + Certificates)
- Use dedicated DB users per service (`store`, `hotels`, analytics, etc.).
- Grant minimum required privileges to each role.
- Rotate DB credentials and certificates regularly.
- Enable audit logging and monitor unusual query patterns.

## Service Hardening Checklist

- [ ] HTTPS enabled at ingress/load balancer.
- [ ] JWT/OAuth2 validation middleware enabled for protected endpoints.
- [ ] CORS restricted to approved frontend domains.
- [ ] Secrets loaded from GCP Secret Manager in Cloud Run.
- [ ] CockroachDB TLS enabled with non-insecure mode.
- [ ] Per-service DB credentials and RBAC policy in place.
- [ ] CI/CD does not print secrets in logs.
- [ ] Security headers enabled (HSTS, X-Content-Type-Options, X-Frame-Options, CSP).

## EKIOBA Implementation Notes

- `store` and `hotels` already support env-based DB URLs via `COCKROACHDB_URL`; set this to TLS-enabled URLs in production.
- Keep local Docker development with insecure settings isolated from production.
- For Iyobo and blockchain endpoints, apply token-based auth before enabling public write actions.
