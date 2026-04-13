# TASK-alavista Development Plan

## Current Status: v1.0 Core Complete ✅

All 22 foundational steps have been completed. The plugin is functional with core features implemented.

---

## Completed: Phase 1-7 (v1.0 Core)

### Phase 1: Project Foundation ✅

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

## Recent Fixes (Post v1.0)

### Bug Fixes
- ✅ Fixed deep link URL encoding (use %20 instead of +)
- ✅ Fixed sidebar activation when right sidebar doesn't exist
- ✅ Enhanced error handling with user-facing notices
- ✅ Added deployment script for development workflow

---

## Next Steps: v1.1 Improvements

### Priority 1: User Experience
- [ ] Add file/folder picker for ICS path setting (replace text input)
- [ ] Add visual feedback for ICS generation status
- [ ] Improve error messages in sidebar for malformed tasks
- [ ] Add "last synced" timestamp display

### Priority 2: Settings Enhancements
- [ ] Add setting for default event duration
- [ ] Add setting for time zone handling
- [ ] Add setting to exclude completed tasks from sidebar
- [ ] Add setting for sidebar sort order (date, title, file)

### Priority 3: UI Polish
- [ ] Add task count badge to sidebar icon
- [ ] Add color coding for task urgency (today, this week, later)
- [ ] Add quick actions (edit, delete, duplicate task)
- [ ] Improve mobile responsiveness

### Priority 4: Performance
- [ ] Add task cache size limit (prevent memory issues)
- [ ] Optimize MetadataCache event handling
- [ ] Add lazy loading for large task lists
- [ ] Profile and optimize ICS generation

---

## Future: v2.0 Major Features

### Natural Language Parsing (Optional)
- [ ] Research NLP libraries (chrono-node, compromise)
- [ ] Implement optional NLP mode alongside strict format
- [ ] Add setting to toggle between strict and NLP parsing
- [ ] Examples: "meeting tomorrow at 2pm", "call next Monday"

### Recurring Events
- [ ] Design recurring event syntax
- [ ] Implement RRULE generation for ICS
- [ ] Add UI for managing recurring tasks
- [ ] Handle exceptions and modifications

### Multi-Vault Support
- [ ] Generate separate ICS files per vault
- [ ] Add vault selector in settings
- [ ] Handle vault switching gracefully

### Advanced Features
- [ ] Task templates with quick insert
- [ ] Conflict detection (overlapping events)
- [ ] Calendar view (month/week grid)
- [ ] Export to other formats (Google Calendar JSON, Outlook CSV)
- [ ] Two-way sync (read calendar events back to Obsidian)

---

## Technical Debt

### Code Quality
- [ ] Add unit tests for TaskParser
- [ ] Add unit tests for IcsGenerator
- [ ] Add integration tests for end-to-end flow
- [ ] Improve error handling coverage
- [ ] Add performance benchmarks

### Documentation
- [ ] Add inline code examples in TSDoc
- [ ] Create video tutorial for YouTube
- [ ] Add FAQ section to README
- [ ] Create troubleshooting flowchart

### Build & Deploy
- [ ] Set up automated testing in CI
- [ ] Add code coverage reporting
- [ ] Create beta release channel
- [ ] Set up automated changelog generation

---

## Community Requests

Track feature requests from users:
- [ ] Support for all-day events
- [ ] Integration with Obsidian Calendar plugin
- [ ] Support for task priorities
- [ ] Bulk edit/delete operations
- [ ] Import from external calendars

---

## Success Criteria for v1.1

Ready for release when:
- [ ] File picker implemented and tested
- [ ] All Priority 1 items completed
- [ ] No regressions from v1.0
- [ ] Documentation updated
- [ ] Beta tested by 3+ users
- [ ] Performance benchmarks meet targets

---

## Success Criteria for v2.0

Ready for release when:
- [ ] At least 2 major features implemented
- [ ] Comprehensive test suite (>80% coverage)
- [ ] Performance optimized for large vaults (1000+ tasks)
- [ ] Community feedback incorporated
- [ ] Migration guide from v1.x