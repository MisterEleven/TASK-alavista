# Task-alavista Development Plan

## Step-by-Step Implementation Guide

This document outlines the incremental development approach for building the Task-alavista plugin. Each step is designed to be a small, testable commit.

---

## Phase 1: Project Foundation (Steps 1-6)

### Step 1: Initialize Project Structure
**Goal**: Create the basic folder structure and initialize npm project

**Actions**:
- Create `src/` directory with subdirectories
- Initialize `package.json` with basic metadata
- Create `.gitignore` for node_modules, build artifacts

**Commit**: `chore: initialize project structure`

---

### Step 2: Configure TypeScript
**Goal**: Set up TypeScript compilation

**Files to create**:
- `tsconfig.json` with strict mode enabled
- Target ES2018 for Obsidian compatibility

**Commit**: `chore: configure TypeScript`

---

### Step 3: Add Linting and Formatting
**Goal**: Ensure code quality standards

**Files to create**:
- `.eslintrc.json` with TypeScript rules
- `.prettierrc` with formatting preferences
- Add lint scripts to `package.json`

**Commit**: `chore: add ESLint and Prettier configuration`

---

### Step 4: Create Obsidian Plugin Manifest
**Goal**: Define plugin metadata for Obsidian

**Files to create**:
- `manifest.json` with plugin details
- `versions.json` for compatibility tracking

**Commit**: `chore: add Obsidian plugin manifest`

---

### Step 5: Configure Build System
**Goal**: Set up esbuild for fast bundling

**Files to create**:
- `esbuild.config.mjs` with development and production configs
- Update `package.json` with build scripts

**Commit**: `chore: configure esbuild bundler`

---

### Step 6: Create Plugin Entry Point
**Goal**: Implement minimal working plugin

**Files to create**:
- `src/main.ts` extending `Plugin` class
- Implement `onload()` and `onunload()` methods
- Add console log to verify plugin loads

**Test**: Load plugin in Obsidian, check console for load message

**Commit**: `feat: create basic plugin entry point`

---

## Phase 2: Settings System (Steps 7-8)

### Step 7: Define Settings Interface
**Goal**: Create type-safe settings structure

**Files to create**:
- `src/settings/PluginSettings.ts` with interface and defaults
- Settings include: icsPath, debounceDelay, completedBehavior

**Commit**: `feat: define plugin settings interface`

---

### Step 8: Implement Settings Tab
**Goal**: Allow users to configure plugin

**Files to create**:
- `src/settings/SettingsTab.ts` extending `PluginSettingTab`
- Add UI controls for each setting
- Integrate with `main.ts` to load/save settings

**Test**: Open settings, modify values, verify persistence

**Commit**: `feat: implement settings tab UI`

---

## Phase 3: Task Parsing (Steps 9-10)

### Step 9: Build Task Parser
**Goal**: Extract scheduled tasks from markdown

**Files to create**:
- `src/parser/types.ts` with `ScheduledTask` interface
- `src/parser/TaskParser.ts` with RegEx parsing logic
- Support format: `#schedule YYYY-MM-DD HH:MM "Title" [options]`

**Test**: Unit test with sample markdown strings

**Commit**: `feat: implement task parser with RegEx`

---

### Step 10: Add Task Validation
**Goal**: Validate parsed task data

**Files to create**:
- `src/parser/TaskValidator.ts` with validation rules
- Check date is not in past, duration format is valid
- Return validation errors for UI display

**Test**: Unit test with invalid inputs

**Commit**: `feat: add task validation logic`

---

## Phase 4: Calendar Generation (Steps 11-12)

### Step 11: Implement ICS Generator
**Goal**: Convert tasks to iCalendar format

**Files to create**:
- `src/calendar/types.ts` with `CalendarEvent` interface
- `src/calendar/IcsGenerator.ts` to build ICS content
- Follow RFC 5545 standard

**Test**: Generate ICS from sample tasks, validate format

**Commit**: `feat: implement ICS file generator`

---

### Step 12: Create ICS File Writer
**Goal**: Write ICS content to file system

**Files to create**:
- `src/calendar/IcsWriter.ts` using Obsidian's `Vault` API
- Handle file creation, updates, and errors
- Create directory if it doesn't exist

**Test**: Generate ICS file, verify it exists in vault

**Commit**: `feat: add ICS file writer`

---

## Phase 5: UI Components (Step 13)

### Step 13: Build Sidebar View
**Goal**: Display scheduled tasks in right pane

**Files to create**:
- `src/ui/SidebarView.ts` extending `ItemView`
- `src/ui/styles.css` for component styling
- Display task list with date, time, title
- Add filter toggle (current note vs. vault)

**Test**: Open sidebar, verify tasks display correctly

**Commit**: `feat: implement sidebar view component`

---

