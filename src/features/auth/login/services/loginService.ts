const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (formData: {
  email_or_username: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to login");
  }

  return result;
};
