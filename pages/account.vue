<template>
  <v-container fluid class="bg_white_geometric">
    <PageTitle title="MY ACCOUNT"></PageTitle>

    <v-container class="pt-6">
      <div class="d-flex flex-wrap">
        <v-avatar size="100" class="mr-5 mb-5">
          <v-img src="/img/users/default.png"></v-img>
        </v-avatar>

        <v-simple-table class="flex-grow-1 mb-5">
          <template #default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $store.state.login.name }}</td>
                <td>{{ $store.state.login.email }}</td>
                <td>{{ $store.state.login.type }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-container>
  </v-container>
</template>

<script>
export default {
  middleware: 'authorize',

  head: {
    title: 'My Account | Your Website',
  },
}
</script>
