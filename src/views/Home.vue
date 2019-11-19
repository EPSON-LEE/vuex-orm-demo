<template>
  <div class="home">
    <h1>{{ specificTitle.title }}</h1>
    <div v-for="todo in todos" :key="todo.key">
      {{ todo.id }} - {{ todo.title }}
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Todo from "../store/models/todo";

export default {
  name: "home",
  computed: {
    // Access data
    todos: () => Todo.all(),
    specificTitle: () =>
      Todo.query()
        .with("title")
        .first()
  },
  created() {
    // insert data
    Todo.insert({
      data: [
        {
          id: 1,
          title: "Hello, world!",
          body: "Some awesome body text...",
          author: {
            id: 1,
            name: "John Doe",
            email: "john@example.com"
          }
        },
        {
          id: 2,
          title: "Hello, world 2!",
          body: "Some awesome body text...",
          author: {
            id: 1,
            name: "John Doe",
            email: "john@example.com"
          }
        }
      ]
    });
  },
  methods: {},
  components: {}
};
</script>
