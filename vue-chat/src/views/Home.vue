<template>
  <div class="home">
    <h1>Chat now</h1>
    <el-upload class="avatar-uploader"
      action="/upload"
      :show-file-list="false"
      :on-success="handleUploadSuccess">
      <img v-if="avatarToUpload"
        :src="avatarToUpload"
        class="avatar">
      <i v-else
        class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div class="user-list">
      <p v-for="(user,index) in userList" :key="index">{{ user.headUrl }} {{ user.name }}</p>
    </div>
    <div class="message-content">
      <div class="message-item"
        :class="item.from === 'me'? 'message-item__me': 'message-item__others'"
        v-for="(item, index) in msgList"
        :key="index">
        <!-- <p class="message-item__name">{{ item.from }}</p> -->
        <div class="message-item__avatar-wrap">
          <img :src="item.avatar"
            class="message-item__avatar"
            alt="No Avatar"
            width="40"
            height="40">
        </div>
        <p class="message-item__text">{{ item.msg }}</p>
      </div>
    </div>
    <div class="input__wrap">
      <mu-text-field v-model.trim='inputText'
        @keyup.enter.trim="sendMessage"
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
    data: () => ({
      socketObj: '',
      msgList: [],
      inputText: '',
      status: '',

      avatarToUpload: '',

      nameDialogShow: false,
      userList: []
    }),
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
        this.socketObj.on('chat message', (from, msg, avatar) => {
          this.msgList.push({from, msg, avatar})
        })
      },
      sendMessage() {
        if (!this.inputText || this.inputText.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
          console.log('Message cannot be empty!')
          return
        }
        this.socketObj.emit('chat message', this.userName, this.inputText, this.avatarToUpload)
        if (this.status && this.status !== 'closed') {
          const msgObj = {
            from: 'me',
            msg: `${this.inputText}`,
            avatar: this.avatarToUpload
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
      },
      getUserAvatar() {
        this.avatarToUpload = localStorage.getItem('MC_CHAT_AVATAR')
      },
      // 头像上传成功后的回调
      handleUploadSuccess(res, file, fileList) {
        console.log(res, file, fileList)
        this.avatarToUpload = res
        localStorage.setItem('MC_CHAT_AVATAR', this.avatarToUpload)
      },
      
      // 检查是否登录
      async checkLoggIn() {
        const res = await this.$ajax.get('/checkLogin')
				if (res.data.code !== 0) {
          this.$toast.error(res.data.msg)
					this.$router.push({ name: 'signup', query: { type: 'login' } })
				}
      }
    },
    created() {
      this.initSocket()
      this.getUserName()
      this.getUserAvatar()
      console.log(this.$localForage)
      this.checkLoggIn()
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
      display: flex;
      text-align: left;
      margin: 10px;
      .message-item__name {
          line-height: 40px;
          margin-right: 6px;
      }
      .message-item__text {
          padding: 10px 6px;
          border-radius: 4px;
          border: 1px solid #e3e3e3;
          width: 600px;
          word-wrap: break-word;
      }
      .message-item__avatar-wrap {
          max-width: 40px;
          max-height: 40px;
          margin: 0 10px;
          .message-item__avatar {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
      }
  }
  .message-item__others {
      justify-content: flex-start;
      .message-item__name {
      }
      .message-item__text {
          background-color: #fff;
          &:hover {
              background-color: #efefef;
          }
      }
  }
  .message-item__me {
      justify-content: flex-end;
      .message-item__name {
          order: 10;
      }
      .message-item__avatar-wrap {
          order: 10;
      }
      .message-item__text {
          background-color: $color1;
          &:hover {
              background-color: darken($color: $color1, $amount: 5%);
          }
      }
  }

  // 上传头像
  .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
      border-color: #409eff;
  }
  .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      position: relative;
      top: 15px;
  }
  .avatar {
      width: 120px;
      height: 120px;
      display: block;
  }
</style>


