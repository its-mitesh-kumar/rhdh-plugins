# Plugin Rename Scope: lightspeed → intelligent-assistant

## Overview

This document catalogs every change required to rename the three Lightspeed plugins to Intelligent Assistant across two repositories:

- **rhdh-plugins** (source code, plugin implementation)
- **rhdh-plugin-export-overlays** (build metadata, OCI packaging, catalog entities, E2E tests)

## Already Migrated (NOT in scope)

The following are already using `intelligent-assistant` naming:

- App-config namespace: `intelligent-assistant:` (not `lightspeed:`)
- RBAC permission strings: `intelligent-assistant.chat.read`, etc.
- Frontend route: `/intelligent-assistant`
- User-facing UI text and translations
- Icons (using PatternFly RhUiAiChatbotIcon / RhUiAiExperienceIcon)

---

## REPO 1: redhat-developer/rhdh-plugins

---

### 1. Directory Renames

| Current                       | New                                      |
| ----------------------------- | ---------------------------------------- |
| `workspaces/lightspeed/`      | `workspaces/intelligent-assistant/`      |
| `plugins/lightspeed/`         | `plugins/intelligent-assistant/`         |
| `plugins/lightspeed-backend/` | `plugins/intelligent-assistant-backend/` |
| `plugins/lightspeed-common/`  | `plugins/intelligent-assistant-common/`  |

**Internal source file renames are out of scope.** ~45 source files contain `lightspeed` in their filenames (components, hooks, utils, test files, fixtures, API reports). These are internal implementation details not visible to external consumers and will **not** be renamed to avoid a massive diff, loss of git history, and unnecessary churn. Only externally visible identifiers (package names, plugin IDs, scalprum keys, export names, API paths) are renamed.

---

### 2. package.json Files (7 files)

**Workspace root** — `workspaces/lightspeed/package.json`

- `"name": "@internal/lightspeed"` → `"@internal/intelligent-assistant"`
- `"repository.directory"` → update path

**Frontend plugin** — `plugins/lightspeed/package.json`

- `"name"` → `@red-hat-developer-hub/backstage-plugin-intelligent-assistant`
- `"backstage.pluginId"` → `"intelligent-assistant"`
- `"backstage.pluginPackage"` → update
- `"backstage.pluginPackages"` → update all 3
- `"scalprum.name"` → `red-hat-developer-hub.backstage-plugin-intelligent-assistant`
- `"scalprum.exposedModules"` → rename `LightspeedFABModule`, `LightspeedTranslationsModule` keys and paths
- `"exports"` → rename `./lightspeed-fab-module`, `./lightspeed-translations-module` subpath keys
- `"typesVersions"` → rename corresponding keys and paths
- `"dependencies"` → update `lightspeed-common` → `intelligent-assistant-common`
- `"repository.directory"` → update path

**Backend plugin** — `plugins/lightspeed-backend/package.json`

- `"name"` → `@red-hat-developer-hub/backstage-plugin-intelligent-assistant-backend`
- `"backstage.pluginId"` → `"intelligent-assistant"`
- `"backstage.pluginPackage"` → update
- `"backstage.pluginPackages"` → update all 3
- `"dependencies"` → update `lightspeed-common` → `intelligent-assistant-common`
- `"repository.directory"` → update path

**Common plugin** — `plugins/lightspeed-common/package.json`

- `"name"` → `@red-hat-developer-hub/backstage-plugin-intelligent-assistant-common`
- `"description"` → update
- `"backstage.pluginId"` → `"intelligent-assistant"`
- `"backstage.pluginPackage"` → update
- `"backstage.pluginPackages"` → update all 3
- `"repository.directory"` → update path

**Dev app packages** — `packages/app/package.json`, `packages/app-legacy/package.json`, `packages/backend/package.json`

- `"repository.directory"` → update paths
- `"dependencies"` → update all `lightspeed` package references

**yarn.lock** — ~22 entries referencing `lightspeed` packages. Auto-regenerated after rename.

---

### 3. Plugin Registration (pluginId — changes API mount path)

