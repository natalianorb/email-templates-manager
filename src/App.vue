<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="less">
 @import "assets/styles/colors";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @text-color;
  * {
    box-sizing: border-box;
  }
  input {
    border: none;
    outline: none;
    padding: 4px;
    color: @text-color;
    &::placeholder {
      color: rgba(7, 16, 28, 0.6);
    }
  }
  button {
    border: 1px solid rgba(7, 16, 28, 0.3);
    outline: none;
    padding: 4px;
    background-color: #fff;
    color: @text-color;
    cursor: pointer;
    &[disabled] {
      background-color: rgba(7, 16, 28, 0.1);
      color: rgba(7, 16, 28, 0.6);
      cursor: default;
    }
  }
}
</style>
