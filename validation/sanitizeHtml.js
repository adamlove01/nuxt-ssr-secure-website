import sanitizeHtml from 'sanitize-html'

export default {
  /**
   * removeAll - Remove ALL html tags from string
   *
   * @param {String} value   - The String to be modified
   * @param {Object} helpers - See Joi Docs 'any.custom(method, [description])'
   *                           Joi requires the format function(value, helpers)
   * @return {String}
   */
  removeAll(value, helpers) {
    const newValue = sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    })
    return newValue
  },

  /**
   * removeSome - Remove only dangerous html tags from string
   *
   * Dangerous tags include '<script>' and '<iframe>' ...
   * Retains harmless tags like <h1>, <div>, <p>, <a> ...
   * This is useful for things like blog entries where you may want to include
   * markdown or other html formatting tags.
   *
   * @param {String} value   - The String to be modified
   * @param {Object} helpers - See Joi Docs 'any.custom(method, [description])'
   *                           Joi requires the format function(value, helpers)
   * @return {String}
   */
  removeSome(value, helpers) {
    return sanitizeHtml(value)
  },
}
