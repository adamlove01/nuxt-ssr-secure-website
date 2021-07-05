# Store

All files in the `/store` directory are managed by Vuex, a global, centralized in-memory data storage system.

Variables defined in the store can be read in .vue files using the store's context variable `$store`. 

For example, to access the 'name' variable in the file `/store/login.js`:
```
<template>
...
<p>{{ $store.state.login.name }}</p>
...
</template>
```

Or to access the 'loggedIn' variable in a function:
```
<script>
export default {
...
computed: {
    /** Display loggedIn status */
    loggedIn() {
      return this.$store.state.login.loggedIn
    },
    ...
  }
}
</script>
```


## login.js

The logged-in user data, including the accessToken, is stored here. We are using Vuex for this data because other solutions such as client-side Cookies or localStorage are considered a security risk. They are javascript-accessible and can be hacked.

## More Info

[nuxtjs.org - Store Directory](https://nuxtjs.org/docs/2.x/directory-structure/store)


