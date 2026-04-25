# Git Workflow & Branching Rules

1. **Main Branch Protection:** Direct commits to `main` are strictly prohibited.
2. **Feature Branches:** All work must be done on branches named `feature/issue-number-short-desc` (e.g., `feature/12-markets-layout`).
3. **Pull Requests (PR):** All changes must go through a PR.
4. **Code Review:** PRs require at least 1 approval from a team member before merging.
5. **CI Checks:** Code must pass `pnpm build` and `pnpm lint` before merging.

## Commit Message Types

1. **feat (Feature):** Used when you are adding brand new functionality to the application.
	- Example: `feat: add WebSocket typing indicator`
2. **fix (Bug Fix):** Used when you are resolving a bug or issue in the existing code.
	- Example: `fix: resolve hydration mismatch on the dashboard`

### Secondary Types

These are used for organizational, structural, or maintenance work that doesn't necessarily add a direct user-facing feature.

1. **chore:** Maintenance tasks, updating dependencies, or modifying configuration files. These changes usually don't touch your actual production source code.
	- Example: `chore: update Supabase client to latest version`
2. **refactor:** A code change that neither fixes a bug nor adds a feature. It’s strictly for improving the structure, readability, or logic of existing code.
	- Example: `refactor: extract custom React hooks into separate files`
3. **docs:** Changes purely to documentation (README files, inline code comments, API specs).
	- Example: `docs: document the FastAPI WebSocket endpoints`
4. **style:** Changes that do not affect the meaning or logic of the code (formatting, missing semi-colons, adjusting indentation).
	- Example: `style: enforce Prettier formatting across the frontend`
5. **perf (Performance):** A code change specifically designed to improve performance.
	- Example: `perf: optimize algorithm for rendering the active user list`
6. **test:** Adding missing tests or correcting existing tests.
	- Example: `test: add unit tests for message broadcasting`