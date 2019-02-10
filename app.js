const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('*', function (request, response) {
    response.sendFile(path.join(__dirname, './index.html'));
})

app.listen(port)
console.log("Server started on port " + port);