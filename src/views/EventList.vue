<script setup>
  import EventCard from "@/components/EventCard.vue";
  import EventService from "@/services/EventService.js";
  import { onMounted, ref, computed, watchEffect } from "vue";

  const props = defineProps(["page"]);

  const events = ref("");
  const totalEvents = ref(0);

  const page = computed(() => props.page);
  const totalPages = ref(0);

  const hasNextPage = computed(() => {
    return page.value < totalPages.value;
  });

  onMounted(() => {
    watchEffect(() => {
      events.value = null;
      EventService.getEvents(2, page.value)
        .then((response) => {
          events.value = response.data;
          totalEvents.value = response.headers["x-total-count"];
          totalPages.value = Math.ceil(totalEvents.value / 2);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
</script>

<template>
  <h1>Events for Good</h1>
  <div class="events">
    <EventCard v-for="event in events" :key="event.id" :event="event" />

    <div class="pagination">
      <router-link
        v-show="page != 1"
        id="page-prev"
        :to="{ name: 'EventList', query: { page: page - 1 } }"
        rel="prev"
      >
        &#60; Previous
      </router-link>

      <router-link
        v-for="pageNum in totalPages"
        :key="pageNum"
        :id="`page-${pageNum}`"
        :to="{ name: 'EventList', query: { page: pageNum } }"
        :class="{ 'current-page': page === pageNum }"
        rel="current"
        >{{ pageNum }}
      </router-link>

      <router-link
        v-show="hasNextPage"
        id="page-next"
        :to="{ name: 'EventList', query: { page: page + 1 } }"
        rel="next"
      >
        Next &#62;
      </router-link>
    </div>
  </div>
</template>

<style scoped>
  .events {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pagination {
    display: flex;
    width: 290px;
    justify-content: space-between;
  }

  .pagination a {
    text-decoration: none;
    color: #2c3e50;
  }

  .pagination a.current-page {
    cursor: inherit;
    color: #42b983;
    font-weight: 900;
  }
</style>
