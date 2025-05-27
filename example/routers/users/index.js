import tomato from "../../../src/index.js";

const register = tomato.NewRegister({
    path: "/",
    process: (req, res) => {
        return 200
    }
})

export { register }
