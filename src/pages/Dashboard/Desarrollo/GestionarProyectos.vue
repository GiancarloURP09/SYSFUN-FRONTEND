<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestión de Proyectos</div>
        <q-btn
          label="Crear Proyecto"
          color="primary"
          @click="abrirModalCrear"
          class="q-ml-md row justify-end"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="proyectos"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay proyectos disponibles"
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                @click="editarProyecto(props.row)"
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

    <!-- Modal para Crear/Editar Proyecto -->
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 600px; max-width: 90vw; padding: 20px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicion ? "Editar Proyecto" : "Crear Proyecto" }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="proyectoForm.nombre"
            label="Nombre del Proyecto"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'Este campo es obligatorio']"
          />
          <q-select
            v-model="proyectoForm.cliente"
            :options="clientesOptions"
            label="Cliente"
            filled
            emit-value
            map-options
          />
          <q-input
            v-model="proyectoForm.descripcion"
            label="Descripción"
            filled
            type="textarea"
          />
          <q-select
            v-model="proyectoForm.responsable"
            :options="usuariosOptions"
            label="Responsable"
            filled
            emit-value
            map-options
          />
          <q-input
            v-model="proyectoForm.fechaInicio"
            label="Fecha de Inicio"
            filled
            type="date"
          />
          <q-input
            v-model="proyectoForm.fechaFin"
            label="Fecha de Fin"
            filled
            type="date"
          />
          <q-select
            v-model="proyectoForm.estado"
            :options="['En progreso', 'Completado', 'Cancelado']"
            label="Estado"
            filled
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
const proyectos = ref([]);
const clientesOptions = ref([]);
const usuariosOptions = ref([]);
const columnas = [
  { name: "nombre", label: "Nombre", align: "left", field: "nombre" },
  { name: "cliente", label: "Cliente", align: "left", field: "cliente.nombre" },
  {
    name: "responsable",
    label: "Responsable",
    align: "left",
    field: "responsable.nombres",
  },
  { name: "estado", label: "Estado", align: "left", field: "estado" },
  { name: "acciones", label: "Acciones", align: "center" },
];

const mostrarModal = ref(false);
const mostrarConfirmacion = ref(false);
const mensajeConfirmacion = ref("");
const proyectoForm = ref({
  nombre: "",
  cliente: "",
  descripcion: "",
  estado: "En progreso",
  fechaInicio: "",
  fechaFin: "",
  responsable: "",
});
const modoEdicion = ref(false);
const proyectoSeleccionado = ref(null);

const cargarProyectos = async () => {
  try {
    const respuesta = await api.get("/proyectos", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    proyectos.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
    alert("Hubo un error al cargar los proyectos.");
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

const abrirModalCrear = () => {
  proyectoForm.value = {
    nombre: "",
    cliente: "",
    descripcion: "",
    estado: "En progreso",
    fechaInicio: "",
    fechaFin: "",
    responsable: "",
  };
  modoEdicion.value = false;
  mostrarModal.value = true;
};

const editarProyecto = (proyecto) => {
  proyectoSeleccionado.value = proyecto;
  proyectoForm.value = { ...proyecto };
  modoEdicion.value = true;
  mostrarModal.value = true;
};

const confirmarGuardar = () => {
  mensajeConfirmacion.value = modoEdicion.value
    ? "¿Está seguro de que desea guardar los cambios en este proyecto?"
    : "¿Está seguro de que desea crear este proyecto?";
  guardarProyecto();
};

const guardarProyecto = async () => {
  try {
    if (modoEdicion.value) {
      await api.put(
        `/proyectos/${proyectoSeleccionado.value._id}`,
        proyectoForm.value,
        { headers: { Authorization: `Bearer ${authStore.token}` } },
      );
    } else {
      await api.post("/proyectos", proyectoForm.value, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    }
    alert("Proyecto guardado correctamente.");
    cerrarModal();
    cargarProyectos();
  } catch (error) {
    console.error("Error al guardar el proyecto:", error);
    alert("Hubo un error al guardar el proyecto.");
  }
};

const mostrarConfirmacionEliminar = (proyecto) => {
  mensajeConfirmacion.value =
    "¿Está seguro de que desea eliminar este proyecto?";
  proyectoSeleccionado.value = proyecto;
  eliminarProyecto();
};

const eliminarProyecto = async () => {
  try {
    await api.delete(`/proyectos/${proyectoSeleccionado.value._id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    alert("Proyecto eliminado correctamente.");
    cargarProyectos();
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    alert("Hubo un error al eliminar el proyecto.");
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false;
};

onMounted(() => {
  cargarProyectos();
  cargarClientes();
  cargarUsuarios();
});
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
