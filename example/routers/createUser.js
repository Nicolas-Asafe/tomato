import { db } from "./db.js";
import NewRegister from "../../src/newRegister.js";
import buildReponse from "../../src/buildResponse.js";

const register = NewRegister({
    method: "POST",
    path: "/",
    status: 200,
    process: (_, req, res) => {
        if (!req.body) { buildReponse(res, { message: "Credenciais faltando", status: 500 }); return; }
        const { name } = req.body ?? {}
        if (!name) { buildReponse(res, { message: "Credenciais faltando", status: 500 }); return; }
        db.save({ name: name, id: db.find().length + 1 })
    },
    responseJSON: {
        message: "usuário criado com sucesso",
        status: 202
    }
})

export { register }