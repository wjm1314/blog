<template>
  <div id="wrapper">
    <my-header></my-header>
    <router-view class="content" v-show="!isLoading"></router-view>
    <transition name="huojian" enter-active-class="animated bounceIn" leave-active-class="animated fadeOut">
      <a href="#app" class="rocket"><i class="iconfont icon-huojian" v-if="show"></i></a>
    </transition>
    <my-footer></my-footer>
  </div>
</template>
<script>
  import MyHeader from './component/MyHeader.vue'
  import MyFooter from './component/MyFooter.vue'
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        show: false
      }
    },
    mounted() {
      window.addEventListener('scroll',this.handleScroll);
    },
    computed: {
      ...mapState(['isLoading'])
    },
    methods: {
      handleScroll() {
        this.show = window.scrollY > 400;
      }
    },
    components: {
      MyHeader,
      MyFooter
    }
  }
</script>
<style scoped>
  @import '../../assets/css/icon.css';
  #wrapper {
    margin:0 auto;
  }
  .icon-huojian {
    font-size: 2.5rem;
    color: #C0CCDA;
    position: fixed;
    bottom: 1.25rem;
    right: 2.5rem;
    cursor: pointer;
    transition: 1s;
  }
  .icon-huojian:hover {
    bottom: 1.875rem;
    color: #00ff7f;
    transition: 1s;
  }
</style>
