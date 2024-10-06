import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    usuario: null, // Nueva variable para almacenar los datos del usuario
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    clearToken() {
      this.token = null;
      this.usuario = null; // Limpiar los datos del usuario al cerrar sesión
      localStorage.removeItem("token");
    },
    setUsuario(usuario) {
      // Nueva acción para guardar los datos del usuario
      this.usuario = usuario;
    },
  },
});
