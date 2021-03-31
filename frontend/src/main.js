import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronDown,
  faPlay,
  faPause,
  faForward,
  faBackward,
  faVolumeUp,
  faPlus,
  faMinus,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faChevronDown);
library.add(faPlay);
library.add(faPause);
library.add(faForward);
library.add(faBackward);
library.add(faVolumeUp);
library.add(faPlus);
library.add(faMinus);
library.add(faList);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
