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
 @import "assets/styles/variables";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: @text-color;
    font-size: 14px;
  }
  * {
   box-sizing: border-box;
  }
  body {
    margin: 0;
  }
  input, textarea {
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
     text-overflow: ellipsis;
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
   color: rgba(7, 16, 28, 0.9);
   font-size: 14px;
   outline: none;
  }
  h1 {
    margin: 0 0 40px;
  }
  h2 {
    margin: 20px 0 10px;
  }
  table {
    border-collapse: collapse;
  }
  .container {
    width: 95%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 0;
    @media screen and (min-width: @laptop) {
      max-width: 90%;
    }
  }
  .header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
  .modal {
    text-align: center;
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
     text-align: center;
     &.active {
       border-radius: 5px;
       border: 1px solid rgba(7, 16, 28, 0.3);
     }
   }
  }
  .disabled {
    a {
      color: rgba(7, 16, 28, 0.6);
      cursor: default !important;
    }
  }
</style>
