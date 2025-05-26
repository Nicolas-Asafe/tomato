import { Group } from "./groups/group.js";
import { Server } from "./server/server.js";
import NewRegister from "./newRegister.js";
import buildReponse from "./buildResponse.js";
import { listVars,access,setVar } from "./system/syvars.js";

const NewSyVAR = (name = "value",value="none") => {
    tomato.syvars.setVar(name,value)
    return [
        ()=>tomato.syvars.access(name),
        (value)=>{tomato.syvars.setVar(name,value)}
    ]
}
const tomato = {
  Group,Server,NewRegister,buildReponse,NewSyVAR
}

export default tomato