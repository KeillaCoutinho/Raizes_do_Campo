document.addEventListener("DOMContentLoaded", () => {
  // 1. Menu Mobile
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // 2. Formulário de Contato
  const formContato = document.getElementById("contatoForm");

  if (formContato) {
    formContato.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Mensagem enviada com sucesso!");
      formContato.reset();
    });
  }

  // 3. Alternância entre Login e Cadastro
  const tabLogin = document.getElementById("tab-login");
  const tabCadastro = document.getElementById("tab-cadastro");
  const formLogin = document.getElementById("form-login");
  const formCadastro = document.getElementById("form-cadastro");

  if (tabLogin && tabCadastro) {
    tabLogin.addEventListener("click", () => {
      tabLogin.classList.add("active");
      tabCadastro.classList.remove("active");
      formLogin.classList.remove("hidden");
      formCadastro.classList.add("hidden");
    });

    tabCadastro.addEventListener("click", () => {
      tabCadastro.classList.add("active");
      tabLogin.classList.remove("active");
      formCadastro.classList.remove("hidden");
      formLogin.classList.add("hidden");
    });
  }

  // 4. Validação do formulário de Cadastro
  if (formCadastro) {
    formCadastro.addEventListener("submit", (e) => {
      const senha = document.getElementById("cad-senha").value;
      if (senha.length < 6) {
        e.preventDefault();
        alert("A senha deve ter no mínimo 6 caracteres.");
      }
    });
  }

  // 5. Scroll Reveal e Efeito Tilt nos Cards
  const cards = document.querySelectorAll(".benefit-card, .testimonial-card");
  if (!cards.length) return;

  cards.forEach((card) => card.classList.add("scroll-reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el));

  const rotateMax = 8;
  cards.forEach((card) => {
    card.style.transformStyle = "preserve-3d";
    card.style.transition = "transform 220ms ease, box-shadow 220ms ease";

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      const rx = (-dy * rotateMax).toFixed(2);
      const ry = (dx * rotateMax).toFixed(2);

      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      card.style.boxShadow = "0 18px 40px rgba(0,0,0,0.28)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
});