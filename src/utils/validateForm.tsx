import { z } from "zod";

export const schemeAccount = z
  .object({
    nome: z.string().min(4, "O nome deve ter pelo menos 5 caracteres"),
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

export const schemeCourt = z.object({
  id: z.string().ulid().optional(),
  fieldTypeId: z.number({message: 'opção inválida'}).int({message: 'Opção inválida'}).positive().max(32_767),
  name: z
    .string({
      required_error: 'O nome da quadra é obrigatório.',
      invalid_type_error: 'O nome da quadra deve ser uma string.',
    })
    .trim()
    .min(3, { message: 'O nome da quadra deve ter pelo menos 3 caracteres.' })
    .max(25, { message: 'O nome da quadra deve ter no máximo 25 caracteres.' })
    .regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
      message: 'O nome da quadra deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
    }),
  description: z
    .string()
    .trim()
    .min(10, {message: 'A descrição deve ter no mínimo 10 caracteres'})
    .max(100, { message: 'A descrição pode ter no máximo 100 caracteres.' })
    .optional(),
  hourlyRate: z.number({message: "O campo recebe números inteiros e decimais ex: 20,20"}).min(0),
  thumbnailUrl: z.string().url({message: 'Imagem inválida'}).max(255),
  address: z.object({
    street: z.string().trim().min(1, {message: "O nome da rua deve ter pelo menos 1 letra"}).max(80).regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
      message: 'O nome da rua deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
    }),
    cityId: z.number().int().positive(),
    provinceId: z.number().int().positive(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
  })
})


 export const schemeCourtType = z.object({
  id: z.number().int().positive().max(32_767),
  name:z
  .string({
    required_error: 'O nome da quadra é obrigatório.',
    invalid_type_error: 'O nome da quadra deve ser uma string.',
  })
  .trim()
  .min(3, {
    message: 'O nome da quadra deve ter pelo menos 3 caracteres.',
  })
  .max(25, {
    message: 'O nome da quadra deve ter no máximo 25 caracteres.',
  })
  .regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
    message:
      'O nome da quadra deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
  })})

 export const schemeProvince = z.object({
id: z.number().int().positive().max(32_767),
  name:z
  .string({
    required_error: 'O nome da província é obrigatório.',
    invalid_type_error: 'O nome da provínvia deve ser uma string.',
  })
  .trim()
  .min(4, {
    message: 'O nome da província deve ter pelo menos 3 caracteres.',
  })
  .max(25, {
    message: 'O nome da província deve ter no máximo 25 caracteres.',
  })
  .regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
    message:
      'O nome da província deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
  })})

 export const schemeCity = z.object({
  id: z.number().int().positive().max(32_767),
  provinceId: z.number().int().positive().max(32_767),
   name: z.string({
  required_error: 'O nome da cidade é obrigatório.',
  invalid_type_error: 'O nome da cidade deve ser uma string.',
})
.trim()
.min(3, { 
  message: 'O nome da cidade deve ter pelo menos 3 caracteres.',
})
.max(25, {
  message: 'O nome da cidade deve ter no máximo 25 caracteres.',
})
.regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
  message:
    'O nome da cidade deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
})

} )



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



const customZod = z.string().superRefine((val, ctx) => {
  // Validação para formato de data (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  // Validação para formato de hora (HH:MM)
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  return {
    date: () => {
      return customZod.refine(
        (val) => dateRegex.test(val),
        { message: "Data deve estar no formato YYYY-MM-DD" }
      );
    },
    time: () => {
      return customZod.refine(
        (val) => timeRegex.test(val),
        { message: "Hora deve estar no formato HH:MM" }
      );
    },
    ulid: () => {
      return customZod.refine(
        (val) => val.length === 26 && /^[0-9A-Z]+$/.test(val),
        { message: "ULID inválido" }
      );
    },
  };
});

// Novo esquema de validação para o formulário de agendamento
export const schemeCourtAvailability = z.object({
  id: z.number().int().positive({
    message: "O ID deve ser um número inteiro positivo.",
  }).optional(),
  fieldId: z.string().ulid({
    message: "O ID do campo deve ser um ULID válido.",
  }).optional(),
  day: z.string().date({
    message: "O dia deve estar no formato de data válido (YYYY-MM-DD).",
  }),
  startTime: z.string().time({
    message: "O horário de início deve estar no formato HH:MM:SS.",
  }),
  endTime: z.string().time({
    message: "O horário de término deve estar no formato HH:MM:SS.",
  }),
});