| File                                          | Current                                            | New                       |
| --------------------------------------------- | -------------------------------------------------- | ------------------------- |
| `plugins/lightspeed/src/plugin.ts:47`         | `createPlugin({ id: 'lightspeed' })`               | `'intelligent-assistant'` |
| `plugins/lightspeed/src/alpha/index.tsx`      | `createFrontendPlugin({ pluginId: 'lightspeed' })` | `'intelligent-assistant'` |
| `plugins/lightspeed-backend/src/plugin.ts:31` | `createBackendPlugin({ pluginId: 'lightspeed' })`  | `'intelligent-assistant'` |

**Impact**: Changing backend `pluginId` moves the API mount from `/api/lightspeed` to `/api/intelligent-assistant`.

---

### 4. API Refs and Base URLs

| File                                | Current                               | New                                              |
| ----------------------------------- | ------------------------------------- | ------------------------------------------------ |
| `src/api/api.ts:64`                 | `plugin.lightspeed.service`           | `plugin.intelligent-assistant.service`           |
| `src/api/notebooksApi.ts:64`        | `plugin.lightspeed.notebooks.service` | `plugin.intelligent-assistant.notebooks.service` |
| `src/api/LightspeedApiClient.ts:51` | `/api/lightspeed`                     | `/api/intelligent-assistant`                     |
| `src/api/NotebooksApiClient.ts:51`  | `/api/lightspeed/notebooks`           | `/api/intelligent-assistant/notebooks`           |

---

### 5. Route Refs — `plugins/lightspeed/src/routes.ts`

| Current ID                 | New ID                                |
| -------------------------- | ------------------------------------- |
| `lightspeed`               | `intelligent-assistant`               |
| `lightspeed-conversation`  | `intelligent-assistant-conversation`  |
| `lightspeed-notebooks`     | `intelligent-assistant-notebooks`     |
| `lightspeed-notebook-view` | `intelligent-assistant-notebook-view` |

---

### 6. Translation Refs — `plugins/lightspeed/src/translations/ref.ts`

| Item                                              | Current              | New                             |
| ------------------------------------------------- | -------------------- | ------------------------------- |
| Export name                                       | `lightspeedMessages` | `intelligentAssistantMessages`  |
| Translation ref ID                                | `plugin.lightspeed`  | `plugin.intelligent-assistant`  |
| Key `icon.lightspeed.alt`                         | key string           | `icon.intelligentAssistant.alt` |
| Key `lcore.notConfigured.developerLightspeedDocs` | key string           | rename                          |

All locale files (`de.ts`, `es.ts`, `fr.ts`, `it.ts`, `ja.ts`) import `lightspeedMessages` and need updating.

---

### 7. NFS Module Exports — `plugins/lightspeed/src/alpha/index.tsx`

| Current                                                          | New                                      |
| ---------------------------------------------------------------- | ---------------------------------------- |
| `lightspeedRedirectModule` (name: `lightspeed-redirect`)         | `intelligentAssistantRedirectModule`     |
| `lightspeedFABModule` (name: `lightspeed-fab`)                   | `intelligentAssistantFABModule`          |
| `lightspeedTranslationsModule` (name: `lightspeed-translations`) | `intelligentAssistantTranslationsModule` |
| `lightspeedApi` blueprint (name: `lightspeed`)                   | name: `intelligent-assistant`            |
| `lightspeedPage`, `lightspeedDrawer` variable names              | rename                                   |
| `AppDrawerContentBlueprint` name: `lightspeed`                   | `intelligent-assistant`                  |

---

### 8. Legacy / OFS Exports — `plugins/lightspeed/src/legacy.ts` and `src/plugin.ts`

| Current export                 | New export                               |
| ------------------------------ | ---------------------------------------- |
| `lightspeedPlugin`             | `intelligentAssistantPlugin`             |
| `LightspeedPage`               | `IntelligentAssistantPage`               |
| `LightspeedDrawerProvider`     | `IntelligentAssistantDrawerProvider`     |
| `LightspeedFAB`                | `IntelligentAssistantFAB`                |
| `LightspeedIcon`               | `IntelligentAssistantIcon`               |
| `LightspeedChatContainer`      | `IntelligentAssistantChatContainer`      |
| `LightspeedDrawerStateExposer` | `IntelligentAssistantDrawerStateExposer` |

**Note**: Consider keeping old names as deprecated aliases for backward compatibility with existing OFS dynamic plugin configs.

---

### 9. Constants — `plugins/lightspeed/src/const.ts`

