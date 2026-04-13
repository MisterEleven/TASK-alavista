/**
 * Calendar and ICS-related types
 */

/**
 * Represents a calendar event in ICS format
 */
export interface CalendarEvent {
  /**
   * Unique identifier for the event (UID in ICS)
   */
  uid: string;

  /**
   * Event summary/title
   */
  summary: string;

  /**
   * Event description (includes deep link)
   */
  description: string;

  /**
   * Event start date/time in ISO format
   */
  startDateTime: string;

  /**
   * Event end date/time in ISO format
   */
  endDateTime: string;

  /**
   * Optional location
   */
  location?: string;

  /**
   * Optional alarm/reminder in minutes before event
   */
  alarmMinutes?: number;

  /**
   * Deep link URL to open in Obsidian
   */
  url: string;

  /**
   * Event status (CONFIRMED, TENTATIVE, CANCELLED)
   */
  status: "CONFIRMED" | "TENTATIVE" | "CANCELLED";

  /**
   * Creation timestamp
   */
  created: string;

  /**
   * Last modified timestamp
   */
  lastModified: string;
}

/**
 * ICS file configuration
 */
export interface IcsConfig {
  /**
   * Calendar name
   */
  calendarName: string;

  /**
   * Calendar description
   */
  calendarDescription: string;

  /**
   * Product identifier
   */
  prodId: string;

  /**
   * Timezone (default: UTC)
   */
  timezone: string;
}