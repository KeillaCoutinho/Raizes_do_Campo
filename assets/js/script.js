
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
  formContato.addEventListener("submit", async (e) => {
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

    // Envio assíncrono para o backend
    try {
    const resposta = await fetch("http://localhost:3000/contato", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            mensagem: mensagem
        })
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
        alert(resultado.erros.join("\n"));
        return;
    }

    alert(resultado.mensagem);
    formContato.reset();

  } catch (erro) {
      console.error("Erro ao enviar formulário:", erro);

      alert(
        "Não foi possível enviar a mensagem. Verifique se o servidor está funcionando."
      );
    }

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

  const nome = document.getElementById("cad-nome");
  const email = document.getElementById("cad-email");
  const senha = document.getElementById("cad-senha");
  const confirmarSenha = document.getElementById("cad-confirmar-senha");

  const erroNome = document.getElementById("erro-nome");
  const erroEmail = document.getElementById("erro-email");
  const erroSenha = document.getElementById("erro-senha");
  const erroConfirmarSenha = document.getElementById("erro-confirmar-senha");

  const mensagemSucesso = document.getElementById("cadastro-sucesso");


  // Função para mostrar erro
  function mostrarErro(campo, elementoErro, mensagem) {
    campo.classList.add("input-invalido");
    campo.classList.remove("input-valido");
    elementoErro.textContent = mensagem;
  }


  // Função para marcar campo como válido
  function marcarValido(campo, elementoErro) {
    campo.classList.remove("input-invalido");
    campo.classList.add("input-valido");
    elementoErro.textContent = "";
  }


  // Validação do nome
  function validarNome() {

    const valor = nome.value.trim();

    if (valor === "") {
      mostrarErro(
        nome,
        erroNome,
        "Informe seu nome completo."
      );
      return false;
    }

    if (valor.length < 3) {
      mostrarErro(
        nome,
        erroNome,
        "O nome deve ter pelo menos 3 caracteres."
      );
      return false;
    }

    marcarValido(nome, erroNome);
    return true;
  }


  // Validação do e-mail
  function validarEmail() {

    const valor = email.value.trim();

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor === "") {
      mostrarErro(
        email,
        erroEmail,
        "Informe seu e-mail."
      );
      return false;
    }

    if (!emailValido.test(valor)) {
      mostrarErro(
        email,
        erroEmail,
        "Digite um e-mail válido."
      );
      return false;
    }

    marcarValido(email, erroEmail);
    return true;
  }


  // Validação da senha
  function validarSenha() {

    const valor = senha.value;

    if (valor === "") {
      mostrarErro(
        senha,
        erroSenha,
        "Informe uma senha."
      );
      return false;
    }

    if (valor.length < 8) {
      mostrarErro(
        senha,
        erroSenha,
        "A senha deve ter pelo menos 8 caracteres."
      );
      return false;
    }

    if (!/[A-Za-z]/.test(valor)) {
      mostrarErro(
        senha,
        erroSenha,
        "A senha deve conter pelo menos uma letra."
      );
      return false;
    }

    if (!/[0-9]/.test(valor)) {
      mostrarErro(
        senha,
        erroSenha,
        "A senha deve conter pelo menos um número."
      );
      return false;
    }

    marcarValido(senha, erroSenha);
    return true;
  }


  // Validação da confirmação da senha
  function validarConfirmacao() {

    const valor = confirmarSenha.value;

    if (valor === "") {
      mostrarErro(
        confirmarSenha,
        erroConfirmarSenha,
        "Confirme sua senha."
      );
      return false;
    }

    if (valor !== senha.value) {
      mostrarErro(
        confirmarSenha,
        erroConfirmarSenha,
        "As senhas não coincidem."
      );
      return false;
    }

    marcarValido(
      confirmarSenha,
      erroConfirmarSenha
    );

    return true;
  }


  // Validação enquanto o usuário digita
  nome.addEventListener("input", validarNome);
  email.addEventListener("input", validarEmail);
  senha.addEventListener("input", () => {
    validarSenha();

    if (confirmarSenha.value !== "") {
      validarConfirmacao();
    }
  });

  confirmarSenha.addEventListener(
    "input",
    validarConfirmacao
  );


  // Validação ao enviar o formulário
  formCadastro.addEventListener("submit", (e) => {

    e.preventDefault();

    mensagemSucesso.textContent = "";

    const nomeValido = validarNome();
    const emailValido = validarEmail();
    const senhaValida = validarSenha();
    const confirmacaoValida = validarConfirmacao();


    if (
      nomeValido &&
      emailValido &&
      senhaValida &&
      confirmacaoValida
    ) {

      mensagemSucesso.textContent =
        "Cadastro preenchido corretamente!";

      /*
       * Futuramente, o backend será chamado aqui
       * para salvar o usuário no PostgreSQL.
       */

    } else {

      const primeiroErro =
        formCadastro.querySelector(".input-invalido");

      if (primeiroErro) {
        primeiroErro.focus();
      }
    }

  });

}

  // 5. Filtros do catálogo de produtos
  const filtrosProdutos = document.querySelectorAll(".filtro");
  const cardsProdutos = document.querySelectorAll(".produto-card");
  const contadorProdutos = document.querySelector(".catalogo-resultados strong");
  const buscaProduto = document.getElementById("buscarProduto");
  const ordenarProdutos = document.getElementById("ordenarProdutos");
  const gradeProdutos = document.querySelector(".produtos-grid");
  const ordemOriginal = Array.from(cardsProdutos);
  let categoriaAtual = "todos";

  if (filtrosProdutos.length > 0 && cardsProdutos.length > 0) {
    function atualizarProdutos() {
      const termoBusca = buscaProduto
        ? buscaProduto.value.trim().toLocaleLowerCase("pt-BR")
        : "";
      let produtosVisiveis = 0;

      cardsProdutos.forEach((card) => {
        const textoCard = card.textContent.toLocaleLowerCase("pt-BR");
        const correspondeCategoria =
          categoriaAtual === "todos" ||
          card.dataset.categoria === categoriaAtual;
        const correspondeBusca =
          termoBusca === "" ||
          card.dataset.nome.toLocaleLowerCase("pt-BR").includes(termoBusca) ||
          textoCard.includes(termoBusca);
        const corresponde = correspondeCategoria && correspondeBusca;

        card.hidden = !corresponde;

        if (corresponde) {
          produtosVisiveis += 1;
        }
      });

      if (contadorProdutos) {
        contadorProdutos.textContent = produtosVisiveis;
      }
    }

    filtrosProdutos.forEach((filtro) => {
      filtro.addEventListener("click", () => {
        filtrosProdutos.forEach((item) => item.classList.remove("active"));
        filtro.classList.add("active");
        categoriaAtual = filtro.dataset.categoria;
        atualizarProdutos();
      });
    });

    if (buscaProduto) {
      buscaProduto.addEventListener("input", atualizarProdutos);
    }

    if (ordenarProdutos && gradeProdutos) {
      ordenarProdutos.addEventListener("change", () => {
        const criterio = ordenarProdutos.value;
        const cardsOrdenados = Array.from(cardsProdutos);

        if (criterio === "original") {
          cardsOrdenados.splice(0, cardsOrdenados.length, ...ordemOriginal);
        } else if (criterio === "nome") {
          cardsOrdenados.sort((cardA, cardB) =>
            cardA.dataset.nome.localeCompare(cardB.dataset.nome, "pt-BR")
          );
        } else if (criterio === "menor-preco") {
          cardsOrdenados.sort(
            (cardA, cardB) =>
              Number(cardA.dataset.preco) - Number(cardB.dataset.preco)
          );
        } else if (criterio === "maior-preco") {
          cardsOrdenados.sort(
            (cardA, cardB) =>
              Number(cardB.dataset.preco) - Number(cardA.dataset.preco)
          );
        }

        cardsOrdenados.forEach((card) => gradeProdutos.appendChild(card));
      });
    }
  }

    // 6. Scroll Reveal e Efeito Tilt nos Cards

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

  // 7. Galeria e lightbox da página Sobre
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrevious = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  if (
    galleryItems.length > 0 &&
    lightbox &&
    lightboxImage &&
    lightboxClose &&
    lightboxPrevious &&
    lightboxNext
  ) {
    let imagemAtual = 0;

    function mostrarImagem(indice) {
      imagemAtual = (indice + galleryItems.length) % galleryItems.length;
      const imagem = galleryItems[imagemAtual].querySelector("img");

      lightboxImage.src = imagem.src;
      lightboxImage.alt = imagem.alt;
    }

    function abrirLightbox(indice) {
      mostrarImagem(indice);
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
    }

    function fecharLightbox() {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    galleryItems.forEach((item, indice) => {
      item.addEventListener("click", () => abrirLightbox(indice));
    });

    lightboxClose.addEventListener("click", fecharLightbox);
    lightboxPrevious.addEventListener("click", () => mostrarImagem(imagemAtual - 1));
    lightboxNext.addEventListener("click", () => mostrarImagem(imagemAtual + 1));

    lightbox.addEventListener("click", (evento) => {
      if (evento.target === lightbox) {
        fecharLightbox();
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (!lightbox.classList.contains("active")) return;

      if (evento.key === "Escape") fecharLightbox();
      if (evento.key === "ArrowLeft") mostrarImagem(imagemAtual - 1);
      if (evento.key === "ArrowRight") mostrarImagem(imagemAtual + 1);
    });
  }

  // 8. Slideshow da página inicial
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

/* =========================================================
   GALERIA DE FOTOS - LIGHTBOX
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.querySelector(".lightbox-close");
    const lightboxPrev = document.querySelector(".lightbox-prev");
    const lightboxNext = document.querySelector(".lightbox-next");

    let currentImage = 0;

    if (galleryItems.length > 0 && lightbox) {

        function showImage(index) {

            currentImage =
                (index + galleryItems.length) % galleryItems.length;

            const image =
                galleryItems[currentImage].querySelector("img");

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";
        }

        function closeLightbox() {

            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");

            document.body.style.overflow = "";
        }

        galleryItems.forEach(function (item, index) {

            item.addEventListener("click", function () {
                showImage(index);
            });

        });

        if (lightboxClose) {
            lightboxClose.addEventListener("click", closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener("click", function () {
                showImage(currentImage - 1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener("click", function () {
                showImage(currentImage + 1);
            });
        }

        lightbox.addEventListener("click", function (event) {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });

        document.addEventListener("keydown", function (event) {

            if (!lightbox.classList.contains("active")) {
                return;
            }

            if (event.key === "Escape") {
                closeLightbox();
            }

            if (event.key === "ArrowLeft") {
                showImage(currentImage - 1);
            }

            if (event.key === "ArrowRight") {
                showImage(currentImage + 1);
            }

        });

    }

});

/* =========================================================
   BUSCA, FILTRO E ORDENAÇÃO DE PRODUTOS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const productGrid = document.querySelector(".produtos-grid");
    const searchInput = document.getElementById("buscarProduto");
    const sortSelect = document.getElementById("ordenarProdutos");
    const filterButtons = document.querySelectorAll(".filtro");

    if (!productGrid) {
        return;
    }

    let categoriaAtual = "todos";

    function atualizarProdutos() {

        const cards = Array.from(
            productGrid.querySelectorAll(".produto-card")
        );

        const termo =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";

        cards.forEach(function (card) {

            const nome =
                card.dataset.nome?.toLowerCase() || "";

            const categoria =
                card.dataset.categoria?.toLowerCase() || "";

            const texto =
                card.textContent.toLowerCase();

            const correspondeBusca =
                nome.includes(termo) ||
                texto.includes(termo);

            const correspondeCategoria =
                categoriaAtual === "todos" ||
                categoria === categoriaAtual;

            if (correspondeBusca && correspondeCategoria) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

        ordenarProdutos();

        atualizarContador();

    }


    function ordenarProdutos() {

        const cards = Array.from(
            productGrid.querySelectorAll(".produto-card")
        );

        const ordem = sortSelect
            ? sortSelect.value
            : "original";

        if (ordem === "nome") {

            cards.sort(function (a, b) {

                const nomeA = a.dataset.nome.toLowerCase();
                const nomeB = b.dataset.nome.toLowerCase();

                return nomeA.localeCompare(nomeB);

            });

        }

        if (ordem === "menor-preco") {

            cards.sort(function (a, b) {

                return (
                    parseFloat(a.dataset.preco) -
                    parseFloat(b.dataset.preco)
                );

            });

        }

        if (ordem === "maior-preco") {

            cards.sort(function (a, b) {

                return (
                    parseFloat(b.dataset.preco) -
                    parseFloat(a.dataset.preco)
                );

            });

        }

        cards.forEach(function (card) {

            productGrid.appendChild(card);

        });

    }


    function atualizarContador() {

        const cards =
            productGrid.querySelectorAll(".produto-card");

        const visiveis =
            Array.from(cards).filter(function (card) {

                return card.style.display !== "none";

            });

        const contador =
            document.querySelector(".produtos-count strong");

        if (contador) {

            contador.textContent = visiveis.length;

        }

    }


    /* BUSCA */

    if (searchInput) {

        searchInput.addEventListener("input", atualizarProdutos);

    }


    /* ORDENAÇÃO */

    if (sortSelect) {

        sortSelect.addEventListener("change", atualizarProdutos);

    }


    /* FILTROS */

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            categoriaAtual =
                button.dataset.categoria;

            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            atualizarProdutos();

        });

    });


    atualizarProdutos();

});