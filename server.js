const express = require('express')
const { errorHandler } = require('./middleware/ErrorHandler')
const cookieParser = require('cookie-parser')
const application = express()

application.use(express.json())
application.use(cookieParser())

const {mainRouter}=require('./components')

application.use('/api/v1/banking-app', mainRouter)
application.use(errorHandler)

application.listen(9000, () => {
    console.log("server started @ http://localhost:9000");
  });