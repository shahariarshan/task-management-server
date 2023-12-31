const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hoyasjp.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const tasksCollections = client.db('TasksDb').collection('Task')
    const usersCollections = client.db('TasksDb').collection('users')


    app.post('/tasks', async (req, res) => {
      const taskItem = req.body
      const result = await tasksCollections.insertOne(taskItem)
      res.send(result)
  })

  app.get('/tasks', async (req, res) => {
    const result = await tasksCollections.find().toArray()
    res.send(result)
})
app.get('/tasks/:id', async (req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const result = await tasksCollections.findOne(query)
  res.send(result)

})

 app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollections.insertOne(users)
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const result = await usersCollections.find().toArray()
            res.send(result);
        })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Task Management System Running')
})
app.listen(port,()=>{
    console.log(`Task management Running On port ${port}`);
})