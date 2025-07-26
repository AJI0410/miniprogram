<template>
  <view class="container">
    <slot />
  </view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.container {
  min-height: 100vh;
  background: #f8f8f8;
}
</style> 