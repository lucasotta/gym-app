const API = "https://gym-app-w75b.onrender.com";

let token = "";
let musculoActual = "";
let ejercicioActual = null;
let grafico = null;
let graficoPeso = null;
let graficoMusculo = null;

/* ===================== */
/* UTIL */
/* ===================== */
function formatearFecha(fechaISO){
  const f = new Date(fechaISO);
  return f.toLocaleDateString("es-ES"); 
}
function ocultarTodo() {
  [
    "auth",
    "musculosVista",
    "ejerciciosVista",
    "seriesVista",
    "calendarioVista"
  ].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.classList.add("hidden");
  });
}

/* ===================== */
/* LOGIN */
/* ===================== */

async function login() {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  });

  const data = await res.json();

  if(!res.ok){
    alert(data.msg || "Error");
    return;
  }

  token = data.token;

  ocultarTodo();
  document.getElementById("musculosVista").classList.remove("hidden");

  mostrarMusculos();
}

/* ===================== */
/* MUSCULOS */
/* ===================== */
function mostrarMusculos() {

  ocultarTodo();
  document.getElementById("musculosVista").classList.remove("hidden");

  const cont = document.getElementById("musculos");
  cont.innerHTML = "";

  const data = [
    {
      nombre: "Pecho",
      img: "https://images.unsplash.com/photo-1646072508263-af94f0218bf0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGVqZXJjaWNpbyUyMHByZXNzJTIwYmFuY2F8ZW58MHx8MHx8fDA%3D",
      icono: ""
    },
    {
      nombre: "Espalda",
      img: "https://plus.unsplash.com/premium_photo-1683120903102-ca698a2abc20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWplcmNpY2lvJTIwamFsb24lMjBhbCUyMHBlY2hvJTIwbXVqZXJ8ZW58MHx8MHx8fDA%3D",
      icono: ""
    },
    {
      nombre: "Piernas",
      img: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWplcmNpY2lvJTIwc2VudGFkaWxsYXxlbnwwfHwwfHx8MA%3D%3D",
      icono: ""
    },
    {
      nombre: "Hombros",
      img: "https://images.unsplash.com/photo-1704223523449-ca3925f89dcc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGVqZXJjaWNpbyUyMHByZXNzJTIwbWlsaXRhcnxlbnwwfHwwfHx8MA%3D%3D",
      icono: ""
    },
    {
      nombre: "Brazos",
      img: "https://images.unsplash.com/photo-1641337221253-fdc7237f6b61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWplcmNpY2lvJTIwYnJhem9zfGVufDB8fDB8fHww",
      icono: ""
    },
    {
      nombre: "Core",
      img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWplcmNpY2lvJTIwY29yZXxlbnwwfHwwfHx8MA%3D%3D",
      icono: ""
    }
  ];

  data.forEach(m => {

    const card = document.createElement("div");

    card.className = `muscle-card`;

    card.innerHTML = `
      <img src="${m.img}" alt="${m.nombre}" style="width: 100%; height: 100%; object-fit: cover;">

      <div class="overlay">
        <h3>${m.nombre}</h3>
      </div>
    `;

    card.onclick = () => entrarMusculo(m.nombre);
    cont.appendChild(card);
  });
}

/* ===================== */
/* EJERCICIOS */
/* ===================== */

