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
    // Manually encode to use %20 instead of + for spaces
    const vault = encodeURIComponent(this.vaultName);
    const file = encodeURIComponent(task.filePath);
    const line = task.lineNumber + 1; // Convert to 1-based line number

    return `obsidian://open?vault=${vault}&file=${file}&line=${line}`;
  }

  /**
   * Generate a deep link with custom parameters
   *
   * @param filePath - Path to the file
   * @param lineNumber - Line number (0-based)
   * @returns obsidian:// URI
   */
  generateCustom(filePath: string, lineNumber: number): string {
    // Manually encode to use %20 instead of + for spaces
    const vault = encodeURIComponent(this.vaultName);
    const file = encodeURIComponent(filePath);
    const line = lineNumber + 1;

    return `obsidian://open?vault=${vault}&file=${file}&line=${line}`;
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
