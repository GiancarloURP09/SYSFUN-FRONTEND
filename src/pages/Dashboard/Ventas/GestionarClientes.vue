<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestión de Clientes</div>
        <q-btn
          label="Crear Cliente"
          color="primary"
          @click="abrirModalCrear"
          class="q-ml-md row justify-end"
        />
      </q-card-section>

      <q-separator />
      <q-card-section>
        <q-table
          :rows="clientes"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay clientes disponibles"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarCliente(props.row)"
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
                icon="search"
                color="accent"
                @click="abrirEvaluacion(props.row)"
                label="Evaluar"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal para Crear/Editar Cliente -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Cliente" : "Crear Cliente" }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="clienteForm.nombre"
            label="Nombre del Cliente"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'Este campo es obligatorio']"
          />
          <q-input
            v-model="clienteForm.rubro"
            label="Rubro"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'Este campo es obligatorio']"
          />
          <q-input
            v-model="clienteForm.representante"
            label="Representante"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'Este campo es obligatorio']"
          />
          <q-select
            v-model="clienteForm.tipoDocumento"
            :options="tiposDocumento"
            label="Tipo de Documento"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'Seleccione un tipo de documento']"
          />
          <q-input
            v-model="clienteForm.numeroDocumento"
            label="Número de Documento"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'Este campo es obligatorio']"
          />
          <q-select
            v-model="clienteForm.usuariosAsociados"
            :options="usuariosOptions"
            label="Usuarios Asociados"
            filled
            emit-value
            map-options
            multiple
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Debe seleccionar al menos un usuario asociado',
            ]"
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

    <!-- Diálogo de Evaluación -->
    <q-dialog v-model="mostrarEvaluacion">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">Evaluación de Cliente</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="clienteEvaluado.nombre"
            label="Nombre"
            filled
            readonly
          />
          <q-input
            v-model="clienteEvaluado.rubro"
            label="Rubro"
            filled
            readonly
          />
          <q-input
            v-model="clienteEvaluado.representante"
            label="Representante"
            filled
            readonly
          />
          <q-toggle
            v-model="clienteEvaluado.esPotencial"
            label="Es Potencial"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="cerrarEvaluacion"
          />
          <q-btn
            flat
            label="Guardar Cambios"
            color="primary"
            @click="guardarEvaluacion"
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
const clientes = ref([]);
const usuariosOptions = ref([]); // Opciones de usuarios cargados
const columnas = [
  {
    name: "nombre",
    label: "Nombre del Cliente",
    align: "left",
    field: "nombre",
  },
  { name: "rubro", label: "Rubro", align: "left", field: "rubro" },
  {
    name: "representante",
    label: "Representante",
    align: "left",
    field: "representante",
  },
  {
    name: "esPotencial",
    label: "Es Potencial",
    align: "center",
    field: (row) => (row.esPotencial ? "Sí" : "No"),
  },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const clienteForm = ref({
  nombre: "",
  rubro: "",
  representante: "",
  tipoDocumento: "",
  numeroDocumento: "",
  usuariosAsociados: [], // Lista de IDs de usuarios asociados
});
const modoEdicion = ref(false);
const clienteSeleccionado = ref(null);
const tiposDocumento = ["DNI", "RUC", "Pasaporte", "Carnet de Extranjería"];
let accionPendiente = null;
const clienteEvaluado = ref({});
const mostrarEvaluacion = ref(false);
const cargarClientes = async () => {
  try {
    const respuesta = await api.get("/clientes", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    clientes.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar los clientes:", error);
    alert("Hubo un error al cargar los clientes.");
  }
};

const cargarUsuarios = async () => {
  try {
    const respuesta = await api.get("/auth/usuarios", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    usuariosOptions.value = respuesta.data.map((usuario) => ({
      label: `${usuario.nombres} ${usuario.apellidos}`,
      value: usuario._id,
    }));
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    alert("Hubo un error al cargar los usuarios.");
  }
};
const abrirEvaluacion = (cliente) => {
  clienteEvaluado.value = { ...cliente };
  mostrarEvaluacion.value = true;
};

const guardarEvaluacion = async () => {
  try {
    await api.put(
      `/clientes/${clienteEvaluado.value._id}`,
      clienteEvaluado.value,
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    alert("Evaluación guardada correctamente.");
    cerrarEvaluacion();
    cargarClientes();
  } catch (error) {
    console.error("Error al guardar la evaluación:", error);
    alert("Hubo un error al guardar la evaluación.");
  }
};

const cerrarEvaluacion = () => {
  mostrarEvaluacion.value = false;
};

const abrirModalCrear = () => {
  clienteForm.value = {
    nombre: "",
    rubro: "",
    representante: "",
    tipoDocumento: "",
    numeroDocumento: "",
    usuariosAsociados: [],
  };
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarCliente = (cliente) => {
  clienteSeleccionado.value = cliente;
  clienteForm.value = { ...cliente };
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const confirmarGuardar = () => {
  mensajeConfirmacion.value = modoEdicion.value
    ? "¿Está seguro de que desea guardar los cambios en este cliente?"
    : "¿Está seguro de que desea crear este cliente?";
  accionPendiente = guardarCliente;
  mostrarConfirmacion.value = true;
};

const guardarCliente = async () => {
  try {
    if (modoEdicion.value) {
      await api.put(
        `/clientes/${clienteSeleccionado.value._id}`,
        clienteForm.value,
        { headers: { Authorization: `Bearer ${authStore.token}` } },
      );
    } else {
      await api.post("/clientes", clienteForm.value, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    }
    alert("Cliente guardado correctamente.");
    cerrarModal();
    cargarClientes();
  } catch (error) {
    console.error("Error al guardar el cliente:", error);
    alert("Hubo un error al guardar el cliente.");
  }
};

const mostrarConfirmacionEliminar = (cliente) => {
  mensajeConfirmacion.value =
    "¿Está seguro de que desea eliminar este cliente?";
  accionPendiente = () => eliminarCliente(cliente._id);
  mostrarConfirmacion.value = true;
};

const eliminarCliente = async (id) => {
  try {
    await api.delete(`/clientes/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("Cliente eliminado correctamente.");
    cargarClientes();
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    alert("Hubo un error al eliminar el cliente.");
  }
};
const evaluarCliente = async (cliente) => {
  try {
    const respuesta = await api.post(
      `/clientes/${cliente._id}/evaluar`,
      {},
      { headers: { Authorization: `Bearer ${authStore.token}` } },
    );
    clienteEvaluado.value = respuesta.data.cliente;
    mostrarEvaluacion.value = true;
    cargarClientes();
  } catch (error) {
    console.error("Error al evaluar el cliente:", error);
    alert("Hubo un error al evaluar el cliente.");
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
  cargarClientes();
  cargarUsuarios();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
.text-positive {
  color: green;
}
.text-negative {
  color: red;
}
</style>
