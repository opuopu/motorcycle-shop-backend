const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;


const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgoei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);
client.connect(err => {
    const collections = client.db("Assignment-12")
    const servicecollection = collections.collection('allservice')
    const ordercollection = collections.collection('all-orders')
    const usercollections= collections.collection('user')
    const reviewcollection = collections.collection('reviews')

    // --------------------post new user-added-------------------
    app.post('/adduser',async(req,res)=>{
        console.log(req.body)
        const result = await usercollections.insertOne(req.body)
        res.send(result)
      })
      
    //   -----------------put new user---------------
    app.put('/adduser', async(req,res)=>{
 
        const filter = {email:req.body.email}
        const options = {upsert:true};
        const updatedoc ={$set: req.body}
        const result = await usercollections.updateOne(filter,updatedoc,options)
      res.send(result)
      })
    //   --------------------post new user end-----------------
  //  --------------add new servie--------
  app.post('/addservice', async(req,res)=>{
    console.log(req.body);
    const result = await servicecollection.insertOne(req.body)
    res.send(result)
  })
  // ------------------get all serivce--------------
  app.get('/getservice',async(req,res)=>{
    const result = await servicecollection.find({}).limit(6).toArray()
    res.send(result)
  })
  // ------------------get all serivce--------------
  app.get('/getproducts',async(req,res)=>{
    const result = await servicecollection.find({}).toArray()
    res.send(result)
  })
// ----------------get single product by id-------------
app.get('/single/:id', async(req,res)=>{
  console.log(req.params.id);
  const result = await servicecollection.findOne({_id:ObjectId(req.params.id)})
  res.send(result)
})
// ----------------post all order--------------
app.post('/orders',async(req,res)=>{
  const result =  await ordercollection.insertOne(req.body)
  res.send(result)
})
// ----------------get all order---------

app.get('/getorder',async(req,res)=>{
  const result = await ordercollection.find({}).toArray()
  res.send(result)
})

// --------------query my order--------------
app.get('/queryorder',async(req,res)=>{
  const result = await ordercollection.find({email:req.query.email}).toArray()
  res.send(result)
})
// -------------get all order-----------
app.get('/allorder',async(req,res)=>{
  const result = await ordercollection.find({}).toArray()
  res.send(result)

})

// ---------------delete my order-----------
app.delete('/delete/:id',async(req,res)=>{
  const result = await ordercollection.deleteOne({_id:ObjectId(req.params.id)})
  res.send(result)
})
// -------------------delete product----------
app.delete('/delete/item/:id',async(req,res)=>{
  const result = await servicecollection.deleteOne({_id:ObjectId(req.params.id)})
  res.send(result)
})




// ---------------------review post-----
app.post('/review',async(req,res)=>{
  console.log(req.body);
  const result = await reviewcollection.insertOne(req.body)
  res.send(result)
})
// -----------------get all review-------
app.get('/getreview',async(req,res)=>{
  const result = await reviewcollection.find({}).toArray()
  res.send(result)
})
// -----------------------make admin-------
app.put('/user/admin',async(req,res)=>{
  const user = req.body
  console.log(user);
  const filter = {email:user.email}
  const updatedoc = {$set:{role:'admin'}}
  const result = await usercollections.updateOne(filter,updatedoc)
  res.send(result)
})

// -----------------admin role----------
app.get('/user/:email',async(req,res)=>{
  const email = req.params.email
  const user = await usercollections.findOne({email:email})
  let isAdmin = false
  if(user?.role ==='admin'){
    isAdmin =true
  }
  res.send({admin:isAdmin})
})

// ------------------update status-------------
app.put('/update/:id',async(req,res) =>{
  const id = req.params.id
  const options = { upsert: true };
 const filter = {_id:(ObjectId(id))}
 const updaedoc = {$set:{status:'shipped'}}
 const result = await ordercollection.updateOne(filter,updaedoc,options)
 res.send(result)

})
    app.get('/',async(req,res)=>{
res.send('database')
console.log("database");
    })
    // client.close();
  });



  app.listen(port,{})