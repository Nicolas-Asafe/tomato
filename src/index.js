import { Group } from "./groups/group.js";
import { Server } from "./server/server.js";
import NewRegister from "./utils/newRegister.js";
import buildResponse from "./utils/buildResponse.js";
import { listVars,access,setVar } from "./system/syvars.js";

const NewSyvarLocal = (name = "value",value="none") => {
    setVar(name,value)
    return [
        ()=>access(name),
        (value)=>{setVar(name,value)}
    ]
}
const syvars = {access,setVar,listVars}

const tomato = {
  Group,Server,NewRegister,buildResponse,NewSyvarLocal,syvars
}

export {Group,Server,NewRegister,buildResponse,NewSyvarLocal,syvars}
export default tomato