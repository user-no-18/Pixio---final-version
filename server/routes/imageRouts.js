import express from 'express'
import { generateImage } from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'
const imageRouter = express.Router()

imageRouter.post('/generate-image',userAuth,generateImage)

export default imageRouter

//This file creates a secure POST route /generate-image that only allows logged-in users to generate an AI image using their prompt.