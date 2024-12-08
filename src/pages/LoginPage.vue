<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h5 ellipsis">Bienvenido a SYSFUN SYSTEM</div>
              <div class="col text-h8 ellipsis">
                Porfavor ingrese sus credenciales
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="iniciarSesion" class="q-gutter-md">
              <q-input
                filled
                v-model="correo"
                label="Correo Electrónico"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Por favor ingrese su correo electrónico',
                ]"
              />
              <q-input
                type="password"
                filled
                v-model="contrasena"
                label="Contraseña"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Por favor ingrese su contraseña',
                ]"
              />
              <div class="q-mt-md">
                <q-btn
                  label="Iniciar Sesion"
                  type="submit"
                  color="primary"
                  class="full-width"
                />
                <q-btn
                  label="Restablecer Contraseña"
                  type="reset"
                  color="secondary"
                  flat
                  class="q-mt-sm full-width"
                  to="/restablecer-contraseña"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../api";
const router = useRouter();
const authStore = useAuthStore();
const correo = ref(null);
const contrasena = ref(null);

const iniciarSesion = async () => {
  try {
    const response = await api.post("/auth/login", {
      correo: correo.value,
      contrasena: contrasena.value,
    });

    // Almacenar el token en el store de Pinia
    authStore.setToken(response.data.token);
    // Obtener los datos del usuario
    const usuarioResponse = await api.get("/auth/me", {
      headers: {
        Authorization: response.data.token, // Incluir el token en la cabecera Authorization
      },
    });
    authStore.setUsuario(usuarioResponse.data); // Guardar los datos del usuario en el store
    // Redirigir a la página principal
    router.push("/index");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    let mensajeError =
      "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
    if (error.response && error.response.data && error.response.data.mensaje) {
      mensajeError = error.response.data.mensaje;
    }

    alert(mensajeError);
  }
};
</script>

<style>
.bg-image {
  background-image: url("../assets/fondolaptop.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  height: 100%;
}

/* Media Query para dispositivos móviles */
@media (max-width: 600px) {
  .bg-image {
    background-size: cover;
  }
}
</style>
