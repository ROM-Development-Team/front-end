import { BASE_URL, API_URL } from "./env";

export const endpoints = {
  // Auth
  google: `${API_URL}/api/v1/auth/google`,
  login: `${API_URL}/api/v1/auth/login`,
  register: `${API_URL}/api/v1/auth/register`,
  forgotPassword: `${API_URL}/api/v1/auth/forgot-password`,
  resetPassword: `${API_URL}/api/v1/auth/reset-password`,

  // User
  account: `${API_URL}/api/v1/account`,
};