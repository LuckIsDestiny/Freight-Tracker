import "dotenv/config";
import { AppError } from "../utils/AppError.js";

const getEnv = (variable: string) => {
  const envValue = process.env[variable];
  if (!envValue) {
    throw new AppError(`Environment values not set: ${variable}`, 500);
  }
  return envValue;
};

const PORT = process.env.PORT || 5000;

const DATABASE_URL = getEnv("DATABASE_URL");

export const env = {
  PORT,
  DATABASE_URL,
};
