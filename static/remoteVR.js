const remoteVR = function() {

  const gamepads = []

  const  backingData = new WeakMap

  function unpack(buffer) {

    const array = new Float32Array(buffer)
    const view = new DataView(buffer)

    const index = view.getUint8(0)
    const timestamp = view.getFloat32(1)



    if(gamepads[index]) {
      backingData.get(gamepads[index]).set(array)
      // gamepads[index]._array.set(array)
      gamepads[index].timestamp = timestamp
    } else {
      gamepads[index] = {
        timestamp: timestamp,
        pose: {
          position: array.subarray(2, 5),
          orientation: array.subarray(5, 9)
        }
        // _array: array
      }

      backingData.set(gamepads[index], array)
    }
  }

  const connect = (peer_connection) => {

    peer_connection.on('open', function() {
      console.log(`Peer: connected`)

      conn.on('data', unpack)

      conn.on('close', () => {
        console.log('Peer: closed connection')
      })
    })

  }

  return {
    connect: connect,
    getGamepads: () => gamepads
  }

}()