async function entrarMusculo(musculo){

  musculoActual = musculo;

  ocultarTodo();
  document.getElementById("ejerciciosVista").classList.remove("hidden");

  const tituloElement = document.getElementById("tituloMusculo");
  if(tituloElement) {
    tituloElement.innerText = musculo;
  }

  const lista = document.getElementById("listaEjercicios");
  if(!lista) {
    console.error("Elemento listaEjercicios no encontrado");
    return;
  }
  
  lista.innerHTML = "";

  try {
    const res = await fetch(
      `${API}/entrenamientos/musculo/${musculo}`,
      {headers:{Authorization:`Bearer ${token}`}}
    );

    if(!res.ok) {
      console.error("Error en la respuesta del servidor");
      return;
    }

    const data = await res.json();

    if(!Array.isArray(data)) {
      console.error("Los datos no son un array");
      return;
    }

    data.forEach(e=>{

      const div = document.createElement("div");
      div.className = `
    bg-gray-800 p-5 rounded-xl flex justify-between items-center
    hover:bg-gray-700 transition shadow exercise-item
  `;
      div.innerHTML = `
  <div>
  <b>${e.ejercicio}</b>
  <p class="text-sm text-gray-400">
  ${e.series.length} series
  </p>
  </div>

  <div class="flex gap-2 items-center">

  <button onclick="event.stopPropagation(); editarEjercicio('${e._id}','${e.ejercicio}')"
  class="text-blue-400 hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-500/20 transition" title="Editar">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
  </button>

  <button onclick="event.stopPropagation(); eliminarEjercicio('${e._id}')"
  class="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-500/20 transition" title="Eliminar">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
  </button>

  <span class="text-green-400">➜</span>

  </div>
  `;

      div.onclick = ()=>abrirEjercicio(e._id);

      lista.appendChild(div);
    });

  } catch(error) {
    console.error("Error al obtener ejercicios:", error);
  }
}
/* ===================== */
/* CREAR EJERCICIO */
/* ===================== */

async function crearEjercicio(){

  if(!token){
    alert("❌ No estás autenticado");
    return;
  }

  if(!musculoActual){
    alert("❌ Debes seleccionar un músculo");
    return;
  }

  const nombre = prompt("Nombre del ejercicio:");
  if(!nombre) return;

  try {
    const res = await fetch(`${API}/entrenamientos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ejercicio: nombre,
        musculo: musculoActual
      })
    });

    const data = await res.json();

    if(!res.ok){
      alert("Error: " + (data.msg || "No se pudo crear"));
      return;
    }

    console.log("✅ Ejercicio creado");
    
    // ⭐ IMPORTANTE: Esperar a que se guarde y LUEGO recargar
    setTimeout(async () => {
      // Recargar lista manualmente
      const lista = document.getElementById("listaEjercicios");
      lista.innerHTML = "<p>Cargando...</p>";
      
      const reRes = await fetch(
        `${API}/entrenamientos/musculo/${musculoActual}`,
        {headers:{Authorization:`Bearer ${token}`}}
      );
      
      const nuevosEjercicios = await reRes.json();
      lista.innerHTML = "";
      
      nuevosEjercicios.forEach(e=>{
        const div = document.createElement("div");
        div.className = `bg-gray-800 p-5 rounded-xl flex justify-between items-center hover:bg-gray-700 transition shadow`;
        div.innerHTML = `
          <div>
            <b>${e.ejercicio}</b>
            <p class="text-sm text-gray-400">${e.series.length} series</p>
          </div>
          <div class="flex gap-2 items-center">
            <button onclick="event.stopPropagation(); editarEjercicio('${e._id}','${e.ejercicio}')" class="text-blue-400 hover:text-blue-300">✏️</button>
            <button onclick="event.stopPropagation(); eliminarEjercicio('${e._id}')" class="text-red-400 hover:text-red-300">🗑</button>
            <span class="text-green-400">➜</span>
          </div>
        `;
        div.onclick = ()=>abrirEjercicio(e._id);
        lista.appendChild(div);
      });
    }, 600);

  } catch(error) {
    console.error("❌ Error:", error);
    alert("Error de conexión");
  }
}
/* ===================== */
/* SERIES */
/* ===================== */

async function abrirEjercicio(id){

  ocultarTodo();
  document.getElementById("seriesVista").classList.remove("hidden");

  const res = await fetch(
    `${API}/entrenamientos/${id}`,
    {headers:{Authorization:`Bearer ${token}`}}
  );

  ejercicioActual = await res.json();

  document.getElementById("tituloEjercicio")
    .innerText = ejercicioActual.ejercicio;

  dibujarSeries();
}
async function editarEjercicio(id,nombreActual){

const nuevo = prompt("Nuevo nombre:", nombreActual);
if(!nuevo) return;

await fetch(`${API}/entrenamientos/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({ ejercicio:nuevo })
});

entrarMusculo(musculoActual);
}

