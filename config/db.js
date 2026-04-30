const { Sequelize } = require('sequelize');
const path = require('path');

class Database {
    constructor() {
        if (Database.instance != null) {
            return Database.instance;
        }

        Database.instance = this;

        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, '../julius.db'),
            logging: false,
        });
    }

    getSequelize() {
        return this.sequelize;
    }
}

module.exports = { sequelize: new Database().getSequelize() };