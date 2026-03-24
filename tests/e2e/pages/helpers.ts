import { test, expect, Page } from '@playwright/test';

/**
 * Dataverse Web API helper for E2E tests.
 * Uses the access token from auth setup to query/create/update records.
 */
export class DataverseApiHelper {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.accessToken = accessToken;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Prefer: 'return=representation',
    };
  }

  async tableExists(tableName: string): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${tableName}')`,
      { headers: this.headers }
    );
    return response.ok;
  }

  async columnExists(tableName: string, columnName: string): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/api/data/v9.2/EntityDefinitions(LogicalName='${tableName}')/Attributes(LogicalName='${columnName}')`,
      { headers: this.headers }
    );
    return response.ok;
  }

  async getRecordCount(tableName: string, filter?: string): Promise<number> {
    let url = `${this.baseUrl}/api/data/v9.2/${tableName}s?$count=true&$top=0`;
    if (filter) url += `&$filter=${encodeURIComponent(filter)}`;
    const response = await fetch(url, { headers: this.headers });
    if (!response.ok) return -1;
    const data = await response.json();
    return data['@odata.count'] || 0;
  }

  async createRecord(tableName: string, data: Record<string, any>): Promise<string | null> {
    const response = await fetch(`${this.baseUrl}/api/data/v9.2/${tableName}s`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result[`${tableName}id`];
  }

  async deleteRecord(tableName: string, id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/data/v9.2/${tableName}s(${id})`, {
      method: 'DELETE',
      headers: this.headers,
    });
    return response.ok;
  }
}

/**
 * Page object for the Content Activation Code App.
 */
export class ContentActivationApp {
  constructor(private page: Page) {}

  async navigate() {
    const envUrl = process.env.PP_DEV_ENV_URL || '';
    // Code Apps are served under the environment URL
    await this.page.goto(`${envUrl}/apps/contentactivation`);
    await this.page.waitForLoadState('networkidle');
  }

  // Navigation
  async goToDashboard() {
    await this.page.getByRole('button', { name: /dashboard/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToIdeas() {
    await this.page.getByRole('button', { name: /ideas/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToReview() {
    await this.page.getByRole('button', { name: /review/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToSchedule() {
    await this.page.getByRole('button', { name: /schedule/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToPlatforms() {
    await this.page.getByRole('button', { name: /platforms/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async goToHistory() {
    await this.page.getByRole('button', { name: /history/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  // Stats
  async getDashboardStats(): Promise<Record<string, string>> {
    const stats: Record<string, string> = {};
    const statCards = this.page.locator('[data-testid="stat-card"]');
    const count = await statCards.count();
    for (let i = 0; i < count; i++) {
      const label = await statCards.nth(i).locator('[data-testid="stat-label"]').textContent();
      const value = await statCards.nth(i).locator('[data-testid="stat-value"]').textContent();
      if (label && value) stats[label] = value;
    }
    return stats;
  }
}
