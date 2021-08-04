import { Router } from 'express'
import { create, read, update, del } from '../controllers/userController'
import { authorize } from '../controllers/authController'

const userRoutes = Router()

userRoutes.post('/server/users/create', authorize, create)
userRoutes.get('/server/users/read', authorize, read)
userRoutes.put('/server/users/update', authorize, update)
userRoutes.delete('/server/users/delete/:id', authorize, del)

export { userRoutes }
