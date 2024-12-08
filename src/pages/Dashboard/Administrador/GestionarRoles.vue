<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestión de Roles</div>
        <q-btn
          label="Crear Rol"
          color="primary"
          @click="abrirModalCrear"
          class="q-ml-md row justify-end"
        />
      </q-card-section>

      <q-separator />
      <q-card-section>
        <q-table
          :rows="roles"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay roles disponibles"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarRol(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="mostrarConfirmacionEliminar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal para Crear/Editar Rol -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Rol" : "Crear Rol" }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="rolForm.nombre"
            label="Nombre del Rol"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'Este campo es obligatorio']"
          />
          <q-input
            v-model="rolForm.descripcion"
            label="Descripción"
            filled
            type="textarea"
          />
          <q-select
            v-model="rolForm.area"
            label="Área"
            filled
            :options="areas"
            option-value="_id"
            option-label="nombre"
            emit-value
            map-options
            lazy-rules
            :rules="[(val) => !!val || 'Debe seleccionar un área']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cerrarModal" />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="confirmarGuardar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de Confirmación -->
    <q-dialog v-model="mostrarConfirmacion">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ mensajeConfirmacion }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="cerrarConfirmacion"
          />
          <q-btn
            flat
            label="Confirmar"
            color="primary"
            @click="confirmarAccion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../../../stores/auth";
import api from "../../../api";
const authStore = useAuthStore();
const roles = ref([]);
const areas = ref([]);
const columnas = [
  { name: "nombre", label: "Nombre del Rol", align: "left", field: "nombre" },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const rolForm = ref({ nombre: "", descripcion: "", area: null });
const modoEdicion = ref(false);
const rolSeleccionado = ref(null);
let accionPendiente = null;

const cargarRoles = async () => {
  try {
    const respuesta = await api.get("/roles", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    roles.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar los roles:", error);
    alert("Hubo un error al cargar los roles.");
  }
};

const cargarAreas = async () => {
  try {
    const respuesta = await api.get("/areas", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    areas.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar las áreas:", error);
    alert("Hubo un error al cargar las áreas.");
  }
};

const abrirModalCrear = () => {
  rolForm.value = { nombre: "", descripcion: "", area: null };
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarRol = (rol) => {
  rolSeleccionado.value = rol;
  rolForm.value = { ...rol };
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const confirmarGuardar = () => {
  mensajeConfirmacion.value = modoEdicion.value
    ? "¿Está seguro de que desea guardar los cambios en este rol?"
    : "¿Está seguro de que desea crear este rol?";
  accionPendiente = guardarRol;
  mostrarConfirmacion.value = true;
};

const guardarRol = async () => {
  try {
    if (modoEdicion.value) {
      // Editar rol
      await api.put(`/roles/${rolSeleccionado.value._id}`, rolForm.value, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    } else {
      // Crear nuevo rol
      await api.post("/roles", rolForm.value, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    }
    alert("Rol guardado correctamente.");
    cerrarModal();
    cargarRoles();
  } catch (error) {
    console.error("Error al guardar el rol:", error);
    alert("Hubo un error al guardar el rol.");
  }
};

const mostrarConfirmacionEliminar = (rol) => {
  mensajeConfirmacion.value = "¿Está seguro de que desea eliminar este rol?";
  accionPendiente = () => eliminarRol(rol._id);
  mostrarConfirmacion.value = true;
};

const eliminarRol = async (id) => {
  try {
    await api.delete(`/roles/${id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    alert("Rol eliminado correctamente.");
    cargarRoles();
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    alert("Hubo un error al eliminar el rol.");
  }
};

const confirmarAccion = async () => {
  mostrarConfirmacion.value = false;
  if (accionPendiente) {
    await accionPendiente();
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false;
  accionPendiente = null;
};

onMounted(() => {
  cargarRoles();
  cargarAreas();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
