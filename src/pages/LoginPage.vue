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
              <div class="col text-h5 ellipsis">Bienvenido a SYSFUN</div>
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

const router = useRouter();
const correo = ref(null);
const contrasena = ref(null);

const iniciarSesion = async () => {
  try {
    const response = await axios.post("http://localhost:4000/auth/login", {
      correo: correo.value,
      contrasena: contrasena.value,
    });

    // Almacenar el token en localStorage
    localStorage.setItem("token", response.data.token);

    // Redirigir a la página principal
    router.push("/");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    if (error.response) {
      alert(error.response.data.mensaje);
    } else {
      alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
    }
  }
};
</script>

<style>
.bg-image {
  background-image: url("../assets/fondolaptop.jpg"); /* Cambia la ruta a tu imagen de tecnología */
  background-size: cover; /* Mantener la imagen cubriendo toda la vista */
  background-position: center; /* Centrar la imagen */
  background-repeat: no-repeat; /* Evitar que la imagen se repita */
  min-height: 100vh; /* Asegúrate de que la altura cubra toda la vista */
  height: 100%; /* Agregar esta línea */
}

/* Media Query para dispositivos móviles */
@media (max-width: 600px) {
  .bg-image {
    background-size: cover; /* Ajustar la imagen para que esté completamente visible */
  }
}
</style>
