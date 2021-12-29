const express = require("express")
const uuid = require("uuid")
const bcrypt = require("bcrypt")

const SALT_ROUNDS = 5 // number of hashing rounds/cost factor (how much time is needed to calculate a single bcrypt hash)
//bcrypt is intentionally a slow algorithm so that there are fewer attempts to crack passwords and it takes more effort than brute force to crack

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const users = {
    // username: 'hashed password'
}

async function createUser(username,password) {
    if(users[username] !== undefined) {
        throw new Error('User already exists')
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    users[username] = hashedPassword
}

async function authUser(username, password, token) {
    if (users[username] === undefined) {
        throw new Error("User doesn't exist")
    }
    const hashedPassword = users[username] // analogous to python dictionary key/value or a hashtable

    const result = await bcrypt.compare(password, hashedPassword) // returns a boolean of whether the password is correct on not

    return result
}

/**
 * Create user with new password
 */
app.post('/signup', async (req, res) => {
    const {username, password} = req.body
    // throw error if user exists
    try {
        await createUser(username, password)
        res.send('username', 'password')
    } catch(err) {
        res.status(401)
        res.send('user already exists')
    }
    await createUser(username, password)
    res.send('user was created')
})


/**
 * Login and return auth token (JSON Web token)
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const result = await authUser(username, password)
        if(result) {
            res.send('unfinished, auth token')
        } else {
            res.send('incorrect password')
        }
    
    } catch(err) {
        res.status(401)
        res.send('user does not exist')
    }
})

/**
 * Test if JWT/auth works
 */
app.post('/protected', (req, res) => {

})

// bcrypt.hash("password", SALT_ROUNDS, function(err, hash) {
//     console.log(hash)

// bcrypt.compare("password2", hash, function(err, result) {
//     console.log(result)
// })
// })

app.listen(30000, () => {
    console.log('Listening on localhost 3000')
})