const https = require('https')
const {mongoConnect} = require('./src/utils/connect')
const app = require('./src/app')
require('dotenv').config ; 
const fs = require('fs')

const PORT=  process.env.PORT


const server = https.createServer({
    
        cert: fs.readFileSync("cert.pem"),
        key: fs.readFileSync("key.pem"),
} , 
      app
)

const startServer = ()=>{
  
server.listen(PORT , async ()=>{

    await mongoConnect() ; 
    console.log('server started on port 8080')
})
    
}

startServer() ; 