## Phase 6: Core Integration (Steps 14-17)

### Step 14: Integrate MetadataCache
**Goal**: Monitor file changes efficiently

**Files to create**:
- `src/core/TaskManager.ts` as central coordinator
- Listen to `metadata-cache:changed` events
- Parse only modified files

**Test**: Modify note with task, verify detection

**Commit**: `feat: integrate MetadataCache for file monitoring`

---

### Step 15: Add Debounced Updates
**Goal**: Prevent excessive ICS regeneration

**Files to create**:
- `src/utils/debounce.ts` utility function
- Apply to ICS update trigger in `TaskManager`

**Test**: Rapidly edit tasks, verify single ICS update

**Commit**: `feat: add debounced update mechanism`

---

### Step 16: Implement Deep Linking
**Goal**: Create obsidian:// URIs for calendar events

**Files to create**:
- `src/core/DeepLinkGenerator.ts`
- Generate `obsidian://open?vault=X&file=Y&line=Z`
- Integrate into ICS generator

**Test**: Click event in calendar app, verify Obsidian opens

**Commit**: `feat: add deep linking support`

---

### Step 17: Connect All Modules
**Goal**: Wire up complete data flow

**Updates**:
- Update `main.ts` to initialize `TaskManager`
- Connect parser → ICS generator → writer → sidebar
- Implement event flow for task changes

**Test**: End-to-end test: create task → see in sidebar → verify ICS

**Commit**: `feat: connect all modules in TaskManager`

---

## Phase 7: Polish & Documentation (Steps 18-20)

### Step 18: Add Command Palette Commands
**Goal**: Provide user actions

**Commands to add**:
- "Refresh scheduled tasks" (manual trigger)
- "Open schedule.ics file"
- "Show scheduled tasks sidebar"

**Commit**: `feat: add command palette commands`

---

### Step 19: Write User Documentation
**Goal**: Help users install and use plugin

**Files to create**:
- `README.md` with installation, usage, examples
- Include task format specification
- Add calendar subscription instructions

**Commit**: `docs: add comprehensive README`

---

### Step 20: Create Contributor Guidelines
**Goal**: Enable community contributions

**Files to create**:
- `CONTRIBUTING.md` with development setup
- Explain Conventional Commits
- Add code style guidelines

**Commit**: `docs: add contributing guidelines`

---

## Testing Checklist (After Each Phase)

### Manual Testing
- [ ] Plugin loads without errors
- [ ] Settings persist correctly
- [ ] Tasks parse from various note formats
- [ ] ICS file generates and updates
- [ ] Sidebar displays tasks accurately
- [ ] Deep links open correct notes
- [ ] Calendar app subscribes successfully

### Edge Cases
- [ ] Empty vault (no tasks)
- [ ] Malformed task syntax
- [ ] Past dates
- [ ] Very long event titles
- [ ] Special characters in file paths
- [ ] Rapid file modifications

---

## Git Workflow

### Commit Message Format
```
<type>: <subject>

<body (optional)>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Build/config

### Example Commits
```
feat: implement task parser with RegEx

Add TaskParser class that extracts #schedule tasks from markdown.
Supports strict format: YYYY-MM-DD HH:MM "Title" [options]
```

```
fix: handle missing duration parameter

Duration is optional, default to 1 hour if not specified.
```

---

## Next Steps

Once all steps are complete:
1. Create GitHub repository
2. Add CI/CD workflow (GitHub Actions)
3. Publish to Obsidian Community Plugins
4. Set up issue templates
5. Create project roadmap for v2.0

---

## Dependencies Summary

### Production
- `obsidian`: ^1.5.0 (provided)
- `date-fns`: ^3.0.0 (date parsing)

### Development
- `typescript`: ^5.3.0
- `esbuild`: ^0.19.0
- `@typescript-eslint/eslint-plugin`: ^6.0.0
- `@typescript-eslint/parser`: ^6.0.0
- `eslint`: ^8.0.0
- `prettier`: ^3.0.0

---

## Estimated Timeline

- **Phase 1** (Foundation): 2-3 hours
- **Phase 2** (Settings): 1-2 hours
- **Phase 3** (Parsing): 2-3 hours
- **Phase 4** (Calendar): 2-3 hours
- **Phase 5** (UI): 2-3 hours
- **Phase 6** (Integration): 3-4 hours
- **Phase 7** (Polish): 2-3 hours

**Total**: ~15-20 hours of focused development

---

## Success Criteria

The plugin is ready for v1.0 release when:
- ✅ All 20 steps completed
- ✅ Manual testing checklist passed
- ✅ No console errors in Obsidian
- ✅ ICS file subscribes in Apple Calendar
- ✅ Deep links work correctly
- ✅ Documentation is complete
- ✅ Code passes linting
- ✅ At least 3 beta testers provide feedback