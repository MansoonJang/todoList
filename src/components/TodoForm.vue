<template>
  <div v-if="loading">Loading...</div>
  <form @submit.prevent="onSave" v-else>
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <input v-model="todo.subject" type="text" class="form-control" />
        <div v-if="todoError"
        class="text-red">
          {{ todoError }}
        </div>
        </div>
      </div>
      <div v-if="editing" class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button
              type="button"
              class="btn"
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
              @click="toggleTodoStauts()"
            >
              {{ todo.completed ? "Completed" : "Incompleted" }}
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea v-model="todo.body" class="form-control" cols="30" rows="10"></textarea>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="todoUpdated">
      {{ editing ? 'Update' : 'Create' }}
    </button>
    <button class="btn btn-danger ml-2" @click="moeveTodosListPage()">
      Cancel
    </button>
  </form>
  <transition name="fade">
    <Toast v-if="showToast" :message="toastMessage" :type="ToastType" />
  </transition>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { ref, computed } from "vue";
import _ from "lodash";
import Toast from "@/components/ToastPop.vue";
import { useToast } from "@/hook/toast.js";

export default {
  components: {
    Toast,
  },
  props: {
    editing: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: "",
      completed: false,
      body: '',
    });
    const originalTodo = ref(null);
    const loading = ref(false);
    const todoError = ref('');
    const todoId = route.params.id;

    const { showToast, toastMessage, ToastType, triggerToast } = useToast();

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`);
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };

        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.log(error);
        triggerToast("something went wrong", "danger");
      }
    };

    if (props.editing) {
      getTodo();
    }

    const todoUpdated = computed(() => {
      // 두 값이 같지 않으면 내용 없데이트가 된것
      return _.isEqual(todo.value, originalTodo.value);
    });

    const toggleTodoStauts = () => {
      todo.value.completed = !todo.value.completed;
    };

    const moeveTodosListPage = () => {
      router.push({
        name: "Todos",
      });
    };

    const onSave = async () => {
      todoError.value = ""
      // subject가 없으면 리턴
      if( !todo.value.subject ){
        todoError.value = "Empty input"
        return
      }
      try {
        let res = "";
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body
        }
        if(props.editing){
          res = await axios.put(`http://localhost:3000/todos/${todoId}`, data);
          originalTodo.value = { ...res.data };
        }else{
          res = await axios.post(`http://localhost:3000/todos`, data);
          todo.value.subject=""
          todo.value.body=""
        }

        const message = `Successfully ${props.editing ? 'Updated!' : "Created!"}`
        triggerToast( message );
      } catch (error) {
        console.log(error);
        triggerToast("something went wrong", "danger");
      }
    };

    return {
      todo,
      loading,
      toggleTodoStauts,
      moeveTodosListPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessage,
      ToastType,
      todoError,
    };
  },
};
</script>

<style>
  .text-red{
    color: red;
  }
  .fade-enter-active,
  .fade-leave-active{
    transition: all 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to{
    opacity:0;
    transform: translateY(-30px);
  }
  .fade-enter-to,
  .fade-leave-from{
    opacity:1;
    transform: translateY(0px);
  }
</style>