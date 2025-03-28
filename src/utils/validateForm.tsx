import { z } from "zod";

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const phoneRegex = /^99|9[1-5]\d{7}$/gm;
const passwordRegex =
  /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,255})/g;

export const schemeRegister = z
  .object({
    name: z.string().trim().min(4, "O nome deve ter pelo menos 4 caracteres"),
    email: z.string().trim().email("Digite um e-mail válido"),
  password: z
    .string()
    .trim()
    .regex(passwordRegex, {
      message:
        "Senha inválida",
    })
    .max(255, "Senha inválida"),
  confirmPassword: z.string().optional(),
  phone: z
    .string()
    .trim()
    .length(9, { message: "O telefone deve possuir exatamente 9 dígitos" })
    .regex(phoneRegex, {
      message:
        "Número de telefone inválido. Use um número que comece com 99 ou de 91 a 95.",
    }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const schemeLogin = z
  .object({
    email: z.string().trim().email("Digite um e-mail válido"),
    password: z
    .string()
    .trim()
    .regex(passwordRegex, {
      message:
        "senha inválida.",
    })
    .max(255, "senha inválida.")});

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
    .max(200, { message: 'A descrição pode ter no máximo 200 caracteres.' })
    .optional(),
  hourlyRate: z.number({message: "O campo recebe números inteiros e decimais ex: 20,20"}).min(0),
  thumbnailUrl: z.string().url({message: 'Imagem inválida'}).max(255).optional(),
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

export const schemeUser = z.object({
  id: z.string().trim().ulid({
    message: "ID inválido",
  }).optional(),
  name: z
    .string()
    .trim()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "O nome não pode ter mais de 100 caracteres" })
    .regex(nameRegex, { message: "O nome contém caracteres inválidos" }),
  email: z
    .string()
    .trim()
    .email({ message: "Digite um e-mail válido" })
    .max(255, { message: "O e-mail não pode ter mais de 255 caracteres" }),
  phone: z
    .string()
    .trim()
    .length(9, { message: "O telefone deve ter exatamente 9 dígitos" })
    .regex(phoneRegex, { message: "Número de telefone inválido" }),
  type: z
    .enum(["administrator", "operator", "client"], {
      message: "Tipo de usuário inválido",
    })
    .default("client"),
  password: z
    .string()
    .trim()
    .regex(passwordRegex, {
      message:
        "A senha deve ter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.",
    })
    .max(255, "A senha deve ter no máximo 255 caracteres")
});


 export const schemeCourtType = z.object({
  id: z.number().int().positive().max(32_767).optional(),
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
id: z.number().int().positive().max(32_767).optional(),
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
  id: z.number().int().positive().max(32_767).optional(),
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

export const schemePaymentMethods = z.object({
  id: z.number().int().positive().max(32_767).optional(),
 name: z.string({
  required_error: 'O nome do método é obrigatório.',
  invalid_type_error: 'O nome do método deve ser uma string.',
})
.trim()
.min(3, { 
  message: 'O nome do método deve ter pelo menos 3 caracteres.',
})
.max(15, {
  message: 'O nome da método deve ter no máximo 15 caracteres.',
})
.regex(/^[a-zA-ZÀ-ÿ]+(?:\s[a-zA-ZÀ-ÿ]+)*$/, {
  message:
    'O nome da método deve conter apenas letras e espaços e não pode começar ou terminar com espaço.',
})

} )

export const schemeBooking = z.object({
  fieldId: z.string().ulid({
    message: "O ID do campo deve ser um ULID válido.",
  }).optional(),
  day: z.string().date({
    message: "O dia deve estar no formato de data válido (YYYY-MM-DD).",
  }).optional(),
  fieldAvailabilityId: z.number().int().positive(),
  paymentMethodId: z.number().int().positive().max(32_767)
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
