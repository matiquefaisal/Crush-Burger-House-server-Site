const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hbtn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
try{

    await client.connect();
    const database =client.db('travel_user')
    const servicesCollection = database.collection('services');
    const OrderCollection = database.collection('AllOrder');

    //get api
    app.get('/services', async(req, res)=>{
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);

    });

    //post all order api 
    app.post('/AllOrder',async(req,res)=>{
      const Orderlist = req.body;
          console.log('hit the post api',Orderlist);
      
      const result = await OrderCollection.insertOne(Orderlist);
      console.log(result);
      res.json(result)
    
    })

    //get all post api

    app.get ('/AllOrder',async (req, res)=>{
      const cursor = OrderCollection.find({});
      const Allorder = await cursor.toArray();
      res.send(Allorder);
    })


    //get single service

    app.get('/services/:id', async(req, res)=>{
      const id =req.params.id;
      console.log('gettt', id);
      const query = {_id: ObjectId(id)};
      const service = await servicesCollection.findOne(query);
      res.json (service);
    })

  //Post api
  app.post('/services',async(req,res)=>{
    const service = req.body;
        console.log('hit the post api',service);
    
    const result = await servicesCollection.insertOne(service);
    console.log(result);
    res.json(result)
  });

  //delete api
  app.delete('/services/:id',async(req, res)=> {
    const id = req.params.id;
    const query ={_id: ObjectId(id)};
    const result = await servicesCollection.deleteOne(query);
    res.json(result);
  });


}
finally{
    // await client.close();
}
}
run ().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
  });

  app.listen(port, () => {
    console.log('Example app listening',port);
  })
  