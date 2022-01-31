// RAUL9qBTNlkDzYGZ
// rongin-posra

const express = require('express');
const cors = require('cors');
// const { MongoClient } = require('mongodb');
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z0k4l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect((err) =>{
    const servicesCollection = client.db("rongin-posra").collection('services')
    const bookingCollection = client.db("rongin-posra").collection('bookings')



    // add plan
    app.post("/AddANewPlan", async (req, res)=>{
        const result = await servicesCollection.insertOne(req.body);
        res.send(result);
    })

    // get all plan
    app.get("/AllPlans", async (req, res)=>{
        const result = await servicesCollection.find({}).toArray();
        res.send(result);
    })

    // get single plan
    app.get("/SinglePlan/:id", async (req, res)=>{
        const result = await servicesCollection.find({ _id: ObjectId(req.params.id) }).toArray();
        res.send(result[0]);
        
    })


    // confirm order
    app.post("/confirmBooking", async (req, res)=>{
        const result = await bookingCollection.insertOne(req.body);
        res.send(result);
        
    })

    // my plans
    app.get("/myPlans/:email", async (req, res)=>{
        const result = await bookingCollection.find({ email: req.params.email }).toArray();
        res.send(result);
        
    })

    // delete order
    app.delete("/deteteOrders/:id", async (req, res)=>{
        const result = await bookingCollection.deleteOne({ _id: ObjectId(req.params.id) })
        res.send(result);
        
        
    })

    // all order
    app.get("/managePlans", async (req, res)=>{
        const result = await bookingCollection.find({}).toArray();
        res.send(result);
    })

    // update status
    app.put("/updateStatus/:id", async (req, res)=>{
        const id = req.params.id;
        const updatedStatus = req.body.status;
        const filter = { _id: ObjectId(id)};
        // console.log(updatedStatus);
        const result = await bookingCollection.updateOne(filter,{
            $set: { status: updatedStatus}
        })
        res.send(result);
        // console.log(result);
    })

})

app.get('/', (req, res) => {
    res.send('rongin-posra server')
})

app.listen(port, () => {
    console.log('rongin-posra server on port', port)
})