const express = require('express');
const cors = require('cors');
const app=express()
require('dotenv').config()
const port=process.env.PORT||5000;
const instructor=require('./instructors.json')

app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{
    res.send('Summer Fashion Is running')
})

app.get('/instructor',(req,res)=>{
    res.send(instructor)
})

app.listen(port,()=>{
    console.log(`Fashion is running on port: ${port}`)
})