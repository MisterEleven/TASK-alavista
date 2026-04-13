# Task-alavista Task Format Specification

## Overview

Task-alavista uses a strict, predictable format for scheduled tasks. This document defines the exact syntax and provides examples.

---

## Basic Format

```
- [ ] #schedule YYYY-MM-DD HH:MM "Event Title" [optional parameters]
```

### Required Components

1. **Task Marker**: `- [ ]` (standard Obsidian task)
2. **Schedule Tag**: `#schedule` (triggers plugin recognition)
3. **Date**: `YYYY-MM-DD` (ISO 8601 format)
4. **Time**: `HH:MM` (24-hour format)
5. **Title**: `"Event Title"` (quoted string)

### Optional Parameters

- `duration:Xh` or `duration:Xm` (hours or minutes)
- `location:"Place Name"` (quoted string)
- `reminder:Xm` (minutes before event)

---

## Examples

### Minimal Task
```markdown
- [ ] #schedule 2026-04-15 14:00 "Team Meeting"
```

### With Duration
```markdown
- [ ] #schedule 2026-04-15 14:00 "Team Meeting" duration:1h
```

### With All Parameters
```markdown
- [ ] #schedule 2026-04-15 14:00 "Team Meeting" duration:1h location:"Conference Room A" reminder:15m
```

### Multiple Tasks in One Note
```markdown
# Project Planning

## This Week
- [ ] #schedule 2026-04-15 09:00 "Standup" duration:15m
- [ ] #schedule 2026-04-15 14:00 "Design Review" duration:2h location:"Zoom"
- [ ] #schedule 2026-04-17 10:00 "Client Call" duration:1h reminder:30m

## Next Week
- [ ] #schedule 2026-04-22 13:00 "Sprint Planning" duration:2h location:"Office"
```

---

## Parameter Details

### Duration Format

**Syntax**: `duration:Xh` or `duration:Xm`

**Examples**:
- `duration:30m` → 30 minutes
- `duration:1h` → 1 hour
- `duration:2h` → 2 hours
- `duration:90m` → 90 minutes (1.5 hours)

**Default**: If not specified, defaults to 1 hour

**Valid Range**: 1m to 24h

### Location Format

**Syntax**: `location:"Place Name"`

**Examples**:
- `location:"Conference Room A"`
- `location:"Zoom (link in description)"`
- `location:"123 Main St, City"`

**Notes**:
- Must be quoted
- Can include special characters
- Appears in calendar event location field

### Reminder Format

**Syntax**: `reminder:Xm`

**Examples**:
- `reminder:15m` → 15 minutes before
- `reminder:30m` → 30 minutes before
- `reminder:60m` → 1 hour before

**Default**: If not specified, uses plugin setting (default: 15m)

**Valid Range**: 0m to 1440m (24 hours)

---

## Date and Time Rules

### Date Format

**Required**: `YYYY-MM-DD`

**Valid Examples**:
- `2026-04-15` ✅
- `2026-12-31` ✅

**Invalid Examples**:
- `04-15-2026` ❌ (wrong order)
- `2026/04/15` ❌ (wrong separator)
- `15.04.2026` ❌ (wrong format)

### Time Format

**Required**: `HH:MM` (24-hour)

**Valid Examples**:
- `09:00` ✅
- `14:30` ✅
- `23:59` ✅

**Invalid Examples**:
- `9:00` ❌ (missing leading zero)
- `2:30 PM` ❌ (12-hour format)
- `14:30:00` ❌ (includes seconds)

### Date Validation

- Date must be in the future (or today)
- Date must be a valid calendar date
- No support for relative dates in v1.0 (e.g., "tomorrow")

---

## Title Rules

### Quoting

**Required**: Title must be enclosed in double quotes

**Valid**:
```markdown
- [ ] #schedule 2026-04-15 14:00 "Team Meeting"
```

**Invalid**:
```markdown
- [ ] #schedule 2026-04-15 14:00 Team Meeting
```

### Special Characters

**Allowed**: Most special characters are supported

**Examples**:
- `"Q2 Planning: Budget & Resources"` ✅
- `"Client Call (Follow-up)"` ✅
- `"Review PR #123"` ✅

**Escaping**: Use backslash for quotes within title
```markdown
- [ ] #schedule 2026-04-15 14:00 "Discuss \"Project Alpha\" timeline"
```

### Length Limits

- **Minimum**: 1 character
- **Maximum**: 255 characters (calendar app limitation)
- **Recommended**: Keep under 50 characters for readability

---

## Parameter Order

### Flexible Ordering

Parameters can appear in any order after the title:

**All valid**:
```markdown
- [ ] #schedule 2026-04-15 14:00 "Meeting" duration:1h location:"Room A" reminder:15m
- [ ] #schedule 2026-04-15 14:00 "Meeting" location:"Room A" duration:1h reminder:15m
- [ ] #schedule 2026-04-15 14:00 "Meeting" reminder:15m duration:1h location:"Room A"
```

