const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000 ; 
const app = express(); 

app.use(cors());
app.use(express.json());


/// Username -->jahidulislam0248
//password -->gFmvt72JMKDVhIhW


const uri = "mongodb+srv://jahidulislam0248:gFmvt72JMKDVhIhW@cluster1.7i4ix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

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

    const usersCollections = client.db('usersDB').collection('users');

        //read
    app.get('/users', async(req,res)=>{
        const cursor = usersCollections.find();
        const results = await cursor.toArray();
        res.send(results)
    })

    //update
    app.get('/users/:id', async(req,res) =>{
        const id = req.params.id; 
        const query  = {_id: new ObjectId(id)}
        const user = await usersCollections.findOne(query); 
        res.send(user)
    })
        //create  
    app.post('/users', async(req,res)=>{
      const user = req.body; 
      console.log('new user', user)
      const result = await usersCollections.insertOne(user);
      res.send(result);
      
    }); 

    //user update put/replace
    app.put('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);
      const filter = {_id:new ObjectId(id)}
      const options =  {upsert: true}
      const updatedUser ={
        $set: {
          name: user.name,
          email: user.email
        }
      }

      const result = await usersCollections.updateOne(filter,updatedUser,options)
      res.send(result)
    })

      //user delete 
    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id  
      console.log('Please delete from database',id)
      const query = {_id: new ObjectId(id)}

      const result  = await usersCollections.deleteOne(query);
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
  res.send('Simple Crud is  Running!')
})

app.listen(port , ()=>{
  console.log(`Simple Crud Running Port ${port}`)
})
