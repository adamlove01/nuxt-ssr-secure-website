exports.seed = function (knex) {
  /** Deletes ALL existing entries */
  return knex('users')
    .del()
    .then(() =>
      knex('users').insert([
        {
          id: 1,
          name: 'admin',
          email: 'admin@admin.com',
          password:
            '$2a$10$sAI76ulPDz2Kud6Aau1AUemMiy7JzW6KD9.SlFCHOWysIb0GCiQp6',
          image: '',
          type: 'admin',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
          last_login: knex.fn.now(),
        },
      ])
    )
}
