import * as z from "zod"

export const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  interests: z.string().min(10, "Merci de décrire vos besoins (10 caractères minimum)")
})

export type FormData = z.infer<typeof formSchema> 