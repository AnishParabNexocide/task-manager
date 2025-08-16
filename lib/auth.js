import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("Missing JWT Secret");

export function signToken(payLoad, options = {}) {
  return jwt.sign(payLoad, JWT_SECRET, { expiresIn: "7d", ...options });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
