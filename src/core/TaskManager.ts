import { App, TFile, MetadataCache, Vault } from "obsidian";
import { ScheduledTask } from "../parser/types";
import { TaskParser } from "../parser/TaskParser";
import { TaskValidator } from "../parser/TaskValidator";
import { IcsGenerator } from "../calendar/IcsGenerator";
import { IcsWriter } from "../calendar/IcsWriter";
import { DeepLinkGenerator } from "./DeepLinkGenerator";
import { debounce } from "../utils/debounce";
import { PluginSettings } from "../settings/PluginSettings";

/**
 * Central coordinator for task management
 * Handles parsing, validation, and ICS generation
 */
export class TaskManager {
  private app: App;
  private settings: PluginSettings;
  private tasks: Map<string, ScheduledTask> = new Map();
  private icsGenerator: IcsGenerator;
  private icsWriter: IcsWriter;
  private deepLinkGenerator: DeepLinkGenerator;
  private debouncedUpdate: (() => void) & { cancel: () => void };
  private onTasksChangedCallback?: (tasks: ScheduledTask[]) => void;

  constructor(app: App, settings: PluginSettings) {
    this.app = app;
    this.settings = settings;

    // Initialize components
    this.icsGenerator = new IcsGenerator();
    this.icsWriter = new IcsWriter(app.vault, settings.icsPath);
    this.deepLinkGenerator = new DeepLinkGenerator(app.vault.getName());

    // Create debounced update function
    this.debouncedUpdate = debounce(() => {
      void this.updateIcsFile();
    }, settings.debounceDelay);
  }

  /**
   * Initialize the task manager
   * Scans all files and sets up event listeners
   */
  async initialize(): Promise<void> {
    // Initial scan of all files
    await this.scanAllFiles();

    // Register event listeners
    this.registerEventListeners();

    // Generate initial ICS file
    await this.updateIcsFile();
  }

  /**
   * Scan all markdown files in the vault
   */
  private async scanAllFiles(): Promise<void> {
    const files = this.app.vault.getMarkdownFiles();

    for (const file of files) {
      await this.parseFile(file);
    }
  }

  /**
   * Register event listeners for file changes
   */
  private registerEventListeners(): void {
    // Listen for file modifications
    this.app.vault.on("modify", (file) => {
      if (file instanceof TFile && file.extension === "md") {
        void this.handleFileChange(file);
      }
    });

    // Listen for file deletions
    this.app.vault.on("delete", (file) => {
      if (file instanceof TFile && file.extension === "md") {
        this.handleFileDelete(file);
      }
    });

    // Listen for file renames
    this.app.vault.on("rename", (file, oldPath) => {
      if (file instanceof TFile && file.extension === "md") {
        this.handleFileRename(file, oldPath);
      }
    });
  }

  /**
   * Handle file change event
   *
   * @param file - Changed file
   */
  private async handleFileChange(file: TFile): Promise<void> {
    await this.parseFile(file);
    this.debouncedUpdate();
    this.notifyTasksChanged();
  }

  /**
   * Handle file delete event
   *
   * @param file - Deleted file
   */
  private handleFileDelete(file: TFile): void {
    // Remove all tasks from this file
    const tasksToRemove: string[] = [];

    this.tasks.forEach((task, id) => {
      if (task.filePath === file.path) {
        tasksToRemove.push(id);
      }
    });

    tasksToRemove.forEach((id) => this.tasks.delete(id));

    this.debouncedUpdate();
    this.notifyTasksChanged();
  }

  /**
   * Handle file rename event
   *
   * @param file - Renamed file
   * @param oldPath - Old file path
   */
  private async handleFileRename(file: TFile, oldPath: string): Promise<void> {
    // Remove tasks with old path
    const tasksToRemove: string[] = [];

    this.tasks.forEach((task, id) => {
      if (task.filePath === oldPath) {
        tasksToRemove.push(id);
      }
    });

    tasksToRemove.forEach((id) => this.tasks.delete(id));

    // Re-parse file with new path
    await this.parseFile(file);

    this.debouncedUpdate();
    this.notifyTasksChanged();
  }

