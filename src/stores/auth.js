// src/stores/auth.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      token: localStorage.getItem("token") || null,
    };
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
