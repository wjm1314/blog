<template>
  <div id="app">
    <router-view></router-view>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <dialog-box v-if="dialog.show"></dialog-box>
    </transition>
  </div>
</template>
<script>
  import DialogBox from './components/share/DialogBox.vue'
  import {mapState} from 'vuex'
  export default {
    mounted() {
      document.addEventListener('visibilitychange',this.changeTitle,false);
    },
    components: {
      DialogBox
    },
    computed: {
      ...mapState(['dialog'])
    },
    methods: {
      changeTitle() {
        if(document.hidden) {
          document.title = 'GO!GO!GO!';
        }else {
          document.title = '欢迎回来';
        }
      }
    }
  }
</script>
<style>
  * {
    padding: 0;
    margin: 0;
  }
  #app {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100%;
    min-height: 100%;
    background: #fff;
  }
  @media screen and (max-width: 440px) {
    #app {
      background: #fff;
    }
  }
</style>
