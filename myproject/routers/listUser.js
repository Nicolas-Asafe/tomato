import { db } from './db.js'
import tomato from '../../src/index.js'


const register = tomato.NewRegister({
    method: "GET",
    responseJSON: db.find(),
    path: "/",
    status: 200,
})

export { register }