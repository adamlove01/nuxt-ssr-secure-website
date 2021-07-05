# PAGES

In the Nuxt framework, any files in the `/pages` folder are automatically routable on the site. for example `/pages/account.vue`  can be accessed as  `yourDomain.com/account`

In this project, every file in the /pages folder must include `middleware: 'authorize'` as below. This includes logged-out guest pages. Otherwise the logged-in status of the user will not be shown in the Nav bar, and login-required pages will redirect to 401 unauthorized.
```
export default {
  ...
  middleware: 'authorize',
  ...
```

Also, the page must be listed in the `/server/accesList.js` file, otherwise the page will redirect to 404.

## index.vue
A landing page with several section components.

## register.vue
User registration. You can disable registration by setting showSignUp = false.

## login.vue
Login has a captcha which is triggered the first time an invalid password is used. 

## logout.vue
This page shows a progress bar while it removes the refresh cookie on the server. Then it redirects to the home page.

## verify.vue
This is where users land when clicking on their registration email link. Like logout, it shows a progressbar, then redirects to login.

## account.vue
Shows the user's account information.

## admin.vue
This page uses Vuetify's v-dataTable component to allow Create, Read, Update and Delete of table data all on one page.


## More info

[Nuxtjs.org - Pages Directory](https://nuxtjs.org/docs/2.x/directory-structure/pages)

[Vuetifyjs.com - Data Tables](https://vuetifyjs.com/en/components/data-tables/#api)

