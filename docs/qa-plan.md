# Quality Assurance Plan

## 1. Test Levels
* **Unit Testing:** Focuses on individual functions and utilities (e.g., data formatting, calculations). Executed via **Jest**.
* **Integration Testing:** Ensures UI components render correctly with mocked state. Executed via **React Testing Library**.
* **System/E2E Testing:** Validates the end-to-end user journey across different viewports (Desktop/Mobile) and route navigations. Executed manually.

## 2. Entry & Exit Criteria
* **Entry Criteria:**
    * Feature development is complete based on acceptance criteria.
    * Code compiles locally without warnings or linting errors.
    * Pull Request is opened against the `main` branch.
* **Exit Criteria:**
    * All automated tests pass successfully in the CI/CD pipeline.
    * Code review is approved by at least one peer.
    * Zero S1 (Critical) or S2 (High) defects remain unresolved.

## 3. Severity Levels
| Level | Description | Example |
| :--- | :--- | :--- |
| **S1 (Critical)** | App crash, broken routing, or complete failure of a core user journey. | The dashboard returns a 500 error on load. |
| **S2 (High)** | Major functionality is broken, and no workaround exists. | A data table renders completely empty. |
| **S3 (Medium)** | Minor functionality is broken, or a visual defect exists with a workaround. | A chart legend overlaps with text on mobile view. |
| **S4 (Low)** | Cosmetic issue, typo, or minor annoyance that does not impact usability. | "Supply Chain" is misspelled in a tooltip. |