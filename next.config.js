/** @type {import('next').NextConfig} */
const isPasswordProtectEnabled =
  typeof process.env.PASSWORD_PROTECT !== "undefined"
    ? process.env.PASSWORD_PROTECT
    : "true";

const nextConfig = {
  reactStrictMode: true,
  env: {
    PASSWORD_PROTECT: isPasswordProtectEnabled,
  },
};

module.exports = nextConfig;

