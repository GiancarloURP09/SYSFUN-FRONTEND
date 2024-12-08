<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestión de Contratos</div>
        <q-btn
          label="Crear Contrato"
          color="primary"
          @click="abrirModalCrear"
          class="q-ml-md row justify-end"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="contratos"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay contratos disponibles"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarContrato(props.row)"
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

    <!-- Modal para Crear/Editar Contrato -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Contrato" : "Crear Contrato" }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="contratoForm.cliente"
            :options="clientesOptions"
            label="Cliente"
            filled
            emit-value
            map-options
          />
          <q-select
            v-model="contratoForm.proyecto"
            :options="proyectosOptions"
            label="Proyecto"
            filled
            emit-value
            map-options
          />
          <q-input
            v-model="contratoForm.descripcion"
            label="Descripción"
            filled
            type="textarea"
          />
          <q-input
            v-model="contratoForm.monto"
            label="Monto"
            filled
            type="number"
          />
          <q-input
            v-model="contratoForm.estado"
            label="Estado"
            filled
            type="text"
          />
          <q-input
            v-model="contratoForm.fechaInicio"
            label="Fecha de Inicio"
            filled
            type="date"
          />
          <q-input
            v-model="contratoForm.fechaFin"
            label="Fecha de Fin"
            filled
            type="date"
          />
          <q-uploader
            v-model="documentos"
            label="Adjuntar Documentos"
            filled
            hint="Arrastra y suelta archivos aquí o haz clic para seleccionar"
            :url="null"
            @added="procesarDocumentos"
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
const contratos = ref([]);
const clientesOptions = ref([]);
const proyectosOptions = ref([]);
const documentos = ref([]);
const columnas = [
  {
    name: "descripcion",
    label: "Descripción",
    align: "left",
    field: "descripcion",
  },
  { name: "cliente", label: "Cliente", align: "left", field: "cliente.nombre" },
  {
    name: "proyecto",
    label: "Proyecto",
    align: "left",
    field: "proyecto.nombre",
  },
  { name: "monto", label: "Monto", align: "left", field: "monto" },
  { name: "estado", label: "Estado", align: "left", field: "estado" },
  { name: "fechaInicio", label: "Inicio", align: "left", field: "fechaInicio" },
  { name: "fechaFin", label: "Fin", align: "left", field: "fechaFin" },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const contratoForm = ref({
  cliente: "",
  proyecto: "",
  descripcion: "",
  monto: "",
  estado: "Activo",
  fechaInicio: "",
  fechaFin: "",
});
const modoEdicion = ref(false);
const contratoSeleccionado = ref(null);

const cargarContratos = async () => {
  try {
    const respuesta = await api.get("/contratos", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    contratos.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar los contratos:", error);
    alert("Hubo un error al cargar los contratos.");
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

const cargarProyectos = async () => {
  try {
    const respuesta = await api.get("/proyectos", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    proyectosOptions.value = respuesta.data.map((proyecto) => ({
      label: proyecto.nombre,
      value: proyecto._id,
    }));
  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
    alert("Hubo un error al cargar los proyectos.");
  }
};

const procesarDocumentos = (archivos) => {
  documentos.value.push(...archivos);
};

const abrirModalCrear = () => {
  contratoForm.value = {
    cliente: "",
    proyecto: "",
    descripcion: "",
    monto: "",
    estado: "Activo",
    fechaInicio: "",
    fechaFin: "",
  };
  documentos.value = [];
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarContrato = (contrato) => {
  contratoSeleccionado.value = contrato;
  contratoForm.value = { ...contrato };
  documentos.value = [];
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const confirmarGuardar = () => {
  guardarContrato();
};

const guardarContrato = async () => {
  try {
    const formData = new FormData();
    Object.entries(contratoForm.value).forEach(([key, value]) =>
      formData.append(key, value),
    );
    documentos.value.forEach((doc) => formData.append("documentos", doc.file));

    const url = modoEdicion.value
      ? `/contratos/${contratoSeleccionado.value._id}`
      : "/contratos";

    const method = modoEdicion.value ? "put" : "post";

    await api[method](url, formData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Contrato guardado correctamente.");
    cerrarModal();
    cargarContratos();
  } catch (error) {
    console.error("Error al guardar el contrato:", error);
    alert("Hubo un error al guardar el contrato.");
  }
};

const mostrarConfirmacionEliminar = (contrato) => {
  mensajeConfirmacion.value =
    "¿Está seguro de que desea eliminar este contrato?";
  contratoSeleccionado.value = contrato;
  eliminarContrato();
};

const eliminarContrato = async () => {
  try {
    await axios.delete(`/contratos/${contratoSeleccionado.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("Contrato eliminado correctamente.");
    cargarContratos();
  } catch (error) {
    console.error("Error al eliminar el contrato:", error);
    alert("Hubo un error al eliminar el contrato.");
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false;
};

onMounted(() => {
  cargarContratos();
  cargarClientes();
  cargarProyectos();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
