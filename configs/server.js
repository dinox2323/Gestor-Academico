'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import authRoutes from '../src/auth/auth.routes.js';
import alumnoRoutes from '../src/alumno/alumno.routes.js';
import courseRoutes from '../src/course/course.routes.js';
import apiLimiter from '../src/middlewares/validar-cant-peticiones.js'

const middlewares = app => {
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(apiLimiter)
}

const router = (app) => {
    app.use('/centroEducativo/v1/auth', authRoutes)
    app.use('/centroEducativo/v1/alumno', alumnoRoutes)
    app.use('/centroEducativo/v1/course', courseRoutes)
}

const conectarDB = async () =>{
    try{
        await dbConnection()
    }catch(err){
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}

export const initServer = () => {
    const app = express()
    try{
        middlewares(app)
        conectarDB()
        router(app)
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    }catch(err){
        console.log(`Server init failed: ${err}`)
    }
}