let path = require('path');
let router = require('koa-router')();
let Sequelize = require('sequelize');

let dao = require('../../dao/' + path.basename(__dirname));

router.post('/', async function (ctx, next) {

  let query = ctx.request.query;

  let data = await dao.delete(query.id);

  return ctx.return(0, '', data);

});

module.exports = router.routes();
