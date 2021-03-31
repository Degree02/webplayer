import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    albums: [],
    songs: [],
    activeAlbum: "",
    playingAlbum: "",
    activeSong: "",
    isPlaying: false,
    playlist: [],
    playlistOpen: false,
  },
  mutations: {
    SET_ALBUMS(state, albums) {
      state.albums = albums;
    },

    SET_SONGS(state, songs) {
      state.songs = songs;
    },

    SET_ACTIVE_ALBUM(state, album) {
      state.playlistOpen = false;
      state.activeAlbum = album;
    },

    SET_SONG(state, song) {
      state.activeSong = song;
    },

    SET_ISPLAYING(state, bool) {
      state.isPlaying = bool;
    },

    SET_PLAYLIST(state, playlist) {
      state.playlist = playlist;
    },

    TOGGLE_PLAYLIST(state) {
      state.playlistOpen = !state.playlistOpen;
    },

    SET_PLAYING_ALBUM(state, album) {
      state.playingAlbum = album;
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
      this.dispatch("fetchPlaylist");
    },

    fetchPlaylist({ commit }) {
      axios.get(`${process.env.VUE_APP_API_URL}playlist`, { withCredentials: true }).then(({ data }) => {
        commit("SET_PLAYLIST", data);
      });
    },

    addToPlaylist({ dispatch }, song) {
      axios
        .post(
          `${process.env.VUE_APP_API_URL}playlist/add`,
          JSON.stringify(song),
          { withCredentials: true }
        )
        .then(() => {
          dispatch("fetchPlaylist");
        });
    },

    removeFromPlaylist({ dispatch }, song) {
      axios
        .post(
          `${process.env.VUE_APP_API_URL}playlist/remove`,
          JSON.stringify(song),
          { withCredentials: true }
        )
        .then(() => {
          dispatch("fetchPlaylist");
        });
    },
  },
  getters: {
    song: (state) => (name) => {
      return state.songs.find((song) => song.name == name);
    },

    songFromPlaylist: (state) => (name) => {
      return state.playlist.find((song) => song.name == name);
    },
  },
});
