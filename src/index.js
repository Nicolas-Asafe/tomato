import { Group } from "./groups/group.js";
import { Server } from "./server/server.js";
import NewRegister from "./newRegister.js";
import buildReponse from "./buildResponse.js";
import { listVars,access,setVar } from "./system/syvars.js";

const syvars = {listVars,access,setVar}

const tomato = {
  Group,Server,NewRegister,buildReponse,syvars
}

export default tomato