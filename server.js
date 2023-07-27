const { stat } = require('fs')
const http = require('http')

const todos = [
    {id:1, text:'one'},
    {id:2, text:'two'},
    {id:3, text:'three'},
    {id:4, text:'four'},
]

const server = http.createServer((req,res)=>{
    const {method,url} =req
    let body =[]

    req.on('data',chunk => {
        body.push(chunk)
    }).on('end',()=>{
        body = Buffer.concat(body).toString();
        console.log(body)
        res.writeHead(200,{
            'Content-Type':'appliation/json',
            'X-Powered-By':'node.js'
        })

        let status = 404
        const response = {
            success:false,
            data:null,
            error:null
        }

        if(method ==='GET' && url==='/todos'){
            status = 200
            response.success = true;
            response.data = todos;
        } else if(method==='POST' && url==='/todos') {
            const {id,text} = JSON.parse(body)
            if(!id || !text){
                status = 400
                response.error = "Please add id and text in req body"
            } else {
                todos.push({id,text})
                response.success=true;
                status = 201
                 response.data = todos
            }
        }


        res.end(JSON.stringify(response))
    })

    
})

const PORT = 5000

server.listen(PORT,()=>{console.log(`Server running on Port : ${PORT}`)})