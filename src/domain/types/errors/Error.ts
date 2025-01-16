import { ZodError } from "zod";
export type apiError = {
  name: string;
  message: string;
  errorCode: number;
  content?: ZodError;
};