function dibujarSeries(){

  const tabla = document.getElementById("tablaSeries");
  tabla.innerHTML = "";

  if(!ejercicioActual || !ejercicioActual.series) return;

  // Agrupar por fecha
  const grupos = {};

  ejercicioActual.series.forEach(s => {

    const fecha = new Date(s.fecha || Date.now())
      .toLocaleDateString("es-AR");

    if(!grupos[fecha]){
      grupos[fecha] = [];
    }

    grupos[fecha].push(s);
  });

  Object.keys(grupos).forEach((fecha,grupoIndex) => {

    // ----- FILA FECHA -----
    const trFecha = document.createElement("tr");
    trFecha.style.cursor = "pointer";
    trFecha.style.background = "#1f2933";

    trFecha.innerHTML = `
      <td colspan="5" style="font-weight:bold;padding:12px;text-align:center;">
        📅 ${fecha}
      </td>
    `;

    tabla.appendChild(trFecha);

    let visible = true;

    // ----- SERIES -----
    grupos[fecha].forEach((s,index)=>{

      const tr = document.createElement("tr");
      tr.classList.add(`grupo-${grupoIndex}`);

      tr.innerHTML = `
        <td style="text-align:center;">${index + 1}</td>

        <td style="text-align:center;" contenteditable="true"
        onblur="editarSerie('${s._id}','reps',this.innerText)">
          ${s.reps}
        </td>

        <td style="text-align:center;" contenteditable="true"
        onblur="editarSerie('${s._id}','peso',this.innerText)">
          ${s.peso}
        </td>

        <td style="text-align:center;" contenteditable="true"
        onblur="editarSerie('${s._id}','rir',this.innerText)">
          ${s.rir ?? ""}
        </td>

        <td style="text-align:center;">
          <button onclick="borrarSerie('${s._id}')" class="text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/20 transition" title="Eliminar serie">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </td>
      `;

      tabla.appendChild(tr);
    });

    // ----- TOGGLE -----
    trFecha.onclick = () => {

      visible = !visible;

      document
        .querySelectorAll(`.grupo-${grupoIndex}`)
        .forEach(fila=>{
          fila.style.display = visible ? "table-row" : "none";
        });

    };

  });

}
async function editarSerie(id,campo,valor){

await fetch(
`${API}/entrenamientos/${ejercicioActual._id}/serie/${id}`,
{
method:"PUT",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({ campo, valor })
}
);

}

