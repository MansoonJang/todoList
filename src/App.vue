<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" to="/">
      Man_Jock
    </router-link>

    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link class="nav-link" to="/todos">
          todos
        </router-link>
      </li>
    </ul>
  </nav>
  <div class="container">
    <router-view />
  </div>
  
</template>