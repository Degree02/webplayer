<template>
  <div ref="toasts" class="toasts">
    <div
      :class="{ active: message.active }"
      class="toast"
      v-for="(message, id) in messages"
      :key="message.text + id"
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
      this.messages.push(message);
      setTimeout(() => (message.active = false), 500);
      setTimeout(() => this.messages.pop(), 3500);
    });
  },
};
</script>

<style lang="scss" scoped>
.toasts {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
}

.toast {
  margin: 0 1em;
  font-weight: bold;
  opacity: 0;
  transition: opacity 3s ease;
  background: $primary;
  color: $dark;
  padding: 0.2em;
  border-radius: 10px;
  animation: fadein 0.1s linear;
  min-width: 25%;
  width: fit-content;

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
