<template>
  <div id="list">
    <i class="iconfont icon-mulu" @click="showList = true" v-show="!showList"></i>
    <i class="iconfont icon-icon3" @click="showList = false" v-show="showList"></i>
    <transition-group enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" tag="div" id="showCata">
      <p class="summary" v-show="showList" key="summary">文章目录</p>
      <ul class="catalog" v-show="showList" key="catalog">
        <li :class="'level-' + title.level"
            v-for="(title,index) in articleList"
            key="index">
          <a :href="'#' + title.content" data-scroll>{{title.content}}</a>
        </li>
      </ul>
    </transition-group>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        showList: true
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    computed: {
      ...mapGetters(['articleList'])
    },
    methods: {
      handleScroll () {
        if (this.$route.name === 'article') {
          const listDiv = document.getElementById('list')
          const topHeight = document.getElementById('nav').clientHeight
          if (window.scrollY > topHeight) {
            listDiv.style.position = 'fixed'
            listDiv.style.top = 0
          } else {
            listDiv.style.position = 'absolute'
            listDiv.style.top = 40 + 'px'
          }
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #list {
    color: #000;
    left: 0.3125rem;
    top: 2.5rem;
    text-align: left;
    position: absolute;
    max-width: 13.75rem;

  i.icon-mulu {
    position: absolute;
    left: 1.25rem;
    top: 0.625rem;
    color: #000;
    font-size: 1.25rem;
    cursor: pointer;
  }
  i.icon-icon3 {
    position: absolute;
    right: -0.9375rem;
    top: 0.3125rem;
    color: #000;
    font-size: 0.9375rem;
    font-weight: bolder;
    cursor: pointer;
  &:hover {
     color: hsl(357,57,50);
   }
  }
  div#showCata {
  div#empty {
    width: 100%;
    background: rgba(204, 204, 204, 0.5);
    position: absolute;
    padding-left: 0.3125rem;
    border-left: 0.1875rem solid darkturquoise;
    transition: 1s;
  }
  p.summary {
    color: #000;
    font-size: 1.25rem;
    font-weight: bold;
    height: 2rem;
    margin-left: 0.625rem;
  }
  .catalog {
    border-left: 0.1875rem solid #000;
    padding-left: 1.5625rem;
  li {
    min-height: 1.875rem;
    list-style-type: circle;
  a {
    color: #000;
    display: block;
    padding: 0.375rem 0 0.375rem 0;
    font-size: 1rem;
    cursor: pointer;
  &:hover {
     color: orange;
   }
  }
  }
  }
  }
  }

  @for $i from 2 to 6 {
    .level-#{$i} {
      border-left: 0.3125rem solid transparent;
      margin-left: #{($i - 1) * 20}px;
    }
  }
</style>


