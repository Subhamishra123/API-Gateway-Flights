const express = require('express');
const bodyParser = require('body-parser')
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api', apiRoutes);


//app.use(express.urlencoded({extended:true}));

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
