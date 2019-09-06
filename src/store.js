import Vue from 'vue';
import Vuex from 'vuex';
import Category from '@/classes/Category';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    category: {},
  },
  mutations: {
    SET_CATEGORY(state, payload) {
      state.category = new Category(payload);
    },
  },
  actions: {
    setCategory({ commit }, category) {
      commit('SET_CATEGORY', category);
    },
  },
});
