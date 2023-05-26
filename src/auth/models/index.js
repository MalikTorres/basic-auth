'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const userSchema = require('./user');

const sequelize = new Sequelize(process.env.DATABASE_URL);


const Users = userSchema(sequelize, DataTypes);


module.exports = { sequelize, Users };
