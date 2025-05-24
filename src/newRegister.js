export default function NewRegister(params={
    method : 'GET',
    path : '/',
    status : 200,
    responseJSON : null,
    responseTXT : null,
    middlewares : [],
    process : async (params, req, res) => { }}){
    const register = (group) => {
        group.newRoute(params)
    }
    return register
}