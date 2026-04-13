# TASK-alavista

Transform your Obsidian tasks into calendar events with automatic `.ics` file generation for seamless integration with any calendar application.

[![CI](https://github.com/MisterEleven/TASK-alavista/actions/workflows/ci.yml/badge.svg)](https://github.com/MisterEleven/TASK-alavista/actions/workflows/ci.yml)
[![Release](https://github.com/MisterEleven/TASK-alavista/actions/workflows/release.yml/badge.svg)](https://github.com/MisterEleven/TASK-alavista/actions/workflows/release.yml)

## Features

- 📅 **Automatic Calendar Sync**: Generate `.ics` files from tagged tasks
- 🔗 **Deep Linking**: Click events in your calendar to jump directly to the task in Obsidian
- 📱 **Universal Compatibility**: Works with Apple Calendar, Google Calendar, Outlook, and any app that supports `.ics` subscriptions
- ⚡ **Real-time Updates**: Debounced file monitoring ensures your calendar stays in sync
- 🎯 **Smart Filtering**: View tasks from current note or entire vault
- ⏰ **Reminders**: Set custom reminder times for each event
- 📍 **Location Support**: Add locations to your scheduled tasks
- ✅ **Completion Tracking**: Configurable behavior for completed tasks

## Installation

### From Obsidian Community Plugins (Recommended)

1. Open Obsidian Settings
2. Navigate to **Community Plugins** and disable **Safe Mode**
3. Click **Browse** and search for "TASK-alavista"
4. Click **Install**, then **Enable**

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/MisterEleven/TASK-alavista/releases)
2. Extract `main.js`, `manifest.json`, and `styles.css` into your vault's `.obsidian/plugins/task-alavista/` folder
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## Usage

### Task Format

Create a task with the `#schedule` tag using this format:

```markdown
- [ ] #schedule YYYY-MM-DD HH:MM "Event Title" [duration:Xh|Xm] [location:"Place"] [reminder:Xm]
```

#### Required Parameters

- **Date**: `YYYY-MM-DD` (e.g., `2026-04-15`)
- **Time**: `HH:MM` in 24-hour format (e.g., `14:00`)
- **Title**: Quoted string (e.g., `"Team Meeting"`)

#### Optional Parameters

- **Duration**: `duration:Xh` or `duration:Xm` (e.g., `duration:1h`, `duration:30m`)
  - Default: 1 hour if not specified
- **Location**: `location:"Place Name"` (e.g., `location:"Conference Room A"`)
- **Reminder**: `reminder:Xm` (e.g., `reminder:15m`)
  - Default: Uses plugin setting (15 minutes)

### Examples

#### Basic Task
```markdown
- [ ] #schedule 2026-04-15 14:00 "Team Meeting"
```

#### With All Parameters
```markdown
- [ ] #schedule 2026-04-15 14:00 "Client Presentation" duration:2h location:"Zoom" reminder:30m
```

#### Multiple Tasks in One Note
```markdown
# Project Planning

## This Week
- [ ] #schedule 2026-04-15 09:00 "Daily Standup" duration:15m
- [ ] #schedule 2026-04-15 14:00 "Design Review" duration:2h location:"Conference Room"
- [ ] #schedule 2026-04-17 10:00 "Sprint Planning" duration:2h reminder:30m

## Next Week
- [ ] #schedule 2026-04-22 13:00 "Retrospective" duration:1h location:"Office"
```

### Sidebar View

The plugin adds a **Scheduled Tasks** sidebar to the right panel:

- **All**: View all scheduled tasks across your vault
- **Current**: View tasks only from the active note
- Click any task to jump to its location in the note

### Calendar Subscription

1. Locate the generated `.ics` file:
   - Default path: `.obsidian/plugins/task-alavista/schedule.ics`
   - Configurable in plugin settings

2. Subscribe in your calendar app:

   **Apple Calendar (macOS/iOS)**:
   - File → New Calendar Subscription
   - Enter the file path or use `file://` URL
   - Set refresh interval (recommended: 5-15 minutes)

   **Google Calendar**:
   - Settings → Add calendar → From URL
   - Use a cloud sync service (Dropbox, iCloud Drive) to host the `.ics` file
   - Enter the public URL

   **Outlook**:
   - File → Account Settings → Internet Calendars → New
   - Enter the file path or URL

3. The calendar will automatically refresh based on your app's settings

### Deep Links

Each calendar event includes an `obsidian://` deep link that opens the exact note and line in Obsidian when clicked in your calendar app.

## Settings

Access settings via **Settings → TASK-alavista**:

| Setting | Description | Default |
|---------|-------------|---------|
| **ICS file path** | Location of the generated `.ics` file | `.obsidian/plugins/task-alavista/schedule.ics` |
| **Update delay** | Debounce delay in milliseconds before updating the file | `2000` (2 seconds) |
| **Completed task behavior** | What to do with completed tasks | `Remove from calendar` |
| **Default reminder** | Default reminder time in minutes | `15` |
| **Date format** | Display format for dates in sidebar | `YYYY-MM-DD` |
| **Filter current note** | Show only current note tasks by default | `false` |

### Completed Task Behavior Options

- **Remove from calendar**: Completed tasks are removed from the `.ics` file
- **Keep in calendar (marked complete)**: Tasks remain but are marked as completed
- **Archive to separate section**: Completed tasks are moved to an archive section

## Commands

Access via Command Palette (`Cmd/Ctrl + P`):

- **Refresh scheduled tasks**: Manually refresh all tasks
- **Show scheduled tasks sidebar**: Open the sidebar view
- **Toggle task filter**: Switch between current note and all tasks

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/MisterEleven/TASK-alavista.git
cd TASK-alavista

# Install dependencies
npm install

# Start development build (watch mode)
npm run dev
```

### Build

```bash
# Production build
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

### Testing

1. Copy `main.js`, `manifest.json`, and `styles.css` to your test vault's `.obsidian/plugins/task-alavista/` folder
2. Reload Obsidian
3. Enable the plugin

## Architecture

The plugin is organized into distinct modules:

- **Parser**: RegEx-based task extraction and validation
- **Calendar**: ICS file generation (RFC 5545 compliant)
- **UI**: Sidebar view for task visualization
- **Core**: TaskManager orchestrates all operations
- **Settings**: User configuration management

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process, dependencies

## Roadmap

### v1.0 (Current)
- ✅ Strict task format parsing
- ✅ ICS file generation
- ✅ Sidebar view
- ✅ Deep linking
- ✅ Settings management

### v2.0 (Planned)
- [ ] Natural language parsing (optional)
- [ ] Recurring events support
- [ ] Multi-vault support
- [ ] Task templates
- [ ] Conflict resolution
- [ ] Additional export formats

## Troubleshooting

### Tasks Not Appearing in Sidebar

1. Verify the task format matches exactly: `- [ ] #schedule YYYY-MM-DD HH:MM "Title"`
2. Check that the date is in the future
3. Open the console (Cmd/Ctrl + Shift + I) and look for parsing errors
4. Try the "Refresh scheduled tasks" command

### Calendar Not Updating

1. Check your calendar app's refresh interval
2. Verify the `.ics` file path in settings
3. Ensure the file is being generated (check the file location)
4. Try manually refreshing the calendar subscription

### Deep Links Not Working

1. Ensure Obsidian is set as the default handler for `obsidian://` URLs
2. Check that the vault name matches exactly
3. Verify the file path is correct

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 🐛 [Report a bug](https://github.com/MisterEleven/TASK-alavista/issues/new?labels=bug)
- 💡 [Request a feature](https://github.com/MisterEleven/TASK-alavista/issues/new?labels=enhancement)
- 💬 [Discussions](https://github.com/MisterEleven/TASK-alavista/discussions)

## Acknowledgments

- Built with the [Obsidian API](https://docs.obsidian.md/)
- Uses [date-fns](https://date-fns.org/) for date handling
- Inspired by the Obsidian community's need for better task-calendar integration

---

Made with ❤️ by [Timo Feddern](https://github.com/MisterEleven)