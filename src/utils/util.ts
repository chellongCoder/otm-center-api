import { randomInt } from "crypto";
import ejs from "ejs";
import path from "path";
import { uid, suid } from "rand-token";
import { logger } from "./logger";
const jwt = require("jsonwebtoken");
const fs = require("fs");
const i = "Notes app"; // Issuer
const s = "demo@hisoft.com.vn"; // Subject
const a = "http://hisoft.com.vn"; // Audience
// SIGNING OPTIONS
const signOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: "1h",
  algorithm: "RS256",
};
// VERIFY OPTIONS
const verifyOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: "1h",
  algorithm: ["RS256"],
};

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== "number" && value === "") {
    return true;
  } else if (typeof value === "undefined" || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === "object" &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const generateRandToken = (): string => {
  return suid(64);
};

export const generateRecoveryCode = (): number => {
  return randomInt(1000, 9999);
};

export const generateAccessToken = (payload: string | object): string => {
  const privateKEY = fs.readFileSync(
    path.join(__dirname, "keys/private.key"),
    "utf8"
  );
  return jwt.sign(payload, privateKEY, signOptions);
};

export const verifyAccessToken = (token: string): object => {
  const publicKEY = fs.readFileSync(
    path.join(__dirname, "keys/public.key"),
    "utf8"
  );
  return jwt.verify(token, publicKEY, verifyOptions);
};

export const templateToString = (templateUrl: string, params: any): string => {
  const template: string = fs.readFileSync(templateUrl);
  return ejs.render(template.toString(), params);
};
