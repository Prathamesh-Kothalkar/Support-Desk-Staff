import { z } from "zod";


export const staffSignUpValidation = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    email: z.string().email("Invalid email address"),
    class: z.enum(["First Year", "Second Year", "Third Year", "Final Year"]),
    dept: z
        .string()
        .max(50, "Department name is too long"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters"),
}) 