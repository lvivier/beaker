import { ipcRenderer } from 'electron'

// globals
// =

// active requests' cbs, waiting for a response
var requestCbs = []


// exported api
// =

export function setup () {
  console.log('sitedata setup')
  ipcRenderer.on('sitedata', onIPCMessage)
}

export function get (key, cb) {
  sendIPCRequest('get', key, null, cb)
}

export function set (key, value, cb) {
  sendIPCRequest('set', key, value, cb)
}


// internal methods
// =

function sendIPCRequest (command, key, value, cb) {
  // track the cb
  var requestId = requestCbs.length
  requestCbs.push(cb || (()=>{}))

  // send message
  ipcRenderer.send('sitedata', command, requestId, key, value)
}

function onIPCMessage (event, command, requestId, ...args)  {
  switch (command) {
    case 'reply':
      var cb = requestCbs[requestId]
      if (!cb)
        return console.warn('Sitedata reply came from main process for a nonwaiting request', arguments)
      requestCbs[requestId] = null
      cb.apply(window, args)
      break

    default:
      console.warn('Unknown sitedata message', arguments)
  }
}