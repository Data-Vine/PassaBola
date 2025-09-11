const express = require("express");
const cors = require("cors");

// CRIANDO A INSTÂNCIA DA APLIACAÇÃO EXPRESS
const app = express();

//DIFINER A PORTA DA APLICAÇÃO QUE IRÁ EXECUTAR
const port =5001;

// CONFIGURAR O EXPRESS PARA REQUISIÇÕES EM JSON
app.use(express.json());

//HABILITA O COR PARA ACEITAR AS REQUISIÇÕES DA APLICAÇÃO
app.use(cors());



app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`)
})