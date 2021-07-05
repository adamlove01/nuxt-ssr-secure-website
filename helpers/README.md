# Helpers

## tryCatch.js

This function can wrap other functions that **return a promise** so you can write cleaner code, in lock-and-key style. Compare:

Wrapped in Try(): 2 lines of clean code

```
async function() => {
  const [err, r] = await Try(myPromiseFunction())
  if (err) return err
  // Do something with r
}
```
Wrapped in try .. catch(): 6 lines of awkward code
```
async function() => {
  let r
  try {
    r = await myPromiseFunction()
  } catch (err) {
    return err
  }
  // Do something with r
 }
```

This function is used both client-side in .vue files and server-side in express .js files. We can do this because this project supports Nodejs ESM. 