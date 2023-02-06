<template>
  <form @submit.prevent="onSubmit()">
    <div class="d-flex">
      <div class="flex-grow-1 mr-2">
        <input
          type="text"
          v-model="todo"
          class="form-control"
          placeholder="Type new To-Do"
        />
      </div>
      <div class="flex-grow-1">
        <button type="submit" class="btn btn-primary">Add</button>
      </div>
    </div>
    <div v-show="hasError" class="emptyErr">This fileld cannot be Empty</div>
  </form>
</template>

<script>
import { ref } from "vue";
export default {
  emits: ["add-todo"],
  setup(props, { emit }) {
    const todo = ref("");
    const hasError = ref(false);
    const onSubmit = () => {
      if (todo.value === "") {
        hasError.value = true;
      } else {
        emit("add-todo", {
          id: Date.now(),
          subject: todo.value,
          completed: false,
        });
        hasError.value = false;
        todo.value = "";
      }
    };
    return {
      todo,
      hasError,
      onSubmit,
    };
  },
};
</script>
