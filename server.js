const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send()
  } catch {
    res.sendStatus(500)
  }
})

app.post('/users/login', async (req, res) => {
  try {
    const userName = req.body.name
    const userPassword = req.body.password

    const user = users.find(u => u.name === userName)
    if (!user) {
      res.status(401).send("User not found")
    }

    if (!await bcrypt.compare(userPassword, user.password)) {
      res.status(401).send("User not found")
    }

    res.send('Loggin')
  } catch {
    res.sendStatus(500)
  }
  
})


app.listen(3000)
