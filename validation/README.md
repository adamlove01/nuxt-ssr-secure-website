# Validation

The scripts in this folder are used to sanitize and validate **all input** on the client and server.  

This validation system is a super simple way to sanitize and validate input across your entire app.  

As a bonus, **all error messages** are contained in two files: JoiMessages.js and serverMessages.js so you can easily modify them or translate them into other languages.

## How does the validation script work?

For each table in the database there is one schema which describes how to sanitize and validate all the fields of that table. We can also create non-databse schemas, such as authorizeSchema(), which validates our auth input.

The sanitizeHtml script contains functions to remove all HTML, or only dangerous HMTL, from the input. These functions are called in the schemas. 

It is important to understand that Joi is being used to **not only** validate, but **also** to alter the input, and to return optimized input. For example, in a schema we can `.trim()` the input, or convert to `.lowercase()`, or call a custom script like `.custom(html.removeAll)` and these change the return values. 

The key to this validation method is the JoiValidate.js script. Using this script we can pass **any subset** of input keys, and input object and a schema. The validate() funcyion will then  
- a) Find the input keys in the input object;
- b) Find the input keys in the schema; and
- c) Validate the input values based on the schema key rules.

Using this method, we only need one schema, since we can validate any set of keys on the fly, without having to create additional schemas. Here are some examples, all using userSchema.js:  
```
const [vErr, v] = validate('email, password', req.body, schema)
```
```
const [vErr, v] = validate('name, email, type, status', req.body, schema)
```
```
  const [vErr, v] = validate('id', req.params, schema)
```

If validation fails, all error messages are contained in a single file: 
`JoiMessages.js`. The `msg()` function generates a client-readable error message that can be returned to the end user.  

## JoiValidate.js

The `validate()` function can validate any subset of keys in any schema.  

## sanitizeHtml.js

This script uses the npm package `sanitize-html` to remove all or some HTML from the input. The functions are called in the Joi schemas.  

## serverMessages.js

All error messages that originate at the server (but not Joi validation errors) are listed here. Like the JoiMessages.js script, the error messages are in a user-readable form and are returned to the end user.  

## tlds

This is a list of all top level domains (tlds) that the internet allows. It is used to validate email addresses in userSchema.js. Usage:

`.email({ tlds: { allow: tlds } })`

For example, if the user enters `name@faketopleveldomain.com`, Joi will flag it as an invalid email address.
