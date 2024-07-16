const express = require('express');
//routing DATA - Daniel 
const routes = require('./routes');
// import sequelize connection
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;
//express.use(start)(express(api).json(only returns in json)) - Daniel
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//express.start using. routes - Daniel
app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

