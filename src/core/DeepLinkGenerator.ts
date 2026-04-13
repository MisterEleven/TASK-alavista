import { ScheduledTask } from "../parser/types";

/**
 * Generates obsidian:// deep links for tasks
 */
export class DeepLinkGenerator {
  private vaultName: string;

  constructor(vaultName: string) {
    this.vaultName = vaultName;
  }

  /**
   * Generate a deep link for a scheduled task
   *
   * @param task - Scheduled task
   * @returns obsidian:// URI
   */
  generate(task: ScheduledTask): string {
    const params = new URLSearchParams({
      vault: this.vaultName,
      file: task.filePath,
      line: String(task.lineNumber + 1), // Convert to 1-based line number
    });

    return `obsidian://open?${params.toString()}`;
  }

  /**
   * Generate a deep link with custom parameters
   *
   * @param filePath - Path to the file
   * @param lineNumber - Line number (0-based)
   * @returns obsidian:// URI
   */
  generateCustom(filePath: string, lineNumber: number): string {
    const params = new URLSearchParams({
      vault: this.vaultName,
      file: filePath,
      line: String(lineNumber + 1),
    });

    return `obsidian://open?${params.toString()}`;
  }

  /**
   * Update vault name
   *
   * @param vaultName - New vault name
   */
  updateVaultName(vaultName: string): void {
    this.vaultName = vaultName;
  }

  /**
   * Get current vault name
   *
   * @returns Current vault name
   */
  getVaultName(): string {
    return this.vaultName;
  }
}
