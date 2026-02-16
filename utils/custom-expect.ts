import { expect as baseExpect } from "@playwright/test";
import type { APILogger } from "./logger";
import { validateSchema } from "./schema-validator";

let apiLogger: APILogger;

export const setCustomExpectLogger = (logger: APILogger) => {
  apiLogger = logger;
};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      shouldEqual(expected: T): R;
      shouldBeLessThanOrEqual(expected: T): R;
      shouldMatchSchema(dirName: string, fileName: string, createSchemaFlag?: boolean): Promise<R>;
    }
  }
}

export const expect = baseExpect.extend({
  async shouldMatchSchema(
    recieved: any,
    dirName: string,
    fileName: string,
    createSchemaFlag: boolean = false,
  ) {
    let pass: boolean;
    let message: string = "";

    try {
      await validateSchema(dirName, fileName, recieved, createSchemaFlag);
      pass = true;
      message = "Schema validation passed";
    } catch (e: any) {
      pass = false;
      const logs = apiLogger.getRecentLogs();
      message = `${e.message}\n\nAPI Logs:  \n${logs}`;
    }
    return {
      message: () => message,
      pass,
    };
  },
  shouldEqual(recieved: any, expected: any) {
    let pass: boolean;
    let logs: string = "";

    try {
      const expectation = this.isNot ? baseExpect(recieved).not : baseExpect(recieved);
      expectation.toEqual(expected);
      pass = true;
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getRecentLogs();
    }

    if (this.isNot) {
      pass = !pass;
    }

    const hint = this.isNot ? "Not" : "";
    const message =
      this.utils.matcherHint("shouldEqual", undefined, undefined, { isNot: this.isNot }) +
      "\n\n" +
      `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(recieved)}\n\n` +
      `API Logs:  \n${logs}`;

    return {
      message: () => message,
      pass,
    };
  },
  shouldBeLessThanOrEqual(recieved: any, expected: any) {
    let pass: boolean;
    let logs: string = "";

    try {
      const expectation = this.isNot ? baseExpect(recieved).not : baseExpect(recieved);
      expectation.toBeLessThanOrEqual(expected);
      pass = true;
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getRecentLogs();
    }

    if (this.isNot) {
      pass = !pass;
    }

    const hint = this.isNot ? "Not" : "";
    const message =
      this.utils.matcherHint("shouldEqual", undefined, undefined, { isNot: this.isNot }) +
      "\n\n" +
      `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
      `Received: ${this.utils.printReceived(recieved)}\n\n` +
      `API Logs:  \n${logs}`;

    return {
      message: () => message,
      pass,
    };
  },
});
