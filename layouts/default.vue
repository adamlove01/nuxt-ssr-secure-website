<template>
  <v-app>
    <nav>
      <v-app-bar v-cloak color="black darken-3" dark app>
        <nuxt-link to="/" class="d-flex">
          <img class="mt-2 mr-3" src="/favicon.ico" height="23" />
          <v-toolbar-title class="text-h6">Your Website</v-toolbar-title>
        </nuxt-link>

        <v-spacer></v-spacer>

        <nuxt-link v-if="mdAndUp" to="/">
          <v-toolbar-title class="body-1 mr-10">Home</v-toolbar-title>
        </nuxt-link>

        <nuxt-link
          v-if="mdAndUp && $store.state.login.type === 'admin'"
          to="/admin"
        >
          <v-toolbar-title class="body-1 mr-10">Admin</v-toolbar-title>
        </nuxt-link>

        <nuxt-link v-if="mdAndUp && !loggedIn && showSignIn" to="/login">
          <v-toolbar-title class="body-1 mr-10">Sign in</v-toolbar-title>
        </nuxt-link>

        <v-menu
          v-if="loggedIn"
          transition="fade-transition"
          content-class="nav-menu"
        >
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item style="background-color: #eaeaea">
              <v-list-item-avatar>
                <v-img src="/img/users/default.png"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{ $store.state.login.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  $store.state.login.email
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item nuxt to="/account">
              <v-list-item-icon class="mr-4">
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Account</v-list-item-title>
            </v-list-item>

            <v-list-item nuxt to="/logout">
              <v-list-item-icon class="mr-4">
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu
          v-if="$vuetify.breakpoint.smAndDown"
          v-click-outside="closeMenu"
          content-class="main-app-menu"
          :transition="transitionType"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              id="main-app-menu-btn"
              icon
              v-on="on"
              @click="menuOpen = !menuOpen"
            >
              <v-icon>{{ menuIcon }}</v-icon>
            </v-btn>
          </template>

          <div class="d-flex flex-no-wrap">
            <div class="main-app-menu-sidebar pa-6 flex-grow-1">
              <p class="heavy-underline text-h4">MENU</p>
            </div>

            <v-list>
              <v-list-item-group
                v-model="group"
                dense
                active-class="grey--text darken-3"
              >
                <v-list-item nuxt to="/">
                  <v-list-item-icon class="mr-4">
                    <v-icon>mdi-home</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Home</v-list-item-title>
                </v-list-item>

                <v-list-item
                  v-if="$store.state.login.type === 'admin'"
                  nuxt
                  to="/admin"
                >
                  <v-list-item-icon class="mr-4">
                    <v-icon>mdi-cog</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Admin</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="!loggedIn && showSignIn" nuxt to="/login">
                  <v-list-item-icon class="mr-4">
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Sign in</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-menu>
      </v-app-bar>
    </nav>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      transitionType: false,
      showSignIn: true,
      menuOpen: false,
      group: null,
    }
  },

  computed: {
    /** Display loggedIn status */
    loggedIn() {
      return this.$store.state.login.loggedIn
    },
    /** Toggle main-app-menu mobile icon */
    menuIcon() {
      return this.menuOpen ? 'mdi-close' : 'mdi-menu'
    },
    mdAndUp() {
      return this.$vuetify.breakpoint.mdAndUp
    },
  },

  methods: {
    closeMenu() {
      this.menuOpen = false
    },
  },
}
</script>

<style lang="scss">
body .v-application {
  /** --- App Bar: Content width */

  nav {
    /** Set toolbar content width to always match v-container width */
    .v-toolbar__content {
      width: 100%;
      padding: 12px;
      margin-right: auto;
      margin-left: auto;
      padding-left: 22px;
      padding-right: 22px;
    }

    /** App Bar: Content width Media Queries */
    @media (min-width: 960px) {
      .v-toolbar__content {
        max-width: 900px;
        padding-left: 12px;
        padding-right: 12px;
      }
    }

    @media (min-width: 1264px) {
      .v-toolbar__content {
        max-width: 1185px;
      }
    }

    @media (min-width: 1904px) {
      .v-toolbar__content {
        max-width: 1785px;
      }
    }

    /** --- App Bar: toolbar text links */

    a {
      .v-toolbar__content {
        color: transparent;
      }
      .v-toolbar__title {
        text-decoration: none;
        color: white;
        &:hover {
          color: #84d2fa;
        }
      }
    }
  }

  /** --- App Bar: Menu Links */

  /** Set color on hover for text and icons */
  .v-menu__content a {
    &.v-list-item:hover:not(.v-list-item--disabled),
    &.v-list-item:hover:not(.v-list-item--disabled) .v-icon {
      color: #1976d2 !important;
    }

    &.grey--text {
      color: inherit !important;
      caret-color: inherit !important;
    }

    /** No underline on hover for icon */
    &.v-list-item:hover {
      text-decoration: none;
    }

    /** Underline on hover for text only */

    &:hover:not(.v-list-item--disabled) .v-list-item__title {
      text-decoration: underline;
    }

    /** No background color change on hover */
    &:before {
      background-color: transparent;
    }
  }

  /** --- App Bar: Main App Menu */

  .main-app-menu {
    width: 100%;
    min-width: 100% !important;
    top: 56px !important;
    left: 0px !important;
    right: 0px;
    border-radius: 0px;
    animation: growDown 350ms ease-in-out;
    transform-origin: top center !important;

    /** Style underline of the menu's left sidebar */
    .heavy-underline {
      display: inline;
      border-bottom: 5px solid #333;
    }

    /** Set width of menu items (relative to sidebar) */
    .v-list {
      width: 70%;
    }

    /** Add divider lines below the list items */
    .v-list-item {
      border-bottom: 1px solid #efefef;
    }

    /** No divider line under the last list item */
    .v-item-group a:last-child.v-list-item {
      border-bottom: none;
    }
  }

  /** Main App Menu: dropdown animation */
  @keyframes growDown {
    0% {
      transform: scaleY(0);
    }
    80% {
      transform: scaleY(1.05);
    }
    100% {
      transform: scaleY(1);
    }
  }

  /** Remove menu button highlighting when clicked/pressed */
  #main-app-menu-btn.v-btn:before {
    background-color: transparent;
  }

  /** Set the background color of the menu's left sidebar */
  .main-app-menu-sidebar {
    background-color: #e1e1e1;
  }

  /** --- App Bar: Other Nav Menus */

  /** Style any other nav menus in the top app bar */
  .nav-menu {
    top: 56px !important;
    padding: 0;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;

    /** Add divider lines below the list items */
    .v-list {
      padding: 0;
    }

    /** Add divider lines below the list items */
    .v-list-item {
      border-bottom: 1px solid #efefef;
    }
  }

  /** The desktop nav bar is taller */
  @media (min-width: 960px) {
    .nav-menu {
      top: 64px !important;
    }
  }
}
</style>
