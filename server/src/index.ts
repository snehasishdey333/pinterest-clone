import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import coookieParser from 'cookie-parser'


// ROUTE IMPORTS
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import pinRoutes from './routes/pins'
import commentRoutes from './routes/comments'
import { errorHandler } from './middlewares/error'
import verifyToken from './middlewares/verifyToken'


// CONFIGURATIONS
dotenv.config()
const app=express()
app.use(express.json())
app.use(cors({origin:process.env.CLIENT_ORIGIN,credentials:true}))
app.use(coookieParser())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))



// ROUTES
app.get("/",(req,res)=>{
    // curl http://localhost:8000
    res.send("hello world!")
})

app.use("/api/auth",authRoutes)
app.use("/api/users",verifyToken,userRoutes)
app.use("/api/pins",pinRoutes)
app.use("/api/comments",commentRoutes)

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
});

// SERVER
const port=Number(process.env.PORT) || 3001
app.listen(port,"0.0.0.0",()=>{
    console.log(`Server running on port ${port}`)
})




