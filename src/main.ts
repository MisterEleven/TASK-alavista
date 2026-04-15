import { Plugin, Notice } from "obsidian";
import { PluginSettings, DEFAULT_SETTINGS } from "./settings/PluginSettings";
import { TaskAlavistaSettingTab } from "./settings/SettingsTab";
import { TaskAlavistaSidebarView, VIEW_TYPE_TASK_ALAVISTA } from "./ui/SidebarView";
import { TaskManager } from "./core/TaskManager";

/**
 * TASK-alavista Plugin
 * Transforms Obsidian tasks into calendar events with automatic .ics generation
 */
export default class TaskAlavistaPlugin extends Plugin {
  settings!: PluginSettings;
  taskManager: TaskManager | null = null;
  sidebarView: TaskAlavistaSidebarView | null = null;

  /**
   * Called when the plugin is loaded
   */
  override async onload(): Promise<void> {
    console.log("Loading TASK-alavista plugin");

    // Load settings
    await this.loadSettings();

    // Register settings tab
    this.addSettingTab(new TaskAlavistaSettingTab(this.app, this));

    // Register sidebar view
    this.registerView(VIEW_TYPE_TASK_ALAVISTA, (leaf) => {
      const view = new TaskAlavistaSidebarView(leaf, this);
      this.sidebarView = view;
      return view;
    });

    // Register commands
    this.registerCommands();

    // Defer initialization until workspace is ready
    this.app.workspace.onLayoutReady(() => {
      // Initialize TaskManager after workspace is ready
      this.taskManager = new TaskManager(this.app, this.settings);
      
      void this.taskManager.initialize().then(() => {
        // Update sidebar when tasks change
        this.taskManager!.onTasksChanged((tasks) => {
          if (this.sidebarView) {
            this.sidebarView.updateTasks(tasks);
          }
        });

        // Activate sidebar and update with tasks
        void this.activateSidebarView().then(() => {
          if (this.sidebarView && this.taskManager) {
            this.sidebarView.updateTasks(this.taskManager.getTasks());
          }
        });
      });
    });
  }

  /**
   * Called when the plugin is unloaded
   */
  override onunload(): void {
    console.log("Unloading TASK-alavista plugin");

    // Cleanup TaskManager
    if (this.taskManager) {
      this.taskManager.destroy();
      this.taskManager = null;
    }

    // Detach sidebar view
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_TASK_ALAVISTA);
  }

  /**
   * Register command palette commands
   */
  private registerCommands(): void {
    // Refresh scheduled tasks
    this.addCommand({
      id: "refresh-scheduled-tasks",
      name: "Refresh scheduled tasks",
      callback: () => {
        if (this.taskManager) {
          void this.taskManager.refresh().then(() => {
            new Notice("Scheduled tasks refreshed and ICS file updated");
          });
        }
      },
    });

    // Generate ICS file now
    this.addCommand({
      id: "generate-ics-now",
      name: "Generate ICS file now",
      callback: () => {
        if (this.taskManager) {
          void this.taskManager
            .refresh()
            .then(() => {
              if (this.taskManager) {
                const tasks = this.taskManager.getTasks();
                new Notice(`ICS file generated with ${tasks.length} tasks`);
              }
            })
            .catch((error) => {
              new Notice(
                `Failed to generate ICS file: ${error instanceof Error ? error.message : "Unknown error"}`
              );
            });
        }
      },
    });

    // Show scheduled tasks sidebar
    this.addCommand({
      id: "show-scheduled-tasks",
      name: "Show scheduled tasks sidebar",
      callback: () => {
        void this.activateSidebarView();
      },
    });

    // Toggle filter (current note vs all)
    this.addCommand({
      id: "toggle-task-filter",
      name: "Toggle task filter (current note / all)",
      callback: () => {
        if (this.sidebarView) {
          this.sidebarView.toggleFilter();
        }
      },
    });
  }

  /**
   * Activate the sidebar view
   */
  private async activateSidebarView(): Promise<void> {
    const { workspace } = this.app;

    // Check if view already exists
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_TASK_ALAVISTA)[0];

    if (!leaf) {
      // Use getLeaf with 'tab' to create in a safe location
      // This avoids issues with uninitialized sidebars
      leaf = workspace.getLeaf('tab');
      
      if (leaf) {
        await leaf.setViewState({
          type: VIEW_TYPE_TASK_ALAVISTA,
          active: true,
        });
      }
    }

    if (leaf) {
      void workspace.revealLeaf(leaf);
    }
  }

  /**
   * Load plugin settings from disk
   */
  async loadSettings(): Promise<void> {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as Partial<PluginSettings>
    );
  }

  /**
   * Save plugin settings to disk
   */
  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);

    // Update TaskManager with new settings
    if (this.taskManager) {
      this.taskManager.updateSettings(this.settings);
    }
  }
}
