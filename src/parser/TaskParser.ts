import { ScheduledTask, ParseResult, TaskMatch } from "./types";

/**
 * Parser for extracting scheduled tasks from markdown content
 */
export class TaskParser {
  /**
   * RegEx pattern for matching scheduled tasks
   * Format: - [ ] #schedule YYYY-MM-DD HH:MM "Title" [duration:Xh|Xm] [location:"Place"] [reminder:Xm]
   */
  private static readonly TASK_PATTERN =
    /^-\s\[([ x])\]\s#schedule\s(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})\s"([^"]+)"(?:\s+duration:(\d+[hm]))?(?:\s+location:"([^"]+)")?(?:\s+reminder:(\d+m))?/;

  /**
   * Parse a single line of markdown text
   *
   * @param line - The markdown line to parse
   * @param filePath - Path to the file containing the line
   * @param lineNumber - Line number in the file (0-based)
   * @returns Parse result with task or error
   */
  static parseLine(line: string, filePath: string, lineNumber: number): ParseResult {
    const trimmedLine = line.trim();

    // Check if line contains #schedule tag
    if (!trimmedLine.includes("#schedule")) {
      return { success: false, error: "Line does not contain #schedule tag" };
    }

    // Try to match the pattern
    const match = trimmedLine.match(this.TASK_PATTERN);

    if (!match) {
      return {
        success: false,
        error: "Line does not match expected format",
      };
    }

    // Extract matched groups (all are guaranteed to exist except optional ones)
    const completionStatus = match[1];
    const date = match[2]!;
    const time = match[3]!;
    const title = match[4]!;
    const duration = match[5];
    const location = match[6];
    const reminder = match[7];

    const taskMatch: TaskMatch = {
      date,
      time,
      title,
      duration,
      location,
      reminder,
    };

    try {
      const task = this.buildTask(
        taskMatch,
        filePath,
        lineNumber,
        completionStatus === "x",
        trimmedLine
      );
      return { success: true, task };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown parsing error",
      };
    }
  }

  /**
   * Build a ScheduledTask from matched components
   *
   * @param match - Matched task components
   * @param filePath - Path to the file
   * @param lineNumber - Line number (0-based)
   * @param isCompleted - Whether task is marked complete
   * @param rawLine - Original line text
   * @returns Constructed ScheduledTask
   */
  private static buildTask(
    match: TaskMatch,
    filePath: string,
    lineNumber: number,
    isCompleted: boolean,
    rawLine: string
  ): ScheduledTask {
    const id = this.generateTaskId(filePath, lineNumber);
    const durationMinutes = this.parseDuration(match.duration);
    const reminderMinutes = this.parseReminder(match.reminder);

    return {
      id,
      filePath,
      lineNumber,
      isCompleted,
      title: match.title,
      date: match.date,
      time: match.time,
      durationMinutes,
      location: match.location,
      reminderMinutes,
      rawLine,
    };
  }

  /**
   * Generate a unique ID for a task based on file path and line number
   *
   * @param filePath - Path to the file
   * @param lineNumber - Line number (0-based)
   * @returns Unique task ID
   */
  private static generateTaskId(filePath: string, lineNumber: number): string {
    const str = `${filePath}:${lineNumber}`;
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Parse duration string to minutes
   *
   * @param duration - Duration string (e.g., "1h", "30m")
   * @returns Duration in minutes (default: 60)
   */
  private static parseDuration(duration?: string): number {
    if (!duration) {
      return 60; // Default 1 hour
    }

    const match = duration.match(/^(\d+)([hm])$/);
    if (!match) {
      return 60;
    }

    const value = match[1];
    const unit = match[2];
    const numValue = parseInt(value!, 10);

    if (unit === "h") {
      return numValue * 60;
    } else {
      return numValue;
    }
  }

  /**
   * Parse reminder string to minutes
   *
   * @param reminder - Reminder string (e.g., "15m")
   * @returns Reminder in minutes before event
   */
  private static parseReminder(reminder?: string): number | undefined {
    if (!reminder) {
      return undefined;
    }

    const match = reminder.match(/^(\d+)m$/);
    if (!match) {
      return undefined;
    }

    return parseInt(match[1]!, 10);
  }

  /**
   * Parse multiple lines from a file
   *
   * @param content - File content as string
   * @param filePath - Path to the file
   * @returns Array of successfully parsed tasks
   */
  static parseFile(content: string, filePath: string): ScheduledTask[] {
    const lines = content.split("\n");
    const tasks: ScheduledTask[] = [];

    lines.forEach((line, index) => {
      const result = this.parseLine(line, filePath, index);
      if (result.success && result.task) {
        tasks.push(result.task);
      }
    });

    return tasks;
  }

  /**
   * Check if a line contains a scheduled task
   *
   * @param line - Line to check
   * @returns True if line contains #schedule tag
   */
  static isScheduledTaskLine(line: string): boolean {
    return line.includes("#schedule");
  }
}
