export const register = (g)=>{
    g.newRoute({
        method:"GET",
        path:"/users",
        responseJSON:[
            {name:"Nicolas"}
        ]
    })
}