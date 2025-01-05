import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists(),
];

export const registerValidation = [
  body("name").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("phone").trim().notEmpty(),
];
