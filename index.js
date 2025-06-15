require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middlewares
app.use(express.json());
app.use(cors())


/*******########### Start:  MongoDB  ###########*****/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3h4lqut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    /***********************START: playing field******************************************* */

const tourPackagesCollection = client.db('tourNowDB').collection('all-packages')

/***### post/insert in the MongoDB ### */
app.post('/all-packages', async (req, res)=>{
  const newPackage = req.body
  const result =await tourPackagesCollection.insertOne(newPackage);
  res.send (result)
})
 /**##### END: post/insert in the MongoDB ####*/


  /**##### All the posted packages List ####*/
app.get('/all-packages', async (req, res)=>{
  const packages = await tourPackagesCollection.find().toArray()
  res.send (packages)
})


 /**#single package details page ####*/
 app.get ('/pkg-details/:id', async (req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const package = await tourPackagesCollection.findOne(query);
  res.send (package)
 })

 
/**#### manageMyPackages: to show only logged in user's/guides posted Packages #### */
app.get (`/manage-my-packages/:email`, async (req, res)=>{
  const email = req.params.email
  const query = {guide_email: email }
  const myPackages = await tourPackagesCollection.find(query).toArray()
  res.send (myPackages)
})

/**#### Delete from database #### */
app.delete (`/manage-my-packages/:id`, async (req, res)=>{
  const id = req.params.id
  const query = {_id: id};
  const result = await tourPackagesCollection.deleteOne(query)
  res.send(result)
})

    /***********************END: playing field******* ******************************************/


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
/*******############ END:  MongoDB  #############*****/



/*********######ExpressJS ########## */
app.get('/', (req, res) => {
  res.send('TourNOW Data base running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
