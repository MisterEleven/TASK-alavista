/**
 * Task parser types and interfaces
 */

/**
 * Represents a scheduled task parsed from a markdown file
 */
export interface ScheduledTask {
  /**
   * Unique identifier for the task (hash of file path + line number)
   */
  id: string;

  /**
   * Path to the file containing the task
   */
  filePath: string;

  /**
   * Line number where the task appears in the file (0-based)
   */
  lineNumber: number;

  /**
   * Whether the task is completed
   */
  isCompleted: boolean;

  /**
   * Event title
   */
  title: string;

  /**
   * Event date in YYYY-MM-DD format
   */
  date: string;

  /**
   * Event time in HH:MM format (24-hour)
   */
  time: string;

  /**
   * Duration in minutes
   */
  durationMinutes: number;

  /**
   * Optional location
   */
  location?: string;

  /**
   * Optional reminder in minutes before event
   */
  reminderMinutes?: number;

  /**
   * Raw task line from the file
   */
  rawLine: string;
}

/**
 * Result of parsing a task line
 */
export interface ParseResult {
  /**
   * Whether parsing was successful
   */
  success: boolean;

  /**
   * Parsed task if successful
   */
  task?: ScheduledTask;

  /**
   * Error message if parsing failed
   */
  error?: string;
}

/**
 * Parsed task parameters from RegEx match
 */
export interface TaskMatch {
  date: string;
  time: string;
  title: string;
  duration?: string;
  location?: string;
  reminder?: string;
}