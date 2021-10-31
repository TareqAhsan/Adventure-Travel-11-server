const express = require("express");
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
//connection uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aubya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const database = client.db("Travel");
    const packageCollection = database.collection("packages");
    const bookCollection = database.collection("booking");
    //get api all data 
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const result = await cursor.toArray();
    //   console.log(result);
      res.send(result);
    });
    // get a single data
    app.get('/packages/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await packageCollection.findOne(query)
        // console.log(query);
        res.send(result)
    })
    app.get('/book/:email',async(req,res)=>{
      const email = req.params.email;
      const filter = {email:email}
        // console.log(email);
      const result = await bookCollection.find(filter).toArray()
      console.log(result);
      res.send(result)
    })
    app.post('/book/add',async(req,res)=>{
      const result = await  bookCollection.insertOne(req.body)
      console.log(result);
      res.send(result)
    })
    app.delete('/book/:id',async(req,res)=>{
      const id = req.params.id
      const cursor = {_id:ObjectId(id)}
      const result = await bookCollection.deleteOne(cursor)
      console.log(result);
      res.send(result)
    });
    //delete api from manage all booking
    app.delete('/manage/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id:ObjectId(id)}
      const result = await bookCollection.deleteOne(filter)
      console.log(result);
      res.send(result)
    })
    // get api from bookCollection
    app.get('/manage',async(req,res)=>{
      const cursor = bookCollection.find({})
      const result = await cursor.toArray()
      console.log(result)
      res.send(result)
    })
    //post new add packages api
    app.post('/addnew',async(req,res)=>{
      const body = req.body
      const result = await packageCollection.insertOne(body)
      console.log(result);
      res.send(result)
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
