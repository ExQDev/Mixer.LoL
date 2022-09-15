const argv = require('minimist')(process.argv.slice(2));
const WS = require('websocket').w3cwebsocket;
const { v4: uuidv4 } = require('uuid');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const SoundcloudTS = require('soundcloud.ts').default
const player = require('audio-play');
// const load = require('audio-loader');

var AudioContext = require('web-audio-api').AudioContext
  , context = new AudioContext()
  // , Speaker = require('speaker')

const express = require('express')

const app = express()
const port = 18800

const soundcloud = new SoundcloudTS()

// Obtain required params to start a WS connection from CLI args.
const NL_PORT = argv['nl-port'];
const NL_TOKEN = argv['nl-token'];
const NL_EXTID = argv['nl-extension-id'];

let client = new WS(`ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}`);

const log = (...data) => {
  client.send(JSON.stringify({
    id: uuidv4(),
    method: 'app.broadcast',
    accessToken: NL_TOKEN,
    data: {
        event: 'log',
        data
    }
  }));
}
let playlist = []

async function init () {
  console.log('init')
  // const asyncContext = Promise.promisifyAll(context)
  
  console.log('subscribed')
}

init()

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

let playback = null, play = null, pause = null
// let buffer = null

const playSong = async (link) => {
  const track = await soundcloud
    ?.util
    .streamLink(link)  
      // log(track)
    const audioBuffer = await fetch(track)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => new Promise((resolve, reject) => {
        context.decodeAudioData(arrayBuffer, (audioBuffer) => {
          // buffer = audioBuffer;
          log('buffer.ok')
          resolve(audioBuffer)
        }, (err) => {
          reject(err)
        }) 
      }))
      // .catch(e => log('BUFFER ERR', e));
      // try { 
        //   const source = context.createBufferSource();
        //   source.buffer = buffer;
        //   context.outStream = new Speaker({
          //     channels: context.format.numberOfChannels,
          //     bitDepth: context.format.bitDepth,
          //     sampleRate: context.sampleRate
          //   })
          //   source.connect(context.destination);
          //   source.start();
          //   log ('source.ok')
          // } catch (e) {
            //   log('SORCE ERR', e)
            // }
            // .then(audioBuffer => {
              // playButton.disabled = false;
              // })
    playback = player(audioBuffer, {
      start: 0,
      end: audioBuffer.duration,
      autoplay: true,
      rate: 1,
      volume: 0.2,
      // device: 'hw:1,0',
      context,
    }, () => {
      playNext();
    })

    play = playback.play
    pause = playback.pause
    // load(track).then(player)
}

const playNext = async () => {
  // for (const track of playlist) {
  if (playlist.length > 0) {
    const song = playlist.shift()
    await playSong(song)
  }
  // }
}

client.onmessage = async function (e) {
  if (typeof e.data === 'string') {
      let message = JSON.parse(e.data);
      switch (message.event) {
        case 'play':
          log(message.data.playlist)
          playlist = message.data.playlist
          playNext()
          break;
        default:
          break;
      }
      // Use extensions.dispatch or extensions.broadcast from the app,
      // to send an event here
  }
};