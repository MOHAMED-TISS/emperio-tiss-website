# Repository Code Formatting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformat all repository source/configuration code into a consistent, readable style without changing application behavior.

**Architecture:** Use a one-time GitHub Actions formatter so the entire repository is formatted from the same toolchain rather than manually rewriting individual files. Format source/config extensions supported by Prettier, leave binary/media assets untouched, and self-delete the temporary workflow after committing the formatting pass.

**Tech Stack:** GitHub Actions, Node.js, Prettier.

**Spec:** User request: “fix all repo code indentment so the code could be readble and clear”.

## Global Constraints

- Preserve runtime behavior and content; formatting only.
- Do not modify images, fonts, or other binary/media assets.
- Format HTML, CSS, JavaScript/ES modules, JSON/JSONC, and YAML/YML source/configuration files.
- Use consistent two-space indentation and formatter-managed line wrapping.
- Do not permanently add formatter infrastructure solely for this cleanup.
- Verify the resulting main branch and confirm the temporary formatter workflow is removed.

---

### Task 1: One-time repository formatting pass

**Files:**
- Create: `.github/workflows/format-code-once.yml`
- Modify: all tracked `*.html`, `*.css`, `*.js`, `*.mjs`, `*.json`, `*.jsonc`, `*.yml`, and `*.yaml` files that Prettier changes.
- Verify: repository branch state and resulting commit history.

**Interfaces:**
- Consumes: current `main` branch source tree.
- Produces: a formatting-only commit on `main`, with the temporary workflow removed in the same formatter commit.

- [ ] **Step 1: Add the one-time formatter workflow**

The workflow checks out `main`, runs Prettier over all supported source/config files, deletes itself, and commits only when formatting changes exist.

- [ ] **Step 2: Trigger the formatter by pushing the workflow**

The formatter runs automatically from the push that creates the workflow file.

- [ ] **Step 3: Let the formatter commit the repo-wide changes**

The workflow uses the repository write token and creates one formatting commit after successful formatting.

- [ ] **Step 4: Verify the resulting tree**

Confirm the one-time workflow file no longer exists and the current `main` tree contains the formatted source files.

- [ ] **Step 5: Verify behavior-sensitive files syntactically**

Run the repository’s existing validation workflows/tests where available and confirm there are no syntax errors introduced by formatting.
