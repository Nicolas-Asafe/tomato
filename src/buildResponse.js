export default function buildReponse(res, params = {
    message: "OK",
    status: true || 200,
    data: {}
}) {
    params.data ?
        res.status(params.status).json({ message: params.message,data:params.data })
        : res.status(params.status).json({ message: params.message })
    return params
}