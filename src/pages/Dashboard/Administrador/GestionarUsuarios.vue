<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="row justify-end">
        <q-btn label="Crear Usuario" color="primary" @click="prompt = true" />
      </div>
      <!--Dialogo Crear Usuario-->
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
      <!--Dialogo Crear Usuario-->

      <q-table
        title="Gestionar Usuarios"
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
              @click="
                mostrarDialogoEditar = true;
                usuarioAEditar = props.row._id;
              "
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
    <!--Dialog Eliminar Usuario-->
    <q-dialog v-model="mostrarDialogoConfirmacion">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar Eliminación</div>
        </q-card-section>

        <q-card-section>
          <p>¿Estás seguro de que quieres eliminar este usuario?</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Eliminar"
            color="negative"
            @click="confirmarEliminacion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--Dialog Eliminar Usuario-->
    <!--Menu Editar Usuario-->
    <q-dialog v-model="mostrarDialogoEditar" persistent>
      <q-card style="min-width: 750px">
        <q-card-section>
          <div class="text-h6">Editar Usuario</div>
        </q-card-section>
        <q-card-section class="q-gutter-md" v-if="obtenidoUsuario">
          <q-form @submit.prevent="abrirConfirmacionEdicion">
            <q-input
              filled
              v-model="nombreEdit"
              label="Nombres"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor ingrese los nombres',
              ]"
            />
            <q-input
              filled
              v-model="apellidoEdit"
              label="Apellidos"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Por favor ingrese los apellidos',
              ]"
            />
            <q-input
              filled
              v-model="correoEdit"
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
              v-model="nombreUsuarioEdit"
              label="Nombre de Usuario"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Por favor ingrese el nombre de usuario',
              ]"
            />
            <q-select
              filled
              v-model="rolEdit"
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
              v-model="tipoDocumentoEdit"
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
              v-model="numeroDocumentoEdit"
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
              v-model="fechaNacimientoEdit"
              label="Fecha de Nacimiento"
              type="date"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            v-close-popup
            @click="mostrarDialogoEditar = false"
          />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            type="submit"
            @click="abrirConfirmacionEdicion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Diálogo de Confirmación de Edición -->
    <q-dialog v-model="mostrarDialogoConfirmacionEdicion">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar Edición</div>
        </q-card-section>
        <q-card-section>
          <p>
            ¿Estás seguro de que quieres guardar los cambios de este usuario?
          </p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            v-close-popup
            @click="mostrarDialogoConfirmacionEdicion = false"
          />
          <q-btn
            flat
            label="Confirmar"
            color="primary"
            @click="confirmarEdicion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const prompt = ref(false);
const usuarios = ref([]);
import api from "../../../api";
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

const mostrarDialogoConfirmacion = ref(false);
const usuarioAEliminar = ref(null);
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

// Editar Usuario
const nombreEdit = ref("");
const apellidoEdit = ref("");
const correoEdit = ref("");
const nombreUsuarioEdit = ref("");
// const contrasenaEdit = ref(""); // No se edita la contraseña
const rolEdit = ref(null);
const tipoDocumentoEdit = ref(null);
const numeroDocumentoEdit = ref(null);
const fechaNacimientoEdit = ref(null);

const obtenerUsuarios = async () => {
  try {
    const response = await api.get("/auth/usuarios", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    usuarios.value = response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
};

// const editarUsuario = (id) => {
//   usuarioAEditar.value = id;
//   mostrarDialogoEditar.value = true;
//   // Obtener los datos del usuario y rellenar el formulario de edición
//   obtenerUsuario(id);
// };
const mostrarDialogoConfirmacionEdicion = ref(false);

const abrirConfirmacionEdicion = () => {
  mostrarDialogoConfirmacionEdicion.value = true;
};

const confirmarEdicion = () => {
  mostrarDialogoConfirmacionEdicion.value = false;
  actualizarUsuario(); // Llamar a la función de actualización
};

const eliminarUsuario = async (id) => {
  usuarioAEliminar.value = id;
  mostrarDialogoConfirmacion.value = true;
};
const confirmarEliminacion = async () => {
  try {
    await api.delete(`/auth/usuario/${usuarioAEliminar.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    obtenerUsuarios(); // Actualizar la lista de usuarios
    mostrarDialogoConfirmacion.value = false; // Cerrar el diálogo
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
  }
};
const obtenerRoles = async () => {
  try {
    const response = await api.get("/roles", {
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
    const formData = new FormData();
    formData.append("nombres", nombre.value);
    formData.append("apellidos", apellido.value);
    formData.append("correo", correo.value);
    formData.append("nombre_usuario", nombreUsuario.value);
    formData.append("contrasena", contrasena.value);
    formData.append("rol", rol.value);
    formData.append("tipoDocumento", tipoDocumento.value);
    formData.append("numeroDocumento", numeroDocumento.value);
    formData.append("fecha_de_nacimiento", fechaNacimiento.value);
    formData.append("foto_de_colaborador", imagenColaborador.value);

    const response = await api.post("/auth/registro", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Usuario creado:", response.data);
    prompt.value = false; // Cerrar el diálogo
    obtenerUsuarios(); // Actualizar la lista de usuarios
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
const obtenidoUsuario = ref({});
watch(usuarioAEditar, (nuevoId) => {
  if (nuevoId) {
    obtenerUsuario(nuevoId);
  } else {
    // Si se cierra el diálogo, limpiar los datos
    obtenidoUsuario.value = null;
  }
});
const obtenerUsuario = async (id) => {
  try {
    const response = await api.get(`/auth/usuario/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const usuario = response.data;
    nombreEdit.value = usuario.nombres;
    apellidoEdit.value = usuario.apellidos;
    correoEdit.value = usuario.correo;
    nombreUsuarioEdit.value = usuario.nombre_usuario;
    rolEdit.value = usuario.rol._id;
    tipoDocumentoEdit.value = usuario.tipoDocumento;
    numeroDocumentoEdit.value = usuario.numeroDocumento;
    fechaNacimientoEdit.value = usuario.fecha_de_nacimiento;
    obtenidoUsuario.value = response.data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
  }
};

const actualizarUsuario = async () => {
  try {
    await api.put(
      `/auth/usuario/${usuarioAEditar.value}`,
      {
        nombres: nombreEdit.value,
        apellidos: apellidoEdit.value,
        correo: correoEdit.value,
        nombre_usuario: nombreUsuarioEdit.value,
        rol: rolEdit.value,
        tipoDocumento: tipoDocumentoEdit.value,
        numeroDocumento: numeroDocumentoEdit.value,
        fecha_de_nacimiento: fechaNacimientoEdit.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    mostrarDialogoEditar.value = false; // Cerrar el diálogo
    obtenerUsuarios(); // Actualizar la lista de usuarios
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
  }
};

onMounted(obtenerUsuarios);
</script>
