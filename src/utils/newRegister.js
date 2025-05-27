export default function NewRegister(params = {
    method: 'GET',
    path: '/',
    status: 200,
    responseJSON: null,
    responseTXT: null,
    middlewares: [],
    caseError,
    return: false,
    process: async (req, res) => { }
}) {
    if (params.return) {
        return params
    } else {
        const register = (group) => {
            group.newRoute(params)
        }
        return register
    }
}