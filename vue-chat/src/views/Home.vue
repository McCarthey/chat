<template>
  <div class="home">
    <h1>Chat now</h1>
    <div class="message-content">
      <div class="message-item"
        :class="item.from === 'me'? 'message-item__me': 'message-item__others'"
        v-for="(item, index) in msgList"
        :key="index">{{ item.from}}: {{ item.msg }}</div>
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
    <name-dialog v-if="nameDialogShow"
      @close="closeNameDialog"></name-dialog>
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
        this.socketObj.on('chat message', (from, msg) => {
          this.msgList.push({ from, msg })
        })
      },
      sendMessage() {
        if (!this.inputText) {
          console.log('Message cannot be empty!')
          return
        }
        this.socketObj.emit('chat message', this.userName, this.inputText)
        if (this.status && this.status !== 'closed') {
          const msgObj = {
            from: 'me',
            msg: `${this.inputText}`
          }
          this.msgList.push(msgObj)
          this.inputText = ''
        }
      },
      closeSocket() {
        this.socketObj.disconnect()
      },

      closeNameDialog() {
        this.getUserName()
        this.nameDialogShow = false
      },

      getUserName() {
        this.userName = localStorage.getItem('MC_CHAT_NAME')
      }
    },
    created() {
      this.initSocket()
      this.getUserName()
    },
    mounted() {
      if (!this.userName) {
        this.nameDialogShow = true
      }
    },
    destroyed() {
      this.closeSocket()
    }
  }
</script>

<style lang="scss">
  $color1: #9eea6a;
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
      background-color: #f6f6f6;
  }
  .input__wrap {
      @include content__wrap;
      border-top: 0;
      padding-left: 20px;
      .btn-send__wrap {
          text-align: right;
      }
  }
  .message-item {
      text-align: left;
      margin: 10px;
      padding: 10px 6px;
      border-radius: 4px;
      border: 1px solid #e3e3e3;
  }
  .message-item__me {
      background-color: $color1;
      &:hover {
          background-color: darken($color: $color1, $amount: 5%);
      }
  }
  .message-item__others {
      background-color: #fff;
      &:hover {
          background-color: #b5b5b5;
      }
  }
</style>


