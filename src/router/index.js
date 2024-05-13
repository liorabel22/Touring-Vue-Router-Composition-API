import { createRouter, createWebHistory } from "vue-router";
import { inject } from "vue";
import EventList from "@/views/EventList.vue";
import EventLayout from "@/views/event/Layout.vue";
import EventDetails from "@/views/event/Details.vue";
import EventRegister from "@/views/event/Register.vue";
import EventEdit from "@/views/event/Edit.vue";
import NotFound from "@/views/NotFound.vue";
import NetworkError from "@/views/NetworkError.vue";

const About = () => import(/* webpackChunkName: "about" */ "@/views/About.vue");

const routes = [
  {
    path: "/",
    name: "EventList",
    component: EventList,
    props: (route) => ({ page: parseInt(route.query.page) || 1 }),
  },
  {
    path: "/events/:id",
    name: "EventLayout",
    props: true,
    component: EventLayout,
    children: [
      {
        path: "",
        name: "EventDetails",
        component: EventDetails,
      },
      {
        path: "register",
        name: "EventRegister",
        component: EventRegister,
      },
      {
        path: "edit",
        name: "EventEdit",
        component: EventEdit,
        meta: { requireAuth: true },
      },
    ],
  },
  {
    path: "/event/:afterEvent(.*)",
    redirect: (to) => {
      return { path: "/events/" + to.params.afterEvent };
    },
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/404/:resource",
    name: "404Resource",
    component: NotFound,
    props: true,
  },
  {
    path: "/network-error",
    name: "NetworkError",
    component: NetworkError,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

router.beforeEach((to, from) => {
  const GStore = inject("GStore");
  const notAuthorized = true;
  if (to.meta.requireAuth && notAuthorized) {
    GStore.flashMessage = "Sorry, you are not authorized to view this page";

    setTimeout(() => {
      GStore.flashMessage = "";
    }, 3000);

    if (from.href) {
      return false;
    }
    return { path: "/" };
  }
});

export default router;
