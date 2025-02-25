import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().nullable(),
});

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  pseudo: z.string(),
  role: z.enum(["USER", "BUILDER", "OWNER", "ADMIN"]),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE", "SUSPENDED", "DELETED"]),
  stripeCustomerId: z.string().nullable(),
  rememberMeToken: z.string().nullable(),
  isEmailVerified: z.boolean(),
  profile: profileSchema.optional(),
});

export type User = z.infer<typeof userSchema>;
