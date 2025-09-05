// Referencias a elementos del DOM
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');
const dropdownBtns = document.querySelectorAll('.dropdown-btn');

// Inicializar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initSidebar);

function initSidebar() {
    // Configurar el evento de toggle del sidebar
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }

    // Configurar los eventos para todos los botones desplegables
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            handleSubmenuToggle(this);
        });
    });
}

// Función para abrir/cerrar el sidebar
function toggleSidebar() {
    sidebar.classList.toggle('close');

    // Cerrar todos los submenús cuando se cierra el sidebar
    if (sidebar.classList.contains('close')) {
        closeAllSubmenus();
    }
    else {
        // Solo cuando se abre el sidebar, resaltar y mostrar menús activos
        highlightActiveMenu();
    }
}

// Función para manejar el clic en un botón de submenú
function handleSubmenuToggle(button) {
    // Si el sidebar está cerrado, abrirlo primero
    if (sidebar.classList.contains('close')) {
        sidebar.classList.remove('close');
    }

    // Obtener el submenú asociado al botón
    const submenu = button.nextElementSibling;

    // Si no hay submenú (es un enlace final), simplemente retornar
    if (!submenu || !submenu.classList.contains('sub-menu')) {
        return;
    }

    // Obtener el nivel de profundidad
    const level = button.getAttribute('data-level');

    // Si el submenú se está abriendo, asegurarse de que su contenido tenga altura
    if (submenu.classList.contains('show')) {
        // Asegurarse de que los elementos dentro del submenú tengan altura suficiente
        // Esto es importante para la animación grid-template-rows
        const submenuContent = submenu.querySelector('div') || submenu;
        if (submenuContent) {
            submenuContent.style.height = 'auto';
        }
    }

    // Alternar visibilidad del submenú actual
    submenu.classList.toggle('show');
    button.classList.toggle('active');
}

// Función para cerrar todos los submenús
function closeAllSubmenus() {
    const openMenus = document.querySelectorAll('.sub-menu.show');
    const activeButtons = document.querySelectorAll('.dropdown-btn.active');

    openMenus.forEach(menu => menu.classList.remove('show'));
    activeButtons.forEach(btn => btn.classList.remove('active'));
}

function initializeMenu() {
    // Esperar a que el menú dinámico se cargue completamente
    setTimeout(() => {
        // Seleccionar elementos dentro del menú cargado dinámicamente
        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("toggle-btn");
        const dropdownBtns = document.querySelectorAll(".dropdown-btn");

        // Verificar que los elementos existen antes de asignar eventos
        if (!sidebar || !toggleBtn || dropdownBtns.length === 0) {
            console.error("No se encontraron elementos del menú. Verifica el HTML.");
            return;
        }

        // Asignar evento para el botón de toggle del sidebar
        toggleBtn.addEventListener("click", function () {
            toggleSidebar(sidebar);
        });

        // Asignar eventos a los botones de submenú
        dropdownBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                handleSubmenuToggle(this, sidebar);
            });
        });

        // console.log("Eventos del menú asignados correctamente.");
    }, 100); // Esperar 100ms para asegurar que el HTML esté cargado
}

// Función para abrir/cerrar el sidebar
function toggleSidebar(sidebar) {
    sidebar.classList.toggle("close");

    // Cerrar todos los submenús cuando se cierra el sidebar
    if (sidebar.classList.contains("close")) {
        closeAllSubmenus();
    }
    else {
        // Abrir automáticamente el primer menú padre al expandir el sidebar
        const firstDropdownBtn = document.querySelector('.dropdown-btn[data-level="1"]');
        if (firstDropdownBtn) {
            const submenu = firstDropdownBtn.nextElementSibling;
            if (submenu && submenu.classList.contains('sub-menu')) {
                submenu.classList.add('show');
                firstDropdownBtn.classList.add('active');
            }
        }
        // Solo cuando se abre el sidebar, resaltar y mostrar menús activos
        highlightActiveMenu();
    }
}

// Función para manejar el clic en un botón de submenú
function handleSubmenuToggle(button, sidebar) {
    // Si el sidebar está cerrado, abrirlo primero
    if (sidebar.classList.contains("close")) {
        sidebar.classList.remove("close");
    }

    // Obtener el submenú asociado al botón
    const submenu = button.nextElementSibling;

    // Si no hay submenú (es un enlace final), simplemente retornar
    if (!submenu || !submenu.classList.contains("sub-menu")) {
        return;
    }

    // Alternar visibilidad del submenú actual
    submenu.classList.toggle("show");
    button.classList.toggle("active");
}

