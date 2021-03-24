import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    albums: [],
    songs: [],
    activeAlbum: "",
    activeSong: "",
    isPlaying: false,
  },
  mutations: {
    SET_ALBUMS(state, albums) {
      state.albums = albums;
    },

    SET_SONGS(state, songs) {
      state.songs = songs;
    },

    SET_ACTIVE_ALBUM(state, album) {
      state.activeAlbum = album;
    },

    SET_SONG(state, song) {
      state.activeSong = song;
    },

    SET_ISPLAYING(state, bool) {
      state.isPlaying = bool;
    },
  },
  actions: {
    fetchData({ commit }, payload) {
      axios
        .post(`${process.env.VUE_APP_API_URL}files`, JSON.stringify(payload))
        .then(({ data }) => {
          if (data.dirs) {
            commit("SET_ALBUMS", data.dirs);
            commit("SET_ACTIVE_ALBUM", data.dirs[0]);
          }
          commit("SET_SONGS", data.files);
          if (payload.name) {
            commit("SET_ACTIVE_ALBUM", payload.name);
          }
        });
    },
  },
  getters: {
    song: (state) => (name) => {
      return state.songs.find((song) => song.name == name);
    },
  },
});
