import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

/**
 * Authenticate to Power Platform using service principal credentials.
 * This stores the auth state so subsequent tests don't need to re-authenticate.
 *
 * Required environment variables:
 *   PP_DEV_ENV_URL  — e.g., https://org-dev.crm.dynamics.com
 *   PP_CLIENT_ID    — Azure AD app registration client ID
 *   PP_CLIENT_SECRET — Client secret (for local dev) or managed via OIDC in CI
 *   PP_TENANT_ID    — Azure AD tenant ID
 */
setup('authenticate to Power Platform', async ({ page }) => {
  const envUrl = process.env.PP_DEV_ENV_URL;
  const clientId = process.env.PP_CLIENT_ID;
  const tenantId = process.env.PP_TENANT_ID;

  if (!envUrl) {
    throw new Error('PP_DEV_ENV_URL environment variable is required');
  }

  // Navigate to the environment
  await page.goto(envUrl);

  // Handle Microsoft login flow
  // In CI with service principal, we use OAuth token injection
  // In interactive mode, this will show the login page
  if (clientId && tenantId) {
    // Service principal auth: acquire token via MSAL and inject
    const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const tokenResponse = await page.request.post(tokenEndpoint, {
      form: {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: process.env.PP_CLIENT_SECRET || '',
        scope: `${envUrl}/.default`,
      },
    });

    if (tokenResponse.ok()) {
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Store the token for API-based tests
      await page.context().addCookies([]);

      // Navigate with auth header for Dataverse Web API tests
      await page.goto(`${envUrl}/api/data/v9.2/$metadata`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Store auth state
      process.env.PP_ACCESS_TOKEN = accessToken;
    }
  } else {
    // Interactive login fallback (for local development)
    // Wait for the Microsoft login page
    await page.waitForURL(/login\.microsoftonline\.com/, { timeout: 10000 }).catch(() => {
      console.log('Already authenticated or not on login page');
    });

    // If on login page, wait for manual intervention
    if (page.url().includes('login.microsoftonline.com')) {
      console.log('⚠️ Manual login required. Complete the login in the browser window.');
      await page.waitForURL(new RegExp(envUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), {
        timeout: 120000,
      });
    }
  }

  // Save auth state
  await page.context().storageState({ path: authFile });
});
