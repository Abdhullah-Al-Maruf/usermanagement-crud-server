// step 1: Load environment variables first
require("dotenv").config();

const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 5000;

// step 2
app.use(cors());
app.use(express.json());

//  step 3
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_SECRET}@cluster0.gklgo91.mongodb.net/?appName=Cluster0`;

// step 4
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// step 5
const run = async () => {
  try {
    await client.connect();

    // step 6 from mongodb documentation  to get data from db
    const db = client.db("simpleCrud");
    const userCollection = db.collection("users");

    //  make a api for the users
    // Create   operation
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });


    //  api for single data
    app.get("/users/:id", async (req, res) => {
      // get the id
      const id = req.params.id;
      // write query for find by id
      const query = {
        _id: new ObjectId(id),
      };
      // now find it
      const user = await userCollection.findOne(query);
      // send it to the client side
      res.send(user);
    });
    // --------------------------------

 // Delete  operation

    app.delete("/users/:id",async (req,res)=>{

      // get the id 
      const id =req.params.id;
      // query for find the id
      const query ={
        _id :new ObjectId(id),
      }
      // delete the selected user
      const result = await userCollection.deleteOne(query)
      // send it 
      res.send(result)
    })




    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment app. You successfully connected to MongoDB!",
    );
  } finally {
    //  await client.close();
  }
};

app.get("/", (req, res) => {
  res.send("Simple crud application is running red go!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

run().catch(console.dir);
