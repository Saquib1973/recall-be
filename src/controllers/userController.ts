import { Request, Response } from 'express'
import { UserModel } from '../schema/db/userSchema'
import jwt from 'jsonwebtoken'
import env from '../utils/config'
import { userSignInSchema, userSignupSchema } from '../schema/zod/userSchema'
import { comparePassword, createPassswordHash } from '../utils/helper'
const userController = {
  async signup(req: Request, res: Response) {
    const { username, password } = req.body
    const check = userSignupSchema.safeParse({ username, password })
    if (!check.success) {
      res.status(404).json({
        message:
          'make sure username is unique and password is minimum 5 characters long',
      })
      return
    }
    try {
      const hashedPassword = await createPassswordHash(password)
      const user = await UserModel.create({
        username,
        password: hashedPassword,
      })
      res.status(200).json({
        message: 'User siggned up successfully',
      })
    } catch (error) {
      res.status(400).json({
        message: 'Internal server error',
      })
    }
  },
  async username(req: Request, res: Response) {
    const { username } = req.body
    const user = await UserModel.findOne({ username })
    if (user) {
      res.status(200).json({
        value:false,
        message: 'Username already in use',
      })
      return
    } else {
      res.status(200).json({
        value:true,
        message: 'Username is available',
      })
    }
  },
  async signin(req: Request, res: Response) {
    const { username, password } = req.body

    const check = userSignInSchema.safeParse({ username, password })
    if (!check.success) {
      res.status(400).json({ message: 'Invalid username or password format' })
      return
    }

    try {
      const user = await UserModel.findOne({ username })
      if (!user) {
        res.status(401).send('Invalid credentials')
        return
      }

      const isMatch = await comparePassword(password, user.password as string)
      if (!isMatch) {
        res.status(401).json({ message: 'Unauthorized access, Denied' })
        return
      }

      const token = jwt.sign({ id: user._id }, env.JWT_SECRET)
      res.status(200).json({ token })
    } catch (error) {
      console.error('Error during signin:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}

export default userController