| Constant                   | Current                    | Action                            |
| -------------------------- | -------------------------- | --------------------------------- |
| `LIGHTSPEED_APP_DRAWER_ID` | `'lightspeed'`             | → `'intelligent-assistant'`       |
| `LIGHTSPEED_PATH`          | `'/intelligent-assistant'` | Already correct, rename variable  |
| `LIGHTSPEED_LEGACY_PATH`   | `'/lightspeed'`            | Keep for backward-compat redirect |

---

### 10. Permissions — `plugins/lightspeed-common/src/permissions.ts`

Permission name strings are already `intelligent-assistant.*`. Export identifiers need renaming:

| Current identifier                 | New identifier                               |
| ---------------------------------- | -------------------------------------------- |
| `lightspeedChatReadPermission`     | `intelligentAssistantChatReadPermission`     |
| `lightspeedChatCreatePermission`   | `intelligentAssistantChatCreatePermission`   |
| `lightspeedChatDeletePermission`   | `intelligentAssistantChatDeletePermission`   |
| `lightspeedChatUpdatePermission`   | `intelligentAssistantChatUpdatePermission`   |
| `lightspeedMcpReadPermission`      | `intelligentAssistantMcpReadPermission`      |
| `lightspeedMcpManagePermission`    | `intelligentAssistantMcpManagePermission`    |
| `lightspeedNotebooksUsePermission` | `intelligentAssistantNotebooksUsePermission` |
| `lightspeedPermissions`            | `intelligentAssistantPermissions`            |

Used in ~20+ frontend/backend files.

---

### 11. CSS Class Seed — `plugins/lightspeed/src/utils/generateClassName.ts`

| Current                            | New                             |
| ---------------------------------- | ------------------------------- |
| `seed: 'lightspeed'` (MUI v4 + v5) | `seed: 'intelligent-assistant'` |

---

### 12. Backend-Specific Changes

| File                                              | Item                                                                                 | Action                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `src/plugin.ts`                                   | `lightspeedPlugin` variable, deprecation warning referencing `lightspeed` config key | Rename, update messages                                                   |
| `src/database/migration.ts:23`                    | `resolvePackagePath('...-lightspeed-backend')`                                       | Update package name                                                       |
| `migrations/20260302120000_add_mcp_servers.js:21` | DB table `lightspeed_mcp_user_settings`                                              | **Evaluate**: requires DB migration if renamed                            |
| `src/service/constant.ts:24-25`                   | `DEFAULT_LIGHTSPEED_SERVICE_HOST/PORT`                                               | **Evaluate**: these reference external Lightspeed Core sidecar — may keep |
| `src/service/utils.ts:83`                         | `rewriteLightspeedProxyPath()`                                                       | Rename function                                                           |
| `src/service/mcp-server-validator.ts:170`         | `clientInfo: { name: 'lightspeed-backend' }`                                         | Update                                                                    |
| `src/service/router.ts`                           | `lightspeedCoreBaseUrl`, permission imports, error messages                          | Update all                                                                |
| `src/service/notebooks/notebooksRouters.ts`       | `lightspeedBaseUrl`, `lightspeedRequest`                                             | Update                                                                    |

---

### 13. Dynamic Plugin Config — `plugins/lightspeed/app-config.dynamic.yaml`

| Item                              | Current                                                                      | New                                  |
| --------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------ |
| Dynamic plugin key                | `red-hat-developer-hub.backstage-plugin-lightspeed`                          | `...-intelligent-assistant`          |
| NFS extension names (commented)   | `app/lightspeed-fab`, `lightspeed/lightspeed`, `app/lightspeed-translations` | Update                               |
| `translationResources.importName` | `lightspeedTranslations`                                                     | `intelligentAssistantTranslations`   |
| `translationResources.ref`        | `lightspeedTranslationRef`                                                   | `intelligentAssistantTranslationRef` |
| `mountPoints[].importName`        | `LightspeedPage`, `LightspeedFAB`, etc.                                      | Update to new export names           |
| `mountPoints[].config.id`         | `lightspeed`                                                                 | `intelligent-assistant`              |

---

### 14. Dev App Wiring (3 files)

