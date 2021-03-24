<template>
  <div class="bottom-section">
    <Player></Player>
    <div class="footer">
      <SoundWave></SoundWave>
      <h3>App created by Jakub Stępień &copy; 2021</h3>
      <SoundWave></SoundWave>
    </div>
  </div>
</template>

<script>
import SoundWave from "./SoundWave";
import Player from "./Player";

export default {
  name: "Footer",
  components: {
    SoundWave,
    Player,
  },
};
</script>

<style lang="scss" scoped>
.bottom-section {
  position: fixed;
  bottom: 0;
  width: 100vw;
  box-shadow: $shadow;
}

.footer {
  width: 100%;
  height: 50px;
  background: black;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
}
</style>
