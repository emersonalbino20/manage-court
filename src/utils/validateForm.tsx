import { z } from "zod";

export const schemeAccount = z
  .object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    senha: z.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    confirmarSenha: z.string(),
    telefone: z.string().min(9, "Digite um número de telefone válido"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

 export const schemeCourt = z
  .string({
    required_error: 'O nome da quadra é obrigatório.',
    invalid_type_error: 'O nome da quadra deve ser uma string.',
  })
  .trim()
  .min(4, {
    message: 'O nome da quadra deve ter pelo menos 3 caracteres.',
  })
  .max(25, {
    message: 'O nome da quadra deve ter no máximo 25 caracteres.',
  })
  .regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
    message:
      'O nome da quadra deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
  })

export const validateAccountForm = () => {
    const errors = {};
    
    if (!formData.nome) errors.nome = "Nome é obrigatório";
    if (!formData.sobrenome) errors.sobrenome = "Sobrenome é obrigatório";
    
    if (!formData.email) {
      errors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }
    
    if (!formData.senha) {
      errors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      errors.senha = "Senha deve ter pelo menos 6 caracteres";
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      errors.confirmarSenha = "As senhas não coincidem";
    }
    
    return errors;
  };