import { Router } from 'express'
import {
  create,
  read,
  update,
  del,
  login,
  logout,
  verify,
} from '../controllers/userController'
import { authorize } from '../authorization/authorize'

const userRoutes = Router()

userRoutes.post('/server/users/create', authorize, create)
userRoutes.get('/server/users/read', authorize, read)
userRoutes.put('/server/users/update', authorize, update)
userRoutes.delete('/server/users/delete/:id', authorize, del)

userRoutes.post('/server/login', login)
userRoutes.get('/server/logout', logout)
userRoutes.post('/server/verify', verify)

userRoutes.post('/server/register', create)
userRoutes.post('/server/authorize', authorize)

export { userRoutes }
