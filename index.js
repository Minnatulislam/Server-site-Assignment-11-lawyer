const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000 ;

// middele were 

app.use(cors());
app.use(express.json())

// username=dbuser1
// passward=MxzIO6IJhsVx1tXA

  






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2ulkcud.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function verifyToken(req,res,next){
  const headered = req.headers.authorization;
  if(!headered ){
     return res.status(401).send({message:' invalid unauthorization access'})
  }
     const token = headered.split(' ')[1]
    
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(error, decoded){
          if(error){
           return res.status(401).send({message:' invalid  unauthorization access'})
          }
          req.decoded = decoded
          next()
  })
}
async function run(){
    try{
      const serviceCollection = client.db('lawyer').collection('services')
      const reviewCollection = client.db('lawyer').collection('reviews')
      
      app.post('/jwt',(req,res)=>{
        const users = req.body;
       const token = jwt.sign(users, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'7d'})

         
           res.send({token})

         })

        app.get('/service', async(req,res)=>{
          const  query = {}
          const cursor = serviceCollection.find(query);
          const result = await cursor.limit(3).toArray();

            res.send(result)
    })


    app.get('/services', async(req,res)=>{
        const  query = {}
        const cursor = serviceCollection.find(query);
        const result = await cursor.toArray();

          res.send(result)
  })

  app.get('/services/:id', async(req,res)=>{
     
       const id = req.params.id;

    const  query = {_id : ObjectId(id)}
    const result = await serviceCollection.findOne(query);
  

      res.send(result)
})
    

app.post('/services', async(req,res)=>{
    
    const service = req.body;
    const result = await serviceCollection.insertOne(service)
    
   res.send(result)

})

 


app.post('/reviews', async(req,res)=>{
    
const review = req.body;
const result = await reviewCollection.insertOne(review)

res.send(result)

})


  app.get('/reviews',  async(req,res)=>{
  
        
    let query = {} ;

    if(req.query.email){

    query = {
      email:req.query.email
      }
    }
       const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    })



app.delete('/reviews/:id',  async(req,res)=>{

    const id = req.params.id;
    const query = { _id:ObjectId(id)}

    const result = await reviewCollection.deleteOne(query)

    res.send(result)
})

}


finally{


}


}

run().catch(console.dir);



app.get('/', (req,res)=>{
res.send(' server site running ...')
})


app.listen(port,()=>{

console.log(` server running ${port}`)
})
