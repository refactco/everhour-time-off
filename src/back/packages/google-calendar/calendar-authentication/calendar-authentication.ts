/* eslint-disable camelcase */
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google, Auth } from 'googleapis';
import * as fs from 'fs/promises';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { ImpersonatedJWTInput, JWTInput } from 'google-auth-library/build/src/auth/credentials';

// If modifying these scopes, delete token.json.
const SCOPES: string[] = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.events.readonly',
  'https://www.googleapis.com/auth/calendar.readonly'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH: string = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH: string = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
 async function loadSavedCredentialsIfExist():Promise<OAuth2Client|null> {
    try {
      const content: Buffer = await fs.readFile(TOKEN_PATH);
      const credentials: Credentials = JSON.parse(content.toString());
      return google.auth.fromJSON(credentials as JWTInput | ImpersonatedJWTInput) as OAuth2Client;
    } catch (err) {
      return null;
    }
  }

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: Auth.OAuth2Client): Promise<void> {
  const content: Buffer = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;
  const payload: string = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize(): Promise<Auth.OAuth2Client> {
  let client: Auth.OAuth2Client | null = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
