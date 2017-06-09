const test = require('tape')

function pack(gamepad, i) {
  const array = new Float32Array(1 + 1 + 3 + 4)

  const view = new DataView(array.buffer)
  view.setUint8(0, i)
  view.setFloat32(1, gamepad.timestamp)

  array.set(gamepad.pose.position, 2)
  array.set(gamepad.pose.orientation, 5)

  return array.buffer
}

function unpack(buffer, gamepadList) {

  const array = new Float32Array(buffer)
  const view = new DataView(buffer)

  const index = view.getUint8(0)
  const timestamp = view.getFloat32(1)

  if(gamepadList[index]) {
    gamepadList[index]._array.set(array)
    gamepadList[index].timestamp = timestamp
  } else {
    gamepadList[index] = {
      timestamp: timestamp,
      pose: {
        position: array.subarray(2, 5),
        orientation: array.subarray(5, 9)
      },
      _array: array
    }
  }

  // // const timestamp = view.getFloat32(1)
  // const position = array.slice(2, 5)
  // const orientation = array.slice(5, 9)
  //
  // console.log('----i--', view.getUint8(0))
  // console.log('----t--', view.getFloat32(1))
  //
  // console.log('----p--', array.slice(2, 5))
  // console.log('----o--', array.slice(5, 9))



}

test('pack/unpack', (t) => {

  t.plan(12)

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

  t.equal(remoteGamepads.length, 1)
  t.equal(remoteGamepads[0].timestamp, 1000)
  t.deepEqual(remoteGamepads[0].pose.position, [1, 2, 3])
  t.deepEqual(remoteGamepads[0].pose.orientation, [4, 5, 6, 7])



  const gamepad_update = {
    timestamp: 1001,
    pose: {
      position: [10, 20, 30],
      orientation: [40, 50, 60, 70]
    }
  }

  unpack(pack(gamepad_update, 0), remoteGamepads)

  t.equal(remoteGamepads.length, 1)
  t.equal(remoteGamepads[0].timestamp, 1001)
  t.deepEqual(remoteGamepads[0].pose.position, [10, 20, 30])
  t.deepEqual(remoteGamepads[0].pose.orientation, [40, 50, 60, 70])


  unpack(pack(gamepad, 1), remoteGamepads)

  t.equal(remoteGamepads.length, 2)
  t.equal(remoteGamepads[1].timestamp, 1000)
  t.deepEqual(remoteGamepads[1].pose.position, [1, 2, 3])
  t.deepEqual(remoteGamepads[1].pose.orientation, [4, 5, 6, 7])

})


function moved_sufficiently(gamepad, packed) {
  if(!packed) return true

  const position = gamepad.pose.position
  const array = new Float32Array(packed)

  const delta =
    Math.abs(position[0] - array[2]) +
    Math.abs(position[1] - array[3]) +
    Math.abs(position[2] - array[4])

  if(delta > 5) return true

  return false
}


test('has_moved', (t) => {

  const A = {
    timestamp: 1000,
    pose: {
      position: [1, 2, 3],
      orientation: [4, 5, 6, 7]
    }
  }

  const B = {
    timestamp: 1002,
    pose: {
      position: [1.01, 2.01, 3.01],
      orientation: [4, 5, 6, 7]
    }
  }

  const C = {
    timestamp: 1003,
    pose: {
      position: [1, 2, 30],
      orientation: [5, 6, 7, 8]
    }
  }

  const APack = pack(A, 0)
  const BPack = pack(B, 0)
  const CPack = pack(C, 0)

  t.plan(4)

  t.equal(moved_sufficiently(A), true)
  t.equal(moved_sufficiently(A, APack), false)
  t.equal(moved_sufficiently(B, APack), false)
  t.equal(moved_sufficiently(C, APack), true)

})
