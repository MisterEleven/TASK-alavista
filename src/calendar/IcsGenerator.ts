import { ScheduledTask } from "../parser/types";
import { CalendarEvent, IcsConfig } from "./types";
import { format, parse, add } from "date-fns";

/**
 * Generates ICS (iCalendar) files from scheduled tasks
 */
export class IcsGenerator {
  private config: IcsConfig;

  constructor(config?: Partial<IcsConfig>) {
    this.config = {
      calendarName: config?.calendarName || "TASK-alavista Schedule",
      calendarDescription: config?.calendarDescription || "Scheduled tasks from Obsidian",
      prodId: config?.prodId || "-//TASK-alavista//Obsidian Plugin//EN",
      timezone: config?.timezone || "UTC",
    };
  }

  /**
   * Generate complete ICS file content from tasks
   *
   * @param tasks - Array of scheduled tasks
   * @param deepLinkGenerator - Function to generate deep links
   * @returns ICS file content as string
   */
  generate(tasks: ScheduledTask[], deepLinkGenerator: (task: ScheduledTask) => string): string {
    const events = tasks.map((task) => this.taskToEvent(task, deepLinkGenerator(task)));

    return this.buildIcsContent(events);
  }

  /**
   * Convert a ScheduledTask to a CalendarEvent
   *
   * @param task - Scheduled task
   * @param deepLink - Deep link URL
   * @returns Calendar event
   */
  private taskToEvent(task: ScheduledTask, deepLink: string): CalendarEvent {
    const startDateTime = this.parseDateTime(task.date, task.time);
    const endDateTime = add(startDateTime, { minutes: task.durationMinutes });

    const now = new Date();

    return {
      uid: task.id,
      summary: task.title,
      description: this.buildDescription(task, deepLink),
      startDateTime: this.formatIcsDateTime(startDateTime),
      endDateTime: this.formatIcsDateTime(endDateTime),
      location: task.location,
      alarmMinutes: task.reminderMinutes,
      url: deepLink,
      status: task.isCompleted ? "CANCELLED" : "CONFIRMED",
      created: this.formatIcsDateTime(now),
      lastModified: this.formatIcsDateTime(now),
    };
  }

  /**
   * Build event description with deep link
   *
   * @param task - Scheduled task
   * @param deepLink - Deep link URL
   * @returns Event description
   */
  private buildDescription(task: ScheduledTask, deepLink: string): string {
    const parts: string[] = [];

    parts.push(`Task from: ${task.filePath}`);
    parts.push(`Line: ${task.lineNumber + 1}`);
    parts.push("");
    parts.push(`Open in Obsidian: ${deepLink}`);

    return parts.join("\\n");
  }

  /**
   * Parse date and time strings into a Date object
   *
   * @param date - Date string (YYYY-MM-DD)
   * @param time - Time string (HH:MM)
   * @returns Date object
   */
  private parseDateTime(date: string, time: string): Date {
    const [hour, minute] = time.split(":").map((s) => parseInt(s!, 10));
    const dateTime = parse(date, "yyyy-MM-dd", new Date());
    dateTime.setHours(hour!, minute!, 0, 0);
    return dateTime;
  }

  /**
   * Format a Date object for ICS format (YYYYMMDDTHHMMSS - local time, no Z suffix)
   *
   * @param date - Date to format
   * @returns ICS-formatted date string in local time
   */
  private formatIcsDateTime(date: Date): string {
    // Format as local time without 'Z' suffix
    // This ensures the time is interpreted in the user's local timezone
    return format(date, "yyyyMMdd'T'HHmmss");
  }

  /**
   * Build complete ICS file content
   *
   * @param events - Array of calendar events
   * @returns ICS file content
   */
  private buildIcsContent(events: CalendarEvent[]): string {
    const lines: string[] = [];

    // Calendar header
    lines.push("BEGIN:VCALENDAR");
    lines.push("VERSION:2.0");
    lines.push(`PRODID:${this.config.prodId}`);
    lines.push(`X-WR-CALNAME:${this.config.calendarName}`);
    lines.push(`X-WR-CALDESC:${this.config.calendarDescription}`);
    lines.push("CALSCALE:GREGORIAN");
    lines.push("METHOD:PUBLISH");

    // Add events
    events.forEach((event) => {
      lines.push(...this.buildEventLines(event));
    });

    // Calendar footer
    lines.push("END:VCALENDAR");

    return lines.join("\r\n");
  }

  /**
   * Build ICS lines for a single event
   *
   * @param event - Calendar event
   * @returns Array of ICS lines
   */
  private buildEventLines(event: CalendarEvent): string[] {
    const lines: string[] = [];

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${event.uid}@task-alavista`);
    lines.push(`DTSTAMP:${event.created}`);
    lines.push(`DTSTART:${event.startDateTime}`);
    lines.push(`DTEND:${event.endDateTime}`);
    lines.push(`SUMMARY:${this.escapeIcsText(event.summary)}`);
    lines.push(`DESCRIPTION:${this.escapeIcsText(event.description)}`);
    lines.push(`STATUS:${event.status}`);
    lines.push(`CREATED:${event.created}`);
    lines.push(`LAST-MODIFIED:${event.lastModified}`);

    if (event.location) {
      lines.push(`LOCATION:${this.escapeIcsText(event.location)}`);
    }

    if (event.url) {
      lines.push(`URL:${event.url}`);
    }

    // Add alarm/reminder if specified
    if (event.alarmMinutes !== undefined) {
      lines.push("BEGIN:VALARM");
      lines.push("ACTION:DISPLAY");
      lines.push(`DESCRIPTION:${this.escapeIcsText(event.summary)}`);
      lines.push(`TRIGGER:-PT${event.alarmMinutes}M`);
      lines.push("END:VALARM");
    }

    lines.push("END:VEVENT");

    return lines;
  }

  /**
   * Escape special characters for ICS format
   *
   * @param text - Text to escape
   * @returns Escaped text
   */
  private escapeIcsText(text: string): string {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  }

  /**
   * Update calendar configuration
   *
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<IcsConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
