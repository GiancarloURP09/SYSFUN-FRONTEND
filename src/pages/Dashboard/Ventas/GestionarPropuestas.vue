<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestión de Propuestas</div>
        <q-btn
          label="Crear Propuesta"
          color="primary"
          @click="abrirModalCrear"
          class="q-ml-md row justify-end"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="propuestas"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay propuestas disponibles"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarPropuesta(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="mostrarConfirmacionEliminar(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="rule"
                color="accent"
                label="Estado"
                @click="cambiarEstadoPropuesta(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal para Crear/Editar Propuesta -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Propuesta" : "Crear Propuesta" }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="propuestaForm.cliente"
            :options="clientesOptions"
            label="Cliente"
            filled
            emit-value
            map-options
          />
          <q-input
            v-model="propuestaForm.descripcion"
            label="Descripción"
            filled
            type="textarea"
          />
          <q-input
            v-model="propuestaForm.monto"
            label="Monto"
            filled
            type="number"
          />
          <q-input
            v-model="propuestaForm.fechaInicio"
            label="Fecha de Inicio"
            filled
            type="date"
          />
          <q-input
            v-model="propuestaForm.fechaFin"
            label="Fecha de Fin"
            filled
            type="date"
          />
          <q-input
            v-model="propuestaForm.fechaReunion"
            label="Fecha de Reunión"
            filled
            type="date"
          />
          <q-input
            v-model="propuestaForm.urlReunion"
            label="URL de Reunión"
            filled
            type="url"
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

    <!-- Modal para Cambiar Estado -->
    <q-dialog v-model="mostrarCambioEstado">
      <q-card style="width: 400px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">Cambiar Estado de Propuesta</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="estadoSeleccionado"
            :options="['Pendiente', 'Aprobada', 'Rechazada']"
            label="Estado"
            filled
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="cerrarCambioEstado"
          />
          <q-btn flat label="Guardar" color="primary" @click="guardarEstado" />
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
const propuestas = ref([]);
const clientesOptions = ref([]);
const columnas = [
  {
    name: "cliente",
    label: "Cliente",
    align: "left",
    field: (row) => row.cliente?.nombre || "Sin cliente",
  },
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  { name: "monto", label: "Monto", align: "left", field: "monto" },
  { name: "fechaInicio", label: "Inicio", align: "left", field: "fechaInicio" },
  { name: "fechaFin", label: "Fin", align: "left", field: "fechaFin" },
  { name: "estado", label: "Estado", align: "left", field: "estado" },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const propuestaForm = ref({
  cliente: "",
  descripcion: "",
  monto: "",
  fechaInicio: "",
  fechaFin: "",
  fechaReunion: "",
  urlReunion: "",
  estado: "Pendiente",
});
const modoEdicion = ref(false);
const propuestaSeleccionada = ref(null);
const mostrarCambioEstado = ref(false);
const estadoSeleccionado = ref("");

const cargarPropuestas = async () => {
  try {
    const respuesta = await api.get("/propuestas", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    propuestas.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar las propuestas:", error);
    alert("Hubo un error al cargar las propuestas.");
  }
};

const cargarClientes = async () => {
  try {
    const respuesta = await api.get("/clientes", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    clientesOptions.value = respuesta.data.map((cliente) => ({
      label: cliente.nombre,
      value: cliente._id,
    }));
  } catch (error) {
    console.error("Error al cargar los clientes:", error);
    alert("Hubo un error al cargar los clientes.");
  }
};

const abrirModalCrear = () => {
  propuestaForm.value = {
    cliente: "",
    descripcion: "",
    monto: "",
    fechaInicio: "",
    fechaFin: "",
    fechaReunion: "",
    urlReunion: "",
    estado: "Pendiente",
  };
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarPropuesta = (propuesta) => {
  propuestaSeleccionada.value = propuesta;
  propuestaForm.value = { ...propuesta };
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const confirmarGuardar = () => {
  mensajeConfirmacion.value = modoEdicion.value
    ? "¿Está seguro de que desea guardar los cambios en esta propuesta?"
    : "¿Está seguro de que desea crear esta propuesta?";
  guardarPropuesta();
};

const guardarPropuesta = async () => {
  try {
    if (modoEdicion.value) {
      await api.put(
        `/propuestas/${propuestaSeleccionada.value._id}`,
        propuestaForm.value,
        { headers: { Authorization: `Bearer ${authStore.token}` } },
      );
    } else {
      await api.post("/propuestas", propuestaForm.value, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    }
    alert("Propuesta guardada correctamente.");
    cerrarModal();
    cargarPropuestas();
  } catch (error) {
    console.error("Error al guardar la propuesta:", error);
    alert("Hubo un error al guardar la propuesta.");
  }
};

const mostrarConfirmacionEliminar = (propuesta) => {
  mensajeConfirmacion.value =
    "¿Está seguro de que desea eliminar esta propuesta?";
  propuestaSeleccionada.value = propuesta;
  eliminarPropuesta();
};

const eliminarPropuesta = async () => {
  try {
    await api.delete(`/propuestas/${propuestaSeleccionada.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("Propuesta eliminada correctamente.");
    cargarPropuestas();
  } catch (error) {
    console.error("Error al eliminar la propuesta:", error);
    alert("Hubo un error al eliminar la propuesta.");
  }
};

const cambiarEstadoPropuesta = (propuesta) => {
  propuestaSeleccionada.value = propuesta;
  estadoSeleccionado.value = propuesta.estado;
  mostrarCambioEstado.value = true;
};

const guardarEstado = async () => {
  try {
    await api.put(
      `/propuestas/${propuestaSeleccionada.value._id}`,
      { estado: estadoSeleccionado.value },
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    alert("Estado actualizado correctamente.");
    cerrarCambioEstado();
    cargarPropuestas();
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    alert("Hubo un error al actualizar el estado.");
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const cerrarCambioEstado = () => {
  mostrarCambioEstado.value = false;
};

onMounted(() => {
  cargarPropuestas();
  cargarClientes();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
