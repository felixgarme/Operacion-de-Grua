// Referencias iniciales
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');
const dropdownBtns = document.querySelectorAll('.dropdown-btn');

// Inicializar el sidebar al cargar el DOM
document.addEventListener('DOMContentLoaded', initSidebar);

function initSidebar() {
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            handleSubmenuToggle(this);
        });
    });
}

// Abrir/cerrar el sidebar
function toggleSidebar() {
    sidebar.classList.toggle('close');
    if (sidebar.classList.contains('close')) {
        closeAllSubmenus();
    } else {
        highlightActiveMenu();
    }
}

// Alternar submenú
function handleSubmenuToggle(button) {
    if (sidebar.classList.contains('close')) {
        sidebar.classList.remove('close');
    }
    const submenu = button.nextElementSibling;
    if (!submenu || !submenu.classList.contains('sub-menu')) return;

    submenu.classList.toggle('show');
    button.classList.toggle('active');
}

// Cerrar todos los submenús
function closeAllSubmenus() {
    document.querySelectorAll('.sub-menu.show').forEach(menu => menu.classList.remove('show'));
    document.querySelectorAll('.dropdown-btn.active').forEach(btn => btn.classList.remove('active'));
}

// Inicializar menú dinámico
function initializeMenu() {
    setTimeout(() => {
        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("toggle-btn");
        const dropdownBtns = document.querySelectorAll(".dropdown-btn");

        if (!sidebar || !toggleBtn || dropdownBtns.length === 0) {
            console.error("No se encontraron elementos del menú.");
            return;
        }

        toggleBtn.addEventListener("click", function () {
            toggleSidebar(sidebar);
        });

        dropdownBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                handleSubmenuToggle(this, sidebar);
            });
        });
    }, 100);
}

// Abrir/cerrar el sidebar con primer menú expandido
function toggleSidebar(sidebar) {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        closeAllSubmenus();
    } else {
        const firstDropdownBtn = document.querySelector('.dropdown-btn[data-level="1"]');
        if (firstDropdownBtn) {
            const submenu = firstDropdownBtn.nextElementSibling;
            if (submenu && submenu.classList.contains('sub-menu')) {
                submenu.classList.add('show');
                firstDropdownBtn.classList.add('active');
            }
        }
        highlightActiveMenu();
    }
}

// Alternar submenú con sidebar dinámico
function handleSubmenuToggle(button, sidebar) {
    if (sidebar.classList.contains("close")) {
        sidebar.classList.remove("close");
    }
    const submenu = button.nextElementSibling;
    if (!submenu || !submenu.classList.contains("sub-menu")) return;

    submenu.classList.toggle("show");
    button.classList.toggle("active");
}

// Resaltar y abrir el menú activo según URL
function highlightActiveMenu() {
    const links = document.querySelectorAll(".menu-link");
    const currentPath = window.location.pathname.split("/").pop();

    links.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
            let currentElement = link.closest("ul.sub-menu");

            while (currentElement) {
                if (!currentElement.parentElement.closest("ul.sub-menu")) break;
                currentElement.classList.add("show");

                const parentButton = currentElement.previousElementSibling;
                if (parentButton && parentButton.classList.contains("dropdown-btn")) {
                    parentButton.classList.add("active");
                }
                currentElement = currentElement.parentElement.closest("ul.sub-menu");
            }
            link.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Forzar inicio de video en segundo específico
function startVideoAtSecond() {
    const video = document.getElementById('video_1');
    const startTime = 10;
    if (video) {
        video.addEventListener('loadedmetadata', function () {
            video.currentTime = startTime;
        });
        video.load();
        video.play();
    }
}

// Cargar menú dinámico y asignar eventos
document.addEventListener("DOMContentLoaded", function () {
    function cargarMenu(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("No encontrado");
                return response.text();
            });
    }

    cargarMenu("sidebar.html")
        .catch(() => cargarMenu("../sidebar.html")) // fallback si no existe en la ruta actual
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
            initializeMenu();

            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                sidebar.style.maxHeight = "100vh";
                sidebar.style.overflowY = "auto";
            }
            highlightActiveMenu();
        })
        .catch(error => console.error("Error al cargar el menú:", error));
});


// Ajustar botón "volver" según el sidebar
document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.querySelector('.back-page-btn');
    const sidebar = document.getElementById('sidebar');

    function actualizarEstilos() {
        backButton.style.left = `${sidebar.offsetWidth}px`;
        if (sidebar.classList.contains('close')) {
            backButton.style.height = `${sidebar.offsetHeight}px`;
        } else {
            backButton.style.height = '';
        }
    }

    actualizarEstilos();
    sidebar.addEventListener('transitionend', actualizarEstilos);

    const toggleButton = document.querySelector('#sidebar-toggle-button');
    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('close');
        actualizarEstilos();
    });
});
