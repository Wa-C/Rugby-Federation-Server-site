const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fileUpload = require('express-fileupload');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()


// app.use(express.static('reviews'));
// app.use(fileUpload());
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const port = 5000;
app.get('/', (req, res) =>{
    res.send("Db is connected")
})

const MongoClient = require('mongodb').MongoClient;
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udre1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("RugbyFederation").collection("Bookings");
  // perform actions on the collection object
  
    app.post('/addBookings', (req, res) => {
        const Bookings = req.body;
        console.log(Bookings);
        bookingCollection.insertOne(Bookings)
        .then(result => {
            res.send(result.insertedCount)
        })
    });

 
    
    app.get('/bookingsByUser', (req, res) => {
       
        bookingCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
            // console.log(documents);
        })
        
    });
    
   


});


client.connect(err => {
    const reviewCollection = client.db("RugbyFederation").collection("Reviews");
    // perform actions on the collection object
    
      app.post('/addReviews', (req, res) => {
          const data = req.body;
          console.log(data);
          reviewCollection.insertOne(data)
          .then(result => {
              res.send(result.insertedCount)
          })
      });
      
      app.get('/reviewsByUser', (req, res) => {
         
        reviewCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
              // console.log(documents);
          })
          
      });
  
  });

  client.connect(err => {
    const serviceCollection = client.db("RugbyFederation").collection("Services");
    // perform actions on the collection object
    
      app.post('/addService', (req, res) => {
          const data = req.body;
          console.log(data);
          serviceCollection.insertOne(data)
          .then(result => {
              res.send(result.insertedCount)
          })
      });
      
      app.get('/services', (req, res) => {
         
        serviceCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
              // console.log(documents);
          })
          
      });
      app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        serviceCollection.deleteOne({_id:id})
        .then(result => {
          console.log(result);
        })
      })
  
  });

  


  client.connect(err => {
    const adminCollection = client.db("RugbyFederation").collection("admin");
    // perform actions on the collection object
    
      app.post('/isAdmin', (req, res) => {
          const email = req.body.email;
         
          adminCollection.find({email:email})
          .toArray((err, admins)=>{
              res.send(admins.length > 0);
          })
        
      });
      app.post('/addAdmin', (req, res) => {
        const data = req.body;
        console.log(data);
        adminCollection.insertOne(data)
        .then(result => {
            res.send(result.insertedCount)
        })
    });
      
  });

app.listen(process.env.PORT || 5000);