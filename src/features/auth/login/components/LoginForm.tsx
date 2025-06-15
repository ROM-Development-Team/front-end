import React from "react";
import ThemedButton from "../../../../components/ThemedButton.tsx";
import ThemedInput from "../../../../components/ThemedInput.tsx";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";

interface LoginFormProps {
  formData: {
    email_or_username: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  error,
}) => {
  return (
    <form className="flex flex-col gap-4" action="" onSubmit={handleSubmit}>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <ThemedInput
        label="Email or Username"
        id="email_or_username"
        value={formData.email_or_username}
        onChange={handleChange}
        icon={<EnvelopeIcon className="text-accent size-4" />}
      />
      <ThemedInput
        label="Password"
        type="password"
        id="password"
        value={formData.password}
        onChange={handleChange}
        icon={<LockClosedIcon className="text-accent size-4" />}
      />

      <ThemedButton
        type="submit"
        value="Sign in"
        className={isLoading ? "cursor-not-allowed bg-gray-200" : " "}
        disabled={isLoading}
      />
    </form>
  );
};
export default LoginForm;
