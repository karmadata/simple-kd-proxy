require('dotenv').config()
let env = process.env
const express = require('express')
const requestp = require('request-promise')
const bodyParser = require('body-parser')
const tokenprocess = require('thorz').apiTokenProcess


// set up express
var app = express()
app.use(bodyParser.json())


// start background auth token process
tokenprocess.start({
  authorization_url: env.KD_THORZ_AUTHORIZATION_URL,
  client_id: env.KD_THORZ_CLIENT_ID,
  client_secret: env.KD_THORZ_CLIENT_SECRET,
  fetch_interval: 600   // every 10 minutes
})


// ---------------------------------------------------
// This sample will proxy anybody within the network.
// Please implement proper authentication when needed.
// ---------------------------------------------------
let authorized = true

app.post('/kdapi/*', async function(req, res) {
  try {
    if (!authorized) throw new Error("Not authorized")
    let newurl = env.KD_API_URL + req.url.substring(6)
    let body = Object.keys(req.body).length === 0 ? null : req.body
    let response = await requestp({
      method: 'POST',
      uri: newurl,
      headers: {
        Authorization: "Bearer " + tokenprocess.getToken()
      },
      body: body,
      json: true,
      simple: false,
      resolveWithFullResponse: true
    })
    // console.log(response)
    res.statusCode = response.statusCode
    for (let key in response.headers) {
      res.setHeader(key, response.headers[key])
    }
    res.send(response.body)
  } catch(e) {
    console.log(e)
    // not sure what happened, do 500
    res.statusCode = 500
    res.send("Unknown Internal error.")
  }
})

app.listen(env.PORT, function() {
  console.log("listening on " + env.PORT)
})
