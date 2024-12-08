<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestión de Áreas</div>
        <q-btn
          label="Crear Área"
          color="primary"
          @click="abrirModalCrear"
          class="q-ml-md row justify-end"
        />
      </q-card-section>

      <q-separator />
      <q-card-section>
        <q-table
          :rows="areas"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay áreas disponibles"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarArea(props.row)"
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

    <!-- Modal para Crear/Editar Área -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Área" : "Crear Área" }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="areaForm.nombre"
            label="Nombre del Área"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'Este campo es obligatorio']"
          />
          <q-input
            v-model="areaForm.descripcion"
            label="Descripción"
            filled
            type="textarea"
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
const areas = ref([]);
const columnas = [
  { name: "nombre", label: "Nombre del Área", align: "left", field: "nombre" },
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
const areaForm = ref({ nombre: "", descripcion: "" });
const modoEdicion = ref(false);
const areaSeleccionada = ref(null);
let accionPendiente = null;

const cargarAreas = async () => {
  try {
    const respuesta = await api.get("/areas", {
      headers: {
        Authorization: `Bearer ${authStore.token}`, // Asegúrate de que el token esté configurado
      },
    });
    areas.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar las áreas:", error);
    alert("Hubo un error al cargar las áreas.");
  }
};

const abrirModalCrear = () => {
  areaForm.value = { nombre: "", descripcion: "" };
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarArea = (area) => {
  areaSeleccionada.value = area;
  areaForm.value = { ...area };
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const confirmarGuardar = () => {
  mensajeConfirmacion.value = modoEdicion.value
    ? "¿Está seguro de que desea guardar los cambios en esta área?"
    : "¿Está seguro de que desea crear esta área?";
  accionPendiente = guardarArea;
  mostrarConfirmacion.value = true;
};

const guardarArea = async () => {
  try {
    if (modoEdicion.value) {
      // Editar área
      await api.put(`/areas/${areaSeleccionada.value._id}`, areaForm.value, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    } else {
      // Crear nueva área
      await api.post("/areas", areaForm.value, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    }
    alert("Área guardada correctamente.");
    cerrarModal();
    cargarAreas();
  } catch (error) {
    console.error("Error al guardar el área:", error);
    alert("Hubo un error al guardar el área.");
  }
};

const mostrarConfirmacionEliminar = (area) => {
  mensajeConfirmacion.value = "¿Está seguro de que desea eliminar esta área?";
  accionPendiente = () => eliminarArea(area._id);
  mostrarConfirmacion.value = true;
};

const eliminarArea = async (id) => {
  try {
    await api.delete(`/areas/${id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    alert("Área eliminada correctamente.");
    cargarAreas();
  } catch (error) {
    console.error("Error al eliminar el área:", error);
    alert("Hubo un error al eliminar el área.");
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

onMounted(cargarAreas);
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
