const express = require('express');
const cors = require('cors');
const app=express()
require('dotenv').config()
const port=process.env.PORT||5000;
const instructor=require('./instructors.json')
const classes=require('./classes.json')

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.snwbd1q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addCollection=client.db('vacationDb').collection('addclass');

    app.post('/addclass',async(req,res)=>{
        const item=req.body;
     const result=await addCollection.insertOne(item)
     res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




















app.get('/',(req,res)=>{
    res.send('Summer Fashion Is running')
})


app.get('/instructor',(req,res)=>{
    res.send(instructor)
})

app.get('/classes',(req,res)=>{
    res.send(classes)
})

app.listen(port,()=>{
    console.log(`Fashion is running on port: ${port}`)
})