function agregarSerie(){

 const reps = prompt("Reps");
const peso = prompt("Peso");
const rir = prompt("RIR (opcional)");

  fetch(`${API}/entrenamientos/${ejercicioActual._id}/serie`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`
    },
    body:JSON.stringify({reps,peso,rir})
  })
  .then(r=>r.json())
  .then(data=>{
    ejercicioActual = data;
    dibujarSeries();
  });
}

function borrarSerie(id){

  fetch(`${API}/entrenamientos/${ejercicioActual._id}/serie/${id}`,{
    method:"DELETE",
    headers:{Authorization:`Bearer ${token}`}
  })
  .then(r=>r.json())
  .then(data=>{
    ejercicioActual = data;
    dibujarSeries();
  });
}

/* ===================== */
/* VOLVER */
/* ===================== */

function volverMusculos(){
  ocultarTodo();
  document.getElementById("musculosVista").classList.remove("hidden");
}

function volverEjercicios(){
  entrarMusculo(musculoActual);
}

async function eliminarEjercicio(id){

if(!confirm("¿Eliminar ejercicio?")) return;

await fetch(`${API}/entrenamientos/${id}`,{
method:"DELETE",
headers:{Authorization:`Bearer ${token}`}
});

entrarMusculo(musculoActual);
}


function filtrarPorFecha(){

const fecha = document.getElementById("selectorFecha").value;

if(!fecha) return;

const cont = document.getElementById("historialFecha");
cont.innerHTML = "";

const filtradas = ejercicioActual.series.filter(s=>{

if(!s.fecha) return false;
return s.fecha.split("T")[0] === fecha;

});

if(!filtradas.length){
cont.innerHTML = "<p>No hay registros ese día</p>";
return;
}

filtradas.forEach(s=>{
const div = document.createElement("div");
div.className = "bg-gray-900 p-3 rounded mb-2";

div.innerText =
`Serie ${s.serie} - ${s.reps} reps - ${s.peso}kg - RIR ${s.rir}`;

cont.appendChild(div);
});

}

function verCalendario(){
  mostrarVista("calendarioVista");
  cargarCalendario();
}
async function cargarCalendario(){

  const cont = document.getElementById("calendario");
  cont.innerHTML = "";

  let entrenamientos = [];

  try {
    // Usar la ruta correcta que ya existe en tu backend
    const res = await fetch(
      `${API}/entrenamientos/musculo/Pecho`,
      {
        headers:{ Authorization:`Bearer ${token}` }
      }
    );

    const pecho = await res.json();
    if(Array.isArray(pecho)) entrenamientos = entrenamientos.concat(pecho);

  } catch(e){
    console.log("Error obteniendo datos", e);
  }

  // Repetir para otros músculos
  const musculos = ["Espalda", "Piernas", "Hombros", "Brazos", "Core"];
  
  for(let musculo of musculos) {
    try {
      const res = await fetch(
        `${API}/entrenamientos/musculo/${musculo}`,
        {
          headers:{ Authorization:`Bearer ${token}` }
        }
      );
      const data = await res.json();
      if(Array.isArray(data)) entrenamientos = entrenamientos.concat(data);
    } catch(e) {
      console.log(`Error obteniendo ${musculo}`, e);
    }
  }

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();

  const primerDia = new Date(año, mes, 1);
  const ultimoDia = new Date(año, mes + 1, 0);

  const totalDias = ultimoDia.getDate();
  const inicioSemana = primerDia.getDay();

  // ===== TÍTULO MES =====
  const titulo = document.createElement("div");
  titulo.className = "col-span-7 text-center font-bold mb-4 text-2xl text-white";
  titulo.innerText = hoy.toLocaleString("es-ES",{ month:"long", year:"numeric"});
  cont.appendChild(titulo);

  // ===== ENCABEZADOS =====
  ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].forEach(d=>{
    const div = document.createElement("div");
    div.className="font-bold text-gray-400 text-center py-3 border-b border-slate-700";
    div.innerText=d;
    cont.appendChild(div);
  });

  // ===== VACÍOS =====
  for(let i=0;i<inicioSemana;i++){
    const empty = document.createElement("div");
    empty.className = "bg-slate-900/50 min-h-24";
    cont.appendChild(empty);
  }

  // ===== DÍAS =====
  for(let d=1; d<=totalDias; d++){

    const fecha = new Date(año, mes, d);
    const fechaString = fecha.toISOString().split("T")[0];
    
    // Buscar entrenamientos de este día
    const musculosDelDia = new Set();
    const ejerciciosDelDia = [];
    
    entrenamientos.forEach(e => {
      if(e.series && e.series.length > 0) {
        e.series.forEach(s => {
          if(s.fecha) {
            const fechaSerie = new Date(s.fecha).toISOString().split("T")[0];
            if(fechaSerie === fechaString) {
              musculosDelDia.add(e.musculo);
              ejerciciosDelDia.push({
                ejercicio: e.ejercicio,
                musculo: e.musculo,
                serie: s
              });
            }
          }
        });
      }
    });

    const tieneEntrenamiento = musculosDelDia.size > 0;
    const musculos = Array.from(musculosDelDia);

    const div = document.createElement("div");

    div.className = `
      min-h-24 p-3 rounded-lg cursor-pointer transition-all border
      ${tieneEntrenamiento 
        ? "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50 hover:from-green-500/30 hover:to-green-600/30" 
        : "bg-slate-900/50 border-slate-700 hover:bg-slate-800"}
    `;

    // Número del día
    const numDia = document.createElement("div");
    numDia.className = `text-lg font-bold ${tieneEntrenamiento ? "text-green-400" : "text-gray-400"} mb-2`;
    numDia.innerText = d;
    div.appendChild(numDia);

    // Músculos del día
    if(tieneEntrenamiento) {
      const musculosDiv = document.createElement("div");
      musculosDiv.className = "space-y-1";
      
      musculos.forEach(musculo => {
        const badge = document.createElement("div");
        badge.className = "text-xs bg-green-600/60 text-white px-2 py-1 rounded font-semibold line-clamp-1";
        badge.innerText = musculo;
        musculosDiv.appendChild(badge);
      });
      
      div.appendChild(musculosDiv);
    } else {
      const vacio = document.createElement("div");
      vacio.className = "text-xs text-gray-500 italic";
      vacio.innerText = "Descanso";
      div.appendChild(vacio);
    }

    // Click para ver detalles
    if(tieneEntrenamiento) {
      div.onclick = () => {
        mostrarDetallesDelDia(fecha, ejerciciosDelDia);
      };
    }

    cont.appendChild(div);
  }
}

// Función para mostrar detalles del día
function mostrarDetallesDelDia(fecha, ejerciciosDelDia) {
  
  // Agrupar por ejercicio
  const ejerciciosAgrupados = {};
  
  ejerciciosDelDia.forEach(item => {
    if(!ejerciciosAgrupados[item.ejercicio]) {
      ejerciciosAgrupados[item.ejercicio] = {
        musculo: item.musculo,
        series: []
      };
    }
    ejerciciosAgrupados[item.ejercicio].series.push(item.serie);
  });

  const fechaFormato = fecha.toLocaleDateString("es-ES", { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let contenido = `
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onclick="this.remove()">
      <div class="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 max-w-3xl w-full border border-slate-700 shadow-2xl" onclick="event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
          <div>
            <h3 class="text-4xl font-bold text-white mb-3">Entrenamiento del Día</h3>
            <p class="text-lg text-gray-400 capitalize font-semibold">${fechaFormato}</p>
          </div>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-gray-500 hover:text-white text-3xl font-light transition">×</button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-5 backdrop-filter backdrop-blur-lg">
            <p class="text-gray-400 text-sm font-semibold mb-2">Ejercicios</p>
            <p class="text-4xl font-bold text-blue-400">${Object.keys(ejerciciosAgrupados).length}</p>
          </div>
          <div class="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-5 backdrop-filter backdrop-blur-lg">
            <p class="text-gray-400 text-sm font-semibold mb-2">Series Totales</p>
            <p class="text-4xl font-bold text-green-400">${ejerciciosDelDia.length}</p>
          </div>
        </div>

        <!-- Entrenamientos -->
        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-3 custom-scroll">
  `;

  Object.entries(ejerciciosAgrupados).forEach(([ejercicio, data]) => {
    let totalReps = 0;
    let totalPeso = 0;
    
    data.series.forEach(s => {
      totalReps += parseInt(s.reps) || 0;
      totalPeso += parseInt(s.peso) || 0;
    });

    contenido += `
      <div class="bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition">
        
        <!-- Título del Ejercicio -->
        <div class="bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-blue-600/15 px-6 py-4 border-b border-slate-700">
          <h4 class="font-bold text-xl text-white mb-2">${ejercicio}</h4>
          <div class="flex gap-3 flex-wrap">
            <span class="inline-block bg-slate-700/80 text-gray-200 px-3 py-1 rounded-lg text-xs font-semibold">
              ${data.musculo}
            </span>
          </div>
        </div>

        <!-- Series -->
        <div class="p-6 space-y-3">
    `;

    data.series.forEach((s, idx) => {
      contenido += `
        <div class="flex justify-between items-center bg-slate-900/50 hover:bg-slate-900/80 px-4 py-3 rounded-lg border border-slate-700/50 transition">
          <div>
            <span class="text-gray-400 text-sm font-semibold">Serie ${idx + 1}</span>
          </div>
          <div class="flex gap-6">
            <div class="text-center">
              <p class="text-gray-500 text-xs uppercase tracking-wider">Reps</p>
              <p class="text-blue-400 text-lg font-bold">${s.reps}</p>
            </div>
            <div class="text-center">
              <p class="text-gray-500 text-xs uppercase tracking-wider">Peso</p>
              <p class="text-green-400 text-lg font-bold">${s.peso} kg</p>
            </div>
            ${s.rir ? `
            <div class="text-center">
              <p class="text-gray-500 text-xs uppercase tracking-wider">RIR</p>
              <p class="text-yellow-400 text-lg font-bold">${s.rir}</p>
            </div>
            ` : ''}
          </div>
        </div>
      `;
    });

    contenido += `
        </div>

        <!-- Totales del Ejercicio -->
        <div class="bg-slate-900/70 border-t border-slate-700 px-6 py-4 flex justify-end gap-8">
          <div class="text-right">
            <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Reps Totales</p>
            <p class="text-blue-400 text-2xl font-bold">${totalReps}</p>
          </div>
         <div class="text-right">
            <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Series</p>
            <p class="text-orange-400 text-2xl font-bold">${data.series.length}</p>
          </div>
        </div>

      </div>
    `;
  });

  contenido += `
        </div>

        <!-- Botón cerrar -->
        <button onclick="this.parentElement.parentElement.remove()" class="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-bold text-base transition-all transform hover:scale-105 active:scale-95">
          Cerrar
        </button>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', contenido);
}

function volverCalendario(){
  mostrarVista("musculosVista");
}
function mostrarVista(id){

  const vistas = [
    "auth",
    "musculosVista",
    "ejerciciosVista",
    "seriesVista",
    "calendarioVista",
    "dashboardVista"
  ];

  vistas.forEach(v=>{
    const el = document.getElementById(v);
    if(el) el.classList.add("hidden");
  });

  const activa = document.getElementById(id);
  if(activa) activa.classList.remove("hidden");
}

function dibujarGraficoPeso(datos){

  if(graficoPeso) graficoPeso.destroy();

  graficoPeso = new Chart(document.getElementById("graficoPeso"),{
    type:"line",
    data:{
      labels: datos.map(d=>d.fecha),
      datasets:[{
        label:"Peso Total",
        data: datos.map(d=>d.total),
        borderColor:"#22c55e",
        backgroundColor:"rgba(34,197,94,.2)",
        tension:.4
      }]
    }
  });
}

function dibujarGraficoMusculo(datos){

  if(graficoMusculo) graficoMusculo.destroy();

  graficoMusculo = new Chart(document.getElementById("graficoMusculo"),{
    type:"pie",
    data:{
      labels:Object.keys(datos),
      datasets:[{
        data:Object.values(datos),
        backgroundColor:[
          "#22c55e",
          "#3b82f6",
          "#facc15",
          "#f97316",
          "#ef4444"
        ]
      }]
    }
  });
}
async function verDashboard() {

  mostrarVista("dashboardVista");

  try {
    // Obtener todos los entrenamientos del usuario
    const res = await fetch(`${API}/entrenamientos/historial`, { 
      headers: { Authorization: `Bearer ${token}` }
    });

    const historial = await res.json();

    if (!Array.isArray(historial)) {
      console.error("Historial inválido");
      return;
    }

    // El historial solo tiene fechas, necesitamos obtener todos los ejercicios
    const resEjercicios = await fetch(`${API}/entrenamientos/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await resEjercicios.json();

    // Si no hay data, mostrar valores en 0
    if (!data) {
      document.getElementById("totalEjercicios").innerText = 0;
      document.getElementById("totalSeries").innerText = 0;
      document.getElementById("pesoMaximo").innerText = "0 kg";
      document.getElementById("promedioRir").innerText = 0;
      return;
    }

    document.getElementById("totalEjercicios").innerText = data.totalEntrenamientos || 0;
    document.getElementById("totalSeries").innerText = data.totalSeries || 0;
    document.getElementById("pesoMaximo").innerText = (data.pesoMaximo || 0) + " kg";
    document.getElementById("promedioRir").innerText = data.repsPromedio || 0;

    // 🔥 GRÁFICO PESO
    const pesoPorFecha = data.progresoPeso || [];
    new Chart(document.getElementById("graficoPeso"), {
      type: "line",
      data: {
        labels: pesoPorFecha.map(p => p.fecha),
        datasets: [{
          label: "Peso Total",
          data: pesoPorFecha.map(p => p.total),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,.2)",
          borderWidth: 2,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });

    // 🔥 GRÁFICO SERIES
    const distribucion = data.distribucionMusculo || {};
    new Chart(document.getElementById("graficoSeries"), {
      type: "bar",
      data: {
        labels: Object.keys(distribucion),
        datasets: [{
          label: "Series por Músculo",
          data: Object.values(distribucion),
          backgroundColor: "#3b82f6"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });

  } catch(error) {
    console.error("Error en dashboard:", error);
    alert("Error al cargar el dashboard");
  }
}

window.verDashboard = verDashboard;
window.verCalendario = verCalendario;
window.login = login;
window.crearEjercicio = crearEjercicio;
window.entrarMusculo = entrarMusculo;
window.abrirEjercicio = abrirEjercicio;