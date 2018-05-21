const express = require('express')
const PORT = process.env.PORT || 5000

express()
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
