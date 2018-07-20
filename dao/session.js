let Sequelize = require('sequelize');
let path = require('path');
let env = require('../config/env');
const Op = require('sequelize').Op;

let modelName = path.basename(__filename, '.js');
let model = require('../models/' + modelName);

let dao = {

    add: async function (addJson) {
        let data = await model.create(addJson,
            {
                logging: env.logging,
            }
        );
        return data;
    },

    list: async function (whereJson = {}, page = 1, pageSize = 10) {
        let data = await model.findAndCountAll({
            logging: env.logging,
            where: whereJson,
            offset: pageSize * (page - 1),
            limit: pageSize
        });
        return data;
    },

    update: async function (updateJson = {}, whereJson = {}) {
        let data = await model.update(updateJson, {
            where: whereJson,
            logging: env.logging,
        });
        return data;
    },

    delete: async function (id = null) {
        let data = await model.destroy({
            where: {
                id: id
            },
            logging: env.logging,
        });
        return data;
    },

    count: async function () {
        let data = await model.count({
            logging: env.logging
        });
        return data;
    },
}

module.exports = dao;