# Vscode Setup

This project was built using Vscode with Vetur and Eslint extensions, and several dev dependencies via npm.

The setup below will auto-format your code on save using Eslint and Prettier, and also add formatting, syntax-highlighting and intellisense for .vue files using Vetur.

It took a while to find the right setup, and this setup works perfectly. 

If you wish to use a similar setup, here is what you need:

## Install Vscode Extensions
In your Vscode app go to View -> Extensions, then search for and install these:
- ESLint  
- Vetur  

## Install Dev Dependencies
- eslint   
- eslint-config-prettier  
- eslint-plugin-prettier  
- eslint-plugin-vue  
- eslint-webpack-plugin  
- prettier  

Install all of these from your project's root folder:  
`cd [project root]`  
`npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue eslint-webpack-plugin`

## Add Eslint config file .eslintrc.cjs
`cd [project root]`  
`touch .eslintrc.cjs`  

Paste this into the file and save:
```
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  globals: {
    $nuxt: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
```
## Add Prettier config file .prettierrc
`cd [project root]`  
`touch .prettierrc`  

Paste this into the file and save:  

```
{
  "trailingComma": "es5",
  "useTabs": false,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "printWidth": 80
}
```
<br>

**Format On Save not working?** 

If your code does not auto-format on save, in Vscode go to Preferences -> Settings, search for 'formatonsave' and check the box for "editor: Format On Save" in both the 'User' tab and the 'Workspace' tab.

**Prettier formatting still not working?**
in Vscode go to Preferences -> Settings and search for 'vetur default formatter'.  

Check these settings:  
```
Vetur > Format > Default Formatter: CSS     = Prettier  
Vetur > Format > Default Formatter: HTML    = Prettier  
Vetur > Format > Default Formatter: JS      = Prettier  
Vetur > Format > Default Formatter: LESS    = Prettier  
Vetur > Format > Default Formatter: Postcss = Prettier  
Vetur > Format > Default Formatter: SCSS    = Prettier  
Vetur > Format > Default Formatter: Sass    = sass-formatter
```

**Vetur formatting of .vue files not working?**

In Vscode go to Preferences -> Settings and search for 'vetur default formatter'.  

Check this setting:  
```
Editor: Default Formatter = Vetur octref.vetur
```

## More Info

[code.visualstudio.com - Install Extensions](https://code.visualstudio.com/docs/editor/extension-marketplace)  
[marketplace.visualstudio.com - Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

