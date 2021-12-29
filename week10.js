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
    db.collection('tweets')

    const tweets = tweets.insertOne({
        handle: 'handle',
        msg: 'msg'
    })

    console.log(tweets)

    res.send('success')
})

app.get('/tweets', async (req, res) => {
    const tweets = db.collection('tweets')
    const data = await tweets.find()
    const arr = await data.toArray()
    res.send(arr)
})

app.on('db-connected', () => {
    app.listen(3000, () => {
        console.log("Listening on local host 3000");
    })
})
