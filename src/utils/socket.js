import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ['websocket'],
  // ส่ง header x-channel ไปใน handshake ด้วย
  extraHeaders: {
    'x-channel': 'cash'
  }
})

export function setSocketChannel (channel) {
  // เปลี่ยน header ใน runtime (แต่ socket.io-client ไม่เปลี่ยน header หลังเชื่อมแล้ว ต้อง disconnect แล้ว connect ใหม่)
  socket.io.opts.extraHeaders['x-channel'] = channel
  // ถ้าอยากเปลี่ยน channel ต้อง disconnect/reconnect
  socket.disconnect()
  socket.connect()
}

export default socket
