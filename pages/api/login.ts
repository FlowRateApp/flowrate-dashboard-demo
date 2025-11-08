import type { NextApiRequest, NextApiResponse } from "next";
import { loginHandler } from "next-password-protect";

const PASSWORD = process.env.NEXT_PASSWORD_PROTECT_PASSWORD;

const handler = PASSWORD ? loginHandler(PASSWORD) : null;

export default function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!PASSWORD || !handler) {
    res
      .status(500)
      .json({ message: "Password protection is not configured correctly." });
    return;
  }

  return handler(req, res);
}


