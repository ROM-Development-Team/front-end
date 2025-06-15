import React, { useState } from "react";
import { registerUser } from "../services/registerService";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    profile: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name.trim()) {
      setError("First name is required");
      return;
    }
    if (!formData.last_name.trim()) {
      setError("Last name is required");
      return;
    }
    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    } else if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    } else if (
      !/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).+/.test(
        formData.password
      )
    ) {
      setError(
        "Password must include an uppercase letter, a number, and a special character"
      );
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await registerUser(formData);
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, isLoading, error };
};
