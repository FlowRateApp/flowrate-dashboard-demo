import type { NextApiRequest, NextApiResponse } from "next";
import { passwordCheckHandler } from "next-password-protect";

const PASSWORD = process.env.NEXT_PASSWORD_PROTECT_PASSWORD;

const handler = PASSWORD ? passwordCheckHandler(PASSWORD) : null;

export default function passwordCheckRoute(
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


