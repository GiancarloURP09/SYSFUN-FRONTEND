<template>
  <q-layout view="lHh LpR lFf">
    <div>
      <q-header class="bg-white text-primary shadow-2">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
            class="q-mr-sm"
          />
          <q-toolbar-title class="text-h6">SYSFUN SYSTEM</q-toolbar-title>

          <q-btn
            round
            flat
            icon="notifications"
            aria-label="Notifications"
            class="q-mr-sm"
          />
          <q-btn
            round
            flat
            icon="settings"
            aria-label="Settings"
            class="q-mr-sm"
          />
          <q-btn round flat>
            <q-avatar size="30px">
              <img v-if="imagenUsuario" :src="imagenUsuario" />
              <img v-else src="/public/profile.svg" />
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">Settings</div>
                    <q-toggle v-model="mobileData" label="Use Mobile Data" />
                    <q-toggle v-model="bluetooth" label="Bluetooth" />
                  </div>

                  <q-separator vertical inset class="q-mx-lg" />

                  <div class="column items-center">
                    <q-avatar size="72px" class="q-mb-sm">
                      <img v-if="imagenUsuario" :src="imagenUsuario" />
                      <img v-else src="/public/profile.svg" />
                    </q-avatar>

                    <div
                      v-if="authStore.usuario"
                      class="text-subtitle1 q-mt-md q-mb-xs"
                    >
                      {{ authStore.usuario.nombres }}
                      {{ authStore.usuario.apellidos }}
                    </div>
                    <q-btn
                      round
                      flat
                      icon="logout"
                      aria-label="Cerrar Sesión"
                      @click="cerrarSesion"
                    />
                  </div>
                </div>
              </q-menu>
            </q-avatar>
          </q-btn>
        </q-toolbar>
      </q-header>
    </div>
    <div>
      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
          "
        >
          <q-list padding>
            <q-item clickable v-ripple to="/index">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section> Dashboard </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/perfil">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section> Perfil </q-item-section>
            </q-item>

            <!-- Módulo de Ventas -->
            <q-expansion-item
              label="Módulo de Ventas"
              icon="monetization_on"
              expand-separator
            >
              <q-list>
                <q-item clickable v-ripple to="/gestionar-clientes">
                  <q-item-section avatar>
                    <q-icon name="people" />
                  </q-item-section>
                  <q-item-section> Clientes </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-propuestas">
                  <q-item-section avatar>
                    <q-icon name="attach_money" />
                  </q-item-section>
                  <q-item-section> Propuestas </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-contratos">
                  <q-item-section avatar>
                    <q-icon name="attach_money" />
                  </q-item-section>
                  <q-item-section> Contratos </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <!-- Módulo de Administracion de Usuarios -->
            <q-expansion-item
              label="Administracion de Usuarios"
              icon="account_circle"
              expand-separator
            >
              <q-list>
                <q-item clickable v-ripple to="/gestionar-usuarios">
                  <q-item-section avatar>
                    <q-icon name="people" />
                  </q-item-section>
                  <q-item-section> Gestionar Usuarios </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-areas">
                  <q-item-section avatar>
                    <q-icon name="business" />
                  </q-item-section>
                  <q-item-section> Gestión de Áreas </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-roles">
                  <q-item-section avatar>
                    <q-icon name="user-role" />
                  </q-item-section>
                  <q-item-section> Gestion de roles </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <!-- Módulo de Desarrollo -->
            <q-expansion-item
              label="Módulo de Desarrollo"
              icon="code"
              expand-separator
            >
              <q-list>
                <q-item clickable v-ripple to="/desarrollo/tareas">
                  <q-item-section avatar>
                    <q-icon name="task" />
                  </q-item-section>
                  <q-item-section> Tareas </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/gestionar-proyectos">
                  <q-item-section avatar>
                    <q-icon name="folder" />
                  </q-item-section>
                  <q-item-section> Proyectos </q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/desarrollo/equipos">
                  <q-item-section avatar>
                    <q-icon name="group" />
                  </q-item-section>
                  <q-item-section> Equipos </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://img.freepik.com/fotos-premium/imagen-fondo-empresarial-cuadros-graficos-financieros_1021632-971.jpg?w=1380"
          style="height: 150px"
        >
          <div
            class="absolute-bottom bg-transparent"
            style="color: darkblue; font-size: medium"
          >
            <q-avatar size="56px" class="q-mb-sm">
              <img v-if="imagenUsuario" :src="imagenUsuario" />
              <img v-else src="/public/profile.svg" />
            </q-avatar>
            <div v-if="authStore.usuario" class="text-weight-bold">
              {{ authStore.usuario.nombres }} {{ authStore.usuario.apellidos }}
            </div>
            <div v-if="authStore.usuario">{{ authStore.usuario.correo }}</div>
          </div>
        </q-img>

        <!-- Botón de Cerrar Sesión en la parte inferior -->
        <div class="q-pa-md absolute-bottom-center" style="margin: auto">
          <q-btn
            round
            flat
            icon="logout"
            aria-label="Cerrar Sesión"
            @click="cerrarSesion"
          />
        </div>
      </q-drawer>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router"; // Importar useRouter
import axios from "axios";
import api from "../api";
defineOptions({
  name: "MainLayout",
});
const authStore = useAuthStore();
const router = useRouter(); // Obtener la instancia del router
const leftDrawerOpen = ref(false);
const mobileData = ref(true);
const bluetooth = ref(false);
const imagenUsuario = ref(null); // Variable para almacenar la URL de la imagen

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
//Metodo para cerrar Sesion
const cerrarSesion = () => {
  authStore.clearToken();
  router.push("/login"); // Redirigir al login después de cerrar sesión
};
onMounted(async () => {
  if (authStore.usuario) {
    try {
      const response = await api.get(`/auth/imagen/${authStore.usuario._id}`, {
        headers: {
          Authorization: authStore.token,
        },
        responseType: "blob", // Especificar que la respuesta es un blob
      });
      const imageUrl = URL.createObjectURL(response.data); // Crear una URL para el blob
      imagenUsuario.value = imageUrl;
    } catch (error) {
      console.error("Error al obtener la imagen del usuario:", error);
    }
  }
});
</script>

<style scoped>
.absolute-bottom-center {
  position: absolute;
  bottom: 0;
  left: 50%; /* Centrar horizontalmente */
  transform: translateX(-50%);
  width: 100%;
  padding: 16px;
}

/* Estilos para el toolbar */
.q-header {
  margin: 5px 20px 5px 0px; /* Centramos horizontalmente */
  border-radius: 10px; /* Esquinas redondeadas */
  position: fixed;
  margin-left: 20px;
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Fondo blanco con transparencia */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Sombra suave para dar profundidad */
  z-index: 10; /* Aseguramos que esté por encima de otros elementos */
  padding: 10px 16px 10px 16px; /* Espaciado interno */

  max-width: 100%; /* Ancho completo para dispositivos */

  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}
.q-header .q-btn {
  margin-right: 8px; /* Reducimos el espacio entre los botones */
}

.q-header .q-avatar {
  width: 32px;
  height: 32px; /* Tamaño más pequeño para el avatar */
}

/* Espaciado en el toolbar */
.q-toolbar {
  justify-content: space-between; /* Distribuye el contenido en la barra de herramientas */
}
</style>
