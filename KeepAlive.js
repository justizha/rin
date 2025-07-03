import express from 'express';

const app =  express();

app.get('/', (req, res)=> {
 res.send("Bot is Alive !")
})

function keepAlive() {
 app.listen(3000 , () => {
  console.log("Keep Alive server is running")
 })
}

 export default  keepAlive