// ---------------------------------------------------------
// tokenprocess
// when started, this process sits in the background and
// periodically queries the Thorz identity server for
// new OAuth token
// when other processes needs a working token, they can
// simply obtain the token from this process
// this simplifies the authorization process, and avoids
// some potential race conditions
// --------------
// tokenprocess.start(options) - starts background process
// expected options:
// - authorization_url
// - client_id
// - client_secret
// - fetch_interval
// ---------------------------------------------------------
const requestp = require('request-promise')


let bearerToken = null
let timer = null
let opts = null


// this function fetches the token from OAuth server, but only sets it
// if successful, just in case there is some server/network error
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


// starts the background process
function start(options) {
  opts = options
  fetchToken()
  if (timer === null) {
    timer = setInterval(fetchToken, opts.fetch_interval * 1000)
  }
}

// stops the background process
function stop() {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

// calls this function to get current token
function getToken() {
  return bearerToken
}

exports.start = start
exports.stop = stop
exports.getToken = getToken
