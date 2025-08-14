import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/kuaixun",
      name: "kuaixun",
      component: () => import("../views/KuaiXunView.vue"),
    },
    {
      path: "/motanrobot",
      name: "motanrobot",
      component: () => import("../views/MotanRobot.vue"),
    },
    {
      path: "/disclaimer",
      name: "disclaimer",
      component: () => import("../views/DisclaimerView.vue"),
    },
    {
      path: "/textclamp",
      name: "textclamp",
      component: () => import("../views/TextClampView.vue"),
    },
  ],
});

export default router;
