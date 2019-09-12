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
  font-size: 14px;

  .modal {
    &__buttons {
      margin-top: 20px;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    &__page {
      width: 20px;
      margin: 0 5px;
      &.active {
        border-radius: 5px;
        border: 1px solid rgba(7, 16, 28, 0.3);
      }
    }
  }
}
* {
 box-sizing: border-box;
}
input {
 border: 1px solid rgba(7, 16, 28, 0.3);
 outline: none;
 padding: 4px;
 color: @text-color;
 font-size: 14px;
 &::placeholder {
   color: rgba(7, 16, 28, 0.6);
 }
 &[disabled] {
   border-color: transparent;
   background-color: transparent;
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
ul {
 list-style: none;
 padding: 0;
 margin: 0;
}
a {
 color: rgba(7, 16, 28, 0.6);
 font-size: 14px;
 outline: none;
}
</style>
