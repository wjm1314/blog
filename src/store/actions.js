import Vue from 'vue'
import router from '../router/index'
import axios from 'axios'

const beginLoading = (commit,add) => {
  add ? commit('loadMore_toggle',true) : commit('isLoading_toggle',true);
  return Date.now();
}
const endLoading = (commit,startTime,toggle) => {
  const leftTime = 500 - (Date.now() - startTime);
  leftTime > 0 ? setTimeout(commit(toggle,false),leftTime) : commit(toggle,false);
}
export default {
  login({commit},payload) {
    console.log('fafa');
    return axios.post('/api/login',payload).catch((err) => {
      console.log(err);
    })
  },
  resetUser({commit},payload) {
    return axios.post('/api/user',payload).then(() => {
      commit('unset_user');
      router.push('/login'); //导航到不同的URL,任何页面都可以调用push
      //router.go({name: 'login'}) //返回上一个history
    }).catch((err) => {
      console.log(err);
    })
  },
  getArticle ({commit,state},aid) {
    const startTime = beginLoading(commit,false);
    document.title = '加载中...';
    return axios.get('/api/article/' + aid)
      .then((response) => {
      //console.log('response: '+ response);
      console.log('response.data: ' + response.data);
      commit('set_article',response.data);
      commit('set_headline',{content: state.article.title, animation: 'animated rotateIn'});
      document.title = state.article.title;
      endLoading(commit,startTime,'isLoading_toggle');
      }).catch((err) => { console.log(err);})
  },
  saveArticle ({state,commit},aid) {
    commit('isSaving_toggle',false)
    if(aid) {
      return axios.patch('/api/article/' + aid, state.article)
        .then(() => {
        commit('isSaving_toggle',true);
        router.push({name: 'posts'})
        }, () => {alert('保存失败')}).catch((err) => {console.log(err)})
    }else {
      return axios.post('/api/article',state.article)
        .then(() => {
        commit('isSaving_toggle',true);
        router.push({name: 'posts'})
        }, () => {alert('保存失败')}).catch((err) => {console.log(err)})
    }
  },
  //article的http请求
  getAllArticles: function({commit},payload) {
    commit('moreArticle_toggle',true);
    const startTime = beginLoading(commit,payload.add);
    if(payload.value) {
      commit('isLoading_toggle',false);
    }
    return axios.get('/api/articles',{params:{payload}})
      .then(response => {return response})
      .then(articles => {
        var articles = articles['data'];
        //console.log('后台: '+ articles);
        if(articles.length === 0) {
          commit('moreArticle_toggle',false);
          commit('noMore_toggle',true);
        }else {
          commit('noMore_toggle',false);
        }
        if(payload.add) {
          commit('add_articles',articles);
          endLoading(commit,startTime,'loadMore_toggle');
        }else {
          commit('set_all_articles',articles);
          endLoading(commit,startTime,'isLoading_toggle');
        }
      }).catch((err) => {
        console.log(err);
        })
  },
  //删除文章
  delArticle ({dispatch},payload) {
    console.log('删除文章: '+ payload.route.name);
    return axios.delete('/api/article/' + payload.aid)
      .then(() => {
        if(payload.route.name === 'posts') {
          dispatch('getAllArticles',{page: payload.page, limit: 8})
        }
        if(payload.route.name === 'drafts') {
          dispatch('getAllDrafts',{page: payload.page, limit: 8})
        }
        if(payload.route.name === 'search') {
          router.push({name: 'posts'})
        }
      }).catch((err) => {console.log(err)})
  },
  //search
  searchArticles: function({commit},payload) {
    document.title = '搜索中...';
    commit('moreArticle_toggle',true);
    const startTime = beginLoading(commit,payload.add);
    //console.log('聪明蛋');
    /*return axios.get('/api/chart',{params: {payload}})*/
    //.then(function (response) {console.log(response);})
    return axios.get('/api/someArticles',{params: {payload}})
      .then((response) => {console.log(response); return response;})
      .then(articles => {
        var articles = articles['data'];
        //var articles = JSON.stringify(articles);
        console.log('类型articles: '+typeof articles);
        console.log('哈哈articles: '+articles);
        if(articles.length === 0) {
          commit('moreArticle_toggle',false);
          commit('noMore_toggle',true);
        }else {
          commit('noMore_toggle',false);
        }
        if(payload.add) {
          commit('add_articles',articles);
          endLoading(commit,startTime,'loadMore_toggle');
        }else {
          commit('set_all_articles',articles);
          endLoading(commit,startTime,'isLoading_toggle');
        }
        document.title = '搜索成功';
      }).catch(
        (err) => { console.log(err);}
        )
  },
  //tags
  getAllTags ({commit}) {
    return axios.get('/api/tags').then(response => {
      //console.log('response: ' + response['data']);
      //console.log(response['data'] instanceof Array);
      commit('set_tags',response['data'])
    }).catch((err) => console.log(err));
  },
  //comment
  getAllComments ({commit},payload) {
    return axios.get('/api/comments',{params: {payload}})
      .then((response) => {console.log('comment: '+ response); return response;})
      .then(comments => {
        var comments = comments['data'];
        console.log('comments: ' + comments);
        commit('set_comment',comments);
      }).catch((err) => {
          console.log(err);
      })
  },
  //drafts
  getAllDrafts({commit},payload) {
    return axios.get('/api/drafts',{params: {payload}})
      .then((response) => {return response})
      .then((articles) => {
      var articles = articles['data'];
      commit('set_all_articles',articles)
    }).catch((err) => {console.log(err)})
  },
  saveDraft ({state,commit}, aid) {
    if(aid) {
      return axios.patch('/api/draft/' + aid, state.article)
        .then(() => {
        commit('isSaving_toggle',true);
        router.push({name: 'drafts'})
        },() => {alert('保存失败')}).catch((err) => {console.log(err)})
    }else {
      return axios.post('/api/draft', state.article)
        .then(() => {
        commit('isSaving_toggle',true);
        router.push({name: 'drafts'})
        },() => {alert('保存失败')}).catch((err) => {console.log(err)})
    }
  },
  //email
  sendMail({commit},payload) {
    return axios.post('/api/mail',payload).catch((err) => {console.log(err)})
  },
  //comment
  summitComment ({commit}, payload) {
    return axios.post('/api/comment',payload)
  },
  getAllComments ({commit},payload) {
    return axios.get('/api/comments',{params: {payload}})
      .then((response) => {return response})
      .then((comments) => {
        var comments = comments['data'];
        console.log('comments: '+comments);
        commit('set_comment',comments)
      }).catch((err) => {console.log(err)})
  },
  updateLike ({commit},payload) {
    console.log('updateLike:'+payload);
    return axios.patch('/api/comments/' + payload.id, {option: payload.option})
      .catch((err) => console.log(err))
  }
}
