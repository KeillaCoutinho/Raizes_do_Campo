const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

const form = document.getElementById("contatoForm");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Mensagem enviada com sucesso!");
        form.reset();
    });
}

// Movimento e reveal para cards de benefícios
(() => {
    const cards = document.querySelectorAll('.benefit-card, .testimonial-card');
    if (!cards.length) return;

    // adiciona classe de reveal para cada card
    cards.forEach(card => card.classList.add('scroll-reveal'));

    // IntersectionObserver para revelar cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    const rotateMax = 8; // deg
    cards.forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = 'transform 220ms ease, box-shadow 220ms ease';

        /* Movimento de tilt baseado na posição do mouse  (pesquisei)*/
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const dx = (x - cx) / cx; // -1 .. 1
            const dy = (y - cy) / cy;
            const rx = (-dy * rotateMax).toFixed(2);
            const ry = (dx * rotateMax).toFixed(2);

            card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
            card.style.boxShadow = '0 18px 40px rgba(0,0,0,0.28)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
})();

