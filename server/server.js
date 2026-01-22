import express from 'express'
import dotenv from'dotenv' 
import cors from 'cors'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import taskRoutes from './routes/taskRoutes.js'


const app = express()
dotenv.config()
connectDB()

app.use(cors())
app.use(express.json())

app.get('/api/test', (req, res)=> {
    res.json({message: 'Backend is reachable'})
})

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
    res.send('API is running')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, '127.0.0.1', () =>
    console.log(`Server is running on port ${PORT}`))