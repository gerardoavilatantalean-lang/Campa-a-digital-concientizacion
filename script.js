// =====================
// BARRA DE PROGRESO
// =====================
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progress-bar').style.width = scrolled + '%';
});

// =====================
// CONTADOR ANIMADO EN HEADER
// =====================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animar números del header
document.querySelectorAll('.stat-number').forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(stat, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(stat);
});

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
document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
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
    playSound(523.25, 0.2);
    setTimeout(() => playSound(659.25, 0.3), 100);
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
// ASISTENTE VIRTUAL MEJORADO (25+ RESPUESTAS)
// =====================
const botButton = document.getElementById("bot-button");
const botWindow = document.getElementById("bot-window");
const botClose = document.getElementById("bot-close");
const botSend = document.getElementById("bot-send");
const botInput = document.getElementById("bot-input");
const botChat = document.getElementById("bot-chat");

botButton.addEventListener("click", () => {
    botWindow.style.display = "flex";
    botButton.style.display = "none";
    botInput.focus();
});

botClose.addEventListener("click", () => {
    botWindow.style.display = "none";
    botButton.style.display = "flex";
});

botSend.addEventListener("click", sendMessage);
botInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    let text = botInput.value.trim();
    if (text === "") return;
    
    addMessage("user", text);
    botInput.value = "";
    
    setTimeout(() => {
        const response = generateResponse(text);
        addMessage("bot", response);
    }, 800);
}

function sendSuggestion(text) {
    botInput.value = text;
    sendMessage();
}

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

