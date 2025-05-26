import tomato from "../../../src/index.js";

export const register = tomato.NewRegister({
    path:"/",
    process:(req,res)=>{
        tomato.buildReponse(res)
    } 
})