  /**
   * Parse a file for scheduled tasks
   *
   * @param file - File to parse
   */
  private async parseFile(file: TFile): Promise<void> {
    const content = await this.app.vault.read(file);
    const lines = content.split("\n");

    // Remove existing tasks from this file
    const existingTaskIds: string[] = [];
    this.tasks.forEach((task, id) => {
      if (task.filePath === file.path) {
        existingTaskIds.push(id);
      }
    });
    existingTaskIds.forEach((id) => this.tasks.delete(id));

    // Parse new tasks
    lines.forEach((line, index) => {
      if (TaskParser.isScheduledTaskLine(line)) {
        const result = TaskParser.parseLine(line, file.path, index);

        if (result.success && result.task) {
          // Validate task
          const validation = TaskValidator.validate(result.task);

          if (validation.isValid) {
            // Handle completed tasks based on settings
            if (result.task.isCompleted && this.settings.completedBehavior === "remove") {
              // Don't add completed tasks if set to remove
              return;
            }

            this.tasks.set(result.task.id, result.task);
          } else {
            console.warn(
              `Invalid task at ${file.path}:${index + 1}:`,
              validation.errors.join(", ")
            );
          }
        } else if (result.error) {
          console.warn(`Failed to parse task at ${file.path}:${index + 1}:`, result.error);
        }
      }
    });
  }

  /**
   * Update the ICS file with current tasks
   */
  private async updateIcsFile(): Promise<void> {
    try {
      const tasksArray = Array.from(this.tasks.values());

      // Filter out completed tasks if needed
      const filteredTasks = tasksArray.filter((task) => {
        if (task.isCompleted && this.settings.completedBehavior === "remove") {
          return false;
        }
        return true;
      });

      // Generate ICS content
      const icsContent = this.icsGenerator.generate(filteredTasks, (task) =>
        this.deepLinkGenerator.generate(task)
      );

      // Write to file
      await this.icsWriter.write(icsContent);

      console.log(`Updated ICS file with ${filteredTasks.length} tasks`);
    } catch (error) {
      console.error("Failed to update ICS file:", error);
    }
  }

  /**
   * Get all tasks
   *
   * @returns Array of all scheduled tasks
   */
  getTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks from a specific file
   *
   * @param filePath - File path
   * @returns Array of tasks from the file
   */
  getTasksFromFile(filePath: string): ScheduledTask[] {
    return Array.from(this.tasks.values()).filter((task) => task.filePath === filePath);
  }

  /**
   * Force refresh all tasks
   */
  async refresh(): Promise<void> {
    this.tasks.clear();
    await this.scanAllFiles();
    await this.updateIcsFile();
    this.notifyTasksChanged();
  }

  /**
   * Update settings
   *
   * @param settings - New settings
   */
  updateSettings(settings: PluginSettings): void {
    this.settings = settings;

    // Update ICS writer path
    this.icsWriter.updatePath(settings.icsPath);

    // Recreate debounced function with new delay
    this.debouncedUpdate.cancel();
    this.debouncedUpdate = debounce(() => {
      void this.updateIcsFile();
    }, settings.debounceDelay);

    // Trigger update
    this.debouncedUpdate();
  }

  /**
   * Register callback for task changes
   *
   * @param callback - Callback function
   */
  onTasksChanged(callback: (tasks: ScheduledTask[]) => void): void {
    this.onTasksChangedCallback = callback;
  }

  /**
   * Notify listeners that tasks have changed
   */
  private notifyTasksChanged(): void {
    if (this.onTasksChangedCallback) {
      this.onTasksChangedCallback(this.getTasks());
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.debouncedUpdate.cancel();
    this.tasks.clear();
  }
}