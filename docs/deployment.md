# Deployment Plan

## Target Environment (Frontend)
* **Platform:** Vercel (Production)
* **Framework:** Next.js (App Router)

## Rollout Strategy: Blue-Green Deployment
We utilize Vercel's atomic deployments. Every push to `main` creates a unique preview URL. Once verified, the production alias is updated to point to the new build, ensuring zero downtime.

## Rollback Steps
1. Open the Vercel Dashboard.
2. Select the "Deployments" tab.
3. Locate the previous stable deployment (marked as "Production" prior to current).
4. Click "Instant Rollback" to redirect traffic to the stable build.
5. Investigate the faulty build logs in the "Logs" tab.

## Target Environment (Backend)