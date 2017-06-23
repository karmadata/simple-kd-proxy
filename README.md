# simple-kd-proxy
A simple proxy that provides partner developers to access KD API via their own Thorz Client

# Use
This application simply proxies POST requests to KD API server, with appropriate bearer token attached. When set up within a partner's intranet, it provides its developers a simple way to develop against KD API without needing to deal with authentication individually.

It also serves as a sample for how partner server can obtain bearer tokens to access KD API.

# How It Works
* index.js - a simple Express server that exposes a /kdapi endpoint that proxies user requests to the actual KD API server, and returns the result from the KD API server to the user.
* KD API server - the actual API server that is hosted by KarmaData. It expects an OAuth token for each API request
* tokenprocess.js - this process sits in the background and periodically queries the Thorz identity server to refresh the auth token
* Thorz - the identity server that hands out OAuth tokens


# Setting up .env
Use the .env-example file as a template, create a .env file in the same folder and fill in the values as appropriate

* Log into Thorz account or ask administrator to obtain the Thorz related values
* KD_THORZ_AUTHORIZATION_URL - the Thorz authorization URL
* KD_THORZ_CLIENT_ID - the client id for the Thorz Client to be used
* KD_THORZ_CLIENT_SECRET - the client secret for the Thorz Client to be used

* KD_API_URL - the base URL of the KD API server
* PORT - the port this application runs on
