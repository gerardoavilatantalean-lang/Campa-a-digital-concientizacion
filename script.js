// =====================
// SMOOTH SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =====================
// DESPLEGAR PROPUESTAS
// =====================
function toggleInfo(id) {
    const infoBox = document.getElementById(id);
    const propuesta = infoBox.closest('.propuesta');
    const icon = propuesta.querySelector('.toggle-icon');
    
    // Cerrar todas las demás propuestas
    document.querySelectorAll('.info').forEach(info => {
        if (info.id !== id && info.style.display === 'block') {
            info.style.display = 'none';
            const otherIcon = info.closest('.propuesta').querySelector('.toggle-icon');
            if (otherIcon) otherIcon.textContent = '▼';
        }
    });
    
    // Alternar la propuesta actual
    if (infoBox.style.display === 'block') {
        infoBox.style.display = 'none';
        icon.textContent = '▼';
    } else {
        infoBox.style.display = 'block';
        icon.textContent = '▲';
    }
}

// =====================
// ANIMACIONES AL SCROLL
// =====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.querySelectorAll('.problema-card, .video-card, .propuesta, .recurso-card, .contacto-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// =====================
// ASISTENTE VIRTUAL
// =====================
const botButton = document.getElementById("bot-button");
const botWindow = document.getElementById("bot-window");
const botClose = document.getElementById("bot-close");
const botSend = document.getElementById("bot-send");
const botInput = document.getElementById("bot-input");
const botChat = document.getElementById("bot-chat");

// Abrir chatbot
botButton.addEventListener("click", () => {
    botWindow.style.display = "flex";
    botButton.style.display = "none";
    botInput.focus();
});

// Cerrar chatbot
botClose.addEventListener("click", () => {
    botWindow.style.display = "none";
    botButton.style.display = "flex";
});

// Enviar mensaje
botSend.addEventListener("click", sendMessage);
botInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Función para enviar mensaje
function sendMessage() {
    let text = botInput.value.trim();
    if (text === "") return;
    
    addMessage("user", text);
    botInput.value = "";
    
    // Simular "escribiendo..."
    setTimeout(() => {
        const response = generateResponse(text);
        addMessage("bot", response);
    }, 800);
}

// Función para sugerencias rápidas
function sendSuggestion(text) {
    botInput.value = text;
    sendMessage();
}

// Agregar mensaje al chat
function addMessage(sender, message) {
    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    
    if (sender === "bot") {
        bubble.classList.add("bot-bubble");
        bubble.innerHTML = `<strong>Asistente:</strong> ${message}`;
    } else {
        bubble.innerHTML = `<strong>Tú:</strong> ${message}`;
    }
    
    botChat.appendChild(bubble);
    botChat.scrollTop = botChat.scrollHeight;
}

