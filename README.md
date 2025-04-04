# 🏀 Reserve Court

**Reserve Court** é uma plataforma web para agendamento de quadras esportivas. Com uma interface moderna e responsiva, oferece funcionalidades adaptadas para diferentes tipos de usuários: **cliente**, **operador** e **administrador**.

## 🎯 Objetivo

Facilitar o agendamento de quadras desportivas com gestão de reservas, pagamentos e administração centralizada.

---

## 👥 Tipos de Usuários

- **Client (Cliente)**:  
  - Pode agendar quadras com base na disponibilidade.  
  - Escolher método de pagamento.  
  - Aguardar aprovação do agendamento.

- **Operator (Operador)**:  
  - Aprova ou cancela agendamentos.  
  - Gera e administra os pagamentos.  
  - Consulta estatísticas sobre reservas.

- **Administrator (Administrador)**:  
  - Gera e gerencia usuários, quadras e outras entidades.  
  - Acompanha dados estatísticos como:
    - Quadras reservadas
    - Reservas pendentes
    - Usuários ativos
    - Comparações mensais (diferença entre o mês atual e anterior)

---

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.com/)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)

---

## 📦 Instalação

> ⚠️ Este projeto refere-se apenas ao **frontend**. Para funcionamento completo, é necessário também o **backend**.

### 1. Clonar o repositório

```bash
git clone https://github.com/emersonalbino20/reserve-court.git
cd reserve-court
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Rodar o projeto

```bash
npm run dev
```

> Certifique-se de ter o **Node.js** instalado no sistema operacional.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do repositório
2. Crie uma branch para a sua feature (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: minha nova feature'`)
4. Faça push para a sua branch (`git push origin minha-feature`)
5. Abra um **Pull Request**

---

## 📁 Organização do Projeto

```bash
📦 reserve-court/
├── src/
│   ├── pages/             # Páginas principais da aplicação
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Hooks customizados (ex: AuthContext)
│   ├── services/          # Axios e chamadas à API
│   ├── routes/            # Rotas da aplicação
│   └── styles/            # Estilos globais
```

---

## ⚙️ Funcionalidades

- Autenticação por tipo de usuário
- Agendamento com seleção de data/hora
- Gestão de quadras e usuários
- Visualização de estatísticas com comparativos mensais
- Upload de imagem de comprovante de pagamento (caso aplicável)
- Controle de status de agendamentos (pendente, aprovado, cancelado)

---

## 📬 Contato

Desenvolvido por [@emersonalbino20](https://github.com/emersonalbino20)