export default function buildReponse(res, params = {
    message: "OK",
    status: 200,
    data: {}
}) {
    params.data ?
        res.status(params.status ?? 200).json({ message: params.message,data:params.data })
        : res.status(params.status ?? 200).json({ message: params.message })
    return params
}