// CHATBOT CON 25+ RESPUESTAS
function generateResponse(msg) {
    msg = msg.toLowerCase();
    
    // Saludos
    if (msg.includes("hola") || msg.includes("buenas") || msg.includes("hey") || msg.includes("hi")) {
        return "¡Hola! 👋 Bienvenido a nuestra campaña de ciudadanía digital. ¿En qué puedo ayudarte hoy? Puedo orientarte sobre ciberacoso, privacidad, propuestas o recursos.";
    }
    
    // Ciberacoso
    if (msg.includes("ciberacoso") || msg.includes("acoso") || msg.includes("bullying") || msg.includes("cyberbullying")) {
        return "El ciberacoso es el uso de medios digitales para acosar, intimidar o humillar a alguien. Incluye insultos, amenazas, difusión de rumores o contenido no autorizado. Si eres víctima: <br>1. No respondas a las provocaciones<br>2. Guarda evidencias (capturas)<br>3. Bloquea al agresor<br>4. Reporta en la plataforma<br>5. Busca ayuda (padres, docentes o nuestra línea de apoyo). <strong>¿Quieres saber cómo reportar un caso?</strong>";
    }
    
    // Reportar
    if (msg.includes("reportar") || msg.includes("denunciar") || msg.includes("ayuda urgente")) {
        return "Puedes reportar casos de forma <strong>anónima y segura</strong> a través de:<br>• Email: ayuda@escuela.edu<br>• Línea nacional: 0800-111-222<br>• Policía: 911<br>• Directo con orientación escolar<br>Todos los reportes son confidenciales y serán atendidos en menos de 24 horas. <strong>Tu seguridad es nuestra prioridad.</strong>";
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
    
    // Adicción digital
    if (msg.includes("adiccion") || msg.includes("adicción") || msg.includes("mucho tiempo") || msg.includes("dependencia")) {
        return "Señales de adicción digital:<br>📱 Usar dispositivos más de 5 horas diarias sin motivo académico<br>📱 Sentir ansiedad sin el celular<br>📱 Descuidar responsabilidades o relaciones<br>📱 Problemas de sueño por uso nocturno<br><strong>Consejos:</strong> Establece límites de tiempo, activa modo no molestar, busca actividades offline. Si persiste, busca ayuda profesional.";
    }
    
    // Sextorsión / Grooming
    if (msg.includes("sextorsion") || msg.includes("sextorsión") || msg.includes("grooming") || msg.includes("chantaje") || msg.includes("fotos intimas")) {
        return "⚠️ <strong>ALERTA GRAVE:</strong> La sextorsión y grooming son delitos serios.<br>Si alguien:<br>• Te pide fotos íntimas<br>• Te chantajea con material tuyo<br>• Un adulto te busca románticamente<br><strong>ACCIÓN INMEDIATA:</strong><br>1. NO envíes nada<br>2. NO borres evidencia<br>3. Habla con un adulto YA<br>4. Llama al 911 o 0800-111-222<br><strong>Esto NO es tu culpa. Hay ayuda disponible.</strong>";
    }
    
    // Robo de cuentas
    if (msg.includes("robaron") || msg.includes("hackearon") || msg.includes("hackeo") || msg.includes("cuenta robada")) {
        return "Si te robaron una cuenta:<br>🔐 <strong>Paso 1:</strong> Intenta recuperarla con 'Olvidé mi contraseña'<br>🔐 <strong>Paso 2:</strong> Revisa tu email de recuperación<br>🔐 <strong>Paso 3:</strong> Cambia contraseñas de TODAS tus cuentas<br>🔐 <strong>Paso 4:</strong> Activa verificación en 2 pasos<br>🔐 <strong>Paso 5:</strong> Avisa a tus contactos del hackeo<br>🔐 <strong>Paso 6:</strong> Reporta a la plataforma<br><strong>Prevención:</strong> Contraseñas únicas y fuertes para cada cuenta.";
    }
    
    // Configuración Instagram
    if (msg.includes("instagram") || msg.includes("insta") || msg.includes("ig")) {
        return "Configuración de privacidad en Instagram:<br>📷 Perfil → Configuración → Privacidad<br>📷 Activar 'Cuenta privada'<br>📷 Desactivar 'Mostrar estado de actividad'<br>📷 Controlar quién puede: comentar, etiquetar, mencionar<br>📷 Bloquear cuentas sospechosas<br>📷 No aceptar mensajes de desconocidos<br><strong>¿Necesitas ayuda con otra red?</strong>";
    }
    
    // Configuración TikTok
    if (msg.includes("tiktok") || msg.includes("tik tok")) {
        return "Configuración de privacidad en TikTok:<br>🎵 Perfil → Menú → Privacidad<br>🎵 Activar 'Cuenta privada'<br>🎵 Mensajes directos: 'Nadie' o 'Amigos'<br>🎵 Desactivar 'Sugerir cuenta a otros'<br>🎵 Controlar comentarios y duetos<br>🎵 No mostrar videos 'Me gusta' públicamente<br><strong>Tip:</strong> Revisa videos antes de publicar, piensa en tu reputación digital.";
    }
    
    // Huella digital
    if (msg.includes("huella digital") || msg.includes("rastro") || msg.includes("historial")) {
        return "Tu <strong>huella digital</strong> es todo lo que dejas en internet:<br>👣 Fotos y videos publicados<br>👣 Comentarios y likes<br>👣 Búsquedas y sitios visitados<br>👣 Información compartida<br><strong>Importante:</strong> Esta huella es PERMANENTE. Futuras universidades y empleadores la pueden ver.<br><strong>Consejo:</strong> Busca tu nombre en Google regularmente, cuida lo que publicas.";
    }
    
    // Sexting
    if (msg.includes("sexting") || msg.includes("desnudo") || msg.includes("pack")) {
        return "⚠️ <strong>Sobre el sexting:</strong><br>• Compartir contenido íntimo es RIESGOSO<br>• Puede ser distribuido sin tu permiso<br>• Puede convertirse en chantaje<br>• Es ILEGAL si eres menor de edad<br>• Una vez enviado, pierdes el control<br><strong>NUNCA envíes:</strong> Fotos/videos íntimos, incluso a tu pareja.<br>Si te presionan: es señal de abuso. Busca ayuda.";
    }
    
    // Verificación de cuentas
    if (msg.includes("verificar") || msg.includes("real") || msg.includes("falso") || msg.includes("perfil falso")) {
        return "Cómo identificar perfiles falsos:<br>🔍 Pocos seguidores o muy reciente<br>🔍 Sin foto de perfil o foto genérica<br>🔍 Pocas publicaciones o solo reposteos<br>🔍 Solicitudes masivas de amistad<br>🔍 Mensajes sospechosos o piden dinero<br>🔍 Información inconsistente<br><strong>Si sospechas:</strong> NO aceptes, bloquea y reporta.";
    }
    
    // Tiempo de pantalla
    if (msg.includes("tiempo") || msg.includes("pantalla") || msg.includes("horas")) {
        return "Tips para controlar tiempo de pantalla:<br>⏰ Usa app de bienestar digital (iOS/Android)<br>⏰ Establece límites por app<br>⏰ Desactiva notificaciones no esenciales<br>⏰ No uses dispositivos 1 hora antes de dormir<br>⏰ Crea zonas sin pantallas (comedor, dormitorio)<br>⏰ Reemplaza con actividades: deporte, lectura, amigos<br><strong>Recomendado:</strong> Máximo 2-3 horas recreativas diarias.";
    }
    
    // Zoom / Clases online
    if (msg.includes("zoom") || msg.includes("clase online") || msg.includes("videollamada") || msg.includes("meet")) {
        return "Seguridad en clases virtuales:<br>💻 No compartas links de reuniones públicamente<br>💻 Usa contraseña en reuniones<br>💻 Activa sala de espera<br>💻 Controla quién puede compartir pantalla<br>💻 Fondo virtual para no mostrar tu casa<br>💻 Silencia micrófono cuando no hables<br>💻 Reporta comportamientos inapropiados<br><strong>¿Dudas sobre otra herramienta?</strong>";
    }
    
    // Respuesta por defecto
    return "Entiendo tu pregunta, pero no tengo una respuesta específica. 🤔<br><br>Puedo ayudarte con:<br>• Ciberacoso y cómo prevenirlo<br>• Privacidad y seguridad digital<br>• Detección de noticias falsas<br>• Propuestas de la campaña<br>• Recursos educativos<br>• Cómo reportar casos<br>• Configuración de redes sociales<br>• Adicción digital<br>• Sextorsión y grooming<br><br><strong>¿Sobre qué te gustaría saber más?</strong>";
}

// =====================
// CENTRO DE SEGURIDAD PERSONAL
// =====================

// Variables globales para scores
let passwordScore = 0;
let privacyScore = 0;

// Toggle visibilidad de contraseña
function togglePasswordVisibility() {
    const input = document.getElementById('password-input');
    const button = event.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Analizar contraseña
function analyzePassword() {
    playClickSound();
    
    const password = document.getElementById('password-input').value;
    
    if (password.length === 0) {
        alert('Por favor, ingresa una contraseña para analizar');
        return;
    }
    
    const result = document.getElementById('password-result');
    const strengthFill = document.getElementById('strength-fill');
    const strengthLabel = document.getElementById('strength-label');
    const checksContainer = document.getElementById('password-checks');
    const suggestionsContainer = document.getElementById('password-suggestions');
    const scoreValue = document.getElementById('password-score-value');
    
    // Análisis de la contraseña
    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        common: !isCommonPassword(password)
    };
    
    // Calcular score
    let score = 0;
    if (checks.length) score += 25;
    if (checks.uppercase) score += 15;
    if (checks.lowercase) score += 15;
    if (checks.numbers) score += 15;
    if (checks.symbols) score += 20;
    if (checks.common) score += 10;
    
    passwordScore = score;
    
    // Actualizar barra de fuerza
    strengthFill.style.width = score + '%';
    
    if (score >= 80) {
        strengthFill.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
        strengthLabel.textContent = '🔒 CONTRASEÑA MUY SEGURA';
        strengthLabel.style.color = '#4CAF50';
    } else if (score >= 60) {
        strengthFill.style.background = 'linear-gradient(90deg, #FFA500, #FF8C00)';
        strengthLabel.textContent = '⚠️ CONTRASEÑA MEDIA';
        strengthLabel.style.color = '#FFA500';
    } else {
        strengthFill.style.background = 'linear-gradient(90deg, #f44336, #e53935)';
        strengthLabel.textContent = '❌ CONTRASEÑA DÉBIL';
        strengthLabel.style.color = '#f44336';
    }
    
    // Mostrar checks
    checksContainer.innerHTML = '';
    
    const checkTexts = {
        length: 'Tiene al menos 12 caracteres',
        uppercase: 'Contiene letras mayúsculas',
        lowercase: 'Contiene letras minúsculas',
        numbers: 'Contiene números',
        symbols: 'Contiene símbolos especiales',
        common: 'No es una contraseña común'
    };
    
    for (let key in checks) {
        const li = document.createElement('li');
        li.textContent = (checks[key] ? '✅ ' : '❌ ') + checkTexts[key];
        li.className = checks[key] ? 'check-pass' : 'check-fail';
        checksContainer.appendChild(li);
    }
    
    // Sugerencias
    suggestionsContainer.innerHTML = '';
    const suggestions = [];
    
    if (!checks.length) suggestions.push('Usa al menos 12 caracteres');
    if (!checks.uppercase) suggestions.push('Agrega letras MAYÚSCULAS');
    if (!checks.lowercase) suggestions.push('Agrega letras minúsculas');
    if (!checks.numbers) suggestions.push('Incluye números (0-9)');
    if (!checks.symbols) suggestions.push('Usa símbolos especiales (!@#$%...)');
    if (!checks.common) suggestions.push('Evita contraseñas comunes como "123456" o "password"');
    
    if (suggestions.length === 0) {
        suggestions.push('¡Excelente! Tu contraseña es muy segura');
        suggestions.push('Recuerda cambiarla cada 3-6 meses');
        suggestions.push('Nunca la compartas con nadie');
    }
    
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsContainer.appendChild(li);
    });
    
    // Mostrar score
    scoreValue.textContent = score;
    
    // Mostrar resultado
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Actualizar resultado global si existe
    updateGlobalSecurity();
}

