import { App, PluginSettingTab, Setting } from "obsidian";
import TaskAlavistaPlugin from "../main";
import { CompletedBehavior } from "./PluginSettings";

/**
 * Settings tab for the TASK-alavista plugin
 */
export class TaskAlavistaSettingTab extends PluginSettingTab {
  plugin: TaskAlavistaPlugin;

  constructor(app: App, plugin: TaskAlavistaPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  /**
   * Display the settings tab
   */
  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    // Header
    containerEl.createEl("h2", { text: "TASK-alavista Settings" });

    // ICS File Path
    new Setting(containerEl)
      .setName("ICS file path")
      .setDesc("Path to the generated .ics file (relative to vault root)")
      .addText((text) =>
        text
          .setPlaceholder(".obsidian/plugins/task-alavista/schedule.ics")
          .setValue(this.plugin.settings.icsPath)
          .onChange(async (value) => {
            this.plugin.settings.icsPath = value;
            await this.plugin.saveSettings();
          })
      );

    // Debounce Delay
    new Setting(containerEl)
      .setName("Update delay")
      .setDesc("Delay in milliseconds before updating the .ics file after changes")
      .addText((text) =>
        text
          .setPlaceholder("2000")
          .setValue(String(this.plugin.settings.debounceDelay))
          .onChange(async (value) => {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 0) {
              this.plugin.settings.debounceDelay = numValue;
              await this.plugin.saveSettings();
            }
          })
      );

    // Completed Task Behavior
    new Setting(containerEl)
      .setName("Completed task behavior")
      .setDesc("What to do with tasks when they are marked as completed")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("remove", "Remove from calendar")
          .addOption("keep", "Keep in calendar (marked complete)")
          .addOption("archive", "Archive to separate section")
          .setValue(this.plugin.settings.completedBehavior)
          .onChange(async (value) => {
            this.plugin.settings.completedBehavior = value as CompletedBehavior;
            await this.plugin.saveSettings();
          })
      );

    // Default Reminder
    new Setting(containerEl)
      .setName("Default reminder")
      .setDesc("Default reminder time in minutes before event (if not specified in task)")
      .addText((text) =>
        text
          .setPlaceholder("15")
          .setValue(String(this.plugin.settings.defaultReminderMinutes))
          .onChange(async (value) => {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 0) {
              this.plugin.settings.defaultReminderMinutes = numValue;
              await this.plugin.saveSettings();
            }
          })
      );

    // Date Format
    new Setting(containerEl)
      .setName("Date format")
      .setDesc("Date format for display in sidebar (parsing always uses YYYY-MM-DD)")
      .addText((text) =>
        text
          .setPlaceholder("YYYY-MM-DD")
          .setValue(this.plugin.settings.dateFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value;
            await this.plugin.saveSettings();
          })
      );

    // Filter Current Note Only
    new Setting(containerEl)
      .setName("Filter current note")
      .setDesc("Show only tasks from the current note in the sidebar by default")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.filterCurrentNoteOnly).onChange(async (value) => {
          this.plugin.settings.filterCurrentNoteOnly = value;
          await this.plugin.saveSettings();
        })
      );

    // Info section
    containerEl.createEl("h3", { text: "About" });
    containerEl.createEl("p", {
      text: "TASK-alavista transforms Obsidian tasks into calendar events. Tag tasks with #schedule and add date, time, and optional parameters.",
    });
    containerEl.createEl("p", {
      text: 'Format: - [ ] #schedule YYYY-MM-DD HH:MM "Title" [duration:Xh|Xm] [location:"Place"] [reminder:Xm]',
      cls: "task-alavista-format-example",
    });
  }
}