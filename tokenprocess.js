// the background process that requests authentication token
const requestp = require('request-promise')

let bearerToken = null
let timer = null
let opts = null

async function fetchToken() {
  try {
    let result = await requestp({
      method: 'POST',
      uri: opts.authorization_url,
      form: {
        grant_type: 'client_credentials',
        client_id: opts.client_id,
        client_secret: opts.client_secret,
        response_type: 'token',
        scope: 'rolesPermissions'
      }
    })
    let token = JSON.parse(result)
    // console.log(token)
    // only set token if not null
    if (token.access_token != null) bearerToken = token.access_token
  } catch(e) {
    // just don't set token if failed
    // console.log(e)
  }
}

function start(options) {
  opts = options
  fetchToken()
  if (timer === null) {
    timer = setInterval(fetchToken, opts.fetch_interval * 1000)
  }
}

function stop() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

function getToken() {
  return bearerToken
}

exports.start = start
exports.stop = stop
exports.getToken = getToken
