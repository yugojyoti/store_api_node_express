require('dotenv').config()

//async error
require('express-async-errors')


const express=require('express')
const app=express()
const connectDB=require('./db/connect.js')
const productsRouter=require('./routes/products.js')

const notFoundMiddleware=require('./middleware/not-found.js')
const errorMiddleware=require('./middleware/error-handler.js')

app.use(express.json())

//routes
app.get('/', (req,res)=>{
    res.send('<h1> store Api </h1> <a href="api/v1/products">products routes</a>')
})

app.use('/api/v1/products',productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port=process.env.PORT || 3000

const start= async()=>{
    try {
        //connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log(` Server is listening in http://localhost:${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()