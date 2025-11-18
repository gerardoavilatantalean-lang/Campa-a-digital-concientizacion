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
    }
    
    // Emergencia
    if (msg.includes("emergencia") || msg.includes("urgente") || msg.includes("peligro")) {
        return "⚠️ <strong>Si estás en peligro inmediato:</strong><br>🚨 Llama al 911<br>🚨 Contacta a un adulto de confianza<br>🚨 Email urgente: ayuda@escuela.edu<br>🚨 Línea de ayuda: 0800-111-222<br><strong>Tu seguridad es lo primero. No dudes en pedir ayuda profesional.</strong>";
    }
    
    // Respuesta por defecto
    return "Entiendo tu pregunta, pero no tengo una respuesta específica. 🤔<br><br>Puedo ayudarte con:<br>• Ciberacoso y cómo prevenirlo<br>• Privacidad y seguridad digital<br>• Detección de noticias falsas<br>• Propuestas de la campaña<br>• Recursos educativos<br>• Cómo reportar casos<br><br><strong>¿Sobre qué te gustaría saber más?</strong>";
}

// =====================
// CONTADOR DE ESTADÍSTICAS
// =====================
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
    }, 20);
}

// Activar contadores cuando sean visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('.stat-number');
            const target = parseInt(number.textContent);
            animateCounter(number, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// =====================
// NAVEGACIÓN ACTIVA
// =====================
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// =====================
// BOTÓN SCROLL TO TOP
// =====================
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '↑';
scrollBtn.className = 'scroll-top';
scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 30px;
    width: 50px;
    height: 50px;
    background: var(--secondary);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5em;
    display: none;
    z-index: 998;
    box-shadow: 0 4px 15px rgba(255,0,68,0.4);
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =====================
// EFECTOS DE SONIDO
// =====================
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Música de fondo
let backgroundMusic = null;
let isMusicPlaying = false;

function playSound(frequency, duration, type = 'sine') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playCorrectSound() {
    playSound(523.25, 0.2); // C5
    setTimeout(() => playSound(659.25, 0.3), 100); // E5
}

function playIncorrectSound() {
    playSound(200, 0.3, 'sawtooth');
}

function playSuccessSound() {
    playSound(523.25, 0.15);
    setTimeout(() => playSound(659.25, 0.15), 100);
    setTimeout(() => playSound(783.99, 0.3), 200);
}

function playClickSound() {
    playSound(800, 0.05);
}

// Control de música de fondo
const musicToggle = document.getElementById('music-toggle');
if (musicToggle) {
    musicToggle.addEventListener('click', function() {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        isMusicPlaying = !isMusicPlaying;
        const icon = document.getElementById('music-icon');
        const text = document.getElementById('music-text');
        
        if (isMusicPlaying) {
            this.classList.add('playing');
            icon.textContent = '🔊';
            text.textContent = 'Música Activa';
            playBackgroundMusic();
        } else {
            this.classList.remove('playing');
            icon.textContent = '🔇';
            text.textContent = 'Activar Música';
            stopBackgroundMusic();
        }
    });
}

function playBackgroundMusic() {
    if (!backgroundMusic) {
        backgroundMusic = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        backgroundMusic.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        backgroundMusic.frequency.value = 220;
        backgroundMusic.type = 'sine';
        gainNode.gain.value = 0.05;
        
        backgroundMusic.start();
    }
}

function stopBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.stop();
        backgroundMusic = null;
    }
}

// =====================
// SISTEMA DE PESTAÑAS
// =====================
function switchTab(tab) {
    playClickSound();
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.interactive-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    if (tab === 'quiz') {
        document.getElementById('quiz-section').classList.add('active');
    } else if (tab === 'memes') {
        document.getElementById('memes-section').classList.add('active');
    }
}