| File                                               | Changes                                                                                             |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `packages/app/src/App.tsx`                         | Update imports of `lightspeedFABModule`, `lightspeedRedirectModule`, `lightspeedTranslationsModule` |
| `packages/app-legacy/src/App.tsx`                  | Update imports, `LightspeedRedirect` component name, keep `/lightspeed` redirect path               |
| `packages/app-legacy/src/components/Root/Root.tsx` | Update `Lightspeed*` component imports, drawer `id: 'lightspeed'`                                   |
| `packages/backend/src/index.ts:59`                 | Update `import('...-lightspeed-backend')`                                                           |

---

### 15. Test Files (~20+ files with URL/API path assertions)

| Category             | Files                                                                     | Changes                                          |
| -------------------- | ------------------------------------------------------------------------- | ------------------------------------------------ |
| API client tests     | `LightspeedApiClient.test.ts` (18 refs), `NotebooksApiClient.test.ts` (7) | `/api/lightspeed` → `/api/intelligent-assistant` |
| Backend router tests | `router.test.ts` (69 refs)                                                | API paths, permission imports                    |
| MCP server tests     | `mcp-server.test.ts` (40 refs)                                            | API paths                                        |
| Utils tests          | `utils.test.ts` (13 refs)                                                 | `rewriteLightspeedProxyPath`                     |
| E2E tests            | 5 test files + 10 support/util files                                      | Filenames, API mocks, URL assertions             |
| E2E fixtures         | `responses.ts`, `mcpServerMocks.ts`                                       | `*/**/api/lightspeed` patterns                   |

---

### 16. GitHub / CI Config (repo root)

| File                                                              | Current                                                         | New                                  |
| ----------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------ |
| `codecov.yml` (lines 85, 172)                                     | `workspaces/lightspeed/`                                        | `workspaces/intelligent-assistant/`  |
| `.github/CODEOWNERS` (line 28)                                    | `/workspaces/lightspeed`                                        | `/workspaces/intelligent-assistant`  |
| `.github/pr-labeler.yml` (lines 45-47)                            | `workspace/lightspeed` label + glob                             | `workspace/intelligent-assistant`    |
| `.github/labeler.yml` (lines 34-35)                               | `workspace/lightspeed` + regex                                  | `workspace/intelligent-assistant`    |
| `.github/renovate.json` (line 67)                                 | `rhdh-lightspeed-presets`                                       | `rhdh-intelligent-assistant-presets` |
| `.github/renovate-presets/workspace/rhdh-lightspeed-presets.json` | Rename file; update `matchFileNames`, `addLabels`, descriptions | All references                       |

---

### 17. Documentation

| File                                      | Approximate matches                   | Changes                                                                    |
| ----------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| `plugins/lightspeed/README.md`            | ~72                                   | Package names, module names, extension IDs, scalprum keys, directory paths |
| `plugins/lightspeed-backend/README.md`    | ~49                                   | Package names, API paths, notebook paths, migration guide                  |
| `plugins/lightspeed-common/README.md`     | ~5                                    | Package name, description                                                  |
| `workspaces/lightspeed/AGENTS.md`         | ~3                                    | Title, paths                                                               |
| `workspaces/lightspeed/catalog-info.yaml` | `metadata.name: developer-lightspeed` | Update                                                                     |
| CHANGELOG files                           | ~185 total                            | Historical — typically left as-is                                          |

---

### 18. Items to Evaluate (may NOT need renaming)

| Item                                              | Reason to keep                               |
| ------------------------------------------------- | -------------------------------------------- |
| `LIGHTSPEED_LEGACY_PATH = '/lightspeed'`          | Intentional backward-compat redirect         |
| `config.has('lightspeed')` in backend plugin      | Migration detection for old config namespace |
| `lightspeed_question_validity-shield` provider ID | External LCS shield name                     |
| `DEFAULT_LIGHTSPEED_SERVICE_HOST/PORT`            | External Lightspeed Core infrastructure name |
| "Lightspeed Core" in error messages               | External service product name                |
| DB table `lightspeed_mcp_user_settings`           | Requires DB migration strategy               |
| CHANGELOG historical entries                      | Version history — leave as-is                |

---

## REPO 2: redhat-developer/rhdh-plugin-export-overlays

---

### 1. Directory Rename

| Current                  | New                                 |
| ------------------------ | ----------------------------------- |
| `workspaces/lightspeed/` | `workspaces/intelligent-assistant/` |

---

