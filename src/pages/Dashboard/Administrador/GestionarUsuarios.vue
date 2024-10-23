<template>
  <q-page padding>
    <div class="q-gutter-y-md">
      <q-btn
        label="Crear Usuario"
        color="primary"
        @click.stop="mostrarDialogoCrear = true"
      />

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

    <q-dialog v-model="mostrarDialogoCrear">
      <CrearUsuario
        @close="mostrarDialogoCrear = false"
        @usuario-creado="obtenerUsuarios"
      />
    </q-dialog>

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

const usuarios = ref([]);
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
const mostrarDialogoCrear = ref(false);
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

onMounted(obtenerUsuarios);
</script>
