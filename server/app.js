const express = require('express')
const cors = require('cors')
const documentRouter = require('./document.router')
const app = express()
const PORT = process.env.port || 3000

app.use(cors())
app.use(express.json())
app.use('/', documentRouter.documentRouter)

app.listen(PORT, () => {
    console.log(`App listened on port ${PORT}`)
})

