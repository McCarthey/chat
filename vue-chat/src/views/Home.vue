<template>
  <div class="home">
    <h1>this is home page</h1>
    <button @click="closeSocket">close socket</button>
    <div>
      <p v-for="(msg, index) in msgList" :key="index">{{ msg }}</p>
    </div>
    <input type="text" v-model='inputText'>
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
// @ is an alias to /src

import io from 'socket.io-client'

export default {
  name: 'home',
  data() {
    return {
      socketObj: '',
      msgList: [],
      inputText: ''
    }
  },
  methods: {
    initSocket() {
      this.socketObj = io('http://10.0.21.16:8770/')
      this.socketObj.on('connect', () => {
        console.log('start')
      })
      console.log(this.socketObj)
      this.socketObj.on('disconnect', () => {
        console.log('chat closed')
      })
      this.socketObj.on('chat message', msg => {
        this.msgList.push(msg)
      })
    },
    sendMessage() {
      if (!this.inputText) {
        console.log('Message cannot be empty!')
        return 
      }
      this.socketObj.emit('chat message', this.inputText)
      this.inputText = ''
    },
    closeSocket() {
      this.socketObj.disconnect()
    }
  },
  created(){
    this.initSocket()
  }
}
</script>
