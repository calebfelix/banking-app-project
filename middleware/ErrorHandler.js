const BankingAppError = require("../error/BankingAppError")

const errorHandler = (error, req, resp, next) => {
    console.log(error)
    if (error instanceof BankingAppError) {
        resp.status(error.httpStatusCode).send(error)
        return
    }
    resp.status(500).send("Internal Server Error")
}
module.exports = { errorHandler }