
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

  if (tabLogin && tabCadastro && formLogin && formCadastro) {
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
      const senha = document.getElementById("cad-senha");

      if (senha && senha.value.length < 6) {
        e.preventDefault();
        alert("A senha deve ter no mínimo 6 caracteres.");
      }
    });
  }

    // 5. Scroll Reveal e Efeito Tilt nos Cards

  // Seleciona TODOS os elementos que devem aparecer ao rolar
  const revealElements = document.querySelectorAll(".scroll-reveal");

  // Cria o observador para revelar as seções quando entrarem na tela
  if (revealElements.length > 0) {
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

    // Observa as seções Sobre, Benefícios, Contato e outros elementos
    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // Efeito Tilt somente nos cards, caso existam
  const cards = document.querySelectorAll(".benefit-card, .testimonial-card");

  if (cards.length > 0) {
    const rotateMax = 8;

    cards.forEach((card) => {
      card.style.transformStyle = "preserve-3d";
      card.style.transition =
        "transform 220ms ease, box-shadow 220ms ease";

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

        card.style.transform =
          `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;

        card.style.boxShadow =
          "0 18px 40px rgba(0,0,0,0.28)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.boxShadow = "";
      });
    });
  }

  // 6. Slideshow da página inicial
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slide-btn.prev");
  const nextBtn = document.querySelector(".slide-btn.next");

  // Só executa se o slideshow existir na página
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;

    // Mostra um slide específico
    function showSlide(index) {
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });

      dots.forEach((dot) => {
        dot.classList.remove("active");
      });

      slides[index].classList.add("active");

      if (dots[index]) {
        dots[index].classList.add("active");
      }

      currentSlide = index;
    }

    // Próximo slide
    function nextSlide() {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    }

    // Slide anterior
    function prevSlide() {
      const prevIndex =
        (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    }

    // Inicia a troca automática
    function startSlideshow() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    // Reinicia o contador após clicar
    function resetSlideshow() {
      clearInterval(slideInterval);
      startSlideshow();
    }

    // Botão próximo
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetSlideshow();
      });
    }

    // Botão anterior
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetSlideshow();
      });
    }

    // Indicadores
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        resetSlideshow();
      });
    });

    // Inicia no primeiro slide
    showSlide(0);
    startSlideshow();
  }
});