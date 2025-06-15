const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (formData: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  profile?: string;
}) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to register");
  }

  return result;
};
