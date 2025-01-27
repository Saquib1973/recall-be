import { z } from "zod";

const userSignupSchema = z.object({
  username : z.string().transform(username=>username.trim().toLowerCase()),
  password:z.string().min(5,"Password must be atleast 5 characters long").transform(password=>password.trim())
})
const userSignInSchema = z.object({

})

export {userSignupSchema,userSignInSchema}