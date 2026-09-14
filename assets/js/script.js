
document.addEventListener("DOMContentLoaded", () => {
  // 1. Menu Mobile
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // 2. Validação do formulário de contato
const formContato = document.getElementById("contatoForm");

if (formContato) {
  const campoNome = document.getElementById("name");
  const campoEmail = document.getElementById("email");
  const campoMensagem = document.getElementById("message");

  // Cria uma mensagem de erro abaixo do campo
  function mostrarErro(campo, mensagem) {
    campo.classList.add("campo-invalido");

    let mensagemErro = campo.parentElement.querySelector(
      `.mensagem-erro[data-campo="${campo.id}"]`
    );

    if (!mensagemErro) {
      mensagemErro = document.createElement("small");
      mensagemErro.classList.add("mensagem-erro");
      mensagemErro.dataset.campo = campo.id;
      campo.insertAdjacentElement("afterend", mensagemErro);
    }

    mensagemErro.textContent = mensagem;
  }

  // Remove a mensagem de erro do campo
  function removerErro(campo) {
    campo.classList.remove("campo-invalido");

    const mensagemErro = campo.parentElement.querySelector(
      `.mensagem-erro[data-campo="${campo.id}"]`
    );

    if (mensagemErro) {
      mensagemErro.remove();
    }
  }

  // Valida o formulário no envio
  formContato.addEventListener("submit", (e) => {
    e.preventDefault();

    let formularioValido = true;

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();
    const mensagem = campoMensagem.value.trim();

    // Limpa os erros anteriores
    removerErro(campoNome);
    removerErro(campoEmail);
    removerErro(campoMensagem);

    // Validação do nome
    if (nome === "") {
      mostrarErro(campoNome, "Por favor, informe seu nome.");
      formularioValido = false;
    } else if (nome.length < 3) {
      mostrarErro(
        campoNome,
        "O nome deve ter pelo menos 3 caracteres."
      );
      formularioValido = false;
    }

    // Validação do e-mail
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      mostrarErro(campoEmail, "Por favor, informe seu e-mail.");
      formularioValido = false;
    } else if (!formatoEmail.test(email)) {
      mostrarErro(
        campoEmail,
        "Digite um e-mail válido. Exemplo: nome@email.com"
      );
      formularioValido = false;
    }

    // Validação da mensagem
    if (mensagem === "") {
      mostrarErro(
        campoMensagem,
        "Por favor, escreva uma mensagem."
      );
      formularioValido = false;
    } else if (mensagem.length < 10) {
      mostrarErro(
        campoMensagem,
        "A mensagem deve ter pelo menos 10 caracteres."
      );
      formularioValido = false;
    }

    // Se houver algum erro, não continua
    if (!formularioValido) {
      return;
    }

    // Caso todos os campos estejam corretos
    alert("Mensagem enviada com sucesso!");
    formContato.reset();
  });

  // Remove o erro enquanto o usuário corrige o campo
  campoNome.addEventListener("input", () => {
    if (campoNome.value.trim().length >= 3) {
      removerErro(campoNome);
    }
  });

  campoEmail.addEventListener("input", () => {
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formatoEmail.test(campoEmail.value.trim())) {
      removerErro(campoEmail);
    }
  });

  campoMensagem.addEventListener("input", () => {
    if (campoMensagem.value.trim().length >= 10) {
      removerErro(campoMensagem);
    }
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

    // 7. Galeria de fotos com Lightbox
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  if (galleryItems.length > 0 && lightbox && lightboxImage) {
    let currentImage = 0;

    // Abre a imagem selecionada
    function openLightbox(index) {
      const image = galleryItems[index].querySelector("img");

      if (!image) return;

      currentImage = index;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;

      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");

      // Impede a página de rolar enquanto a imagem está aberta
      document.body.style.overflow = "hidden";
    }

    // Fecha a imagem ampliada
    function closeLightbox() {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");

      document.body.style.overflow = "";
    }

    // Mostra a imagem anterior
    function showPreviousImage() {
      currentImage =
        (currentImage - 1 + galleryItems.length) % galleryItems.length;

      openLightbox(currentImage);
    }

    // Mostra a próxima imagem
    function showNextImage() {
      currentImage =
        (currentImage + 1) % galleryItems.length;

      openLightbox(currentImage);
    }

    // Clique nas fotos
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        openLightbox(index);
      });
    });

    // Botão fechar
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    // Botões anterior e próximo
    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", showPreviousImage);
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", showNextImage);
    }

    // Fecha ao clicar no fundo escuro
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    // Fecha com Esc e navega com as setas do teclado
    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("active")) return;

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    });
  }

});