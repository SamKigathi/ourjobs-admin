import { AuthBindings } from "@refinedev/core";
import axios from 'axios';

export const TOKEN_KEY = "refine-auth";
export const LOGIN_URL = "http://localhost:7000/api/v1/auth/login";

import axiosInstance from './pages/login/header';


export const authProvider: AuthBindings = {
  login: async ({ username, email, password }) => {

    
    if ((username || email) && password) {

      const response = await axios.post(LOGIN_URL, { email, password });

      if (response.status === 200) {
          localStorage.setItem(TOKEN_KEY, `${response.data.user.token}`);

          localStorage.setItem("auth", JSON.stringify(`${response.data.user.token}`));

          axiosInstance.defaults.headers.common = {
            Authorization: `Bearer ${response.data.user.token}`,
          };

          return {
              success: true,
              redirectTo: "/",
          };
      }

      return {
          success: false,
          error: {
              message: "Invalid credentials",
              name: "Invalid credentials",
          },
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        id: 1,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
