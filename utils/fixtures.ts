import { test as base } from "@playwright/test";
import { RequestHandler } from "./request-handler.ts";
import { APILogger } from "./logger.ts";
import { setCustomExpectLogger } from "./custom-expect.ts";
import { config } from "../api-test.config.ts";
import { createToken } from "../helpers/createToken.ts";

export type TestOptions = {
  api: RequestHandler;
  config: typeof config;
};

export type WorkerFixture = {
  authToken: string;
};

export const test = base.extend<TestOptions, WorkerFixture>({
  authToken: [
    async ({}, use) => {
      const authToken = await createToken(config.userEmail, config.userPassword);
      await use(authToken);
    },
    { scope: "worker" },
  ],

  api: async ({ request, authToken }, use) => {
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    const requestHandler = new RequestHandler(request, config.apiUrl, logger, authToken);
    await use(requestHandler);
  },
  config: async ({}, use) => {
    await use(config);
  },
});
