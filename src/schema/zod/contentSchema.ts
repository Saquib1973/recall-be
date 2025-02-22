import { z } from "zod";


export const tagValidationZod = z.object({
  tag:z.string().trim().toLowerCase()
})