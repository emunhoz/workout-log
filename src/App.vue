<template>
  <div id="app">
    <vue-up></vue-up>
    <simplert></simplert>
    <section class="workout-wrapper">

      <h1 class="title">Workout Log</h1>

      <form class="form" @submit.prevent="validateBeforeSubmit">
        <div class="input-wrapper">
          <input type="time" name="time" v-model="timeSpent" v-validate="'required'" :class="{ 'alert': errors.has('time') }"  placeholder="Time spent">
          <div v-show="errors.has('time')" class="help">{{ errors.first('time') }}</div>
        </div>
        <div class="input-wrapper">
          <select name="type" v-model="type" v-validate="'required'" :class="{ 'alert': errors.has('type') }">
            <option value="" disabled hidden>Select type</option>
            <option>Run</option>
            <option>Swimming</option>
            <option>Bike</option>
          </select>
          <div v-show="errors.has('type')" class="help">{{ errors.first('type') }}</div>
        </div>
        <div class="input-wrapper">
          <input type="date" name="date" v-model="date" :max="moment().format('YYYY-MM-DD')" v-validate="'required'" :class="{ 'alert': errors.has('date') }">
          <div v-show="errors.has('date')" class="help">{{ errors.first('date') }}</div>
        </div>
        <button class="btn" type="submit">+ Add</button>
      </form>

      <table v-if="filteredTodos.length">
        <thead>
          <tr>
            <th scope="col"><a href="#" @click="sortBy('time')">Time</a></th>
            <th scope="col"><a href="#" @click="sortBy('type')">Type</a></th>
            <th scope="col"><a href="#" @click="sortBy('date')">Date</a></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="todo in filteredTodos" v-bind:key="todo.id">
            <td>{{ todo.time }}</td>
            <td>{{ todo.type }}</td>
            <td>{{ moment(todo.date).format('DD/MM/YYYY') }} <small class="week-day">{{ moment(todo.date).startOf('hour').fromNow() }}</small></td>
            <td>
              <button @click="deleteTodo(todo)" class="btn-icon-delete"><i class="far fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty-list" v-else>
        <h2 class="subtitle">Hey, your list is empty :(</h2>
        <p>Let's add some exercises</p>
      </div>

      <p class="todo-count" v-if="filteredTodos.length"><i class="far fa-clock"></i> {{ convertToHours }} {{ convertToHours | pluralize }} of exercise</p>

    </section>
  </div>
</template>

<script>
import localStorage from './utils/localStorage'
import _ from 'lodash'

export default {
  name: 'App',
  data () {
    return {
      timeSpent: '',
      type: '',
      date: '',
      configs: {
        orderBy: ''
      },
      todos: localStorage.fetch()
    }
  },
  watch: {
    todos: {
      handler (todos) {
        localStorage.save(todos)
      },
      deep: true
    }
  },
  computed: {
    filteredTodos () {
      return _.orderBy(this.todos, this.configs.orderBy)
    },

    sumDurations () {
      const getTime = this.todos.map(a => a.time)
      return getTime.reduce((sum, string) => {
        var hour, min
        [hour, min] = string.split(':').slice(-2).map(n => parseInt(n, 10))
        return sum + hour * 60 + min
      }, 0)
    },

    convertToHours () {
      let mins = this.sumDurations
      let h = Math.floor(mins / 60)
      let m = mins % 60
      h = h < 10 ? '0' + h : h
      m = m < 10 ? '0' + m : m
      return `${h}:${m}`
    }
  },

  filters: {
    pluralize (n) {
      n = parseInt(n)
      return n === 1 ? 'hour' : 'hours'
    }
  },

  methods: {
    sortBy (sortKey) {
      this.configs.orderBy = sortKey
    },

    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.addTodo()
        }
      })
    },

    addTodo () {
      this.todos.push({
        type: this.type,
        date: this.date,
        time: this.timeSpent
      })
      this.resetForm()
      this.$popup({ message: 'New item added :D', delay: 8 })
    },

    resetForm () {
      this.$nextTick().then(() => {
        this.timeSpent = ''
        this.type = ''
        this.date = ''
        this.$validator.reset()
        this.errors.clear()
      })
    },

    deleteTodo (index) {
      let confirmFn = () => {
        this.todos.splice(this.todos.indexOf(index), 1)
      }
      let obj = {
        title: 'Confirm',
        message: 'Do you want to delete this item?',
        type: 'warning',
        customCloseBtnText: 'Cancel',
        customCloseBtnClass: 'btn btn-outline',
        onClose: this.onClose,
        useConfirmBtn: true,
        customConfirmBtnClass: 'btn btn-alert',
        onConfirm: confirmFn,
        showXclose: true
      }
      this.$Simplert.open(obj)
    }
  }
}
</script>
