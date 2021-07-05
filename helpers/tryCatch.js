/**
 * Try - Wrap a function that returns a promise, returning an array,
 * for simpler and more readable code. Compare:
 *
 * Wrapped in Try(): 2 lines of clean code
 *
 * async function() => {
 *   const [err, r] = await Try(myPromiseFunction())
 *   if (err) return err
 *   // Do something with r
 * }
 *
 * Wrapped in try .. catch(): 6 lines of awkward code
 *
 * async function() => {
 *   let r
 *   try {
 *     r = await myPromiseFunction()
 *   } catch (err) {
 *     return err
 *   }
 *   // Do something with r
 * }
 *
 * @param {Function}  promise - A function that returns a promise
 * @return {Array<{err: *, result: *}>}
 *                    err     - {any} The error if an error is caught.
 *                    result  - {any} Whatever the wrapped function returns.
 */
export default (promise) => {
  return promise
    .then((result) => {
      return [false, result]
    })
    .catch((err) => {
      /** Log the errors here if you wish */
      // console.log(err)
      return [err, false]
    })
}
