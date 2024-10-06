import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => {
    // Intentar obtener el usuario de localStorage
    let usuario = null;
    const usuarioStored = localStorage.getItem("usuario");
    if (usuarioStored) {
      try {
        usuario = JSON.parse(usuarioStored);
      } catch (error) {
        console.error("Error al analizar el usuario de localStorage:", error);
      }
    }

    return {
      token: localStorage.getItem("token") || null,
      usuario: usuario,
    };
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    clearToken() {
      this.token = null;
      this.usuario = null;
      localStorage.removeItem("token");
      localStorage.removeItem("usuario"); // Eliminar el usuario de localStorage
    },
    setUsuario(usuario) {
      this.usuario = usuario;
      localStorage.setItem("usuario", JSON.stringify(usuario)); // Guardar el usuario en localStorage
    },
  },
});
