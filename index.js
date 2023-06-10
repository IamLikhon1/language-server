const express = require('express');
const cors = require('cors');
const app=express()
require('dotenv').config()
const stripe=require('stripe')(process.env.PAYMENT_SECRET_KEY)
const port=process.env.PORT||5000;
const instructor=require('./instructors.json')
const classes=require('./classes.json')

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // await client.connect();

    const userCollection=client.db('vacationDb').collection('user')
    const addCollection=client.db('vacationDb').collection('addclass');



    app.get('/users',async(req,res)=>{
      const result=await userCollection.find().toArray()
      res.send(result)
    })

    app.get('/users/admin/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email:email};
      const user=await userCollection.findOne(query)
      const result={admin:user?.role==='admin'}
      res.send(result)
    })



    app.post('/users',async(req,res)=>{
      const user=req.body;
      const query={email:user.email};
      const existingUser=await userCollection.findOne(query);
      if(existingUser){
        return res.send({message:'User Already Have Exists'})
      }
      const result=await userCollection.insertOne(user)
      res.send(result)
    })

    app.patch('/users/admin/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const updateDoc={
        $set:{
          role:'admin'
        }
      }
      const result=await userCollection.updateOne(filter,updateDoc);
      res.send(result)
    })

    app.patch('/users/instructor/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const updateDoc={
        $set:{
          role:'instructor'
        }
      }
      const result=await userCollection.updateOne(filter,updateDoc);
      res.send(result)
    })






    app.post('/addclass',async(req,res)=>{
      const item=req.body;
      const result=await addCollection.insertOne(item)
     res.send(result)
    });

    app.get('/getAllClass',async(req,res)=>{
        const result=await addCollection.find().toArray()
        res.send(result)
    })

    app.get('/getAllClass/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await addCollection.findOne(query)
      res.send(result)
    })

    app.delete('/delete/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)};
        const result=await addCollection.deleteOne(query)
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