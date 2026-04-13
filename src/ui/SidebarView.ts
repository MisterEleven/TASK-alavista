import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import { ScheduledTask } from "../parser/types";
import { format, parse } from "date-fns";
import TaskAlavistaPlugin from "../main";

/**
 * View ID for the sidebar
 */
export const VIEW_TYPE_TASK_ALAVISTA = "task-alavista-sidebar";

/**
 * Sidebar view for displaying scheduled tasks
 */
export class TaskAlavistaSidebarView extends ItemView {
  private tasks: ScheduledTask[] = [];
  private filterCurrentNote: boolean = false;

  constructor(leaf: WorkspaceLeaf, plugin: TaskAlavistaPlugin) {
    super(leaf);
    this.filterCurrentNote = plugin.settings.filterCurrentNoteOnly;
  }

  /**
   * Get view type identifier
   */
  getViewType(): string {
    return VIEW_TYPE_TASK_ALAVISTA;
  }

  /**
   * Get display text for the view
   */
  getDisplayText(): string {
    return "Scheduled Tasks";
  }

  /**
   * Get icon for the view
   */
  override getIcon(): string {
    return "calendar-clock";
  }

  /**
   * Called when the view is opened
   */
  override async onOpen(): Promise<void> {
    this.render();
  }

  /**
   * Called when the view is closed
   */
  override async onClose(): Promise<void> {
    // Cleanup if needed
  }

  /**
   * Update tasks and re-render
   *
   * @param tasks - Array of scheduled tasks
   */
  updateTasks(tasks: ScheduledTask[]): void {
    this.tasks = tasks;
    this.render();
  }

  /**
   * Render the sidebar view
   */
  private render(): void {
    const container = this.containerEl.children[1];
    if (!container) return;

    container.empty();
    container.addClass("task-alavista-sidebar");

    // Header with filter controls
    this.renderHeader(container);

    // Filter tasks based on current settings
    const filteredTasks = this.getFilteredTasks();

    // Render tasks or empty state
    if (filteredTasks.length === 0) {
      this.renderEmptyState(container);
    } else {
      this.renderTaskList(container, filteredTasks);
    }
  }

  /**
   * Render header with filter controls
   *
   * @param container - Container element
   */
  private renderHeader(container: Element): void {
    const header = container.createDiv({ cls: "task-alavista-header" });

    header.createEl("h3", { text: "Scheduled Tasks" });

    const filterContainer = header.createDiv({ cls: "task-alavista-filter" });

    // All tasks button
    const allButton = filterContainer.createEl("button", {
      text: "All",
      cls: this.filterCurrentNote ? "" : "active",
    });
    allButton.addEventListener("click", () => {
      this.filterCurrentNote = false;
      this.render();
    });

    // Current note button
    const currentButton = filterContainer.createEl("button", {
      text: "Current",
      cls: this.filterCurrentNote ? "active" : "",
    });
    currentButton.addEventListener("click", () => {
      this.filterCurrentNote = true;
      this.render();
    });
  }

  /**
   * Get filtered tasks based on current filter settings
   *
   * @returns Filtered and sorted tasks
   */
  private getFilteredTasks(): ScheduledTask[] {
    let filtered = [...this.tasks];

    // Filter by current note if enabled
    if (this.filterCurrentNote) {
      const activeFile = this.app.workspace.getActiveFile();
      if (activeFile) {
        filtered = filtered.filter((task) => task.filePath === activeFile.path);
      } else {
        filtered = [];
      }
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = this.parseTaskDateTime(a);
      const dateB = this.parseTaskDateTime(b);
      return dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }

  /**
   * Parse task date and time into Date object
   *
   * @param task - Scheduled task
   * @returns Date object
   */
  private parseTaskDateTime(task: ScheduledTask): Date {
    const [hour, minute] = task.time.split(":").map((s) => parseInt(s!, 10));
    const date = parse(task.date, "yyyy-MM-dd", new Date());
    date.setHours(hour!, minute!, 0, 0);
    return date;
  }

  /**
   * Render empty state
   *
   * @param container - Container element
   */
  private renderEmptyState(container: Element): void {
    const empty = container.createDiv({ cls: "task-alavista-empty" });
    empty.createEl("p", { text: "No scheduled tasks found" });
    empty.createEl("p", {
      text: "Create a task with #schedule tag to get started",
      cls: "task-alavista-hint",
    });
  }

  /**
   * Render task list
   *
   * @param container - Container element
   * @param tasks - Tasks to render
   */
  private renderTaskList(container: Element, tasks: ScheduledTask[]): void {
    const listContainer = container.createDiv({ cls: "task-alavista-task-list" });

    tasks.forEach((task) => {
      this.renderTaskItem(listContainer, task);
    });
  }

  /**
   * Render a single task item
   *
   * @param container - Container element
   * @param task - Task to render
   */
  private renderTaskItem(container: Element, task: ScheduledTask): void {
    const item = container.createDiv({ cls: "task-alavista-task-item" });

    // Make item clickable to open note
    item.addEventListener("click", () => {
      this.openTaskInNote(task);
    });

    // Date and time
    const dateEl = item.createDiv({ cls: "task-alavista-task-date" });
    const formattedDate = this.formatTaskDate(task);
    dateEl.setText(formattedDate);

    // Title
    const titleEl = item.createDiv({ cls: "task-alavista-task-title" });
    titleEl.setText(task.title);

    // Metadata (duration, location)
    const metaContainer = item.createDiv({ cls: "task-alavista-task-meta" });

    // Duration
    const durationEl = metaContainer.createDiv({ cls: "task-alavista-task-meta-item" });
    durationEl.setText(`⏱️ ${this.formatDuration(task.durationMinutes)}`);

    // Location
    if (task.location) {
      const locationEl = metaContainer.createDiv({ cls: "task-alavista-task-meta-item" });
      locationEl.setText(`📍 ${task.location}`);
    }

    // Reminder
    if (task.reminderMinutes !== undefined) {
      const reminderEl = metaContainer.createDiv({ cls: "task-alavista-task-meta-item" });
      reminderEl.setText(`🔔 ${task.reminderMinutes}m before`);
    }
  }

  /**
   * Format task date for display
   *
   * @param task - Scheduled task
   * @returns Formatted date string
   */
  private formatTaskDate(task: ScheduledTask): string {
    const dateTime = this.parseTaskDateTime(task);
    return format(dateTime, "EEE, MMM d 'at' HH:mm");
  }

  /**
   * Format duration for display
   *
   * @param minutes - Duration in minutes
   * @returns Formatted duration string
   */
  private formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Open task in note at specific line
   *
   * @param task - Task to open
   */
  private openTaskInNote(task: ScheduledTask): void {
    const file = this.app.vault.getAbstractFileByPath(task.filePath);

    if (file instanceof TFile) {
      const leaf = this.app.workspace.getLeaf(false);
      void leaf.openFile(file).then(() => {
        // Set cursor to task line
        const editor = this.app.workspace.activeEditor?.editor;
        if (editor) {
          editor.setCursor({ line: task.lineNumber, ch: 0 });
          editor.scrollIntoView(
            { from: { line: task.lineNumber, ch: 0 }, to: { line: task.lineNumber, ch: 0 } },
            true
          );
        }
      });
    }
  }

  /**
   * Toggle filter mode
   */
  toggleFilter(): void {
    this.filterCurrentNote = !this.filterCurrentNote;
    this.render();
  }
}
