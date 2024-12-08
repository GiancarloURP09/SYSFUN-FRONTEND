const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/index",
        component: () => import("pages/Dashboard/HomePage.vue"),
      },
      {
        path: "/perfil",
        component: () => import("pages/Dashboard/PerfilUsuario.vue"),
      },
      {
        path: "/gestionar-usuarios",
        component: () =>
          import("pages/Dashboard/Administrador/GestionarUsuarios.vue"),
      },
      {
        path: "/gestionar-areas",
        component: () =>
          import("pages/Dashboard/Administrador/GestionarAreas.vue"),
      },
      {
        path: "/gestionar-roles",
        component: () =>
          import("pages/Dashboard/Administrador/GestionarRoles.vue"),
      },
      {
        path: "/gestionar-clientes",
        component: () => import("pages/Dashboard/Ventas/GestionarClientes.vue"),
      },
      {
        path: "/gestionar-propuestas",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarPropuestas.vue"),
      },
      {
        path: "/gestionar-contratos",
        component: () =>
          import("pages/Dashboard/Ventas/GestionarContratos.vue"),
      },
      {
        path: "/gestionar-proyectos",
        component: () =>
          import("pages/Dashboard/Desarrollo/GestionarProyectos.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/restablecer-contraseña",
    component: () => import("pages/RestablecerContraseña.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
