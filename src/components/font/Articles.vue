<template>
  <div class="articleContent">
    <div id="articles">
      <div class="tags animated fadeIn">
        <div class="tagFlex">
          <button v-for="(tag,index) in allTags"
                  v-bind:class="{activeBtn: selectIndex === index}"
                  v-on:click="switchTag({value: tag,page: 1},index,tag)">
            <span>{{tag}}</span>
          </button>
        </div>
      </div>
      <div id="article" class="animated fadeIn" v-for="(article,index) in reducedArticles">
        <h2>{{article.title}}</h2>
        <time><i class="iconfont icon-shijian"></i>{{article.date | toDate}}</time>
        <span class="articleTag"><i class="iconfont icon-label"></i>{{article.tags | toTag}}</span>
        <span class="commentNumber"><i class="iconfont icon-huifu"></i>{{article.comment_n}}</span>
        <p>{{article.content}}</p>
        <router-link :to="{name:'article',params:{id:article.aid,index:index,page:page},hash:'#article'}" tag="button" exact>
          <span>Continue reading</span>
        </router-link>
      </div>
      <p class="noMore animated fadeIn" v-if="!loadMore" v-show="!noMore">下拉加载更多</p>
      <p class="noMore animated fadeIn" v-if="noMore">已经到底了，别扯了</p>
    </div>
  </div>
</template>
<script>
  import {mapMutations,mapActions,mapGetters,mapState} from 'vuex'
  export default {
    data() {
      return {
        selectIndex: 0,
        page: 1
      }
    },
    created() {
      this.set_headline({
        content: '文章见解',
        animation: 'animated flipInY'
      });
      this.getAllArticles({page: 1});
      this.getAllTags();
    },
    computed: {
      ...mapGetters(['reducedArticles','allTags']),
      ...mapState(['curTag','loadMore','moreArticles','isLoading','moMore'])
    },
    methods: {
      ...mapMutations(['set_headline'],['set_curtag']),
      ...mapActions(['getAllArticles','getAllTags']),
      switchTag(payload,index,tag) {
        this.getAllArticles(payload);
        this.selectIndex = index;
        this.set_curtag(tag);
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .articleContent {
    background: #fff;
  #articles {
    padding: 1.875rem 12.5rem 0;
  .tags {
  .tagFlex {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  .activeBtn {
    background: #ffc520;
    color: #000;
    transition:  1s;
  }
  button {
    transition:  1s;
    padding-left: 1rem;
    padding-right: 1rem;
    text-align: center;
    background: rgb(129, 216, 208);
    color: #00193a;
    margin: 0 1.25rem 1.25rem 0;
  }
  }
  }
  div#article {
    color: #000;
    width: 100%;
    border-bottom: 0.125rem solid rgb(129, 216, 208);
  h2 {
    color: rgb(129, 216, 208);
    margin-top: 1.875rem;
    margin-bottom: 1.25rem;
  }
  time {
    margin-top: 0.625rem;
    margin-right: 0.625rem;
  }
  p {
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-top: 1.875rem;
    margin-bottom: 1.875rem;
  }
  button {
    width: 8.75rem;
    height: 2.5rem;
    line-height: 2.5rem;
    margin-bottom: 1.25rem;
    border-radius: 0.25rem;
    margin-left: calc(100% - 8.75rem);
  }
  .articleTag {
    margin-bottom: 1.875rem;
    margin-right: 0.625rem;
  }
  .commentNumber {
    color: #000;
  i {
    font-size: 1.125rem;
    margin-right: 0.3125rem;
  }
  }
  i.icon-label, i.icon-shijian {
    color: #000;
    font-size: 1.25rem;
    margin-right: 0.3125rem;
  }
  }
  p.noMore {
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    color: #000;
    margin-top: 1.875rem;
    /*padding-bottom:1.875rem;*/
    margin-bottom: 1.875rem;
    text-align: center;
  }
  }
  }
  @media screen and (max-width: 440px) {
    #articles {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }
</style>

