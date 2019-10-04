const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');




const productRoutes = require('./api/routes/products');
const orderRoutes   = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*"); // Other webpages
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next(); // Lock incoming request, not returning

});




// * Means giving access to any client


// Before reaching routes solve CORS => Cross Origin Resource Sharing

//Middlewire <-> Updated Part
// Routes Handling errors
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);



app.use((req,res,next)=>{
  const error = new Error('Not Found');
  error.status=404;
  next(error);
}); // Created error by user


app.use((error,req,res,next)=>{
  res.status(error.status || 500);
  res.json({
    error: {
      message : error.message
    }
  });
}); // Error thrown from anywhere else in this application


module.exports=app;

// got to postman type
// localhost:3000 => Error Encountered
//localhost:3000/products it would work
