import { URL } from "url";
import fetch from "node-fetch";
import waitOn from "wait-on";
import Logger from "@reactioncommerce/logger";
import { Meteor } from "meteor/meteor";
import config from "../config.js";

const {
  OAUTH2_ADMIN_URL,
  OAUTH2_CLIENT_ID,
  ROOT_URL
} = config;

const makeAbsolute = (relativeUrl, baseUrl = ROOT_URL) => {
  const url = new URL(relativeUrl, baseUrl);
  return url.href;
};

/* eslint-disable camelcase */
const hydraClient = {
  client_id: OAUTH2_CLIENT_ID,
  token_endpoint_auth_method: "none",
  redirect_uris: [
    makeAbsolute("/authentication/callback"),
    makeAbsolute("/authentication/silent_callback")
  ],
  grant_types: ["authorization_code"],
  response_types: ["code"],
  post_logout_redirect_uris: [ROOT_URL]
};
/* eslint-enable camelcase */

/**
 * @summary Calls Hydra's endpoint to create an OAuth client for this application
 *   if one does not already exist. This works because the Hydra admin port
 *   is exposed on the internal network. Ensure that it is not exposed to the
 *   public Internet in production.
 * @returns {Promise<undefined>} Nothing
 */
export async function ensureHydraClient() {
  try {
    Logger.info("Waiting for Hydra service to be available...");
    const parsedUrl = new URL(OAUTH2_ADMIN_URL);
    await waitOn({
      resources: [`tcp:${parsedUrl.host}`],
      timeout: 120000 // 2 minutes
    });
    Logger.info("Hydra service is available.");
  } catch (error) {
    throw new Error(`Could not connect to Hydra service at ${OAUTH2_ADMIN_URL}`);
  }

  const getClientResponse = await fetch(makeAbsolute(`/clients/${OAUTH2_CLIENT_ID}`, OAUTH2_ADMIN_URL), {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (![200, 404].includes(getClientResponse.status)) {
    Logger.error(await getClientResponse.text());
    throw new Error(`Could not get Hydra client [${getClientResponse.status}]`);
  }

  if (getClientResponse.status === 200) {
    // Update the client to be sure it has the latest config
    Logger.info("Updating Hydra client...");

    const updateClientResponse = await fetch(makeAbsolute(`clients/${OAUTH2_CLIENT_ID}`, OAUTH2_ADMIN_URL), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hydraClient)
    });

    if (updateClientResponse.status === 200) {
      Logger.info("OK: Hydra client updated");
    } else {
      Logger.error(await updateClientResponse.text());
      throw new Error(`Could not update Hydra client [${updateClientResponse.status}]`);
    }
  } else {
    Logger.info("Creating Hydra client...");

    const response = await fetch(makeAbsolute("/clients", OAUTH2_ADMIN_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hydraClient)
    });

    switch (response.status) {
      case 200:
      // intentional fallthrough!
      // eslint-disable-line no-fallthrough
      case 201:
        Logger.info("OK: Hydra client created");
        break;
      case 409:
        Logger.info("OK: Hydra client already exists");
        break;
      default:
        Logger.error(await response.text());
        throw new Error(`Could not create Hydra client [${response.status}]`);
    }
  }
}

/**
 * @summary Given an Authorization bearer token it returns a JSON object with user
 *   properties and claims found
 * @param {String} token Auth token
 * @returns {Object} JSON object
 */
export async function expandAuthToken(token) {
  const response = await fetch(makeAbsolute("/oauth2/introspect", OAUTH2_ADMIN_URL), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
    body: `token=${encodeURIComponent(token)}`
  });

  if (!response.ok) {
    throw new Meteor.Error("access-denied", "Error introspecting token");
  }

  return response.json();
}
