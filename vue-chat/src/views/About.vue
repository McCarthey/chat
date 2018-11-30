<template>
  <div class="about">
    <h1>This is an about page</h1>
    <count-down leftTime="86400"></count-down>
  </div>
</template>

<script>
import CountDown from '../components/countdown/index.vue'

export default {
  name: 'About',
  components: {
    CountDown
  }
}
</script>
