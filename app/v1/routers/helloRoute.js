import tomato from '../../../src/index.js'
import hello from '../handlers/hello.js'

export const register = tomato.NewRegister({
   path:"/hello",
   process:(_,res)=>{
     tomato.buildResponse(res,{
       message:hello(),
       status:200
     })
   }
})