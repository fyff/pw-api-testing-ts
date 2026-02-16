import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const processEnv = process.env.TEST_ENV;
const env = processEnv || "dev";
console.log("Test environment is: " + env);

const config = {
  apiUrl: "https://conduit-api.bondaracademy.com/api",
  userEmail: process.env.USERNAME as string,
  userPassword: process.env.PASSWORD as string,
};

if (env === "qa") {
  if (!process.env.USERNAME || !process.env.PASSWORD) {
    throw Error(`Missing required environment variables`);
  }
  config.apiUrl = "https://qa.conduit-api.bondaracademy.com/api";
  config.userEmail = process.env.USERNAME;
  config.userPassword = process.env.PASSWORD;
}

export { config };
