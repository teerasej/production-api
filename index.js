const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

const {ObjectId} = require('mongodb');
const dbConnection = require('./db');
const dbName = 'nfmongop';

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// read
app.get('/people', async (req,res) => {

    let client = await dbConnection.connect()
    let collection = client.db('nfmongop').collection('people')
    let result = await collection.find().limit(10).toArray()
    client.close()

    res.json(result)
})

// create
app.post('/people', async (req,res) => {

    let newPeople = req.body

    let client = await dbConnection.connect()
    let collection = client.db('nfmongop').collection('people')
    let result = await collection.insertOne(newPeople);
    client.close()

    res.json(result)
})

// update
app.put('/people', async (req,res) => {

    let targetPeople = req.body

    let client = await dbConnection.connect()
    let collection = client.db('nfmongop').collection('people')

    let filter = { _id: ObjectId(targetPeople._id) }
    let query = {
        $set: { first_name: targetPeople.first_name }
    }

    let result = await collection.updateOne(filter, query)
    client.close()

    res.json(result);
})

// delete
app.delete('/people', async (req,res) => {

    let targetPeople = req.body

    let client = await dbConnection.connect()
    let collection = client.db('nfmongop').collection('people')

    let filter = { _id: ObjectId(targetPeople._id) }

    let result = await collection.remove(filter)
    client.close()

    res.json(result);
})

app.get('/doctor/patient', async (req, res) => {

    let client = await dbConnection.connect()
    let collection = client.db('doctor').collection('Doctor with patients');
    let result = await collection.find().toArray();
    client.close();

    res.json(result);
})

app.listen(port, () => console.log(`Product API listening on port ${port}!`))