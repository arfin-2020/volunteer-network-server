const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();


const app = express()
const port = 5000;

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r5j5a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// console.log(uri)
//middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server successfully run.')
  })


  
  
const run = async() =>{
    try{
        await client.connect();
        const eventsCollections  = client.db("volunteerNetwork").collection("events");
        const registereventsCollections  = client.db("volunteerNetwork").collection("registerEvents");
       
        //    await eventsCollections.insertOne(events)
        // .then(result=>{
        //     console.log(`A document was inserted with the _id: ${result.insertedId}`);
        // })
        // .catch(err=>{
        //     console.log(err.message)
        // })
        // console.log("Connected successfully to server");

        // Get Methods 
        app.get("/events",async(req,res)=>{
            const dataFromDB = eventsCollections.find({});
            await dataFromDB.toArray()
            .then(result=>{
                // console.log('Data Come from DB')
                res.send(result);
            });

        })
        app.get("/allVoluenteer",async(req,res)=>{
          const allVoluenteerDataFromDB = registereventsCollections.find({});
          await allVoluenteerDataFromDB.toArray()
          .then(result=>{
            res.send(result)
          })
        })

        // POST methods

        app.post("/registers",async(req,res)=>{
            const eventRegister = req.body;
            // console.log("She hitting me",req.body);
            const result = await registereventsCollections.insertOne(eventRegister);
            // console.log(
            //     `A document was inserted with the _id: ${result.insertedId}`,
            //  );
            res.json(result)
        })
        // Data fetching  query byName using post methods

        app.post('/allevents/byName',async(req,res)=>{
            // console.log("O bagi ase ne?--",req.body)
            const name = req.body;
            const query  = {name: {$in: name}};
            const events = await registereventsCollections.find(query).toArray();
            res.send(events)
        })

        app.post('/addEvent',async(req,res)=>{
          const addEvent = req.body;
          // console.log(addEvent)
          const result = await eventsCollections.insertOne(addEvent)
          res.json(result)
        })

        //DELETE MEthods

        app.delete('/events/:id',async(req,res)=>{
          // console.log(req.params.id);
          const id = req.params.id;
          const query = {_id: ObjectID(id)}
          const result = await registereventsCollections.deleteOne(query);
          if(result.deletedCount === 1){
            console.log('Data Deleted successfull.')
            res.json(result)
          }
        })

       
    }catch(error){
        console.log(error.message)
    }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})