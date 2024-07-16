require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = process.env.DB_URL
    ? new Sequelize(process.env.DB_URL)
    : new Sequelize(
        'ecommerce_db',
        'postgres',
        'S1mbaPr1de!',
        {
            host: 'localhost',
            dialect: 'postgres',
        }
    );

// export sequelize connection to be used elsewhere
module.exports = sequelize;

