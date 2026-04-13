import { Plugin } from "obsidian";
import { PluginSettings, DEFAULT_SETTINGS } from "./settings/PluginSettings";
import { TaskAlavistaSettingTab } from "./settings/SettingsTab";

/**
 * TASK-alavista Plugin
 * Transforms Obsidian tasks into calendar events with automatic .ics generation
 */
export default class TaskAlavistaPlugin extends Plugin {
  settings: PluginSettings;

  /**
   * Called when the plugin is loaded
   */
  async onload(): Promise<void> {
    console.log("Loading TASK-alavista plugin");

    // Load settings
    await this.loadSettings();

    // Register settings tab
    this.addSettingTab(new TaskAlavistaSettingTab(this.app, this));

    // TODO: Register sidebar view
    // TODO: Initialize TaskManager
    // TODO: Register commands
  }

  /**
   * Called when the plugin is unloaded
   */
  onunload(): void {
    console.log("Unloading TASK-alavista plugin");

    // TODO: Cleanup resources
    // TODO: Unregister views
    // TODO: Stop file monitoring
  }

  /**
   * Load plugin settings from disk
   */
  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  /**
   * Save plugin settings to disk
   */
  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }
}