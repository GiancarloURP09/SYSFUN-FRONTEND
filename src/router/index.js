import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "../stores/auth";

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Navigation guard para verificar la autenticación
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (authStore.token) {
      // Si hay un token, redirigir a /index si se intenta acceder a /login o /restablecer-contraseña
      if (to.path === "/login" || to.path === "/restablecer-contraseña") {
        next("/");
      } else {
        // Si hay un token y la ruta no es /login ni /restablecer-contraseña, permitir el acceso
        next();
      }
    } else if (to.path === "/login" || to.path === "/restablecer-contraseña") {
      // Si no hay token, pero la ruta es /login o /restablecer-contraseña, permitir el acceso
      next();
    } else {
      // Si no hay token y la ruta no es /login ni /restablecer-contraseña, redirigir a /login
      next("/login");
    }
  });

  return Router;
});
