Initialize fake api server: npx json-server --watch server/db.json --port 5000

Para fazer **POST**, **PUT** e **DELETE** usando o **TanStack React Query** com uma **Fake API** do **JSON Server**, siga os passos abaixo:

---

## 📌 **1. Criar o JSON Server**  
Se ainda não instalou, execute:  

```sh
npm install -g json-server
```

Agora, crie um arquivo `db.json` com alguns dados iniciais:  

```json
{
  "products": [
    { "id": 1, "name": "Bola de Futebol", "price": 50 },
    { "id": 2, "name": "Tênis Esportivo", "price": 120 }
  ]
}
```

Agora, rode o servidor:  

```sh
json-server --watch db.json --port 3001
```

Agora você tem uma **API Fake** rodando em `http://localhost:3001/products`.

---

## 📌 **2. Configurar o TanStack Query no Projeto**  
Se ainda não instalou, faça isso com:  

```sh
npm install @tanstack/react-query axios
```

Agora, configure o `QueryClient` no seu `main.tsx`:  

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

---

## 📌 **3. Criar Funções para POST, PUT e DELETE**  
Crie um arquivo `api.ts` para centralizar os requests:  

```tsx
import axios from "axios";

const API_URL = "http://localhost:3001/products";

// Criar um produto (POST)
export const createProduct = async (product: { name: string; price: number }) => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

// Atualizar um produto (PUT)
export const updateProduct = async (product: { id: number; name: string; price: number }) => {
  const response = await axios.put(`${API_URL}/${product.id}`, product);
  return response.data;
};

// Excluir um produto (DELETE)
export const deleteProduct = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
```

---

## 📌 **4. Usar as Mutations no React Query**
Agora, crie um **hook** para gerenciar essas operações no seu componente:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct, deleteProduct } from "../api";

export function useProducts() {
  const queryClient = useQueryClient();

  // Criar produto
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Atualizar produto
  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Deletar produto
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
```

---

## 📌 **5. Criar o Componente de Teste**
Agora, use essas **mutations** dentro de um componente:  

```tsx
import { useState } from "react";
import { useProducts } from "../hooks/useProducts";

function ProductManager() {
  const { createMutation, updateMutation, deleteMutation } = useProducts();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Gerenciar Produtos</h2>
      
      {/* Criar Produto */}
      <input 
        type="text" 
        placeholder="Nome do Produto" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="border p-2 mr-2"
      />
      <input 
        type="number" 
        placeholder="Preço" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        className="border p-2 mr-2"
      />
      <button 
        className="bg-green-500 text-white px-4 py-2" 
        onClick={() => createMutation.mutate({ name, price: Number(price) })}
      >
        Adicionar
      </button>

      {/* Atualizar Produto */}
      <button 
        className="bg-blue-500 text-white px-4 py-2 ml-2"
        onClick={() => updateMutation.mutate({ id: 1, name: "Novo Nome", price: 200 })}
      >
        Atualizar Produto 1
      </button>

      {/* Deletar Produto */}
      <button 
        className="bg-red-500 text-white px-4 py-2 ml-2"
        onClick={() => deleteMutation.mutate(1)}
      >
        Excluir Produto 1
      </button>
    </div>
  );
}

export default ProductManager;
```

---

### 🚀 **Pronto!**
Agora seu React Query está funcionando com **POST**, **PUT** e **DELETE** usando uma API Fake com **JSON Server**! 🎯  

Se precisar de algo mais, só avisar! 🔥