// =====================
// QUIZ INTERACTIVO
// =====================
const quizQuestions = [
    {
        question: "¿Qué es el ciberacoso o ciberbullying?",
        answers: [
            "Usar internet para estudiar",
            "Hostigar o intimidar a alguien a través de medios digitales",
            "Compartir memes divertidos",
            "Crear perfiles en redes sociales"
        ],
        correct: 1
    },
    {
        question: "¿Cuál es una buena práctica para crear contraseñas seguras?",
        answers: [
            "Usar tu fecha de nacimiento",
            "Usar la misma contraseña para todo",
            "Combinar letras, números y símbolos de forma aleatoria",
            "Usar tu nombre completo"
        ],
        correct: 2
    },
    {
        question: "Si recibes un mensaje ofensivo de un desconocido, ¿qué debes hacer?",
        answers: [
            "Responder con otro insulto",
            "Compartirlo en todas tus redes",
            "Bloquear, reportar y guardar evidencia",
            "Ignorarlo completamente sin hacer nada"
        ],
        correct: 2
    },
    {
        question: "¿Qué información NO debes compartir en redes sociales?",
        answers: [
            "Tus hobbies favoritos",
            "Tu ubicación en tiempo real y datos personales sensibles",
            "Fotos de paisajes",
            "Memes graciosos"
        ],
        correct: 1
    },
    {
        question: "¿Cómo puedes identificar una noticia falsa (fake news)?",
        answers: [
            "Si tiene muchos likes es verdadera",
            "Verificando la fuente, fecha y buscando otras referencias confiables",
            "Si la compartió un amigo debe ser cierta",
            "Por el título sensacionalista"
        ],
        correct: 1
    },
    {
        question: "¿Qué es la huella digital?",
        answers: [
            "Una aplicación para escanear huellas",
            "El rastro de información que dejas en internet",
            "Un tipo de contraseña",
            "Un virus informático"
        ],
        correct: 1
    },
    {
        question: "Si un amigo está siendo víctima de ciberacoso, ¿qué debes hacer?",
        answers: [
            "Unirte a las burlas para no ser el siguiente",
            "Ignorarlo porque no es tu problema",
            "Apoyarlo, no compartir el contenido ofensivo y reportar la situación",
            "Solo darle like para que se sienta mejor"
        ],
        correct: 2
    },
    {
        question: "¿Qué significa 'phishing'?",
        answers: [
            "Un juego online",
            "Pescar información personal mediante engaños digitales",
            "Una red social nueva",
            "Un tipo de antivirus"
        ],
        correct: 1
    },
    {
        question: "¿Con qué frecuencia deberías revisar tu configuración de privacidad en redes sociales?",
        answers: [
            "Solo cuando creas la cuenta",
            "Nunca, es innecesario",
            "Regularmente, al menos cada 3-6 meses",
            "Solo si te hackean"
        ],
        correct: 2
    },
    {
        question: "¿Qué debes hacer antes de compartir una publicación en redes sociales?",
        answers: [
            "Compartir inmediatamente sin pensar",
            "Reflexionar sobre el impacto, verificar la información y pensar a largo plazo",
            "Esperar a tener más seguidores",
            "Pedirle permiso a todos tus amigos"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let quizStarted = false;

function startQuiz() {
    playClickSound();
    quizStarted = true;
    currentQuestion = 0;
    score = 0;
    
    document.getElementById('start-quiz-btn').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showResults();
        return;
    }
    
    const q = quizQuestions[currentQuestion];
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('question-text').textContent = q.question;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    q.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(index);
        answersContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex) {
    const q = quizQuestions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach(btn => btn.style.pointerEvents = 'none');
    
    if (selectedIndex === q.correct) {
        buttons[selectedIndex].classList.add('correct');
        score += 10;
        playCorrectSound();
        document.getElementById('quiz-score').textContent = score;
    } else {
        buttons[selectedIndex].classList.add('incorrect');
        buttons[q.correct].classList.add('correct');
        playIncorrectSound();
    }
    
    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1500);
}

function showResults() {
    playSuccessSound();
    
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('final-score').textContent = score;
    
    let message = '';
    let badge = '';
    
    if (score === 100) {
        message = '¡PERFECTO! Eres un experto en ciudadanía digital 🌟';
        badge = '🏆 MAESTRO DIGITAL';
    } else if (score >= 80) {
        message = '¡Excelente! Tienes muy buenos conocimientos 👏';
        badge = '🥇 EXPERTO DIGITAL';
    } else if (score >= 60) {
        message = '¡Bien hecho! Vas por buen camino 👍';
        badge = '🥈 CIUDADANO DIGITAL';
    } else if (score >= 40) {
        message = 'Puedes mejorar. Revisa los contenidos 📚';
        badge = '🥉 APRENDIZ DIGITAL';
    } else {
        message = 'Necesitas repasar más. ¡No te rindas! 💪';
        badge = '📖 ESTUDIANTE DIGITAL';
    }
    
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-badge').textContent = badge;
}

function restartQuiz() {
    playClickSound();
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-score').textContent = '0';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('start-quiz-btn').style.display = 'block';
}

function shareResult() {
    playClickSound();
    const text = `¡Obtuve ${score}/100 puntos en el Quiz de Ciudadanía Digital! 🎮 ¿Puedes superarme?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi resultado en el Quiz',
            text: text
        }).catch(() => {
            alert('Comparte este texto: ' + text);
        });
    } else {
        alert('Comparte este texto: ' + text);
    }
}

// =====================
// GENERADOR DE MEMES
// =====================
let currentTemplate = 1;

const templates = {
    1: { bg: 'linear-gradient(135deg, #667eea, #764ba2)', icon: '🔒' },
    2: { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', icon: '🛡️' },
    3: { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', icon: '🔍' },
    4: { bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', icon: '💪' }
};

function selectTemplate(templateNum) {
    playClickSound();
    currentTemplate = templateNum;
    const template = templates[templateNum];
    
    document.getElementById('meme-bg').style.background = template.bg;
    document.getElementById('meme-icon').textContent = template.icon;
    
    document.querySelectorAll('.template-card').forEach(card => {
        card.querySelector('.template-preview').style.borderColor = 'transparent';
    });
    
    event.target.closest('.template-card').querySelector('.template-preview').style.borderColor = '#FFD700';
}

function applyPresetMessage() {
    const select = document.getElementById('preset-messages');
    const value = select.value;
    
    if (value) {
        playClickSound();
        const [top, bottom] = value.split('|');
        document.getElementById('meme-text-top').value = top;
        document.getElementById('meme-text-bottom').value = bottom;
    }
}

function downloadMeme() {
    playClickSound();
    alert('📸 ¡Meme creado! En una versión completa, esto descargaría tu meme como imagen. Por ahora, puedes hacer una captura de pantalla del meme. 😊');
}

function shareMeme() {
    playClickSound();
    const topText = document.getElementById('meme-text-top').value || 'TU TEXTO';
    const bottomText = document.getElementById('meme-text-bottom').value || 'AQUÍ';
    
    const text = `¡Creé un meme de concientización digital! "${topText}" - "${bottomText}" 🎨 #CiudadaníaDigital`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi Meme Digital',
            text: text
        }).catch(() => {
            alert('Comparte este texto: ' + text);
        });
    } else {
        alert('Comparte este texto: ' + text);
    }
}

// =====================
// CONSOLA - MENSAJE
// =====================
console.log('%c🌐 Ciudadanía Digital Responsable', 'font-size: 20px; font-weight: bold; color: #0044ff;');
console.log('%c¡Gracias por visitar nuestra campaña!', 'font-size: 14px; color: #666;');
console.log('%cJuntos construimos un internet más seguro 💙', 'font-size: 14px; color: #ff0044;');
