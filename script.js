/* ============================
   SMOOTH SCROLL DEL MENÚ
============================ */
document.querySelectorAll("nav a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        target.scrollIntoView({ behavior: "smooth" });
    });
});

/* ============================
   EFECTO HEADER AL HACER SCROLL
============================ */
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ============================
   ANIMACIONES AL APARECER (SCROLL REVEAL)
============================ */
const items = document.querySelectorAll("article, .accion-card");

const showOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

    items.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;

        if (itemTop < triggerBottom) {
            item.classList.add("show");
        }
    });
};

window.addEventListener("scroll", showOnScroll);
showOnScroll(); // Para cargar animaciones si ya están en pantalla

/* ============================
   BOTÓN "VOLVER ARRIBA"
============================ */
const btnTop = document.createElement("button");
btnTop.textContent = "↑";
btnTop.id = "btnTop";
document.body.appendChild(btnTop);

btnTop.style.position = "fixed";
btnTop.style.bottom = "25px";
btnTop.style.right = "25px";
btnTop.style.padding = "10px 15px";
btnTop.style.fontSize = "20px";
btnTop.style.borderRadius = "8px";
btnTop.style.border = "none";
btnTop.style.cursor = "pointer";
btnTop.style.display = "none";
btnTop.style.background = "#007bff";
btnTop.style.color = "white";
btnTop.style.boxShadow = "0 3px 8px rgba(0,0,0,0.3)";
btnTop.style.zIndex = "999";
btnTop.style.transition = "0.3s";

window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
});

btnTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============================
   EFECTO EN BOTONES (SUAVE)
============================ */
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("mousedown", () => {
        btn.style.transform = "scale(0.95)";
    });
    btn.addEventListener("mouseup", () => {
        btn.style.transform = "scale(1)";
    });
});
