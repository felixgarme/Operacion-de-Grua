// SCORM.js

class ScormManager {
  static init() {
    if (typeof API !== "undefined") {
      API.LMSInitialize("");
      API.LMSSetValue("cmi.lesson_status", "incomplete");
      API.LMSCommit("");
    } 
    // else {
    //   console.log("SCORM no disponible. Modo web.");
    // }
  }

  static guardarProgreso(pagina) {
    // Remover 'views/' del inicio de la ruta si existe
    pagina = pagina.replace('views/', '');
    
    const paginasCurso = ScormManager.paginasCurso;
    const paginaIndex = paginasCurso.indexOf(pagina);

    if (paginaIndex === -1) {
      console.warn("Página no registrada en el curso:", pagina);
      return;
    }

    const porcentaje = Math.round(((paginaIndex + 1) / paginasCurso.length) * 100);

    if (typeof API !== "undefined") {
      API.LMSSetValue("cmi.core.lesson_location", pagina);
      API.LMSSetValue("cmi.core.score.raw", porcentaje.toString());
      if (porcentaje === 100) {
        API.LMSSetValue("cmi.lesson_status", "completed");
      }
      API.LMSCommit("");
    } else {
      localStorage.setItem("ultimaPagina", pagina);
      localStorage.setItem("porcentaje", porcentaje);
    }

    // Actualizar la barra de progreso visual
    const barra = document.getElementById("progreso-barra");
    const texto = document.getElementById("progreso-texto");
    if (barra && texto) {
      barra.style.width = porcentaje + "%";
      texto.textContent = porcentaje + "%";
    }

    // console.log(`✅ Progreso guardado: ${porcentaje}% (${pagina})`);
  }

  static cargarProgreso() {
    if (typeof API !== "undefined") {
      const pagina = API.LMSGetValue("cmi.core.lesson_location");
      const score = API.LMSGetValue("cmi.core.score.raw");
      return { ultimaPagina: pagina, score };
    } else {
      const pagina = localStorage.getItem("ultimaPagina");
      const score = localStorage.getItem("porcentaje");
      return { ultimaPagina: pagina, score };
    }
  }
}

// 👉 Lista actualizada de páginas del curso según el menú actual
ScormManager.paginasCurso = [

  // Módulo 1
  "M1_inicio.html",
  "M1_pg1.html",
  "M1_pg2.html",
  "M1_pg3.html",
  "M1_pg4.html",
  "M1_pg5.html",

  // Módulo 2
  "M2_inicio.html",
  "M2_pg1.html",
  "M2_pg2.html",
  "M2_pg3.html",
  "M2_pg4.html",
  "M2_pg5.html",
  "M2_pg6.html",
  "M2_pg7.html",
  "M2_pg8.html",
  "M2_pg9.html",
  "M2_pg10.html",

  // Módulo 4
  "M4_inicio.html",
  "M4_pg1.html",
  "M4_pg2.html",
  
  // Módulo 3
  "M3_inicio.html",
  "M3_pg1.html",

  // Módulo 5
  "M5_inicio.html",
  "M5_pg1.html",

];

// 👉 Lo hace accesible globalmente
window.ScormManager = ScormManager;