// Verificar contraseñas comunes
function isCommonPassword(password) {
    const common = ['123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234', '111111', '1234567', 'dragon', '123123', 'baseball', 'iloveyou', '1234567890', '000000', 'password1'];
    return common.includes(password.toLowerCase());
}

// Calcular score de privacidad
function calculatePrivacyScore() {
    playClickSound();
    
    const checks = document.querySelectorAll('.privacy-check');
    let total = 0;
    let obtained = 0;
    
    checks.forEach(check => {
        const points = parseInt(check.getAttribute('data-points'));
        total += points;
        if (check.checked) {
            obtained += points;
        }
    });
    
    privacyScore = obtained;
    
    // Mostrar resultado
    const result = document.getElementById('privacy-result');
    const scoreNumber = document.getElementById('privacy-score-number');
    const rating = document.getElementById('privacy-rating');
    const feedback = document.getElementById('privacy-feedback');
    
    scoreNumber.textContent = obtained;
    
    let ratingText = '';
    let feedbackText = '';
    
    if (obtained >= 80) {
        ratingText = '🏆 EXCELENTE';
        rating.style.color = '#4CAF50';
        feedbackText = '¡Felicidades! Tu nivel de privacidad es excelente. Mantienes buenas prácticas de seguridad en redes sociales. Sigue así y revisa tu configuración regularmente.';
    } else if (obtained >= 60) {
        ratingText = '👍 BUENO';
        rating.style.color = '#FFA500';
        feedbackText = 'Tienes un buen nivel de privacidad, pero hay margen de mejora. Revisa las opciones que no marcaste y considera implementarlas para mayor seguridad.';
    } else if (obtained >= 40) {
        ratingText = '⚠️ REGULAR';
        rating.style.color = '#FF8C00';
        feedbackText = 'Tu nivel de privacidad es regular. Es importante que tomes medidas adicionales para proteger tus datos personales. Revisa tu configuración de privacidad HOY.';
    } else {
        ratingText = '❌ BAJO';
        rating.style.color = '#f44336';
        feedbackText = 'ALERTA: Tu nivel de privacidad es bajo y estás muy expuesto. Es URGENTE que revises y mejores tu configuración de privacidad en todas tus redes sociales.';
    }
    
    rating.textContent = ratingText;
    feedback.textContent = feedbackText;
    
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Actualizar resultado global
    updateGlobalSecurity();
}

