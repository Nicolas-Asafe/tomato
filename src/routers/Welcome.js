export const register = (group) =>{
    group.newRoute({
        method:"GET",
        path:"/",
        responseTXT:"welcome!"
    })
}