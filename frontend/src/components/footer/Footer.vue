<template>
  <div class="footer">
    <SoundWave></SoundWave>
    <h3>App created by Jakub Stępień &copy; 2021</h3>
    <SoundWave></SoundWave>
  </div>
</template>

<script>
import SoundWave from "./SoundWave";

export default {
  name: "Footer",
  components: {
    SoundWave,
  },
};
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100vw;
  background: black;
  box-shadow: $shadow;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 5%;
  overflow: hidden;
}
</style>
