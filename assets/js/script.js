document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. MENU MOBILE
    // ==========================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    const apiUrl = "http://127.0.0.1:3000";

    async function fazerLogout(e) {
        e.preventDefault();

        try {
            const resposta = await fetch(`${apiUrl}/logout`, {
                method: "POST",
                credentials: "include"
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.erro || "Erro ao sair.");
            }

            window.location.href = "login.html";
        } catch (erro) {
            console.error("Erro ao fazer logout:", erro);
            alert("Não foi possível encerrar a sessão.");
        }
    }

    document.querySelectorAll(".nav-logout").forEach((botao) => {
        botao.addEventListener("click", fazerLogout);
    });

    const linkLogin = document.querySelector(".nav-login");

    if (linkLogin) {
        fetch(`${apiUrl}/sessao`, {
            method: "GET",
            credentials: "include"
        }).then((resposta) => {
            if (resposta.ok) {
                linkLogin.textContent = "Sair";
                linkLogin.href = "#";
                linkLogin.classList.remove("nav-login");
                linkLogin.classList.add("nav-logout");
                linkLogin.addEventListener("click", fazerLogout);
            }
        }).catch(() => {
            // O restante da página continua disponível sem o backend.
        });
    }


    // ==========================================
    // 2. CADASTRO DE PRODUTO
    // ==========================================

    const formCrud = document.getElementById("form-crud");

    if (formCrud) {
        formCrud.addEventListener("submit", async (e) => {
            e.preventDefault();

            const titulo = document
                .getElementById("titulo")
                .value
                .trim();

            const categoria = document
                .getElementById("categoria")
                .value;

            const preco = document
                .getElementById("preco")
                .value;

            const descricao = document
                .getElementById("descricao")
                .value
                .trim();

            try {
                const itemId = document
                    .getElementById("item-id")
                    .value;

                const resposta = await fetch(
                    itemId
                        ? `${apiUrl}/produtos/${itemId}`
                        : `${apiUrl}/produtos`,
                    {
                        method: itemId ? "PUT" : "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },

                        // Envia o cookie da sessão
                        credentials: "include",

                        body: JSON.stringify({
                            id_categoria: Number(categoria),
                            nome: titulo,
                            descricao: descricao,
                            preco: Number(preco),
                            unidade_medida: "unidade"
                        })
                    }
                );

                const resultado = await resposta.json();

                if (!resposta.ok) {
                    alert(
                        resultado.erro ||
                        "Erro ao cadastrar produto."
                    );
                    return;
                }

                alert(
                    itemId
                        ? "Produto atualizado com sucesso!"
                        : "Produto cadastrado com sucesso!"
                );

                // Limpa o formulário
                formCrud.reset();
                document.getElementById("item-id").value = "";
                document.getElementById("form-title").textContent =
                    "Cadastrar Novo Produto / Serviço";
                document.querySelector("#form-crud button[type='submit']")
                    .textContent = "Salvar Item";

                // Atualiza a lista de produtos
                carregarProdutos();

            } catch (erro) {
                console.error(
                    "Erro ao cadastrar produto:",
                    erro
                );

                alert(
                    "Não foi possível conectar com o servidor."
                );
            }
        });
    }


    // ==========================================
    // 3. CARREGAR MEUS PRODUTOS
    // ==========================================

    async function carregarProdutos() {
        try {
            const resposta = await fetch(
                "http://127.0.0.1:3000/meus-produtos",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!resposta.ok) {
                const resultado = await resposta.json();

                throw new Error(
                    resultado.erro ||
                    "Erro ao buscar seus produtos."
                );
            }

            const produtos = await resposta.json();

            console.log(
                "Meus produtos recebidos da API:",
                produtos
            );

            atualizarRelatorio(produtos);
            carregarResumoProducao();

            const listaItens =
                document.getElementById("lista-itens");

            if (!listaItens) {
                return;
            }

            listaItens.innerHTML = "";

            produtos.forEach((produto) => {
                const linha =
                    document.createElement("tr");

                linha.innerHTML = `
                    <td>
                        ${produto.nome}
                    </td>

                    <td>
                        ${produto.id_categoria}
                    </td>

                    <td>
                        R$ ${Number(produto.preco).toFixed(2)}
                    </td>

                    <td>
                        ${produto.unidade_medida || "-"}
                    </td>

                    <td>
                        <button
                            type="button"
                            class="btn-editar"
                            data-id="${produto.id_produto}">
                            Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            data-id="${produto.id_produto}">
                            Excluir
                        </button>
                    </td>
                `;

                listaItens.appendChild(linha);
            });

            document.querySelectorAll(".btn-excluir").forEach((botao) => {
                botao.addEventListener("click", () => {
                    const id_produto = botao.dataset.id;
                    excluirProduto(id_produto);
                });
            });

            document.querySelectorAll(".btn-editar").forEach((botao) => {
                botao.addEventListener("click", () => {
                    const produto = produtos.find((item) =>
                        String(item.id_produto) === botao.dataset.id
                    );

                    if (produto) {
                        editarProduto(produto);
                    }
                });
            });

        } catch (erro) {
            console.error(
                "Erro ao carregar meus produtos:",
                erro
            );

            const listaItens =
                document.getElementById("lista-itens");

            if (listaItens) {
                listaItens.innerHTML = `
                    <tr>
                        <td colspan="5">
                            Não foi possível carregar seus produtos.
                        </td>
                    </tr>
                `;
            }
        }
    }

    function editarProduto(produto) {
        const formulario = document.getElementById("form-crud");

        if (!formulario) {
            return;
        }

        document.getElementById("item-id").value = produto.id_produto;
        document.getElementById("titulo").value = produto.nome || "";
        document.getElementById("categoria").value = produto.id_categoria || "";
        document.getElementById("preco").value = produto.preco || "";
        document.getElementById("descricao").value = produto.descricao || "";
        document.getElementById("form-title").textContent =
            "Editar Produto / Serviço";
        document.querySelector("#form-crud button[type='submit']")
            .textContent = "Atualizar Item";

        formulario.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function atualizarRelatorio(produtos) {
        const totalProdutos = produtos.length;
        const categorias = new Map();
        const unidades = new Map();
        const nomesCategorias = {
            2: "Frutas",
            3: "Verduras",
            4: "Legumes",
            5: "Raízes",
            6: "Grãos",
            7: "Temperos",
            8: "Hortaliças",
            9: "Derivados",
            10: "Orgânicos",
            11: "Artesanais"
        };

        produtos.forEach((produto) => {
            const categoria = String(produto.id_categoria);
            const unidade = produto.unidade_medida || "Não informada";

            categorias.set(categoria, (categorias.get(categoria) || 0) + 1);
            unidades.set(unidade, (unidades.get(unidade) || 0) + 1);
        });

        const precoMedio = totalProdutos > 0
            ? produtos.reduce((total, produto) =>
                total + Number(produto.preco || 0), 0
            ) / totalProdutos
            : 0;

        const elementoProdutos = document.getElementById("relatorio-produtos");
        const elementoCategorias = document.getElementById("relatorio-categorias");
        const elementoPrecoMedio = document.getElementById("relatorio-preco-medio");
        const listaCategorias = document.getElementById("relatorio-categorias-lista");
        const elementoStatus = document.getElementById("relatorio-status");

        if (elementoProdutos) {
            elementoProdutos.textContent = totalProdutos;
        }

        if (elementoCategorias) {
            elementoCategorias.textContent = categorias.size;
        }

        if (elementoPrecoMedio) {
            elementoPrecoMedio.textContent = totalProdutos > 0
                ? `R$ ${precoMedio.toFixed(2).replace(".", ",")}`
                : "R$ 0,00";
        }

        if (elementoStatus) {
            elementoStatus.textContent = "Dados atualizados";
        }

        if (listaCategorias) {
            if (categorias.size === 0) {
                listaCategorias.innerHTML = `
                    <div class="relatorio-vazio">
                        <span>📊</span>
                        <p>Nenhum produto cadastrado.</p>
                    </div>
                `;
            } else {
                listaCategorias.innerHTML = Array.from(categorias.entries())
                    .map(([categoria, quantidade]) => {
                        const percentual = (quantidade / totalProdutos) * 100;
                        const nome = nomesCategorias[categoria] || `Categoria ${categoria}`;

                        return `
                            <div class="categoria-relatorio">
                                <div>
                                    <span>${nome}</span>
                                    <strong>${quantidade}</strong>
                                </div>
                                <div class="categoria-barra">
                                    <span style="width: ${percentual}%"></span>
                                </div>
                            </div>
                        `;
                    })
                    .join("");
            }
        }

        const unidadeMaisUtilizada = Array.from(unidades.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        const elementoUnidade = document.getElementById("relatorio-unidade");

        if (elementoUnidade && unidadeMaisUtilizada) {
            elementoUnidade.textContent = unidadeMaisUtilizada;
        }
    }

    function exibirResumoProducao(resumo) {
        const ultimaColheita = document.getElementById("relatorio-ultima-colheita");
        const registros = document.getElementById("relatorio-registros");
        const producao = document.getElementById("relatorio-producao");
        const unidade = document.getElementById("relatorio-unidade");
        const campoData = document.getElementById("ultima-colheita");
        const campoRegistros = document.getElementById("total-registros");
        const campoUnidade = document.getElementById("unidade-mais-utilizada");

        if (ultimaColheita) {
            ultimaColheita.textContent = resumo.ultima_colheita
                ? resumo.ultima_colheita.split("T")[0].split("-").reverse().join("/")
                : "Não informada";
        }

        if (registros) {
            registros.textContent = resumo.total_registros ?? 0;
        }

        if (producao) {
            producao.textContent = resumo.total_registros ?? 0;
        }

        if (unidade) {
            unidade.textContent = resumo.unidade_mais_utilizada || "Não informada";
        }

        if (campoData) {
            campoData.value = resumo.ultima_colheita
                ? resumo.ultima_colheita.split("T")[0]
                : "";
        }

        if (campoRegistros) {
            campoRegistros.value = resumo.total_registros ?? 0;
        }

        if (campoUnidade) {
            campoUnidade.value = resumo.unidade_mais_utilizada || "";
        }
    }

    async function carregarResumoProducao() {
        if (!document.getElementById("form-resumo-producao")) {
            return;
        }

        try {
            const resposta = await fetch(`${apiUrl}/resumo-producao`, {
                method: "GET",
                credentials: "include"
            });

            if (!resposta.ok) {
                return;
            }

            exibirResumoProducao(await resposta.json());
        } catch (erro) {
            console.error("Erro ao carregar resumo da produção:", erro);
        }
    }

    const formResumoProducao = document.getElementById("form-resumo-producao");

    if (formResumoProducao) {
        formResumoProducao.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const resposta = await fetch(`${apiUrl}/resumo-producao`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ultima_colheita: document.getElementById("ultima-colheita").value,
                        total_registros: document.getElementById("total-registros").value,
                        unidade_mais_utilizada: document
                            .getElementById("unidade-mais-utilizada")
                            .value
                            .trim()
                    })
                });

                const resultado = await resposta.json();

                if (!resposta.ok) {
                    alert(resultado.erro || "Erro ao salvar resumo da produção.");
                    return;
                }

                exibirResumoProducao(resultado);
                alert("Resumo da produção atualizado com sucesso!");
            } catch (erro) {
                console.error("Erro ao salvar resumo da produção:", erro);
                alert("Não foi possível conectar com o servidor.");
            }
        });
    }

