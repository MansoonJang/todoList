<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2>To-Do List</h2>
      <button class="btn btn-primary" @click="todoCreateMovePage">Create</button>
    </div>
    
    <input
      type="text"
      v-model="searchText"
      class="form-control"
      placeholder="Search"
      @keyup.enter="searchTodo"
    />
    <hr />

    <div style="color: red">{{ error }}</div>

    <div v-if="!todos.length" class="mt-2">
      There is noting to display
    </div>

    <TodoList
      :todos="todos"
      @toggle-Todo="toggleTodo"
      @delete-Todo="deleteTodo"
    />
    <hr />
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item"
          v-if="currentPage !== 1">
          <a class="page-link" @click="getTodos(currentPage - 1)">Previous</a>
        </li>
        <li
          v-for="page in numberOfPages"
          :key="page"
          class="page-item"
          :class="currentPage === page ? 'active' : ''">
          <a class="page-link" @click="getTodos(page)">{{page}}</a>
        </li>
        <li class="page-item"
          v-if="numberOfPages !== currentPage">
          <a class="page-link" @click="getTodos(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
  <Toast v-if="showToast" :message="toastMessage" :type="ToastType" />
</template>

<script>
import { ref, computed, watch,} from "vue";
import TodoList from "@/components/TodoList.vue";
import axios from "axios";
import Toast from "@/components/ToastPop.vue";
import { useToast } from "@/hook/toast.js";
import { useRouter } from "vue-router";


export default {
  components: {
    TodoList,
    Toast,
  },
  setup() {
    const router = useRouter();
    const todos = ref([]);
    const error = ref("");
    const numberOfTodos = ref(0);
    const limit = ref(5);
    const currentPage = ref(1);
    const searchText = ref("");

    const { showToast, toastMessage, ToastType, triggerToast } = useToast();

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value/limit.value);
    });

    const getTodos = async ( page = currentPage.value ) => {
      currentPage.value = page
      try {
        const res = await axios.get(
          `http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit.value}`
        );
        numberOfTodos.value = res.headers["x-total-count"];
        todos.value = res.data;
      } catch (err) {
        console.log(err);
        error.value = "Something went wrong.";
        triggerToast("something went wrong", "danger");
      }
    };
    getTodos();

    const addTodo = async (todo) => {
      error.value = "";
      try {
        await axios.post("http://localhost:3000/todos/", {
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodos(1)
      } catch (err) {
        console.log(err);
        error.value = "Somting went wrong";
        triggerToast("something went wrong", "danger");
      }
    };

    const toggleTodo = async (i, checked) => {
      const id = todos.value[i].id;
      try {
        await axios.patch("http://localhost:3000/todos/" + id, {
          completed: checked
        });
        todos.value[i].completed = checked
        
      } catch (err) {
        console.log(err);
        error.value = "Somting went wrong";
        triggerToast("something went wrong", "danger");
      }
    };

    const deleteTodo = async (id) => {
      error.value = "";
      try {
        await axios.delete("http://localhost:3000/todos/" + id);
        getTodos(1)
      } catch (err) {
        console.log(err);
        error.value = "Somting went wrong";
        triggerToast("something went wrong", "danger");
      }
    };

    const todoCreateMovePage = () => {
      router.push({
        name: 'Todocreate'
      })
    }

    let searchTodo = () => {
      clearTimeout ( clearTime )
      getTodos(1)
    }
    
    let clearTime ='null'
    watch( searchText, () => { 
      clearTimeout( clearTime )
      clearTime = setTimeout( () => {
        getTodos(1)
      },1000)
      
    })

    return {
      searchTodo,
      todos,
      addTodo,
      deleteTodo,
      toggleTodo,
      searchText,
      error,
      numberOfPages,
      currentPage,
      getTodos,
      showToast,
      toastMessage,
      ToastType,
      todoCreateMovePage,
    };
  },
};
</script>

<style>
.todo {
  text-decoration: line-through;
  color: #ccc;
}
.emptyErr {
  color: red;
}
.page-link{
  cursor: pointer;
}
</style>
