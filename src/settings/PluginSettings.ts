/**
 * Plugin settings interface and default values
 */

/**
 * Behavior when a task is marked as completed
 */
export type CompletedBehavior = "remove" | "keep" | "archive";

/**
 * Plugin configuration settings
 */
export interface PluginSettings {
  /**
   * Path to the generated .ics file relative to vault root
   * @default ".obsidian/plugins/task-alavista/schedule.ics"
   */
  icsPath: string;

  /**
   * Debounce delay in milliseconds before updating the .ics file
   * @default 2000
   */
  debounceDelay: number;

  /**
   * How to handle completed tasks in the calendar
   * @default "remove"
   */
  completedBehavior: CompletedBehavior;

  /**
   * Default reminder time in minutes before event
   * @default 15
   */
  defaultReminderMinutes: number;

  /**
   * Date format for display (not for parsing)
   * @default "YYYY-MM-DD"
   */
  dateFormat: string;

  /**
   * Show tasks from current note only in sidebar
   * @default false
   */
  filterCurrentNoteOnly: boolean;
}

/**
 * Default plugin settings
 */
export const DEFAULT_SETTINGS: PluginSettings = {
  icsPath: ".obsidian/plugins/task-alavista/schedule.ics",
  debounceDelay: 2000,
  completedBehavior: "remove",
  defaultReminderMinutes: 15,
  dateFormat: "YYYY-MM-DD",
  filterCurrentNoteOnly: false,
};
