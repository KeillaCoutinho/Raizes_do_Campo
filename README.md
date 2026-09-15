# 🌱 Agricultura Familiar - Raízes do Campo

## 📖 Sobre o Projeto

**Raízes do Campo** é um site informativo desenvolvido com **HTML, CSS e JavaScript** com o objetivo de promover a **Agricultura Familiar**, destacando sua importância para a sustentabilidade, a economia local e a segurança alimentar.

O projeto apresenta informações sobre os benefícios da agricultura familiar, sua relevância para a sociedade e disponibiliza um canal de contato para aproximar produtores e consumidores.

---

## 🚀 Funcionalidades

* Página inicial com seção de destaque (*Hero Section*);
* Navegação responsiva com menu hambúrguer;
* Seção "Sobre" explicando o conceito de agricultura familiar;
* Seção de benefícios para a comunidade;
* Área de contato;
* Rodapé com informações e links rápidos;
* Efeitos de animação e rolagem suave;
* Acessibilidade com link "Ir para o conteúdo principal".

---

## 🛠️ Tecnologias Utilizadas

* **HTML5**
* **CSS3**
* **JavaScript**
* **Google Fonts**

  * Playfair Display
  * Lora
  * DM Sans

---

## 📂 Estrutura do Projeto

```bash
Raizes-do-Campo/
│
├── index.html
├── sobre.html
├── contato.html
├── beneficios.html
│
├── css/
│   └── styles.css
│
├── assets/
│   └── js/
│       └── script.js
│
└── README.md
```

---

## 🎯 Objetivos

Este projeto busca:

* Incentivar a valorização da agricultura familiar;
* Divulgar práticas sustentáveis de produção;
* Mostrar a importância dos pequenos produtores rurais;
* Fortalecer a conexão entre produtores e consumidores;
* Contribuir para a conscientização ambiental e social.

---

## 📱 Responsividade

O site foi desenvolvido para funcionar em diferentes tamanhos de tela, oferecendo uma boa experiência tanto em computadores quanto em dispositivos móveis.

---

## ♿ Acessibilidade

Foram implementados alguns recursos de acessibilidade, como:

* Link de navegação rápida para o conteúdo principal;
* Estrutura semântica utilizando `<header>`, `<nav>`, `<section>` e `<footer>`;
* Uso adequado de títulos e hierarquia de informações.

---

## 📞 Contato

**Email:** [contato@agricultura.com](mailto:contato@agricultura.com)
**Telefone:** (75) 99999-9999

---

## 👥 Equipe

Projeto desenvolvido como parte do **Projeto Integrador - Liga Steam / ArcelorMittal**, com foco na disseminação de informações sobre agricultura familiar e sustentabilidade.

---

## 📄 Licença

Este projeto é de caráter acadêmico e educacional, podendo ser utilizado como referência para estudos e projetos relacionados à sustentabilidade e desenvolvimento web.

## ☁️ Deploy no Render

O projeto pode ser publicado como um **Web Service** único, pois o backend também serve os arquivos do site.

1. Envie o projeto para um repositório no GitHub e crie um Web Service no [Render](https://render.com/).
2. Selecione a raiz do repositório como **Root Directory**.
3. Use `npm ci` em **Build Command** e `npm start` em **Start Command**.
4. Cadastre estas variáveis em **Environment**:

```text
NODE_ENV=production
SESSION_SECRET=uma-chave-longa-e-aleatoria
DB_HOST=...
DB_PORT=5432
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
```

O Render fornece `PORT` automaticamente. O banco precisa ser um PostgreSQL acessível pelo serviço e já conter as tabelas usadas pela aplicação. Se o frontend for publicado em outro domínio, adicione também `FRONTEND_URL` com a URL completa dele, por exemplo `https://seu-site.onrender.com`.

---

### 🌿 "Fortalecendo o campo e alimentando o Brasil."
