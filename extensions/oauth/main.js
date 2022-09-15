const argv = require('minimist')(process.argv.slice(2));
const WS = require('websocket').w3cwebsocket;
const { v4: uuidv4 } = require('uuid');
const express = require('express')

const app = express()
const port = 18800

// Obtain required params to start a WS connection from CLI args.
const NL_PORT = argv['nl-port'];
const NL_TOKEN = argv['nl-token'];
const NL_EXTID = argv['nl-extension-id'];

const clientId = 'ade03a71678a413db9808404d3a9d6ce'
const clientSecret = '4de3198c193348d8a88c941f150fc1c0'


let client = new WS(`ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}`);


app.get('/oauth', (req, res) => {
  console.log(req.query.code, req.query.state)
  
  client.send(JSON.stringify({
    id: uuidv4(),
    method: 'app.broadcast',
    accessToken: NL_TOKEN,
    data: {
        event: 'code',
        data: {
          code: req.query.code, 
          state: req.query.state
        }
    }
  }));
  res.send('Success, you can close this window now')
})

app.get('/tokenx', (req, res) => {
  console.log(req.query.code, req.query.state)
  client.send(JSON.stringify({
    id: uuidv4(),
    method: 'app.broadcast',
    accessToken: NL_TOKEN,
    data: {
        event: 'token',
        data: {
          body: req.body
        }
    }
  }));
  res.send('Success, you can close this window now')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


client.onerror = function () {
    console.log('Connection error!');
};

client.onopen = function () {
    console.log('Connected');
};

client.onclose = function () {
    console.log('Connection closed');
    // Make sure to exit the extension process when WS extension is closed (when Neutralino app exits)
    process.exit();
};

client.onmessage = async function (e) {
    if (typeof e.data === 'string') {
        let message = JSON.parse(e.data);
        console.log(e.data)
        switch (message.event) {
          case 'message':
            client.send(JSON.stringify({
              id: uuidv4(),
              method: 'app.broadcast',
              accessToken: NL_TOKEN,
              data: {
                  event: 'code',
                  data: {
                    code: 'sample code'
                  }
              }
            }));   
            break;
          default:
            break;
        }
        // Use extensions.dispatch or extensions.broadcast from the app,
        // to send an event here
    }
};