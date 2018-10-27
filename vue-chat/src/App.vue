<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <mu-appbar style="width: 100%;"
      color="primary">
      <mu-button flat
        slot="right"
        @click="handleLogout">Logout</mu-button>
    </mu-appbar>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'app',
    methods: {
      async handleLogout() {
        const res = await this.$ajax.post('/logout')
        if (res.data.code === 0) {
          this.$router.push({ name: 'signup', query: { type: 'login' } })
        } else {
          this.$toast.error(res.data.msg)
        }
      }
    }
  }
</script>


<style lang="scss">
  #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
  }
  #nav {
      padding: 30px;
      a {
          font-weight: bold;
          color: #2c3e50;
          &.router-link-exact-active {
              color: #42b983;
          }
      }
  }
  p {
      margin: 0;
  }
</style>
