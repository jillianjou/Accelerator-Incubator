const express = require('express')
const uuid = require('uuid').v4

const app = express(); // creating express app

/**
 * Body parsing middleware
 */
//creating pipeline to start the app (works in the way it is set up (order-wise))

function authMiddleware(req, res, next) {
// once next is called, it is the end of the middleware function; next thing in the pipeline would get called
// middleware is used for things like authentication
//sample authentication check/middleware for all endpoints
    const { auth } = req.query

    if(auth !== "true") {
        res.status(401)
        res.send(createErrorMsg("unauthorized"))
    } else {
        next()
    }
}
//app.use(authMiddleware)
app.use(express.urlencoded({extended: true})) // parse out urlencoded body
app.use(express.json()) // parse out json encoded body
// i.e. if getTweets is called, first express will parse out urlencoded body, then parse out json encoded body, then call get function
    // so that req.body can be called in the get function

let tweets = [
    createTweet({
        handle: 'test handle',
        msg: 'test msg'
    })
]

/**
 * Creates tweet by adding uuid to tweet data given by user
 */
function createTweet(config) {
    const {handle, msg, parentId } = config
    // same as:
            // const handle = config.handle
            // const msg = config.msg

    return {
        handle,
        msg,
        id: uuid(),
        parentId
    }
}

function getTweet(id) {
    const tweet = tweets.find(t => t.id === id)

    if (!tweet) {
        return undefined
    }

    // this will create a shallow clone of a tweet
    // tweet = { ...tweet }

    return {
        ...tweet,
        children: tweets.filter(t => t.parentId === tweet.id)
    }
}

function deleteTweet(id) {
    let foundTweet = false;

    tweets = tweets.filter(tweet => {
        if(tweet.id === id) {
            foundTweet = true
            return false
        }
        return true
    })

    return foundTweet
}

function updateTweet(id, { msg }) {
    const tweet = getTweet(id)

    if(tweet === undefined) {
        return false
    }

    tweet.msg = msg

    return true
}

function getFeed({ includeReplies = false }) {
    return includeReplies ? tweets : tweets.filter(t => t.parentId === undefined)
}

function createErrorMsg(msg) {
    return {
        error: msg
    }
}

function createMsg(msg) {
    return {
        msg
    }
}

app.post('/tweets', function(req, res) {
    const { handle, msg, parentId } = req.body
    // same as the following:
        // const handle = req.body.handle
        // const msg = req.body.msg

    const parentTweet = parentId !== undefined ? getTweet(parentId) : false
    // if user tried to find parent tweet but failed
    if(parentId !== undefined  && !parentTweet) {
        res.status(404)
        res.send(createErrorMsg("can't reply to tweet that doesn't exist"))
        return
    }

    const tweet = createTweet({ handle, msg, parentId })
    tweets.unshift(tweet)
})

/**
 * Get a list (feed) of tweets from everyone
 */
app.get('/tweets', function(req, res){
    res.send(getFeed({}))
})

/**
 * updates tweet
 */
app.put('/tweets/:id', (req, res) => {
    const { id } = req.params
    const { msg } = req.body
})

/**
 * Deletes a tweet by its id
 */
app.delete('/tweets/:id', function(req, res) {
    const id = req.params.id
    const foundTweet = deleteTweet(id)

    if(foundTweet === false) {
        res.status(400);
        res.send(createErrorMsg('tweet with id "${id}" not found'))
        return
    }
    res.send(createMsg('deleted tweet with id "${id}"'))
})

/**
 * Get a single tweet
 */
app.get("/tweets/:id", authMiddleware, (req, res) => {
    const { id } = req.params
    const tweet = getTweet(id)

    if(tweet === undefined) {
        res.status(404)
        res.send(createErrorMsg('tweet with id "${id}" not found'))
    }

    res.send(tweet)
})

app.listen(3000)
