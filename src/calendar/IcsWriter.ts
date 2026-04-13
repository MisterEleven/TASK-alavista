import { Vault, TFolder, TFile } from "obsidian";

/**
 * Handles writing ICS files to the vault
 */
export class IcsWriter {
  private vault: Vault;
  private filePath: string;

  constructor(vault: Vault, filePath: string) {
    this.vault = vault;
    this.filePath = filePath;
  }

  /**
   * Write ICS content to file
   *
   * @param content - ICS file content
   * @returns Promise that resolves when write is complete
   */
  async write(content: string): Promise<void> {
    try {
      // Ensure directory exists
      await this.ensureDirectoryExists();

      // Check if file exists
      const file = this.vault.getAbstractFileByPath(this.filePath);

      if (file instanceof TFile) {
        // Update existing file
        await this.vault.modify(file, content);
      } else {
        // Create new file
        await this.vault.create(this.filePath, content);
      }
    } catch (error) {
      throw new Error(
        `Failed to write ICS file: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Ensure the directory for the ICS file exists
   */
  private async ensureDirectoryExists(): Promise<void> {
    const dirPath = this.getDirectoryPath(this.filePath);

    if (!dirPath) {
      return; // File is in root directory
    }

    const dir = this.vault.getAbstractFileByPath(dirPath);

    if (!dir) {
      // Directory doesn't exist, create it
      await this.createDirectory(dirPath);
    } else if (!(dir instanceof TFolder)) {
      throw new Error(`Path exists but is not a directory: ${dirPath}`);
    }
  }

  /**
   * Create directory recursively
   *
   * @param path - Directory path to create
   */
  private async createDirectory(path: string): Promise<void> {
    const parts = path.split("/");
    let currentPath = "";

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      const existing = this.vault.getAbstractFileByPath(currentPath);

      if (!existing) {
        await this.vault.createFolder(currentPath);
      } else if (!(existing instanceof TFolder)) {
        throw new Error(`Cannot create directory, file exists: ${currentPath}`);
      }
    }
  }

  /**
   * Get directory path from file path
   *
   * @param filePath - Full file path
   * @returns Directory path or empty string if in root
   */
  private getDirectoryPath(filePath: string): string {
    const lastSlash = filePath.lastIndexOf("/");
    return lastSlash > 0 ? filePath.substring(0, lastSlash) : "";
  }

  /**
   * Check if ICS file exists
   *
   * @returns True if file exists
   */
  async exists(): Promise<boolean> {
    const file = this.vault.getAbstractFileByPath(this.filePath);
    return file instanceof TFile;
  }

  /**
   * Read ICS file content
   *
   * @returns File content or null if file doesn't exist
   */
  async read(): Promise<string | null> {
    const file = this.vault.getAbstractFileByPath(this.filePath);

    if (file instanceof TFile) {
      return await this.vault.read(file);
    }

    return null;
  }

  /**
   * Delete ICS file
   *
   * @returns Promise that resolves when deletion is complete
   */
  async delete(): Promise<void> {
    const file = this.vault.getAbstractFileByPath(this.filePath);

    if (file instanceof TFile) {
      await this.vault.delete(file);
    }
  }

  /**
   * Update file path
   *
   * @param newPath - New file path
   */
  updatePath(newPath: string): void {
    this.filePath = newPath;
  }

  /**
   * Get current file path
   *
   * @returns Current file path
   */
  getPath(): string {
    return this.filePath;
  }
}