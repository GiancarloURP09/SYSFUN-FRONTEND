<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Gestión de Áreas</div>
        <q-btn
          label="Crear Área"
          color="primary"
          @click="abrirModalCrear"
          class="q-ml-md"
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
            <q-btn
              flat
              round
              icon="edit"
              color="primary"
              @click="editarArea(props.row)"
            />
            <q-btn
              flat
              round
              icon="delete"
              color="negative"
              @click="eliminarArea(props.row._id)"
            />
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal para Crear/Editar Área -->
    <q-dialog v-model="mostrarModal">
      <q-card>
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
          <q-btn flat label="Guardar" color="primary" @click="guardarArea" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../../../stores/auth";

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
const areaForm = ref({ nombre: "", descripcion: "" });
const modoEdicion = ref(false);
const areaSeleccionada = ref(null);

const cargarAreas = async () => {
  try {
    const respuesta = await axios.get("http://localhost:4000/areas", {
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

const guardarArea = async () => {
  try {
    if (modoEdicion.value) {
      // Editar área
      await axios.put(
        `http://localhost:4000/areas/${areaSeleccionada.value._id}`,
        areaForm.value,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
    } else {
      // Crear nueva área
      await axios.post("http://localhost:4000/areas", areaForm.value, {
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

const eliminarArea = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/areas/${id}`, {
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

const cerrarModal = () => {
  mostrarModal.value = false;
};

onMounted(cargarAreas);
</script>

<style scoped>
.q-pa-md {
  padding: 20px;
}
</style>
