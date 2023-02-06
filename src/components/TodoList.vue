<template>
  <div v-for="(todo, i) in todos" :key="todo" class="card mt-2">
    <div
      class="card-body p-1 d-flex align-items-center"
      @click="moveToPage(todo.id)"
    >
      <div class=" flex-grow-1">
        <input
          class="ml-2 mr-2"
          type="checkbox"
          :checked="todo.completed"
          @change.stop="toggleTodo(i, $event)"
          @click.stop
        />
        <span :class="{ todo: todo.completed }">
          {{ todo.subject }}
        </span>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click.stop="openModal(todo.id)">
          Delete
        </button>
      </div>
    </div>
  </div>
  <teleport to="#modal">
    <Modal 
      v-if="showModal"
      @close='closeModal'
      @delete='deleteTodo'
    />
  </teleport>
</template>

<script>
import { useRouter } from "vue-router";
import Modal from '@/components/DeleteModal.vue'
import { ref } from 'vue'

export default {
  components:{
    Modal
  },
  props: {
    todos: {
      type: Array,
    },
  },
  emits: ["toggle-todo", "delete-todo"],
  setup(props, { emit }) {
    const router = useRouter();
    const showModal = ref(false)
    const todoDeleteId = ref(null)
    const toggleTodo = (i, event) => {
      emit("toggle-todo", i, event.target.checked);
    };
    const openModal = (id) => {
      showModal.value = true
      todoDeleteId.value = id
    }
    const closeModal = () => {
      showModal.value = false
      todoDeleteId.value = ''
    }

    const deleteTodo = () => {
      emit("delete-todo", todoDeleteId.value );
      showModal.value = false;
      todoDeleteId.value = ''
    };
    const moveToPage = (todoId) => {
      // router index.js에서 경로 이동방법

      // 이동할 경로를 수동으로 지정했을경우
      // router.push( '/todos/' + todoid);
      // router에서 지정한 name으로 찾아 경로 이동
      router.push({
        name: "Todo",
        params: {
          id: todoId,
        },
      });
    };
    return {
      toggleTodo,
      deleteTodo,
      moveToPage,
      showModal,
      openModal,
      closeModal,
    };
  },
};
</script>

<style>
.card-body {
  cursor: pointer;
}
</style>
