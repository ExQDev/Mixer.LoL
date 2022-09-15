const argv = require('minimist')(process.argv.slice(2));
const WS = require('websocket').w3cwebsocket;
const { v4: uuidv4 } = require('uuid');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { authenticate, createWebSocketConnection, LeagueClient, LeagueWebSocket } = require('league-connect')
// Obtain required params to start a WS connection from CLI args.
const NL_PORT = argv['nl-port'];
const NL_TOKEN = argv['nl-token'];
const NL_EXTID = argv['nl-extension-id'];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const omitUris = [
  'riot-messaging-service',
  'lol-challenges',
  'lol-game-client-chat',
  'lol-chat',
  'lol-honor',
  '/lol-champ-select/v1/bannable-champion-ids',
  '/lol-champ-select-legacy/v1/disabled-champion-ids',
  '/lol-champ-select/v1/disabled-champion-ids',
  '/lol-champ-select-legacy/v1/pickable-skin-ids',
  '/lol-champ-select-legacy/v1/bannable-champion-ids',
  '/lol-champ-select/v1/pickable-champion-ids',
  '/lol-champ-select-legacy/v1/pickable-champion-ids',
  '/lol-champ-select/v1/skin-carousel-skins',
  '/lol-champ-select/v1/current-champion',
  '/lol-champ-select-legacy/v1/current-champion',
  '/lol-champ-select/v1/session',
  '/lol-champ-select-legacy/v1/session',
  '/lol-hovercard/',
  '/lol-champ-select-legacy/v1/team-boost',
  '/lol-champ-select-legacy/v1/implementation-active',
  '/data-store/',
  '/lol-champ-select/v1/team-boost'
]

const mustHaveUris = [
  // '/lol-champ-select/v1/current-champion',           // data = id
  '/lol-champ-select/v1/skin-selector-info',            // data = { championName, isSkinGrantedFromBoost, selectedChampionId, selectedSkinId, showSkinSelector, skinSelectionDisabled }
  '/lol-lobby/v2/lobby/members'                         // data = array of members
]
let client = new WS(`ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}`);
let champInfo = null
let champs = []
let wasUpdated = false
let scheduledPlay = null

async function schedulePlay () {
  clearTimeout(scheduledPlay)
  scheduledPlay = null
  // if (wasUpdated) return
  // else
    client.send(JSON.stringify({
      id: uuidv4(),
      method: 'app.broadcast',
      accessToken: NL_TOKEN,
      data: {
        event: 'champStarted',
        data: champInfo
      }
    }));
}

async function skinSelection (event) {
  // console.log('1p',event)
  if (event.uri === '/lol-champ-select/v1/skin-selector-info') {
    console.log('Its ok')
    // if (event.eventType === 'Update') {
    //   wasUpdated = true
    // };

    if (event.eventType === 'Delete') {
      return
    }
    //   console.log(champInfo)
    //   client.send(JSON.stringify({
      //     id: uuidv4(),
      //     method: 'app.broadcast',
      //     accessToken: NL_TOKEN,
      //     data: {
        //       event: 'champStarted',
        //       data: champInfo
        //     }
        //   }));
        // } else {
      const champ = champs.find(champ => {
        return +champ.key === event.data.selectedChampionId
      })
      champInfo = {
        id: champ.id,
        ...event.data
      }
      if (scheduledPlay) {
        clearTimeout(scheduledPlay)
        scheduledPlay = null
        scheduledPlay = setTimeout(schedulePlay, 15000)
      } else {
        scheduledPlay = setTimeout(schedulePlay, 15000)
      }
    // }
  }
}

let credentials = null
let ws = null
let wsoRuntime = null

async function init () {
  console.log('init')

  credentials = await authenticate({
    awaitConnection: true,
    pollInterval: 5000
  }).catch(err => console.log(err))
  console.log('credentials')
  try {
    console.log('Lol started')
    // client.send(JSON.stringify({
    //   id: uuidv4(),
    //   method: 'app.broadcast',
    //   accessToken: NL_TOKEN,
    //   data: {
    //     event: 'msg',
    //     data: 'League started!'
    //   }
    // }));
  } catch (e) {
    console.log(e)
  }
  const champsData = await (await fetch(`http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json`)).json()
  champs = Object.values(champsData.data)
  
  
  const client = new LeagueClient(credentials, {
    pollInterval: 1000 // Check every second
  })
  // console.log('client', client)
  client.on('connect', (newCredentials) => {
    // newCredentials: Each time the Client is started, new credentials are made
    // this variable contains the new credentials.
    console.log('newCredentials')
    credentials = newCredentials
    wsoRuntime = wso()
  })
  
  client.on('disconnect', () => {
    console.log('disconnect')
    if (ws) {
      ws.close()
      ws = null
    }
    // goto(restart);
  })
  client.start()
  wsoRuntime = wso()
  console.log('Client started')
}

const wso = async () => {
  console.log('wso')
  
  await sleep(5000)
  try {
    ws = await createWebSocketConnection(credentials)
    console.log('ws')
    
    ws.subscribe('/lol-champ-select/v1/skin-selector-info', (data, event) => {
      console.log(event)
      skinSelection(event)
    })
    // ws.on('message', (msg) => {
      //   try {
        //     const event = msg.toJSON()
        //     // console.log(event)
        //     // const event = JSON.parse(msg)
        //     if (event.type === 'Buffer') {
    //       const decoded = Buffer.from(event.data).toString()
    //       // console.log(decoded)
    //       return
    //     }
    //     const data = event[2]
    //     skinSelection(data)
    //     // if (!omitUris.reduce((acc, omit) => acc || data.uri.includes(omit), false)) {
      //       // console.log('[LoL]', data)
      
      //     // }
      //   } catch (e) {
        //     console.error(e)
        //   }
        // })
        console.log('subscribed')
      } catch (e) {
        console.error(e)
        if (wsoRuntime) return;
        wso()
        return
      }
    }
    
    client.onerror = function () {
      console.log('Connection error!');
    };
    
    client.onopen = function () {
      console.log('Connected');
    };
    
    client.onclose = function () {
    console.log('Connection closed');
    // Make sure to exit the extension process when WS extension is closed (when Neutralino app exits)
    // process.exit();
};

init()


