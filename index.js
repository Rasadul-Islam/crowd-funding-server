const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzkk6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // const database = client.db("insertDB");
    // const haiku = database.collection("haiku");
    const campaignCollection = client.db('campaignDB').collection('campaign');

    //post campaign data
    app.post('/campaign', async (req, res) => {
      const newCampaign = req.body;
      console.log(newCampaign);
      const result = await campaignCollection.insertOne(newCampaign);
      res.send(result);
    })

    //get All campaigns data on port
    app.get('/all-campaign', async (req, res) => {
      const cursor = campaignCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    //get Running campaigns data on port
    app.get('/campaign', async (req, res) => {
      const cursor = campaignCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })

    // Get My campaign data
    app.get('/campaign/my/:email', async (req, res) => {
      const email = req.params.email;
      const query = { creatorEmail: email }
      const result = await campaignCollection.find(query).toArray();
      res.send(result);
    })

    // get campaign's one ditails data by id
    app.get('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await campaignCollection.findOne(query);
      res.send(result);
    })

    // delete one campaign data by id
    app.delete('/campaign/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await campaignCollection.deleteOne(query);
      res.send(result);
    })

    // Get one campaign data in Update
    app.get('/campaign/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await campaignCollection.findOne(query);
      res.send(result);
    })
    // Update one campaign data
    app.put('/campaign/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCampaign = req.body;

      const campaign = {
        $set: {
          image: updateCampaign.image,
          title: updateCampaign.title,
          campaign_type: updateCampaign.campaign_type,
          description: updateCampaign.description,
          donation_amount: updateCampaign.donation_amount,
          deadline: updateCampaign.deadline,
        }
      }
      const result = await campaignCollection.updateOne(filter,campaign, options,)
      res.send(result);
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




app.get('/', (req, res) => {
  res.send('Crwod fonidng server is Runing')
})

app.listen(port, () => {
  console.log(`funding server is running on port: ${port}`)
})




