import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    user: {},
    headline: {},
    isLoading: false,
    moreArticle: true,
    loadMore: false,
    isSaving: false,
    noMore: false,
    dialog: {
      show: false,
      hasTwoBtn: false,
      info: 'hey',
      resolveFn: () => {},
      rejectFn: () => {}
    },
    tags: [],
    curTag: '',
    article: {},
    articles: [],
    draft: {},
    drafts: {},
    comments: []
  },
  getters,
  actions,
  mutations
})
export default store