### 2. Metadata (Package Manifests)

| Current file                                                      | New file                                      | Changes inside                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workspaces/lightspeed/metadata/rhdh-bsp-lightspeed.yaml`         | `rhdh-bsp-intelligent-assistant.yaml`         | `metadata.name`, `metadata.title` ("Lightspeed Frontend" → "Intelligent Assistant Frontend"), `spec.packageName`, `spec.dynamicArtifact` OCI URI, `spec.partOf`, all `appConfigExamples` (scalprum key, importNames, config IDs, translation refs) |
| `workspaces/lightspeed/metadata/rhdh-bsp-lightspeed-backend.yaml` | `rhdh-bsp-intelligent-assistant-backend.yaml` | `metadata.name`, `metadata.title`, `spec.packageName`, `spec.dynamicArtifact` OCI URI, `spec.partOf`, `appConfigExamples` config keys                                                                                                              |

---

### 3. Catalog Entity (Extensions Marketplace)

| Current file                                          | New file                     | Changes inside                                                                                                                                                                                                                                                       |
| ----------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `catalog-entities/extensions/plugins/lightspeed.yaml` | `intelligent-assistant.yaml` | ~430 lines: `metadata.name`, `metadata.title`, `spec.description`, `spec.packages`, `spec.installation` (OCI URIs, npm package names, scalprum keys, import paths, config namespace, RBAC policy names, env var names, CLI commands, source URLs, all code examples) |
| `catalog-entities/extensions/plugins/all.yaml`        | —                            | Update `./lightspeed.yaml` → `./intelligent-assistant.yaml` reference                                                                                                                                                                                                |

---

### 4. Package Lists

| File                                        | Current                                                                  | New                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `rhdh-supported-packages.txt` (lines 96-97) | `lightspeed/plugins/lightspeed`, `lightspeed/plugins/lightspeed-backend` | `intelligent-assistant/plugins/intelligent-assistant[-backend]`            |
| `default.packages.yaml` (lines 99-101)      | `@red-hat-developer-hub/backstage-plugin-lightspeed[-backend]`           | `...-intelligent-assistant[-backend]`                                      |
| `workspaces/lightspeed/plugins-list.yaml`   | `plugins/lightspeed:`, `plugins/lightspeed-backend:`                     | `plugins/intelligent-assistant:`, `plugins/intelligent-assistant-backend:` |

---

### 5. Source Pin

| File                                | Changes                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `workspaces/lightspeed/source.json` | No content change needed (repo URL stays the same), but file moves with directory rename |

---

### 6. E2E Tests

| Current file                                          | Action                                                                                        |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `e2e-tests/package.json`                              | `"name": "lightspeed-e2e-tests"` → `"intelligent-assistant-e2e-tests"`                        |
| `e2e-tests/playwright.config.ts`                      | Project name `lightspeed` → `intelligent-assistant`                                           |
| `e2e-tests/tests/specs/lightspeed.spec.ts`            | Rename file, update URL assertions (`/lightspeed` → `/intelligent-assistant`), update imports |
| `e2e-tests/tests/support/lightspeed-page.ts`          | Rename file, update route references, sidebar label                                           |
| `e2e-tests/tests/support/test-helper.ts`              | Namespace, deploy config, `/lightspeed` navigation (~15 refs)                                 |
| `e2e-tests/tests/support/sidebar.ts`                  | "Developer Lightspeed" label                                                                  |
| `e2e-tests/tests/support/conversation-helper.ts`      | Import from `lightspeed-page`                                                                 |
| `e2e-tests/tests/support/notebook-surface-page.ts`    | `openLightspeed` import                                                                       |
| `e2e-tests/tests/support/notebook-constants.ts`       | URL regex `/lightspeed/notebooks/`                                                            |
| `e2e-tests/tests/support/notebook-delete-dialog.ts`   | "Lightspeed Activity" text                                                                    |
| `e2e-tests/tests/specs/notebook.spec.ts`              | `ensureLightspeedDeployment` reference                                                        |
| `e2e-tests/tests/config/value_file.yaml`              | `global.lightspeed.enabled` Helm key, comments                                                |
| `e2e-tests/tests/config/app-config-rhdh.yaml`         | `lightspeed:` config block, RBAC plugin list, comments                                        |
| `e2e-tests/tests/config/rhdh-secrets.yaml`            | Comments referencing lightspeed                                                               |
| `e2e-tests/tests/config/dynamic-plugins-nightly.yaml` | Comment noting Lightspeed in default catalog                                                  |
| `e2e-tests/yarn.lock`                                 | Auto-regenerated                                                                              |

**Note on Helm values**: `global.lightspeed.enabled` and `global.lightspeed.secret` are RHDH Helm chart keys. These may require a coordinated Helm chart update or may stay as `lightspeed` if the chart doesn't rename.

---

### 7. Cross-Workspace References (other workspaces that mention lightspeed)

| File                                                                        | Content                                                                              | Action                            |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------- |
| `workspaces/backstage/e2e-tests/tests/config/value_file.yaml`               | `global.lightspeed.enabled: false`                                                   | Update if Helm key changes        |
| `workspaces/backstage/e2e-tests/tests/config/notifications/value-file.yaml` | `lightspeed:` disabled                                                               | Same                              |
| `workspaces/backstage/e2e-tests/tests/config/kubernetes/value_file.yaml`    | `lightspeed:` disabled                                                               | Same                              |
| `workspaces/backstage/e2e-tests/tests/config/gitlab-events/value-file.yaml` | `lightspeed:` disabled                                                               | Same                              |
| `workspaces/bulk-import/e2e-tests/tests/config/values.yaml`                 | `global.lightspeed.enabled: false`                                                   | Same                              |
| `workspaces/quickstart/metadata/rhdh-bsp-quickstart.yaml`                   | 13 refs: "Set up Lightspeed", "Get started with Lightspeed" step titles/descriptions | Update to "Intelligent Assistant" |
| `workspaces/quickstart/e2e-tests/tests/config/app-config-rhdh.yaml`         | 13 refs: quickstart step definitions                                                 | Update                            |
| `workspaces/quickstart/e2e-tests/tests/specs/quick-start.spec.ts`           | 5 refs: clicks on Lightspeed quickstart buttons                                      | Update                            |

---

### 8. GitHub / CI

| File                 | Changes                                                        |
| -------------------- | -------------------------------------------------------------- |
| `.github/CODEOWNERS` | `/workspaces/lightspeed` → `/workspaces/intelligent-assistant` |

---

## Summary Statistics

| Category                      | rhdh-plugins | rhdh-plugin-export-overlays | Total |
| ----------------------------- | ------------ | --------------------------- | ----- |
| Files with content matches    | ~150         | ~32                         | ~182  |
| Files needing filename rename | ~45          | ~5                          | ~50   |
| Directories to rename         | 4            | 1                           | 5     |
| package.json files to update  | 7            | 1                           | 8     |

---

## Rename Quick Reference

| Category             | From                                                        | To                                     |
| -------------------- | ----------------------------------------------------------- | -------------------------------------- |
| npm (frontend)       | `@red-hat-developer-hub/backstage-plugin-lightspeed`        | `...-intelligent-assistant`            |
| npm (backend)        | `...-lightspeed-backend`                                    | `...-intelligent-assistant-backend`    |
| npm (common)         | `...-lightspeed-common`                                     | `...-intelligent-assistant-common`     |
| Backstage pluginId   | `lightspeed`                                                | `intelligent-assistant`                |
| Scalprum key         | `red-hat-developer-hub.backstage-plugin-lightspeed`         | `...-intelligent-assistant`            |
| API path             | `/api/lightspeed`                                           | `/api/intelligent-assistant`           |
| API ref              | `plugin.lightspeed.service`                                 | `plugin.intelligent-assistant.service` |
| Translation ref      | `plugin.lightspeed`                                         | `plugin.intelligent-assistant`         |
| Route ref IDs        | `lightspeed-*`                                              | `intelligent-assistant-*`              |
| Export subpaths      | `./lightspeed-fab-module`                                   | `./intelligent-assistant-fab-module`   |
| OCI image (frontend) | `red-hat-developer-hub-backstage-plugin-lightspeed`         | `...-intelligent-assistant`            |
| OCI image (backend)  | `red-hat-developer-hub-backstage-plugin-lightspeed-backend` | `...-intelligent-assistant-backend`    |
| Workspace            | `workspaces/lightspeed`                                     | `workspaces/intelligent-assistant`     |
