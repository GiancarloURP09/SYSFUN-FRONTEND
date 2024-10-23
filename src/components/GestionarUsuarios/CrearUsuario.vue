<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Crear Usuario</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit.prevent="crearUsuario" class="q-gutter-md">
        <q-input
          filled
          v-model="nombre"
          label="Nombres"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Por favor ingrese los nombres',
          ]"
        />
        <q-input
          filled
          v-model="apellido"
          label="Apellidos"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Por favor ingrese los apellidos',
          ]"
        />
        <q-input
          filled
          v-model="correo"
          label="Correo Electrónico"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Por favor ingrese el correo electrónico',
          ]"
        />
        <q-input
          filled
          v-model="nombreUsuario"
          label="Nombre de Usuario"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Por favor ingrese el nombre de usuario',
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
              (val && val.length > 0) || 'Por favor ingrese la contraseña',
          ]"
        />
        <q-select
          filled
          v-model="rol"
          :options="roles"
          label="Rol"
          option-value="_id"
          option-label="nombre"
          emit-value
          map-options
          :rules="[(val) => val || 'Por favor seleccione un rol']"
        />
        <q-select
          filled
          v-model="tipoDocumento"
          :options="[
            { label: 'DNI', value: 'DNI' },
            { label: 'Pasaporte', value: 'Pasaporte' },
            { label: 'Carnet de Extranjería', value: 'Carnet de Extranjería' },
            { label: 'Otro', value: 'Otro' },
          ]"
          label="Tipo de Documento"
          :rules="[(val) => val || 'Por favor seleccione un tipo de documento']"
        />
        <q-input
          filled
          v-model="numeroDocumento"
          label="Número de Documento"
          lazy-rules
          :rules="[
            (val) =>
              (val && val.length > 0) ||
              'Por favor ingrese el número de documento',
          ]"
        />
        <q-input
          filled
          v-model="fechaNacimiento"
          label="Fecha de Nacimiento"
          type="date"
        />
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="primary" v-close-popup />
      <q-btn
        flat
        label="Guardar"
        color="primary"
        type="submit"
        @click="crearUsuario"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const emit = defineEmits(["close", "usuario-creado"]);

const nombre = ref("");
const apellido = ref("");
const correo = ref("");
const nombreUsuario = ref("");
const contrasena = ref("");
const rol = ref(null);
const tipoDocumento = ref(null);
const numeroDocumento = ref(null);
const fechaNacimiento = ref(null);
const roles = ref([]);

const obtenerRoles = async () => {
  try {
    const response = await axios.get("http://localhost:4000/roles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    roles.value = response.data;
  } catch (error) {
    console.error("Error al obtener los roles:", error);
  }
};

onMounted(obtenerRoles);

const crearUsuario = async () => {
  try {
    const response = await axios.post(
      "http://localhost:4000/auth/registro",
      {
        nombres: nombre.value,
        apellidos: apellido.value,
        correo: correo.value,
        nombre_usuario: nombreUsuario.value,
        contrasena: contrasena.value,
        rol: rol.value,
        tipoDocumento: tipoDocumento.value,
        numeroDocumento: numeroDocumento.value,
        fecha_de_nacimiento: fechaNacimiento.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    console.log("Usuario creado:", response.data);
    emit("usuario-creado");
    emit("close");
    // Limpiar los campos del formulario después de crear el usuario
    nombre.value = "";
    apellido.value = "";
    correo.value = "";
    nombreUsuario.value = "";
    contrasena.value = "";
    rol.value = null;
    tipoDocumento.value = null;
    numeroDocumento.value = "";
    fechaNacimiento.value = null;
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    // Manejar el error, mostrar un mensaje al usuario
  }
};
</script>
