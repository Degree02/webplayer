<template>
  <div ref="toasts" class="toasts">
    <div
      :class="{ active: message.active }"
      class="toast"
      v-for="message in messages"
      :key="message.text"
    >
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import { EventBus } from "../../eventbus";

export default {
  name: "Toast",
  data() {
    return {
      messages: [],
    };
  },
  mounted() {
    EventBus.$on("toast", (text) => {
      const message = { text, active: true };
      const messageIndex = this.messages.length;
      this.messages.push(message);
      setTimeout(() => (message.active = false), 500);
      setTimeout(() => this.messages.splice(messageIndex, 1), 5000);
    });
  },
};
</script>

<style lang="scss" scoped>
.toasts {
  position: absolute;
  top: 0;
  right: 0;
  height: calc(100% - 200px);
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.toast {
  margin: 1em 1em;
  font-size: 1.2em;
  font-weight: bold;
  opacity: 0;
  transition: opacity 5s ease;
  background: $primary;
  color: $dark;
  padding: 0.5em;
  border-radius: 10px;
  animation: fadein 0.1s linear;

  &.active {
    opacity: 1;
  }
}

@keyframes fadein {
  0% {
    transform: translate(150%);
  }

  100% {
    transform: translate(0);
  }
}
</style>
