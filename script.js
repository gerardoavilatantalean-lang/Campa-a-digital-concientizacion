// =====================
// DESPLEGAR PROPUESTAS
// =====================

function toggleInfo(id) {
    const box = document.getElementById(id);
    box.style.display = box.style.display === "block" ? "none" : "block";
}

// =====================
// ASISTENTE VIRTUAL
// =====================

const botButton = document.getElementById("bot-button");
const botWindow = document.getElementById("bot-window");
const botClose = document.getElementById("bot-close");
const botSend = document.getElementById("bot-send");
const botInput = document.getElementById("bot-input");
const botChat = document.getElementById("bot-chat");

botButton.addEventListener("click", () => {
    botWindow.style.display = "block";
});

botClose.addEventListener("click", () => {
    botWindow.style.display = "none";
});

botSend.addEventListener("click", sendMessage);
botInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    let text = botInput.value.trim();
    if (text === "") return;

    addMessage("Tú", text);
    botInput.value = "";

    setTimeout(() => {
        addMessage("Asistente", generateResponse(text));
    }, 500);
}

function addMessage(sender, message) {
    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.innerHTML = `<strong>${sender}:</strong> ${message}`;
    botChat.appendChild(bubble);
    botChat.scrollTop = botChat.scrollHeight;
}

function generateResponse(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("hola")) return "¡Hola! ¿En qué puedo ayudarte con respecto a tus dudas sobre la campaña campaña?";
    if (msg.includes("problema")) return "El problema principal es el mal uso de la tecnología, ciberacoso y desinformación.";
    if (msg.includes("propuestas")) return "Tenemos opcciones variadas frente a esos problemas , brigadas digitales, buzón anónimo, charlas informativas,anucios llenos de informacion y más.";
    if (msg.includes("video")) return "Los videos te ayudan a identificar el ciberacoso y la desinformación de una mejor manera.";

    return "No entendí bien, pero puedo ayudarte con dudas del problema, propuestas o videos.";
}