// Generar respuesta del bot (MEJORADO)
function generateResponse(msg) {
    msg = msg.toLowerCase();
    
    // Saludos
    if (msg.includes("hola") || msg.includes("buenas") || msg.includes("hey")) {
        return "¡Hola! 👋 Bienvenido a nuestra campaña de ciudadanía digital. ¿En qué puedo ayudarte hoy? Puedo orientarte sobre ciberacoso, privacidad, propuestas o recursos.";
    }
    
    // Ciberacoso
    if (msg.includes("ciberacoso") || msg.includes("acoso") || msg.includes("bullying")) {
        return "El ciberacoso es el uso de medios digitales para acosar, intimidar o humillar a alguien. Incluye insultos, amenazas, difusión de rumores o contenido no autorizado. Si eres víctima: <br>1. No respondas a las provocaciones<br>2. Guarda evidencias (capturas)<br>3. Bloquea al agresor<br>4. Reporta en la plataforma<br>5. Busca ayuda (padres, docentes o nuestra línea de apoyo). <strong>¿Quieres saber cómo reportar un caso?</strong>";
    }
    
    // Reportar
    if (msg.includes("reportar") || msg.includes("denunciar") || msg.includes("ayuda")) {
        return "Puedes reportar casos de forma <strong>anónima y segura</strong> a través de:<br>• Nuestra plataforma digital (sección Contacto)<br>• Email: ayuda@escuela.edu<br>• Línea nacional: 0800-111-222<br>• Directo con orientación escolar<br>Todos los reportes son confidenciales y serán atendidos en menos de 24 horas. <strong>Tu seguridad es nuestra prioridad.</strong>";
    }
    
    // Privacidad
    if (msg.includes("privacidad") || msg.includes("privado") || msg.includes("datos") || msg.includes("informacion personal")) {
        return "Para proteger tu privacidad digital:<br>✓ Usa contraseñas fuertes y únicas<br>✓ Activa verificación en 2 pasos<br>✓ Revisa configuración de privacidad en redes<br>✓ No compartas: ubicación, datos familiares, contraseñas<br>✓ Desconfía de perfiles desconocidos<br>✓ Piensa antes de publicar (será permanente)<br><strong>¿Necesitas ayuda con alguna red social específica?</strong>";
    }
    
    // Noticias falsas
    if (msg.includes("noticia") || msg.includes("fake") || msg.includes("false") || msg.includes("desinformacion") || msg.includes("desinformación")) {
        return "Para detectar noticias falsas:<br>🔍 Verifica la fuente (¿es confiable?)<br>🔍 Revisa la fecha (¿es actual?)<br>🔍 Busca otras fuentes que confirmen<br>🔍 Analiza el tono (¿sensacionalista?)<br>🔍 Verifica imágenes (búsqueda inversa)<br>🔍 Lee más allá del titular<br><strong>Antes de compartir, verifica. No seas parte de la desinformación.</strong>";
    }
    
    // Problema
    if (msg.includes("problema") || msg.includes("riesgo")) {
        return "Los principales problemas digitales que enfrentamos son:<br>• <strong>Ciberacoso:</strong> 70% de jóvenes lo sufren<br>• <strong>Privacidad vulnerada:</strong> Datos personales expuestos<br>• <strong>Suplantación de identidad:</strong> Perfiles falsos<br>• <strong>Desinformación:</strong> Fake news virales<br>• <strong>Adicción digital:</strong> Uso excesivo<br>¿Sobre cuál quieres saber más?";
    }
    
    // Propuestas
    if (msg.includes("propuesta") || msg.includes("solucion") || msg.includes("solución") || msg.includes("que hacer")) {
        return "Tenemos 6 propuestas concretas:<br>1️⃣ Talleres de ciudadanía digital<br>2️⃣ Protocolo anti-ciberacoso<br>3️⃣ Campañas escolares permanentes<br>4️⃣ Charlas con especialistas<br>5️⃣ Brigadas digitales estudiantiles<br>6️⃣ Plataforma de ayuda anónima<br><strong>Ve a la sección 'Soluciones' para conocer cada propuesta en detalle.</strong>";
    }
    
    // Videos
    if (msg.includes("video")) {
        return "Tenemos videos educativos sobre:<br>🎥 <strong>Ciberacoso:</strong> Cómo identificarlo y qué hacer<br>🎥 <strong>Desinformación:</strong> Detectar fake news<br>Los encuentras en la sección 'Videos'. Te ayudarán a reconocer situaciones de riesgo reales. <strong>¿Quieres consejos específicos sobre algún tema?</strong>";
    }
    
    // Propósito
    if (msg.includes("proposito") || msg.includes("propósito") || msg.includes("objetivo") || msg.includes("para que")) {
        return "El propósito de esta campaña es:<br>✨ <strong>Generar conciencia</strong> sobre riesgos digitales reales<br>✨ <strong>Educar</strong> en ciudadanía digital responsable<br>✨ <strong>Proteger</strong> a estudiantes de ciberacoso y engaños<br>✨ <strong>Promover</strong> convivencia digital respetuosa<br>✨ <strong>Brindar herramientas</strong> prácticas de seguridad<br><strong>Juntos construimos un internet más seguro.</strong>";
    }
    
    // Contraseñas
    if (msg.includes("contraseña") || msg.includes("password") || msg.includes("clave")) {
        return "Tips para contraseñas seguras:<br>🔐 Mínimo 12 caracteres<br>🔐 Mezcla: mayúsculas, minúsculas, números y símbolos<br>🔐 No uses: fechas, nombres, palabras comunes<br>🔐 Una diferente para cada cuenta<br>🔐 Usa gestor de contraseñas<br>🔐 Activa verificación en 2 pasos<br>🔐 Cámbiala cada 3-6 meses<br><strong>NUNCA compartas tus contraseñas, ni con amigos.</strong>";
    }
    
    // Redes sociales
    if (msg.includes("red social") || msg.includes("redes sociales") || msg.includes("facebook") || msg.includes("instagram") || msg.includes("tiktok") || msg.includes("whatsapp")) {
        return "Consejos para redes sociales:<br>📱 Perfil privado siempre<br>📱 Solo acepta conocidos reales<br>📱 Desactiva ubicación en publicaciones<br>📱 Piensa antes de publicar<br>📱 No compartas información sensible<br>📱 Reporta contenido inapropiado<br>📱 Bloquea sin dudas si algo te incomoda<br><strong>¿Necesitas ayuda con la configuración de privacidad?</strong>";
    }
    
    // Estado emocional
    if (msg.includes("triste") || msg.includes("mal") || msg.includes("deprimido") || msg.includes("solo") || msg.includes("ayuda emocional")) {
        return "Lamento que te sientas así. 💙 Tu bienestar es importante. Te recomiendo:<br>• Hablar con alguien de confianza (padres, docentes, amigos)<br>• Contactar a orientación escolar<br>• Línea de apoyo emocional: 0800-111-222<br>• Evitar aislarte, busca actividades que disfrutes<br><strong>No estás solo. Hay personas que quieren ayudarte.</strong> Si es urgente, no dudes en llamar al 911.";
    }
    
    // Brigadas
    if (msg.includes("brigada") || msg.includes("voluntario") || msg.includes("participar")) {
        return "¡Qué genial que quieras participar! 🌟<br>Las <strong>Brigadas Digitales</strong> son grupos de estudiantes que:<br>• Detectan situaciones de riesgo<br>• Orientan a compañeros<br>• Promueven buenas prácticas<br>• Median conflictos menores<br><strong>Beneficios:</strong> Capacitación gratuita, certificación y horas de servicio social.<br>Para unirte, contacta a orientación escolar o escribe a: brigadas@escuela.edu";
    }
    
    // Recursos
    if (msg.includes("recurso") || msg.includes("material") || msg.includes("guia") || msg.includes("guía")) {
        return "Tenemos varios recursos útiles:<br>📚 Sitios web confiables (PantallasAmigas, Internet Segura)<br>📚 Apps de control parental (Qustodio, Family Link)<br>📚 Guías descargables (Privacidad, Anti-acoso)<br>📚 Juegos educativos (Interland, CyberChase)<br><strong>Visita la sección 'Recursos' para acceder a todo el material.</strong>";
    }
    
    // Padres
    if (msg.includes("padre") || msg.includes("mama") || msg.includes("mamá") || msg.includes("papa") || msg.includes("papá") || msg.includes("familia")) {
        return "Consejos para hablar con tus padres sobre seguridad digital:<br>👨‍👩‍👧 Sé honesto sobre tu actividad online<br>👨‍👩‍👧 Muéstrales tu configuración de privacidad<br>👨‍👩‍👧 Comparte lo que aprendes aquí<br>👨‍👩‍👧 Pídeles orientación si algo te incomoda<br>👨‍👩‍👧 Establezcan límites de tiempo juntos<br><strong>La comunicación familiar es clave para tu seguridad digital.</strong>";
    }
    
    // Agradecimiento
    if (msg.includes("gracias") || msg.includes("thank")) {
        return "¡De nada! 😊 Estoy aquí para ayudarte. Si tienes más preguntas sobre ciudadanía digital, seguridad, o cualquier tema de la campaña, no dudes en consultarme. <strong>¡Juntos construimos un internet más seguro!</strong> 🌐";
    }
    
    // Identificación
    if (msg.includes("quien eres") || msg.includes("quién eres") || msg.includes("que eres") || msg.includes("qué eres")) {
        return "Soy el <strong>Asistente Virtual de Ciudadanía Digital</strong> 🤖<br>Estoy aquí para:<br>• Responder dudas sobre la campaña<br>• Orientarte en temas de seguridad digital<br>• Brindarte consejos prácticos<br>• Ayudarte a encontrar recursos<br>• Guiarte si necesitas reportar algo<br><strong>¿En qué puedo ayudarte hoy?</strong>";

