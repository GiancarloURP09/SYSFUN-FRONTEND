<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '90%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg" />
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Restablecer Contraseña</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit.prevent="handleReset">
              <q-input
                filled
                v-model="newPassword"
                label="Nueva Contraseña"
                type="password"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length >= 6) ||
                    'La contraseña debe tener al menos 6 caracteres',
                ]"
              />
              <q-input
                filled
                v-model="confirmPassword"
                label="Confirmar Nueva Contraseña"
                type="password"
                lazy-rules
                :rules="[
                  (val) =>
                    val === newPassword || 'Las contraseñas no coinciden',
                ]"
              />
              <div class="q-mt-md">
                <q-btn
                  label="Restablecer"
                  type="submit"
                  color="primary"
                  class="full-width"
                />
                <q-btn
                  label="Ir a inicio de sesión"
                  color="secondary"
                  flat
                  class="q-mt-sm full-width"
                  to="/login"
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
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const newPassword = ref("");
    const confirmPassword = ref("");

    const handleReset = () => {
      // Aquí puedes agregar la lógica para restablecer la contraseña.
      console.log("Nueva contraseña:", newPassword.value);
      console.log("Confirmar contraseña:", confirmPassword.value);
      // Realiza la lógica de restablecimiento aquí
    };

    return {
      newPassword,
      confirmPassword,
      handleReset,
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
  height: 100%; /* Asegurarse de que el contenedor ocupe toda la altura */
}

/* Media Query para dispositivos móviles */
@media (max-width: 600px) {
  .bg-image {
    background-size: cover; /* Mantener la imagen cubriendo toda la vista en móviles */
  }
}
</style>
