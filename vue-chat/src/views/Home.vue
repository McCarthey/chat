<template>
  <div class="home">
    <h1>Chat now</h1>
    <div class="message-content">
      <p v-for="(msg, index) in msgList"
        :key="index">{{ msg }}</p>
    </div>
    <div class="input__wrap">
      <mu-text-field v-model='inputText'
        @keyup.enter="sendMessage"
        multi-line
        :rows="4"
        solo
        full-width></mu-text-field>
      <div class="btn-send__wrap">
        <mu-button color="primary"
          @click="sendMessage">Send</mu-button>
      </div>
    </div>
    <!-- <button @click="closeSocket">close socket</button> -->
    <name-dialog v-show="nameDialogShow" @close="closeNameDialog"></name-dialog>
  </div>
</template>

<script>
  // @ is an alias to /src

  import io from 'socket.io-client'
  import NameDialog from '@/components/NameDialog'

  export default {
    name: 'home',
    data() {
      return {
        socketObj: '',
        msgList: [],
        inputText: '',
        status: '',
        
        nameDialogShow: false
      }
    },
    components: {
      NameDialog
    },
    methods: {
      initSocket() {
        this.socketObj = io('http://10.0.21.16:8770/')
        this.socketObj.on('connect', () => {
          console.log('start')
          this.status = 'start'
        })
        console.log(this.socketObj)
        this.socketObj.on('disconnect', () => {
          this.status = 'closed'
          console.log('chat closed', this.status)
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
        this.socketObj.emit('chat message', 'McCarthey', this.inputText)
        if (this.status && this.status !== 'closed') {
          this.msgList.push(`McCarthey said: ${this.inputText}`)
          this.inputText = ''
        }
      },
      closeSocket() {
        this.socketObj.disconnect()
      },
      
      closeNameDialog() {
        this.nameDialogShow = false
        
      }
    },
    created() {
      this.initSocket()
    },
    mounted() {
      if(!localStorage.getItem('MC_CHAT_NAME')) {
        this.nameDialogShow = true
      }
    },
    destroyed() {
      this.closeSocket()
    }
  }
</script>

<style lang="scss">
  @mixin content__wrap {
      border: 1px solid #ddd;
      width: 90%;
      margin: 0 auto;
      max-width: 800px;
  }
  .message-content {
      @include content__wrap;
      height: 600px;
      overflow-y: scroll;
  }
  .input__wrap {
      @include content__wrap;
      border-top: 0;
      padding-left: 20px;
      .btn-send__wrap {
          text-align: right;
      }
  }
</style>


