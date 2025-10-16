import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import  connectDB from './config/db.js'
import userRouter from './routes/userRouters.js'
import imageRouter from './routes/imageRouts.js'


const PORT = process.env.PORT || 4000
const app  = express()

app.use(express.json())
app.use(cors())
await connectDB()

app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)
app.get('/',(req,res)=>res.send("API Working fine"))


app.listen(PORT,()=>console.log('server is running '+ PORT));