// Carrega os produtos somente se
// existir a tabela no HTML
if (document.getElementById("lista-itens")) {
    carregarProdutos();
}

// BOTÃO DE EXCLUIR PRODUTO

async function excluirProduto(id_produto) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `http://127.0.0.1:3000/produtos/${id_produto}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(
                resultado.erro ||
                "Erro ao excluir produto."
            );
            return;
        }

        alert("Produto excluído com sucesso!");

        // Atualiza a tabela depois da exclusão
        carregarProdutos();

    } catch (erro) {
        console.error(
            "Erro ao excluir produto:",
            erro
        );

        alert(
            "Não foi possível conectar com o servidor."
        );
    }
}

    // ==========================================
    // 4. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
    // ==========================================

    const formContato =
        document.getElementById("contatoForm");

    if (formContato) {

        const campoNome =
            document.getElementById("name");

        const campoEmail =
            document.getElementById("email");

        const campoMensagem =
            document.getElementById("message");


        // Cria mensagem de erro abaixo do campo
        function mostrarErro(campo, mensagem) {

            campo.classList.add("campo-invalido");

            let mensagemErro =
                campo.parentElement.querySelector(
                    `.mensagem-erro[data-campo="${campo.id}"]`
                );

            if (!mensagemErro) {

                mensagemErro =
                    document.createElement("small");

                mensagemErro.classList.add(
                    "mensagem-erro"
                );

                mensagemErro.dataset.campo =
                    campo.id;

                campo.insertAdjacentElement(
                    "afterend",
                    mensagemErro
                );
            }

            mensagemErro.textContent =
                mensagem;
        }


        // Remove mensagem de erro
        function removerErro(campo) {

            campo.classList.remove(
                "campo-invalido"
            );

            const mensagemErro =
                campo.parentElement.querySelector(
                    `.mensagem-erro[data-campo="${campo.id}"]`
                );

            if (mensagemErro) {
                mensagemErro.remove();
            }
        }


        // Envio do formulário
        formContato.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();

                let formularioValido = true;

                const nome =
                    campoNome.value.trim();

                const email =
                    campoEmail.value.trim();

                const mensagem =
                    campoMensagem.value.trim();


                // Limpa erros anteriores
                removerErro(campoNome);
                removerErro(campoEmail);
                removerErro(campoMensagem);


                // Validação do nome
                if (nome === "") {

                    mostrarErro(
                        campoNome,
                        "Por favor, informe seu nome."
                    );

                    formularioValido = false;

                } else if (nome.length < 3) {

                    mostrarErro(
                        campoNome,
                        "O nome deve ter pelo menos 3 caracteres."
                    );

                    formularioValido = false;
                }


                // Validação do e-mail
                const formatoEmail =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (email === "") {

                    mostrarErro(
                        campoEmail,
                        "Por favor, informe seu e-mail."
                    );

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


                // Se houver erro, para aqui
                if (!formularioValido) {
                    return;
                }


                // Envia para o backend
                try {

                    const resposta = await fetch(
                        "http://localhost:3000/contato",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                nome: nome,
                                email: email,
                                mensagem: mensagem
                            })
                        }
                    );

                    const resultado =
                        await resposta.json();


                    if (!resposta.ok) {

                        alert(
                            resultado.erros
                                ? resultado.erros.join("\n")
                                : "Erro ao enviar mensagem."
                        );

                        return;
                    }


                    alert(
                        resultado.mensagem
                    );

                    formContato.reset();

                } catch (erro) {

                    console.error(
                        "Erro ao enviar formulário:",
                        erro
                    );

                    alert(
                        "Não foi possível enviar a mensagem. Verifique se o servidor está funcionando."
                    );
                }
            }
        );


        // Remove erro do nome enquanto corrige
        campoNome.addEventListener(
            "input",
            () => {

                if (
                    campoNome.value.trim().length >= 3
                ) {
                    removerErro(campoNome);
                }
            }
        );


        // Remove erro do e-mail enquanto corrige
        campoEmail.addEventListener(
            "input",
            () => {

                const formatoEmail =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                    formatoEmail.test(
                        campoEmail.value.trim()
                    )
                ) {
                    removerErro(campoEmail);
                }
            }
        );


        // Remove erro da mensagem enquanto corrige
        campoMensagem.addEventListener(
            "input",
            () => {

                if (
                    campoMensagem.value.trim().length >= 10
                ) {
                    removerErro(campoMensagem);
                }
            }
        );
    }


    // ==========================================
    // 5. ALTERNÂNCIA ENTRE LOGIN E CADASTRO
    // ==========================================

    const tabLogin =
        document.getElementById("tab-login");

    const tabCadastro =
        document.getElementById("tab-cadastro");

    const formLogin =
        document.getElementById("form-login");

    const formCadastro =
        document.getElementById("form-cadastro");


    if (
        tabLogin &&
        tabCadastro &&
        formLogin &&
        formCadastro
    ) {

        tabLogin.addEventListener(
            "click",
            () => {

                tabLogin.classList.add("active");

                tabCadastro.classList.remove(
                    "active"
                );

                formLogin.classList.remove(
                    "hidden"
                );

                formCadastro.classList.add(
                    "hidden"
                );
            }
        );


        tabCadastro.addEventListener(
            "click",
            () => {

                tabCadastro.classList.add(
                    "active"
                );

                tabLogin.classList.remove(
                    "active"
                );

                formCadastro.classList.remove(
                    "hidden"
                );

                formLogin.classList.add(
                    "hidden"
                );
            }
        );
    }


    // ==========================================
    // 6. LOGIN DO USUÁRIO
    // ==========================================

    if (formLogin) {

        formLogin.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();


                // Pega o e-mail
                const email =
                    document
                        .getElementById("login-email")
                        .value
                        .trim();


                // Pega a senha
                const senha =
                    document
                        .getElementById("login-senha")
                        .value;


                // Pega o tipo de usuário
                const tipoUsuario =
                    document.querySelector(
                        'input[name="tipo-login"]:checked'
                    )?.value;


                // Verifica se escolheu o tipo
                if (!tipoUsuario) {

                    alert(
                        "Selecione se você deseja entrar como consumidor ou produtor."
                    );

                    return;
                }


                try {

                    // Envia os dados para o backend
                    const resposta =
                        await fetch(
                            "http://127.0.0.1:3000/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                // Permite receber e salvar
                                // o cookie da sessão
                                credentials: "include",

                                body: JSON.stringify({
                                    email: email,
                                    senha: senha,
                                    tipoUsuario: tipoUsuario
                                })
                            }
                        );


                    const resultado =
                        await resposta.json();


                    // Se houver erro
                    if (!resposta.ok) {

                        alert(
                            resultado.erro ||
                            "Erro ao realizar login."
                        );

                        return;
                    }


                    // Login realizado
                    alert(
                        resultado.mensagem
                    );


                    // Mostra no console
                    console.log(
                        "Usuário logado:",
                        resultado.usuario
                    );

                    console.log(
                        "Tipo de usuário:",
                        resultado.tipoUsuario
                    );


                    // Vai para o perfil
                    window.location.href =
                        "perfil.html";


                } catch (erro) {

                    console.error(
                        "Erro ao fazer login:",
                        erro
                    );

                    alert(
                        "Não foi possível conectar com o servidor."
                    );
                }
            }
        );
    }


    // ==========================================
    // 7. CADASTRO DO USUÁRIO
    // ==========================================

    if (formCadastro) {

        formCadastro.addEventListener(
            "submit",
            async (e) => {

                e.preventDefault();


                const nome =
                    document
                        .getElementById("cad-nome")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("cad-email")
                        .value
                        .trim();


                const senha =
                    document
                        .getElementById("cad-senha")
                        .value;


                const tipoUsuario =
                    document.querySelector(
                        'input[name="tipo-usuario"]:checked'
                    )?.value;


                console.log(
                    "Tipo de usuário escolhido:",
                    tipoUsuario
                );


                // Validação da senha
                if (senha.length < 6) {

                    alert(
                        "A senha deve ter no mínimo 6 caracteres."
                    );

                    return;
                }


                // Verifica o tipo de usuário
                if (!tipoUsuario) {

                    alert(
                        "Selecione se você deseja se cadastrar como consumidor ou produtor."
                    );

                    return;
                }


                try {

                    // Define a rota conforme o tipo
                    const urlCadastro =
                        tipoUsuario === "produtor"
                            ? "http://localhost:3000/produtores"
                            : "http://localhost:3000/consumidores";


                    // Envia para o backend
                    const resposta =
                        await fetch(
                            urlCadastro,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    nome: nome,
                                    email: email,
                                    senha: senha
                                })
                            }
                        );


                    const resultado =
                        await resposta.json();


                    // Se houver erro
                    if (!resposta.ok) {

                        alert(
                            resultado.erro ||
                            "Erro ao cadastrar usuário."
                        );

                        return;
                    }


                    // Cadastro realizado
                    alert(
                        resultado.mensagem
                    );


                    // Limpa o formulário
                    formCadastro.reset();


                    // Volta para login
                    tabLogin.click();


                } catch (erro) {

                    console.error(
                        "Erro ao cadastrar:",
                        erro
                    );

                    alert(
                        "Não foi possível conectar com o servidor."
                    );
                }
            }
        );
    }


    // ==========================================
    // 8. CARREGAR INFORMAÇÕES DO PERFIL
    // ==========================================

    const userName =
        document.getElementById("user-name");

    const userEmail =
        document.getElementById("user-email");

    const areaProdutor =
        document.getElementById("area-produtor");

    const tituloPainel =
        document.getElementById("titulo-painel");


    if (userName && userEmail) {

        fetch(
            "http://127.0.0.1:3000/perfil",
            {
                method: "GET",
                credentials: "include"
            }
        )

            .then(async (resposta) => {

                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    throw new Error(
                        resultado.erro
                    );
                }


                // Mostra os dados do usuário
                userName.textContent =
                    resultado.nome;

                userEmail.textContent =
                    resultado.email;


                // ==================================
                // IDENTIFICA O TIPO DE USUÁRIO
                // ==================================

                const tipoUsuario =
                    resultado.tipoUsuario;


                // Se for produtor
                if (tipoUsuario === "produtor") {

                    if (areaProdutor) {

                        areaProdutor.style.display =
                            "";
                    }


                    if (tituloPainel) {

                        tituloPainel.textContent =
                            "Painel de Gerenciamento do Produtor";
                    }

                }


                // Se for consumidor
                else {

                    if (areaProdutor) {

                        areaProdutor.style.display =
                            "none";
                    }


                    if (tituloPainel) {

                        tituloPainel.textContent =
                            "Meu Perfil";
                    }
                }

            })


            .catch((erro) => {

                console.error(
                    "Erro ao carregar perfil:",
                    erro
                );


                userName.textContent =
                    "Não foi possível carregar";

                userEmail.textContent =
                    "Não foi possível carregar";


                // Esconde área de produtor
                if (areaProdutor) {

                    areaProdutor.style.display =
                        "none";
                }
            });
    }


    // ==========================================
    // 9. SCROLL REVEAL E EFEITO TILT
    // ==========================================

    const revealElements =
        document.querySelectorAll(
            ".scroll-reveal"
        );


    if (revealElements.length > 0) {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            (element) => {

                observer.observe(element);
            }
        );
    }


    // Efeito Tilt nos cards
    const cards =
        document.querySelectorAll(
            ".benefit-card, .testimonial-card"
        );


    if (cards.length > 0) {

        const rotateMax = 8;


        cards.forEach(
            (card) => {

                card.style.transformStyle =
                    "preserve-3d";

                card.style.transition =
                    "transform 220ms ease, box-shadow 220ms ease";


                card.addEventListener(
                    "mousemove",
                    (e) => {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            e.clientX -
                            rect.left;

                        const y =
                            e.clientY -
                            rect.top;


                        const cx =
                            rect.width / 2;

                        const cy =
                            rect.height / 2;


                        const dx =
                            (x - cx) / cx;

                        const dy =
                            (y - cy) / cy;


                        const rx =
                            (-dy * rotateMax)
                                .toFixed(2);

                        const ry =
                            (dx * rotateMax)
                                .toFixed(2);


                        card.style.transform =
                            `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;


                        card.style.boxShadow =
                            "0 18px 40px rgba(0,0,0,0.28)";
                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "";

                        card.style.boxShadow =
                            "";
                    }
                );
            }
        );
    }


    // ==========================================
    // 10. GALERIA E LIGHTBOX
    // ==========================================

    const galleryItems =
        document.querySelectorAll(
            ".gallery-item"
        );

    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );

    const lightboxClose =
        document.querySelector(
            ".lightbox-close"
        );

    const lightboxPrevious =
        document.querySelector(
            ".lightbox-prev"
        );

    const lightboxNext =
        document.querySelector(
            ".lightbox-next"
        );


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

            imagemAtual =
                (indice + galleryItems.length) %
                galleryItems.length;


            const imagem =
                galleryItems[
                    imagemAtual
                ].querySelector("img");


            lightboxImage.src =
                imagem.src;

            lightboxImage.alt =
                imagem.alt;
        }


        function abrirLightbox(indice) {

            mostrarImagem(indice);

            lightbox.classList.add(
                "active"
            );

            lightbox.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow =
                "hidden";

            lightboxClose.focus();
        }


        function fecharLightbox() {

            lightbox.classList.remove(
                "active"
            );

            lightbox.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.style.overflow =
                "";
        }


        galleryItems.forEach(
            (item, indice) => {

                item.addEventListener(
                    "click",
                    () => {

                        abrirLightbox(indice);
                    }
                );
            }
        );


        lightboxClose.addEventListener(
            "click",
            fecharLightbox
        );


        lightboxPrevious.addEventListener(
            "click",
            () => {

                mostrarImagem(
                    imagemAtual - 1
                );
            }
        );


        lightboxNext.addEventListener(
            "click",
            () => {

                mostrarImagem(
                    imagemAtual + 1
                );
            }
        );


        lightbox.addEventListener(
            "click",
            (evento) => {

                if (
                    evento.target === lightbox
                ) {

                    fecharLightbox();
                }
            }
        );


        document.addEventListener(
            "keydown",
            (evento) => {

                if (
                    !lightbox.classList.contains(
                        "active"
                    )
                ) {
                    return;
                }


                if (
                    evento.key === "Escape"
                ) {

                    fecharLightbox();
                }


                if (
                    evento.key === "ArrowLeft"
                ) {

                    mostrarImagem(
                        imagemAtual - 1
                    );
                }


                if (
                    evento.key === "ArrowRight"
                ) {

                    mostrarImagem(
                        imagemAtual + 1
                    );
                }
            }
        );
    }


    // ==========================================
    // 11. SLIDESHOW DA PÁGINA INICIAL
    // ==========================================

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    const dots =
        document.querySelectorAll(
            ".dot"
        );

    const prevBtn =
        document.querySelector(
            ".slide-btn.prev"
        );

    const nextBtn =
        document.querySelector(
            ".slide-btn.next"
        );


    if (slides.length > 0) {

        let currentSlide = 0;
        let slideInterval;


        function showSlide(index) {

            slides.forEach(
                (slide) => {

                    slide.classList.remove(
                        "active"
                    );
                }
            );


            dots.forEach(
                (dot) => {

                    dot.classList.remove(
                        "active"
                    );
                }
            );


            slides[index].classList.add(
                "active"
            );


            if (dots[index]) {

                dots[index].classList.add(
                    "active"
                );
            }


            currentSlide = index;
        }


        function nextSlide() {

            const nextIndex =
                (currentSlide + 1) %
                slides.length;

            showSlide(nextIndex);
        }


        function prevSlide() {

            const prevIndex =
                (currentSlide - 1 + slides.length) %
                slides.length;

            showSlide(prevIndex);
        }


        function startSlideshow() {

            slideInterval =
                setInterval(
                    nextSlide,
                    5000
                );
        }


        function resetSlideshow() {

            clearInterval(
                slideInterval
            );

            startSlideshow();
        }


        if (nextBtn) {

            nextBtn.addEventListener(
                "click",
                () => {

                    nextSlide();
                    resetSlideshow();
                }
            );
        }


        if (prevBtn) {

            prevBtn.addEventListener(
                "click",
                () => {

                    prevSlide();
                    resetSlideshow();
                }
            );
        }


        dots.forEach(
            (dot, index) => {

                dot.addEventListener(
                    "click",
                    () => {

                        showSlide(index);
                        resetSlideshow();
                    }
                );
            }
        );


        showSlide(0);
        startSlideshow();
    }


    // ==========================================
    // 12. BUSCA, FILTRO E ORDENAÇÃO
    // ==========================================

    const productGrid =
        document.querySelector(
            ".produtos-grid"
        );

    const searchInput =
        document.getElementById(
            "buscarProduto"
        );

    const sortSelect =
        document.getElementById(
            "ordenarProdutos"
        );

    const filterButtons =
        document.querySelectorAll(
            ".filtro"
        );


    if (!productGrid) {
        return;
    }


    let categoriaAtual = "todos";


    function atualizarProdutos() {

        const cards =
            Array.from(
                productGrid.querySelectorAll(
                    ".produto-card"
                )
            );


        const termo =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        cards.forEach(
            (card) => {

                const nome =
                    card.dataset.nome
                        ? card.dataset.nome.toLowerCase()
                        : "";


                const categoria =
                    card.dataset.categoria
                        ? card.dataset.categoria.toLowerCase()
                        : "";


                const texto =
                    card.textContent.toLowerCase();


                const correspondeBusca =
                    nome.includes(termo) ||
                    texto.includes(termo);


                const correspondeCategoria =
                    categoriaAtual === "todos" ||
                    categoria === categoriaAtual;


                if (
                    correspondeBusca &&
                    correspondeCategoria
                ) {

                    card.style.display = "";

                } else {

                    card.style.display =
                        "none";
                }
            }
        );


        ordenarProdutos();
        atualizarContador();
    }


    function ordenarProdutos() {

        const cards =
            Array.from(
                productGrid.querySelectorAll(
                    ".produto-card"
                )
            );


        const ordem =
            sortSelect
                ? sortSelect.value
                : "original";


        if (ordem === "nome") {

            cards.sort(
                (a, b) => {

                    const nomeA =
                        a.dataset.nome
                            .toLowerCase();

                    const nomeB =
                        b.dataset.nome
                            .toLowerCase();


                    return nomeA.localeCompare(
                        nomeB
                    );
                }
            );
        }


        if (ordem === "menor-preco") {

            cards.sort(
                (a, b) => {

                    return (
                        parseFloat(
                            a.dataset.preco
                        ) -
                        parseFloat(
                            b.dataset.preco
                        )
                    );
                }
            );
        }


        if (ordem === "maior-preco") {

            cards.sort(
                (a, b) => {

                    return (
                        parseFloat(
                            b.dataset.preco
                        ) -
                        parseFloat(
                            a.dataset.preco
                        )
                    );
                }
            );
        }


        cards.forEach(
            (card) => {

                productGrid.appendChild(
                    card
                );
            }
        );
    }


    function atualizarContador() {

        const cards =
            productGrid.querySelectorAll(
                ".produto-card"
            );


        const visiveis =
            Array.from(cards)
                .filter(
                    (card) =>
                        card.style.display !==
                        "none"
                );


        const contador =
            document.querySelector(
                ".produtos-count strong"
            );


        if (contador) {

            contador.textContent =
                visiveis.length;
        }
    }


    // Busca
    if (searchInput) {

        searchInput.addEventListener(
            "input",
            atualizarProdutos
        );
    }


    // Ordenação
    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            atualizarProdutos
        );
    }


    // Filtros
    filterButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    categoriaAtual =
                        button.dataset.categoria;


                    filterButtons.forEach(
                        (btn) => {

                            btn.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    atualizarProdutos();
                }
            );
        }
    );


    atualizarProdutos();

});