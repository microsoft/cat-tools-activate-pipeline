import { test, expect } from '@playwright/test';
import { DataverseApiHelper } from './pages/helpers';

/**
 * Dataverse Schema Validation — Playwright E2E
 *
 * These tests verify that the Content Activation Pipeline schema
 * has been correctly deployed to the target environment.
 * Runs headless in CI after solution import.
 */

const TABLES = [
  'cap_contentidea',
  'cap_contentpiece',
  'cap_mediaasset',
  'cap_platformconfig',
  'cap_publishlog',
];

const TABLE_COLUMNS: Record<string, string[]> = {
  cap_contentidea: [
    'cap_name',
    'cap_sourcemessage',
    'cap_sourcetype',
    'cap_transcript',
    'cap_status',
    'cap_contentgroupid',
    'cap_targetplatforms',
    'cap_generateimages',
    'cap_submittedon',
    'cap_teamsmessageid',
    'cap_voicerecordingurl',
  ],
  cap_contentpiece: [
    'cap_name',
    'cap_contentideaid',
    'cap_platform',
    'cap_generatedcontent',
    'cap_generatedcontentjson',
    'cap_status',
    'cap_scheduleddate',
    'cap_publisheddate',
    'cap_approvalstatus',
    'cap_approvercomments',
    'cap_errordetails',
    'cap_posturl',
    'cap_hashtags',
    'cap_charactercount',
    'cap_editedcontent',
  ],
  cap_mediaasset: [
    'cap_name',
    'cap_contentideaid',
    'cap_contentpieceid',
    'cap_mediatype',
    'cap_fileurl',
    'cap_alttext',
    'cap_generationprompt',
    'cap_platform',
    'cap_width',
    'cap_height',
  ],
  cap_platformconfig: [
    'cap_name',
    'cap_platformkey',
    'cap_enabled',
    'cap_connectorname',
    'cap_prompttemplate',
    'cap_maxcontentlength',
    'cap_imagewidth',
    'cap_imageheight',
    'cap_maxhashtags',
    'cap_hashtagstrategy',
    'cap_includeimage',
    'cap_settingsjson',
    'cap_sortorder',
  ],
  cap_publishlog: [
    'cap_name',
    'cap_contentpieceid',
    'cap_platform',
    'cap_action',
    'cap_success',
    'cap_httpstatuscode',
    'cap_responsedetails',
    'cap_attempteddate',
    'cap_attemptnumber',
    'cap_posturl',
    'cap_flowrunid',
  ],
};

test.describe('Dataverse Schema Validation', () => {
  let api: DataverseApiHelper;

  test.beforeAll(() => {
    const envUrl = process.env.PP_DEV_ENV_URL;
    const token = process.env.PP_ACCESS_TOKEN;
    if (!envUrl || !token) {
      throw new Error('PP_DEV_ENV_URL and PP_ACCESS_TOKEN are required');
    }
    api = new DataverseApiHelper(envUrl, token);
  });

  for (const table of TABLES) {
    test(`table "${table}" exists in Dataverse`, async () => {
      const exists = await api.tableExists(table);
      expect(exists, `Table ${table} should exist in Dataverse`).toBe(true);
    });
  }

  for (const [table, columns] of Object.entries(TABLE_COLUMNS)) {
    for (const column of columns) {
      test(`column "${table}.${column}" exists`, async () => {
        const exists = await api.columnExists(table, column);
        expect(exists, `Column ${column} should exist on table ${table}`).toBe(true);
      });
    }
  }
});

test.describe('Dataverse CRUD Operations', () => {
  let api: DataverseApiHelper;
  let testIdeaId: string | null = null;

  test.beforeAll(() => {
    const envUrl = process.env.PP_DEV_ENV_URL;
    const token = process.env.PP_ACCESS_TOKEN;
    if (!envUrl || !token) {
      throw new Error('PP_DEV_ENV_URL and PP_ACCESS_TOKEN are required');
    }
    api = new DataverseApiHelper(envUrl, token);
  });

  test.afterAll(async () => {
    // Cleanup test data
    if (testIdeaId) {
      await api.deleteRecord('cap_contentidea', testIdeaId);
    }
  });

  test('can create a ContentIdea record', async () => {
    testIdeaId = await api.createRecord('cap_contentidea', {
      cap_name: 'E2E Test Idea — Playwright',
      cap_sourcemessage: 'This is an automated test idea created by Playwright E2E tests',
      cap_sourcetype: 100000001, // Text
      cap_status: 100000000, // Draft
      cap_targetplatforms: 'LinkedIn,Teams',
      cap_generateimages: false,
    });
    expect(testIdeaId, 'Should create a ContentIdea record').toBeTruthy();
  });

  test('can query ContentIdea records', async () => {
    const count = await api.getRecordCount('cap_contentidea');
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
