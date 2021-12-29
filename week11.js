const express = require('express')
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin:jj1234@cluster0.h4j2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db
client.connect(err => {
    db = client.db('twitter')

    console.log(err)

    if(err === undefined) {
        app.emit('db-connected')
    }
//   const collection = client.db("test").collection("devices");
//   console.log("connected")

//   // perform actions on the collection object
//   client.close();
});

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.post('/tweet', async (req, res) => {
    const tweets = db.collection('tweets')
    const { handle, msg } = req.body

    db.collection('tweets')

    const tweet = tweets.insertOne({
        handle: 'handle',
        msg: 'msg'
    })

    res.send('success')
})

app.get('/tweets/:id', async (req,res) => {
    const { id } = req.params
    const tweets = db.collection('tweets')

    const tweet = await tweets.findOne({_id: ObjectId(id)})

    if(tweet === null) {
        res.status(404)
        res.send({error: "tweet not found"})
        return
    }

    res.send(tweet)
})

app.delete('/tweets/:id', async (req,res) => {
    const tweets = db.collection('tweets')
    const { id } = req.params

    const { deletedCount } = await tweets.deleteOne({ _id: ObjectId(id) })

    if (deletedCount === 0) {
        res.status(404)
        res.send({ error: 'tweet not found' })
        return
    }

    res.send({
        msg: 'deleted tweet'
    })
})

app.get('/tweets', async (req, res) => {
    const tweets = db.collection('tweets')
    const data = await tweets.find().sort({_id: -1})
    const arr = await data.toArray()

    res.send(arr)
})

app.on('db-connected', () => {
    app.listen(3000, () => {
        console.log("Listening on local host 3000");
    })
})
