import { ScheduledTask } from "./types";
import { parse, isValid, isPast } from "date-fns";

/**
 * Validation result
 */
export interface ValidationResult {
  /**
   * Whether the task is valid
   */
  isValid: boolean;

  /**
   * Validation errors (if any)
   */
  errors: string[];
}

/**
 * Validator for scheduled tasks
 */
export class TaskValidator {
  /**
   * Validate a scheduled task
   *
   * @param task - Task to validate
   * @returns Validation result with any errors
   */
  static validate(task: ScheduledTask): ValidationResult {
    const errors: string[] = [];

    // Validate date format and value
    const dateError = this.validateDate(task.date);
    if (dateError) {
      errors.push(dateError);
    }

    // Validate time format
    const timeError = this.validateTime(task.time);
    if (timeError) {
      errors.push(timeError);
    }

    // Validate date is not in the past (only if date and time are valid)
    if (!dateError && !timeError) {
      const pastError = this.validateNotPast(task.date, task.time);
      if (pastError) {
        errors.push(pastError);
      }
    }

    // Validate duration
    const durationError = this.validateDuration(task.durationMinutes);
    if (durationError) {
      errors.push(durationError);
    }

    // Validate reminder
    if (task.reminderMinutes !== undefined) {
      const reminderError = this.validateReminder(task.reminderMinutes);
      if (reminderError) {
        errors.push(reminderError);
      }
    }

    // Validate title
    const titleError = this.validateTitle(task.title);
    if (titleError) {
      errors.push(titleError);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate date format and value
   *
   * @param date - Date string in YYYY-MM-DD format
   * @returns Error message or undefined
   */
  private static validateDate(date: string): string | undefined {
    // Check format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      return `Invalid date format: ${date}. Expected YYYY-MM-DD`;
    }

    // Parse and validate
    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    if (!isValid(parsedDate)) {
      return `Invalid date: ${date}`;
    }

    return undefined;
  }

  /**
   * Validate time format
   *
   * @param time - Time string in HH:MM format
   * @returns Error message or undefined
   */
  private static validateTime(time: string): string | undefined {
    // Check format
    const timePattern = /^\d{2}:\d{2}$/;
    if (!timePattern.test(time)) {
      return `Invalid time format: ${time}. Expected HH:MM`;
    }

    // Validate hour and minute ranges
    const [hourStr, minuteStr] = time.split(":");
    const hour = parseInt(hourStr!, 10);
    const minute = parseInt(minuteStr!, 10);

    if (hour < 0 || hour > 23) {
      return `Invalid hour: ${hour}. Must be 0-23`;
    }

    if (minute < 0 || minute > 59) {
      return `Invalid minute: ${minute}. Must be 0-59`;
    }

    return undefined;
  }

  /**
   * Validate that date/time is not in the past
   *
   * @param date - Date string
   * @param time - Time string
   * @returns Error message or undefined
   */
  private static validateNotPast(date: string, time: string): string | undefined {
    const [hour, minute] = time.split(":").map((s) => parseInt(s!, 10));
    const taskDate = parse(date, "yyyy-MM-dd", new Date());
    taskDate.setHours(hour!, minute!, 0, 0);

    const now = new Date();

    if (isPast(taskDate) && taskDate.getTime() < now.getTime()) {
      return `Task date/time is in the past: ${date} ${time}`;
    }

    return undefined;
  }

  /**
   * Validate duration
   *
   * @param durationMinutes - Duration in minutes
   * @returns Error message or undefined
   */
  private static validateDuration(durationMinutes: number): string | undefined {
    if (durationMinutes < 1) {
      return `Duration must be at least 1 minute, got: ${durationMinutes}`;
    }

    if (durationMinutes > 1440) {
      // 24 hours
      return `Duration cannot exceed 24 hours (1440 minutes), got: ${durationMinutes}`;
    }

    return undefined;
  }

  /**
   * Validate reminder time
   *
   * @param reminderMinutes - Reminder in minutes before event
   * @returns Error message or undefined
   */
  private static validateReminder(reminderMinutes: number): string | undefined {
    if (reminderMinutes < 0) {
      return `Reminder cannot be negative, got: ${reminderMinutes}`;
    }

    if (reminderMinutes > 1440) {
      // 24 hours
      return `Reminder cannot exceed 24 hours (1440 minutes), got: ${reminderMinutes}`;
    }

    return undefined;
  }

  /**
   * Validate title
   *
   * @param title - Event title
   * @returns Error message or undefined
   */
  private static validateTitle(title: string): string | undefined {
    if (title.length === 0) {
      return "Title cannot be empty";
    }

    if (title.length > 255) {
      return `Title too long (max 255 characters), got: ${title.length}`;
    }

    return undefined;
  }

  /**
   * Quick validation check (returns boolean only)
   *
   * @param task - Task to validate
   * @returns True if valid
   */
  static isValid(task: ScheduledTask): boolean {
    return this.validate(task).isValid;
  }
}