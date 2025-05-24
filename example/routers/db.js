const DB = {users:[]}


export const db = {
    save:(data)=>{
        DB.users.push(data)
    },
    remove:(id)=>{
        const Id = DB.users.findIndex(u=>u.id === Id)
        if(!Id) throw new Error("Erro ao achar usuário para deletar ou usuário não existe")
        DB.users.splice(id,1)
    },
    find:()=>{
        return DB.users
    }
}