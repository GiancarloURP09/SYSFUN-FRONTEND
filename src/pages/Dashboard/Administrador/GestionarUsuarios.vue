<template>
  <q-page padding>
    <div class="q-gutter-y-md">
      <q-btn label="Crear Usuario" color="primary" @click="prompt = true" />
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 750px">
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
                  (val) =>
                    (val && val.length > 0) || 'Por favor ingrese los nombres',
                ]"
              />
              <q-input
                filled
                v-model="apellido"
                label="Apellidos"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    'Por favor ingrese los apellidos',
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
                    (val && val.length > 0) ||
                    'Por favor ingrese la contraseña',
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
                  {
                    label: 'Carnet de Extranjería',
                    value: 'Carnet de Extranjería',
                  },
                  { label: 'Otro', value: 'Otro' },
                ]"
                label="Tipo de Documento"
                emit-value
                :rules="[
                  (val) => val || 'Por favor seleccione un tipo de documento',
                ]"
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

              <q-file
                v-model="imagenColaborador"
                label="Imagen de Colaborador"
                accept=".jpg, .jpeg, .png"
              />
            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancelar"
              color="primary"
              v-close-popup
              @click="prompt = false"
            />
            <q-btn
              flat
              label="Guardar"
              color="primary"
              type="submit"
              @click="crearUsuario"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-table
        title="Usuarios"
        :rows="usuarios"
        :columns="columnas"
        row-key="name"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              icon="edit"
              color="primary"
              flat
              round
              dense
              @click="editarUsuario(props.row._id)"
            />
            <q-btn
              icon="delete"
              color="negative"
              flat
              round
              dense
              @click="eliminarUsuario(props.row._id)"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="mostrarDialogoEditar">
      <EditarUsuario
        :usuario-id="usuarioAEditar"
        @close="mostrarDialogoEditar = false"
        @usuario-actualizado="obtenerUsuarios"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const prompt = ref(false);
const usuarios = ref([]);

//Registrar Usuario
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
const imagenColaborador = ref(null); // Variable para la imagen
const roles = ref([]);
//

const columnas = [
  { name: "nombre", label: "Nombre", field: "nombres" },
  { name: "apellido", label: "Apellido", field: "apellidos" },
  { name: "correo", label: "Correo", field: "correo" },
  {
    name: "rol",
    label: "Rol",
    field: (row) => (row.rol ? row.rol.nombre : "Sin rol"),
  },
  { name: "acciones", label: "Acciones" },
];

const mostrarDialogoEditar = ref(false);
const usuarioAEditar = ref(null);

const obtenerUsuarios = async () => {
  try {
    const response = await axios.get("http://localhost:4000/auth/usuarios", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    usuarios.value = response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

const editarUsuario = (id) => {
  usuarioAEditar.value = id;
  mostrarDialogoEditar.value = true;
};

const eliminarUsuario = async (id) => {
  if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
    try {
      await axios.delete(`http://localhost:4000/auth/usuario/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }
};
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
        tipoDocumento: tipoDocumento.value, // Enviar como string
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
    prompt.value = false; // Cerrar el diálogo
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
    imagenColaborador.value = null; // Limpiar la imagen
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    // Manejar el error, mostrar un mensaje al usuario
  }
};
onMounted(obtenerUsuarios);
</script>
