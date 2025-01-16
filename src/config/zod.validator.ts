import { z } from "zod";
import { Gender, Roles, ValidatedUser, ValidatedPartialUser } from "../domain";
import { logger } from "../app";

// Esquema de validación para usuarios

class UserZodSchema {
  static getSchema() {
    return z.object({
      id: z.string().uuid({ message: "Invalid UUID" }).optional(),
      name: z
        .string({
          required_error: "user_name is required",
          invalid_type_error: "user_name must be a string",
        })
        .min(4, {
          message: "user_name must be at least 4 characters long",
        })
        .trim(),
      surname: z
        .string({ invalid_type_error: "user_name must be a string" })
        .trim()
        .optional(),
      nickname: z
        .string({ invalid_type_error: "user_name must be a string" })
        .trim()
        .optional(),
      rol: z.nativeEnum(Roles, {
        invalid_type_error: `role must be ${Roles.user} or ${Roles.admin}`,
        required_error: "rol is required",
      }),
      gender: z.nativeEnum(Gender, {
        invalid_type_error: `gender must be ${Gender.male} or ${Gender.female}`,
        required_error: "gender is required",
      }),
      email: z
        .string({
          required_error: "email is required",
          invalid_type_error: "email must be a string",
        })
        .email({ message: "email must be a valid email address" })
        .trim(),
      phone: z
        .string({
          required_error: "phone is required",
          invalid_type_error: "phone must be a string",
        })
        .trim()
        .regex(/^\d{9}$/, { message: "phone must have exactly 9 digits" }),
      password: z
        .string({
          required_error: "password is required",
          invalid_type_error: "password must be a string",
        })
        .min(8, { message: "password must be at least 8 characters" })
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          {
            message:
              "password must contain at least one uppercase, one lowercase, one digit, and one special character",
          }
        ),
      is_verified: z
        .boolean({
          invalid_type_error: "is_verified must be a boolean",
        })
        .default(false)
        .optional(),
      is_disabled: z
        .boolean({
          invalid_type_error: "is_disabled must be a boolean",
        })
        .default(false)
        .optional(),
    });
  }
}

// Funciones para validar datos con los esquemas
export function validateUser(data: { [key: string]: unknown }): {
  success: boolean;
  data?: ValidatedUser;
  error: z.ZodError | null;
} {
  const valResult = UserZodSchema.getSchema().safeParse(data);
  if (!valResult.success) {
    logger.error(`Error validating user data: ${valResult.error.message}`);
    return { success: false, error: valResult.error, data: valResult.data };
  }
  logger.info(
    `User data validated successfully: ${JSON.stringify(valResult.data)}`
  );
  return {
    success: true,
    error: null,
    data: valResult.data,
  };
}

export function validatePartialUser(data: { [key: string]: unknown }): {
  success: boolean;
  data?: ValidatedPartialUser;
  error: z.ZodError | null;
} {
  const valResult = UserZodSchema.getSchema().partial().safeParse(data);
  if (!valResult.success) {
    logger.error(`Error validating user data: ${valResult.error.message}`);
    return { success: false, error: valResult.error, data: valResult.data };
  }
  logger.info(
    `Partial user data validated successfully: ${JSON.stringify(
      valResult.data
    )}`
  );
  return { success: true, error: null, data: valResult.data };
}
