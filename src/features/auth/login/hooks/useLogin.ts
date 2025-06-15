import React, { useState } from "react";
import { loginUser } from "../services/loginService";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email_or_username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email_or_username.trim()) {
      setError("Email or username is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(formData);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, handleChange, handleSubmit, isLoading, error };
};