// Función para cerrar todos los submenús
function closeAllSubmenus() {
    const openMenus = document.querySelectorAll(".sub-menu.show");
    const activeButtons = document.querySelectorAll(".dropdown-btn.active");

    openMenus.forEach(menu => menu.classList.remove("show"));
    activeButtons.forEach(btn => btn.classList.remove("active"));
}

function highlightActiveMenu() {

    const links = document.querySelectorAll(".menu-link");
    const currentPath = window.location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");

            let currentElement = link.closest("ul.sub-menu");

            while (currentElement) {
                if (!currentElement.parentElement.closest("ul.sub-menu")) {
                    break;
                }
                currentElement.classList.add("show");

                const parentButton = currentElement.previousElementSibling;
                if (parentButton && parentButton.classList.contains("dropdown-btn")) {
                    parentButton.classList.add("active");
                    // parentButton.style.color = "#ffffff";
                    // parentButton.style.background = "#000000";
                }


                currentElement = currentElement.parentElement.closest("ul.sub-menu");

            }

            // Opcional: asegurarse de que el link esté visible
            link.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// function initializeLessonProgress() {
//     const lessonLinks = document.querySelectorAll(".menu-item a"); // Todos los enlaces de lecciones
//     const totalLessons = lessonLinks.length; // Número total de lecciones
//     const progressBar = document.getElementById("progress-bar");
//     const progressText = document.getElementById("progress-text");

//     // Usamos una clave única para almacenar el progreso global
//     const progressKey = "completedLessons_global"; 

//     // Cargar progreso almacenado de manera global
//     let completedLessons = new Set(JSON.parse(localStorage.getItem(progressKey)) || []);

//     // Función para actualizar el progreso
//     function updateProgress() {
//         const progress = (completedLessons.size / totalLessons) * 100;
//         progressBar.style.width = progress + "%";
//         progressText.textContent = `${Math.round(progress)}%`;
//     }

//     // Marcar como completadas las lecciones ya almacenadas
//     lessonLinks.forEach(link => {
//         const lessonId = link.getAttribute("href");

//         if (completedLessons.has(lessonId)) {
//             link.style.color = "green"; // Cambia el color para indicar que está completada
//         }

//         link.addEventListener("click", () => {
//             completedLessons.add(lessonId);
//             localStorage.setItem(progressKey, JSON.stringify([...completedLessons]));
//             updateProgress();
//         });
//     });

//     // Sincronizar progreso entre versiones
//     window.addEventListener("storage", function (event) {
//         if (event.key === progressKey) {
//             completedLessons = new Set(JSON.parse(event.newValue) || []);
//             updateProgress();
//         }
//     });

//     // Actualizar progreso al cargar la página
//     updateProgress();
// }


function startVideoAtSecond() {
    const video = document.getElementById('video_1');
    const startTime = 10; // Cambia esto al segundo exacto donde quieres que inicie
    if (video) {
        video.addEventListener('loadedmetadata', function () {
            video.currentTime = startTime; // Ajusta el tiempo de inicio

        });
        video.load();
        video.play();
    }
}


// Cargar el menú dinámicamente y volver a asignar los eventos
document.addEventListener("DOMContentLoaded", function () {
    fetch("sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
            initializeMenu(); // Reasignar eventos

            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                sidebar.style.maxHeight = "100vh";
                sidebar.style.overflowY = "auto"; // Reforzar el scroll
            }
            // initializeLessonProgress();
            highlightActiveMenu();
            // startVideoAtSecond();
        })
        .catch(error => console.error("Error al cargar el menú:", error));
});

//manejo de la posicion para el boton volver
document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.querySelector('.back-page-btn');
    const sidebar = document.getElementById('sidebar');

    function actualizarEstilos() {
        backButton.style.left = `${sidebar.offsetWidth}px`;

        if (sidebar.classList.contains('close')) {
            backButton.style.height = `${sidebar.offsetHeight}px`;
        } else {
            backButton.style.height = ''; // Altura por defecto
        }
    }

    // Ejecutar al inicio para que se vea desde el principio
    actualizarEstilos();

    sidebar.addEventListener('transitionend', actualizarEstilos);

    const toggleButton = document.querySelector('#sidebar-toggle-button');
    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('close');
        actualizarEstilos();
    });
});