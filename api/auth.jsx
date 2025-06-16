import { endpoints } from './config';

export const google = async (userData) => {
  const url = `${endpoints.google}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      return {
        status: "error",
        message: data.message || "Google login failed",
      };
    }

    localStorage.setItem("user", JSON.stringify(data));
    return {
      status: "success",
      message: data.message,
      user_id: data.user_id,
      token: data.token,
    };
  } catch (error) {
    console.error("Google login error:", error);
    return {
      status: "error",
      message: "An error occurred during Google login.",
    };
  }
};

export const login = async (userData) => {
  const url = `${endpoints.login}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        status: 'error', 
        message: data.message || 'Login failed'
      };
    }

    if (data.status === 'success') {
      localStorage.setItem('user', JSON.stringify(data));
      return { 
        status: 'success', 
        message: data.message, 
        user_id: data.user_id,
        token: data.token 
      };
    } else {
      return { 
        status: 'error', 
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { 
      status: 'error', 
      message: 'An error occurred during login. Please try again.'
    };
  }
};

export const register = async (userData) => {
  const url = `${endpoints.register}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        status: 'error', 
        message: data.message || 'Registration failed' 
      };
    }

    if (data.status === 'sucess') {
      return { 
        status: 'success', 
        message: data.message
      };
    } else {
      return { 
        status: 'error', 
        message: data.message
      };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { 
      status: 'error', 
      message: 'An error occurred during registration. Please try again.' 
    };
  }
};

export const forgotPassword = async (userData) => {
  const url = `${endpoints.forgotPassword}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { 
        status: 'success', 
        message: data.message 
      };
    } else {
      return { 
        status: 'error', 
        message: data.message 
      };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { status: 'error', message: 'An error occurred during registration. Please try again.' };
  }
};

export const resetPassword = async (userData) => {
  const url = `${endpoints.resetPassword}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.status === 'success') {
      return { 
        status: 'success', 
        message: data.message 
      };
    } else {
      return { 
        status: 'error', 
        message: data.message 
      };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { status: 'error', message: 'An error occurred during registration. Please try again.' };
  }
};