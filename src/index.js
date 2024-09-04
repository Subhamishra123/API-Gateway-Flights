const express = require('express');
const bodyParser = require('body-parser')
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const { rateLimit } = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 100, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
})

app.use(limiter);

app.use('/flightsService',createProxyMiddleware({
    target:ServerConfig.FLIGHTS_SERVICE,
    changeOrigin:true,
    pathRewrite:{'^/flightsService':'/'}
}));

app.use('/bookingsService',createProxyMiddleware({
    target:ServerConfig.BOOKINGS_SERVICE,
    changeOrigin:true,
    pathRewrite:{'^/bookingsService':'/'}
}))
app.use('/api', apiRoutes);


//app.use(express.urlencoded({extended:true}));

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
   
});
