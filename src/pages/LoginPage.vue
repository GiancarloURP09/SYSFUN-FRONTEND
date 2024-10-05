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
            <q-form class="q-gutter-md">
              <q-input filled v-model="username" label="Username" lazy-rules />
              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />
              <q-checkbox v-model="rememberMe" label="Recuerdame" />
              <div class="q-mt-md">
                <q-btn
                  label="Iniciar Sesion"
                  type="submit"
                  color="primary"
                  class="full-width"
                  to="/"
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

<script>
import { defineComponent } from "vue";
import { ref } from "vue";

export default defineComponent({
  setup() {
    return {
      username: ref("Pratik"),
      password: ref("12345"),
      rememberMe: ref(false),
    };
  },
});
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
