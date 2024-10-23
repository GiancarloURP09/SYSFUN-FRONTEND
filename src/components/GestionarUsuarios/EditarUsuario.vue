<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Editar Usuario</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="actualizarUsuario" class="q-gutter-md"> </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="primary" v-close-popup />
      <q-btn flat label="Guardar" color="primary" type="submit" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const emit = defineEmits(["close", "usuario-actualizado"]); // Definir los eventos emitidos
const props = defineProps(["usuarioId"]); // Definir las props

const nombre = ref("");
// ... (otros campos del formulario)
const roles = ref([]);

const obtenerRoles = async () => {
  // ... (igual que en CrearUsuario)
};

const obtenerUsuario = async () => {
  try {
    const response = await axios.get(
      `http://localhost:4000/auth/usuario/${props.usuarioId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const usuario = response.data;
    nombre.value = usuario.nombres;
    // ... (asignar los demás campos del formulario)
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
  }
};

onMounted(() => {
  obtenerRoles();
  obtenerUsuario();
});

const actualizarUsuario = async () => {
  try {
    await axios.put(
      `http://localhost:4000/auth/usuario/${props.usuarioId}`,
      {
        nombres: nombre.value,
        // ... (otros campos del formulario)
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    emit("usuario-actualizado"); // Emitir el evento usuarioActualizado
    emit("close"); // Cerrar el diálogo
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
  }
};
</script>
