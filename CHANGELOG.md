# Changelog

All notable changes to TASK-alavista will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-13

### Added
- Initial release of TASK-alavista
- Task parsing with strict format: `#schedule YYYY-MM-DD HH:MM "Title" [options]`
- Automatic ICS file generation (RFC 5545 compliant)
- Sidebar view for scheduled tasks with filtering
- Deep linking support (obsidian:// URIs)
- Settings management (ICS path, debounce delay, completed task behavior)
- Real-time updates via MetadataCache integration
- Command palette commands (refresh, show sidebar, toggle filter)
- Support for optional parameters: duration, location, reminder
- Debounced file updates (configurable delay)
- Comprehensive documentation (README, ARCHITECTURE, CONTRIBUTING, TASK_FORMAT)

### Fixed
- Deep link URL encoding now uses %20 instead of + for spaces
- Sidebar activation handles missing right sidebar gracefully
- Enhanced error handling with user-facing notices

### Technical
- TypeScript with strict mode
- ESLint and Prettier configuration
- esbuild for fast bundling
- GitHub Actions CI/CD workflow
- Deployment script for development

[1.0.0]: https://github.com/MisterEleven/TASK-alavista/releases/tag/1.0.0