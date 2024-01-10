const { Sequelize } = require('sequelize');

class Database {
    constructor() {
        if (Database.instance != null) {
            return Database.instance;
        }

        Database.instance = this;

        this.sequelize = new Sequelize({
            database: 'julius',
            username: 'root',
            password: 'root',
            host: 'localhost',
            dialect: 'postgres',
        });
    }

    getSequelize() {
        return this.sequelize;
    }
}

module.exports = { sequelize: new Database().getSequelize() };