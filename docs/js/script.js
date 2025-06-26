document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMENTOS DEL DOM ---
    const loginSection = document.getElementById('login-section');
    const appSection = document.getElementById('app-section');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const welcomeUser = document.getElementById('welcome-user');
    const loginError = document.getElementById('login-error');
    
    // --- BASE DE DATOS SIMULADA ---
    const users = {
        "8.888.888-8": { password: "gerente", name: "Carlos Gerente", role: "gerente" },
        "9.999.999-9": { password: "operador", name: "Ana Operadora", role: "operador" },
        "15.888.777-K": { password: "pasajero", name: "Sofía Castro", role: "pasajero" }
    };

    const menuConfig = {
        gerente: [
            { id: 'dashboard', icon: 'house-door-fill', text: 'Panel Principal' },
            { id: 'salida-menores', icon: 'person-vcard-fill', text: 'Validación Menores (R.3)' },
            { id: 'control-sag-pdi', icon: 'pc-display-horizontal', text: 'Monitor SAG/PDI (R.5)' }
        ],
        operador: [
            { id: 'dashboard', icon: 'house-door-fill', text: 'Panel Principal' },
            { id: 'salida-menores', icon: 'person-vcard-fill', text: 'Validación Menores (R.3)' },
            { id: 'control-sag-pdi', icon: 'pc-display-horizontal', text: 'Control SAG/PDI (R.5)' },
            { id: 'validacion-mascotas', icon: 'file-earmark-check-fill', text: 'Validación Mascotas (R.8)' }
        ],
        pasajero: [
            { id: 'dashboard', icon: 'house-door-fill', text: 'Mis Trámites' },
            { id: 'consulta-tramite', icon: 'search', text: 'Consultar Trámite (R.7)' },
            { id: 'declaracion-alimentos', icon: 'apple', text: 'Declaración Alimentos (R.9)' }
        ]
    };
    
    let currentUser = null;

    // --- LÓGICA DE LOGIN ---
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;
        loginError.classList.add('d-none');

        const user = users[username];
        if (user && user.password === password) {
            currentUser = user;
            loginSection.classList.add('d-none');
            appSection.classList.remove('d-none');
            setupAppForUser(user);
        } else {
            loginError.classList.remove('d-none');
        }
    });

    // --- LÓGICA DE LOGOUT ---
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        currentUser = null;
        appSection.classList.add('d-none');
        loginSection.classList.remove('d-none');
        document.getElementById('login-form').reset();
    });

    // --- CONFIGURACIÓN DE LA APP SEGÚN EL ROL ---
    function setupAppForUser(user) {
        welcomeUser.textContent = `Bienvenido, ${user.name}`;
        generateSidebarMenu(user.role);
        navigateTo('dashboard');
    }

    function generateSidebarMenu(role) {
        const menuItems = menuConfig[role];
        sidebarMenu.innerHTML = ''; // Limpiar menú anterior
        
        const headingText = role.charAt(0).toUpperCase() + role.slice(1); // Capitalize role
        const heading = `<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"><span>${headingText}</span></h6>`;
        const list = document.createElement('ul');
        list.className = 'nav flex-column';

        menuItems.forEach(item => {
            list.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" href="#" data-target="${item.id}">
                        <i class="bi bi-${item.icon}"></i>${item.text}
                    </a>
                </li>`;
        });
        sidebarMenu.innerHTML = heading;
        sidebarMenu.appendChild(list);

        // Añadir listeners a los nuevos links del menú
        document.querySelectorAll('#sidebar .nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                navigateTo(targetId);
            });
        });
    }

    // --- NAVEGACIÓN SPA ---
    function navigateTo(targetId) {
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        document.querySelectorAll('#sidebar .nav-link').forEach(link => link.classList.remove('active'));
        
        document.getElementById(targetId)?.classList.add('active');
        document.querySelector(`.nav-link[data-target="${targetId}"]`)?.classList.add('active');
    }

    // --- INTERACTIVIDAD ESPECÍFICA DE PANTALLAS ---

    // 1. Consulta de Trámite Mejorada (R.7)
    const consultarTramiteBtn = document.getElementById('consultar-tramite-btn');
    const tramiteCodeInput = document.getElementById('tramite-code-input');
    const tramiteResultDiv = document.getElementById('tramite-result');
    const tramiteNotFoundDiv = document.getElementById('tramite-not-found');
    const tramiteHeader = document.getElementById('tramite-header');
    const tramiteTimeline = document.getElementById('tramite-timeline');

    const tramitesDB = {
        "CHL-2024-12345": {
            title: "Trámite de Ingreso Vehicular para: Ana Operadora",
            timeline: [
                { status: 'success', icon: 'check-lg', title: 'Inicio de Trámite Digital', text: 'Declaración recibida.', time: 'Ayer 10:00' },
                { status: 'success', icon: 'check-lg', title: 'Validación Migratoria (PDI)', text: 'Pasajeros validados.', time: 'Ayer 10:30' },
                { status: 'active', icon: 'arrow-clockwise', title: 'Revisión Aduanera', text: 'En espera de inspección fiscal.', time: 'Hoy 09:15' },
                { status: 'pending', icon: 'hourglass-split', title: 'Finalización del Proceso', text: 'Pendiente.', time: '' }
            ]
        },
        "CHL-2024-67890": {
            title: "Trámite de Declaración SAG para: Sofía Castro",
            timeline: [
                { status: 'success', icon: 'check-lg', title: 'Declaración Jurada Recibida', text: 'Pasajero declara no portar productos.', time: '18/10/2024 14:00' },
                { status: 'success', icon: 'check-lg', title: 'Inspección Aleatoria', text: 'No seleccionado para inspección física.', time: '18/10/2024 14:05' },
                { status: 'success', icon: 'check-lg', title: 'Trámite Finalizado', text: 'Proceso completado exitosamente.', time: '18/10/2024 14:06' }
            ]
        },
        "CHL-2024-55555": {
            title: "Trámite de Ingreso Mascota para: Carlos Gerente",
            timeline: [
                { status: 'success', icon: 'check-lg', title: 'Documentación Recibida', text: 'CZE y Vacunas cargadas.', time: '17/10/2024 11:00' },
                { status: 'danger', icon: 'x-lg', title: 'Validación SAG Rechazada', text: 'Certificado de vacuna antirrábica vencido. Requiere acción.', time: '17/10/2024 11:30' },
                { status: 'pending', icon: 'hourglass-split', title: 'Inspección Física', text: 'Pendiente de resolución documental.', time: '' }
            ]
        }
    };

    consultarTramiteBtn.addEventListener('click', () => {
        const code = tramiteCodeInput.value.trim().toUpperCase();
        const tramite = tramitesDB[code];

        tramiteResultDiv.classList.add('d-none');
        tramiteNotFoundDiv.classList.add('d-none');
        
        if (tramite) {
            tramiteHeader.textContent = `Resultado para: ${code}`;
            tramiteTimeline.innerHTML = `<h5 class="mb-3">${tramite.title}</h5>`;
            tramite.timeline.forEach(item => {
                const statusClass = { success: 'bg-success', active: 'bg-primary', pending: 'bg-secondary', danger: 'bg-danger' }[item.status];
                tramiteTimeline.innerHTML += `
                    <div class="timeline-item ${item.status}">
                        <div class="timeline-icon ${statusClass}"><i class="bi bi-${item.icon}"></i></div>
                        <div class="timeline-content">
                            <strong>${item.title}</strong>
                            <p>${item.text} <small class="text-muted">${item.time}</small></p>
                        </div>
                    </div>`;
            });
            tramiteResultDiv.classList.remove('d-none');
        } else {
            tramiteNotFoundDiv.classList.remove('d-none');
        }
    });

    // 2. Switch en Declaración Jurada (R.9)
    const declaraSwitch = document.getElementById('declaraProductos');
    const detalleDiv = document.getElementById('detalle-productos');
    if(declaraSwitch) {
        declaraSwitch.addEventListener('change', function() {
            detalleDiv.classList.toggle('d-none', !this.checked);
        });
    }
});