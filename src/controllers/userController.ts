import { Request, Response } from 'express'
import { UserModel } from '../schema/db/userSchema'
import jwt from 'jsonwebtoken'
import env from '../utils/config'
import {
  resetPasswordSchema,
  userSignInSchema,
  userSignupSchema,
} from '../schema/zod/userSchema'
import { Password } from '../utils/helper'
const userController = {
  async signup(req: Request, res: Response) {
    const { username, password } = req.body
    const alreadyExists = await UserModel.findOne({ username })
    if (alreadyExists) {
      res.status(400).json({
        message: 'Username already in use',
      })
      return
    }
    const check = userSignupSchema.safeParse({ username, password })

    if (!check.success) {
      res.status(404).json({
        message:
          'make sure username is unique and password is minimum 5 characters long',
      })
      return
    }
    try {
      const hashedPassword = await Password.hash(password)
      const user = await UserModel.create({
        username,
        password: hashedPassword,
      })
      res.status(200).json({
        message: 'User signed up successfully',
      })
    } catch (error) {
      res.status(400).json({
        message: 'Internal server error',
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
        res.status(401).json({
          message: 'Username is invalid',
        })
        return
      }

      const isMatch = await Password.compare(password, user.password as string)
      if (!isMatch) {
        res.status(401).json({ message: 'Password is wrong' })
        return
      }

      const token = jwt.sign({ id: user._id }, env.JWT_SECRET)
      res.status(200).json({ token, message: 'Successfull' })
    } catch (error) {
      console.error('Error during signin:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  async resetPassword(req: Request, res: Response) {
    const { password, newPassword } = req.body
    const { userId: _id } = req
    try {
      //check if user exists
      const user = await UserModel.findOne({ _id })
      if (!user) {
        res.status(401).json({
          message: 'Username is invalid',
        })
        return
      }

      //compare the password
      const isMatch = await Password.compare(password, user.password as string)
      if (!isMatch) {
        res.status(401).json({ message: 'Password is wrong' })
        return
      }
      const samePassword = await Password.compare(newPassword, user.password as string);
      if (samePassword) {
        res.status(400).json({ message: 'New password cannot be the same as the old password' })
        return
      }

      //password zod validation
      const check = resetPasswordSchema.safeParse({ password: newPassword })
      if (!check.success) {
        res.status(400).json({ message: 'Invalid password format' })
        return
      }

      //hash password
      const hashedPassword = await Password.hash(newPassword)

      //upadte password in db
      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id },
        { password: hashedPassword }
      )
      if (!updatedUser) {
        res
          .status(400)
          .json({ message: 'Could not reset the password try again!' })
        return
      }

      res.status(202).json({
        message: 'password changed successfully',
      })
    } catch (error) {
      console.error('Error during signin:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  async username(req: Request, res: Response) {
    const { username } = req.body
    const user = await UserModel.findOne({ username })
    if (user) {
      res.status(200).json({
        value: false,
        message: 'Username already in use',
      })
      return
    }
    res.status(200).json({
      value: true,
      message: 'Username is available',
    })
  },
}

export default userController
