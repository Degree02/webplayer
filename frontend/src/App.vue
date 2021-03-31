<template>
  <div id="app">
    <Nav></Nav>
    <SongsList></SongsList>
    <Footer></Footer>
    <Background></Background>
    <Toast></Toast>
  </div>
</template>

<script>
import Nav from "./components/navigation/Nav";
import SongsList from "./components/songslist/SongsList";
import Footer from "./components/footer/Footer";
import Background from "./components/background/Background";
import Toast from "./components/toast/Toast";

export default {
  name: "App",
  components: {
    Nav,
    SongsList,
    Footer,
    Background,
    Toast,
  },
  mounted() {
    this.$store.dispatch("fetchData", {
      action: "FIRST",
    });
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Lato";
}

body {
  background: $background;
  min-height: calc(100vh - 200px);
  color: $text-color;
}
</style>