// Actualizar resultado global
function updateGlobalSecurity() {
    if (passwordScore === 0 || privacyScore === 0) return;
    
    const globalSection = document.getElementById('global-security');
    const globalScoreEl = document.getElementById('global-score');
    const globalBadge = document.getElementById('global-badge');
    const actionItems = document.getElementById('action-items');
    
    // Calcular score global (promedio ponderado)
    const globalScore = Math.round((passwordScore * 0.5) + (privacyScore * 0.5));
    
    globalScoreEl.textContent = globalScore;
    
    // Badge
    let badgeText = '';
    if (globalScore >= 80) {
        badgeText = '🏆 EXPERTO EN SEGURIDAD';
        globalBadge.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (globalScore >= 60) {
        badgeText = '🥈 USUARIO CONSCIENTE';
        globalBadge.style.background = 'linear-gradient(135deg, #FFA500, #FF8C00)';
    } else {
        badgeText = '⚠️ NECESITAS MEJORAR';
        globalBadge.style.background = 'linear-gradient(135deg, #f44336, #e53935)';
    }
    
    globalBadge.textContent = badgeText;
    
    // Plan de acción
    actionItems.innerHTML = '';
    const actions = [];
    
    if (passwordScore < 80) {
        actions.push('Mejora tu contraseña siguiendo las sugerencias del escáner');
    }
    
    if (privacyScore < 80) {
        actions.push('Revisa tu configuración de privacidad en todas tus redes sociales');
    }
    
    if (globalScore < 60) {
        actions.push('Activa verificación en 2 pasos en todas tus cuentas importantes');
        actions.push('Revisa qué apps tienen acceso a tus redes sociales');
        actions.push('Haz una auditoría de seguridad semanal');
    }
    
    if (actions.length === 0) {
        actions.push('¡Excelente trabajo! Mantén estos buenos hábitos');
        actions.push('Revisa tu seguridad cada 3 meses');
        actions.push('Ayuda a otros a mejorar su seguridad digital');
    }
    
    actions.forEach(action => {
        const li = document.createElement('li');
        li.textContent = action;
        actionItems.appendChild(li);
    });
    
    // Mostrar sección
    globalSection.style.display = 'block';
    setTimeout(() => {
        globalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

// Compartir score de seguridad
function shareSecurityScore() {
    playClickSound();
    
    const globalScore = Math.round((passwordScore * 0.5) + (privacyScore * 0.5));
    const text = `¡Obtuve ${globalScore}/100 en el Centro de Seguridad Digital! 🔐 ¿Qué tal tu seguridad? #CiudadaníaDigital`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi Seguridad Digital',
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
console.log('%c🌐 Ciudadanía Digital Responsable', 'font-size: 24px; font-weight: bold; color: #0044ff;');
console.log('%c¡Gracias por visitar nuestra campaña mejorada!', 'font-size: 16px; color: #666;');
console.log('%cJuntos construimos un internet más seguro 💙', 'font-size: 16px; color: #ff0044;');
