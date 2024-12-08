<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div>
        <q-row>
          <q-col cols="12">
            <div class="text-h5" style="padding: auto; color: turquoise">
              Bienvenido, {{ authStore.usuario.nombres }}!
            </div>
          </q-col>
        </q-row>
      </div>
      <!-- Tarjeta: Total de Clientes -->
      <q-row>
        <q-col cols="12">
          <div class="text-h5">
            <q-card class="col-2" style="background-color: aquamarine">
              <q-card-section>
                <div class="text-h6">Total de Clientes</div>
              </q-card-section>
              <q-card-section>
                <div class="text-subtitle1">{{ totalClientes }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-col>
      </q-row>

      <q-row>
        <q-col cols="12">
          <div class="text-h5">
            <!-- Tarjeta: Clientes Potenciales -->
            <q-card class="col-3" style="background-color: burlywood">
              <q-card-section>
                <div class="text-h6">Clientes Potenciales</div>
              </q-card-section>
              <q-card-section>
                <div class="text-subtitle1">{{ clientesPotenciales }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-col>
      </q-row>
      <q-row>
        <q-col cols="12">
          <div class="text-h5">
            <!-- Tarjeta: Total de Usuarios -->
            <q-card class="col-3" style="background-color: darkseagreen">
              <q-card-section>
                <div class="text-h6">Total de Usuarios</div>
              </q-card-section>
              <q-card-section>
                <div class="text-subtitle1">{{ totalUsuarios }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-col>
      </q-row>
      <q-row>
        <q-col cols="12">
          <div class="text-h5">
            <!-- Tarjeta: Total de Áreas -->
            <q-card class="col-3" style="background-color: khaki">
              <q-card-section>
                <div class="text-h6">Total de Áreas</div>
              </q-card-section>
              <q-card-section>
                <div class="text-subtitle1">{{ totalAreas }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-col>
      </q-row>
    </div>

    <div class="row q-mt-md">
      <!-- Gráfico: Clientes Potenciales -->
      <q-card class="col-6">
        <q-card-section>
          <div class="text-h6">Distribución de Clientes</div>
        </q-card-section>
        <q-card-section>
          <canvas id="chartClientes"></canvas>
        </q-card-section>
      </q-card>

      <!-- Gráfico: Usuarios por Área -->
      <q-card class="col-6">
        <q-card-section>
          <div class="text-h6">Usuarios por Área</div>
        </q-card-section>
        <q-card-section>
          <canvas id="chartUsuariosPorArea"></canvas>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto"; // Importar Chart.js
import { useAuthStore } from "../../stores/auth";
import api from "../../api";
const authStore = useAuthStore();

// Variables reactivas para estadísticas
const totalClientes = ref(0);
const clientesPotenciales = ref(0);
const totalUsuarios = ref(0);
const totalAreas = ref(0);

// Funciones para cargar datos
const cargarEstadisticas = async () => {
  try {
    // Total de clientes
    const respuestaClientes = await api.get("/clientes", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const clientes = respuestaClientes.data;
    totalClientes.value = clientes.length;
    clientesPotenciales.value = clientes.filter(
      (cliente) => cliente.esPotencial,
    ).length;

    // Total de usuarios
    const respuestaUsuarios = await api.get("/auth/usuarios", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    totalUsuarios.value = respuestaUsuarios.data.length;

    // Total de áreas
    const respuestaAreas = await api.get("/areas", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    totalAreas.value = respuestaAreas.data.length;

    // Crear gráficos
    crearGraficoClientes(clientes);
    crearGraficoUsuariosPorArea(respuestaUsuarios.data, respuestaAreas.data);
  } catch (error) {
    console.error("Error al cargar las estadísticas:", error);
    alert("Hubo un error al cargar las estadísticas.");
  }
};

// Función para crear el gráfico de distribución de clientes
const crearGraficoClientes = (clientes) => {
  const ctx = document.getElementById("chartClientes").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Potenciales", "No Potenciales"],
      datasets: [
        {
          data: [
            clientes.filter((cliente) => cliente.esPotencial).length,
            clientes.filter((cliente) => !cliente.esPotencial).length,
          ],
          backgroundColor: ["#4caf50", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
};

// Función para crear el gráfico de usuarios por área
const crearGraficoUsuariosPorArea = (usuarios, areas) => {
  const dataPorArea = areas.map((area) => ({
    area: area.nombre,
    cantidad: usuarios.filter((usuario) => usuario.area === area._id).length,
  }));

  const ctx = document.getElementById("chartUsuariosPorArea").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: dataPorArea.map((item) => item.area),
      datasets: [
        {
          label: "Usuarios",
          data: dataPorArea.map((item) => item.cantidad),
          backgroundColor: "#3f51b5",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { title: { display: true, text: "Áreas" } },
        y: { title: { display: true, text: "Cantidad de Usuarios" } },
      },
    },
  });
};

// Cargar estadísticas al montar el componente
onMounted(cargarEstadisticas);
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
