import React from "react";
import ThemedButton from "../../../../components/ThemedButton.tsx";
import ThemedInput from "../../../../components/ThemedInput.tsx";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

interface RegisterFormProps {
  formData: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    profile?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  error,
}) => {
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <ThemedInput
          label="First Name"
          value={formData.first_name}
          onChange={handleChange}
          type="text"
          id="first_name"
        />
        <ThemedInput
          label="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          type="text"
          id="last_name"
        />
      </div>
      <ThemedInput
        label="Username"
        value={formData.username}
        onChange={handleChange}
        type="text"
        id="username"
        autoComplete="username"
        icon={<UserIcon className="text-accent size-4" />}
      />
      <ThemedInput
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        type="email"
        id="email"
        autoComplete="email"
        icon={<EnvelopeIcon className="text-accent size-4" />}
      />
      <ThemedInput
        label="Password"
        value={formData.password}
        onChange={handleChange}
        minLength={6}
        type="password"
        id="password"
        icon={<LockClosedIcon className="text-accent size-4" />}
      />
      <ThemedInput
        label="Confirm Password"
        value={formData.confirm_password}
        onChange={handleChange}
        type="password"
        id="confirm_password"
        icon={<LockClosedIcon className="text-accent size-4" />}
      />
      <ThemedButton
        type="submit"
        value="Sign up"
        className={isLoading ? "cursor-not-allowed bg-gray-200" : " "}
        disabled={isLoading}
      />
    </form>
  );
};
export default RegisterForm;
