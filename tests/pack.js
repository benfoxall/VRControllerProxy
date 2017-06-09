const test = require('tape')

function pack(gamepad, i) {
  //
  const array = new Float32Array(1 + 1 + 3 + 4)

  const view = new DataView(array.buffer)
  view.setUint8(0, i)
  view.setFloat32(1, gamepad.timestamp)

  console.log("ARRAY LENGTH")

  array.set(gamepad.pose.position, 2)
  array.set(gamepad.pose.orientation, 5)

  console.log(array)

  return array.buffer
}

function unpack(buffer, gamepadList) {

  const array = new Float32Array(buffer)
  const view = new DataView(buffer)

  const index = view.getUint8(0)
  if(!gamepadList[index]) {
    const _data = array
    gamepadList[index] = {
      _data: _data,
      timestamp:-1,
      pose: {
        position: array.slice(2, 5),
        orientation: array.slice(5, 9)
      }
    }
  }


  const timestamp = view.getFloat32(1)
  const position = array.slice(2, 5)
  const orientation = array.slice(5, 9)

  console.log('----i--', view.getUint8(0))
  console.log('----t--', view.getFloat32(1))

  console.log('----p--', array.slice(2, 5))
  console.log('----o--', array.slice(5, 9))



}

test('pack/unpack', (t) => {

  t.plan(1)

  const gamepad = {
    timestamp: 1000,
    pose: {
      position: [1, 2, 3],
      orientation: [4, 5, 6, 7]
    }
  }

  const data = pack(gamepad, 0)

  const remoteGamepads = []

  unpack(data, remoteGamepads)

  t.assert(false)

})