### Duplicate Parameters

**Behavior**: Last occurrence wins

**Example**:
```markdown
- [ ] #schedule 2026-04-15 14:00 "Meeting" duration:1h duration:2h
```
Result: Duration is 2 hours (last value used)

---

## Task Completion

### Marking Complete

When you check off a task:
```markdown
- [x] #schedule 2026-04-15 14:00 "Team Meeting" duration:1h
```

**Default Behavior**: Event is removed from `.ics` file

**Configurable**: Can be set to keep or archive completed events

### Unchecking

If you uncheck a completed task:
```markdown
- [ ] #schedule 2026-04-15 14:00 "Team Meeting" duration:1h
```

**Behavior**: Event is re-added to `.ics` file

---

## Common Patterns

### Daily Standup
```markdown
- [ ] #schedule 2026-04-15 09:00 "Daily Standup" duration:15m location:"Zoom"
```

### All-Day Event
```markdown
- [ ] #schedule 2026-04-15 00:00 "Conference Day" duration:24h location:"Convention Center"
```

### Quick Meeting
```markdown
- [ ] #schedule 2026-04-15 14:00 "Quick Sync" duration:30m
```

### Important Meeting with Reminder
```markdown
- [ ] #schedule 2026-04-15 10:00 "Board Meeting" duration:2h location:"HQ" reminder:60m
```

---

## Error Handling

### Invalid Format

**Example**:
```markdown
- [ ] #schedule 2026-04-15 "Meeting"
```

**Error**: Missing time component

**Result**: Task is ignored, warning logged to console

### Past Date

**Example**:
```markdown
- [ ] #schedule 2020-01-01 14:00 "Old Meeting"
```

**Error**: Date is in the past

**Result**: Task is ignored, warning displayed in sidebar

### Invalid Duration

**Example**:
```markdown
- [ ] #schedule 2026-04-15 14:00 "Meeting" duration:25h
```

**Error**: Duration exceeds 24 hours

**Result**: Duration defaults to 1 hour, warning logged

---

## RegEx Pattern

The plugin uses this RegEx pattern for parsing:

```regex
^-\s\[\s\]\s#schedule\s(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})\s"([^"]+)"(?:\s+duration:(\d+[hm]))?(?:\s+location:"([^"]+)")?(?:\s+reminder:(\d+m))?
```

**Capture Groups**:
1. Date (YYYY-MM-DD)
2. Time (HH:MM)
3. Title (string)
4. Duration (optional)
5. Location (optional)
6. Reminder (optional)

---

## Future Enhancements

### Planned for v2.0

**Natural Language Parsing** (optional):
```markdown
- [ ] #schedule Team meeting tomorrow at 2pm for 1 hour
```

**Recurring Events**:
```markdown
- [ ] #schedule 2026-04-15 09:00 "Standup" duration:15m repeat:daily
```

**Time Zones**:
```markdown
- [ ] #schedule 2026-04-15 14:00 "Call" duration:1h timezone:PST
```

---

## Best Practices

### 1. Use Descriptive Titles
```markdown
✅ - [ ] #schedule 2026-04-15 14:00 "Q2 Budget Review with Finance Team"
❌ - [ ] #schedule 2026-04-15 14:00 "Meeting"
```

### 2. Include Location for Physical Meetings
```markdown
- [ ] #schedule 2026-04-15 10:00 "Client Presentation" location:"Conference Room B"
```

### 3. Set Reminders for Important Events
```markdown
- [ ] #schedule 2026-04-15 09:00 "Board Meeting" reminder:60m
```

### 4. Group Related Tasks
```markdown
## Project Alpha
- [ ] #schedule 2026-04-15 10:00 "Kickoff" duration:1h
- [ ] #schedule 2026-04-17 14:00 "Design Review" duration:2h
- [ ] #schedule 2026-04-20 09:00 "Sprint Planning" duration:2h
```

### 5. Use Consistent Formatting
- Always use 24-hour time format
- Always quote titles and locations
- Use consistent duration units (prefer hours for long events)

---

## Troubleshooting

### Task Not Appearing in Sidebar

**Check**:
1. Is `#schedule` tag present?
2. Is date format correct (YYYY-MM-DD)?
3. Is time format correct (HH:MM)?
4. Is title quoted?
5. Is date in the future?

### Event Not in Calendar

**Check**:
1. Is `.ics` file being generated?
2. Is calendar app subscribed to correct file?
3. Has calendar app refreshed? (may take 5-15 minutes)
4. Check console for errors

### Wrong Event Time

**Check**:
1. Time zone settings in calendar app
2. Time format (must be 24-hour)
3. Leading zeros in time (09:00, not 9:00)

---

## Support

For issues or questions:
- GitHub Issues: [task-alavista/issues](https://github.com/yourusername/task-alavista/issues)
- Obsidian Forum: [Plugin Support](https://forum.obsidian.md/)
- Documentation: [README.md](README.md)