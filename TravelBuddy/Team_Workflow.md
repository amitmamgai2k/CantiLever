# Team Collaboration Workflow

This document outlines the development workflow for our 4-member team building the **TravelBuddy** application. Adhering to this process ensures code quality, minimizes conflicts, and streamlines deployment.

## 1. Branching Strategy

We follow a **Feature Branch Workflow** (simplified Gitflow) to manage our codebase.

### **Core Branches**
*   **`main`**: The production-ready branch. This code is always deployable. **Direct commits are blocked.**
*   **`develop`**: The primary integration branch. All feature branches are merged here first for testing before moving to `main`.

### **Feature Branches**
*   **Naming Convention**: `feature/<developer-initials>-<feature-name>` or `fix/<developer-initials>-<bug-name>`
    *   Example: `feature/am-private-messaging` or `fix/jd-login-error`
*   **Source**: Always branch off from `develop`.
*   **Lifespan**: Should be short-lived. Merge back as soon as the feature is complete.

---

## 2. Development Lifecycle

### **Step 1: Sync & Branch**
Before starting new work, always ensure you have the latest code.
```bash
git checkout develop
git pull origin develop
git checkout -b feature/am-new-feature
```

### **Step 2: Develop & Commit**
*   Write clear, modular code following the project's style guide.
*   **Commit Messages**: Use descriptive specific messages (Conventional Commits recommended).
    *   `feat: add user profile components`
    *   `fix: resolve socket connection timeout`

### **Step 3: Keep Updated**
To avoid merge conflicts later, frequently pull changes from `develop` into your branch.
```bash
git fetch origin
git merge origin/develop
# functionality check after merge
```

### **Step 4: Pull Request (PR)**
When the feature is ready:
1.  Push your branch: `git push origin feature/am-new-feature`.
2.  Open a **Pull Request** on GitHub/GitLab targeting **`develop`**.
3.  **Description**: detailed explination of changes, screenshots (if UI), and relevant ticket IDs.
4.  **Assign Reviewers**: specific team members must review.

---

## 3. Code Review Process (The "4-Eyes" Rule)

Since we are a team of four, **at least one** other team member must approve a PR before merging.

*   **Reviewer Responsibilities**:
    *   Check for logic errors and bugs.
    *   Ensure code style consistency.
    *   Verify no console logs or commented-out code are left behind.
    *   Test the functionality locally if complex.
*   **Author Responsibilities**:
    *   Respond to comments constructively.
    *   Make requested changes and re-push.

---

## 4. Merging & Deployment

1.  Once approved, **Squash and Merge** the PR into `develop`.
2.  Delete the remote feature branch.
3.  **Weekly/Bi-weekly Release**:
    *   The Team Lead merges `develop` into `main` for production release after a final stability check.

---

## 5. Communication & Meetings

*   **Daily Standup (15 mins)**:
    *   What did I do yesterday?
    *   What will I do today?
    *   Any blockers?
*   **Merge Window**: alert the team in the group chat before merging large changes to `develop` to avoid disrupting others.

## 6. Project Setup Standards

*   All members must use the same **Node version** (LTS).
*   Use `.env.example` to share environment variable stucture (never commit `.env` files).
*   Run `npm run lint` (if configured) before pushing.
