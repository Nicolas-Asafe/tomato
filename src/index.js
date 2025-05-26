import { Group } from "./groups/group.js";
import { Server } from "./server/server.js";
import NewRegister from "./newRegister.js";
import buildReponse from "./buildResponse.js";
import { listVars,access,setVar } from "./system/syvars.js";

const NewSyVAR = (name = "value",value="none") => {
    setVar(name,value)
    return [
        ()=>access(name),
        (value)=>{setVar(name,value)}
    ]
}
const tomato = {
  Group,Server,NewRegister,buildReponse,NewSyVAR,listVars
}

export default tomato