let path = require('path');
let router = require('koa-router')();
let Sequelize = require('sequelize');

// 单 Model API 的 dao 名就是 controller 的 module 名，直接复制即可，根据路径识别，多 Model 的接口需要分别引用命名，注意修改
let daoName = path.basename(__dirname);
let dao = require('../../dao/' + daoName);

let daoUser = require('../../dao/user');
let trimPost = require('../../utils/pre/trimPost');
let md5 = require('../../utils/lib/md5');

// 用户注册逻辑
// 1.是否发验证码，是否存在手机号？存在，更新验证码，不存在，插入验证码
// 输入用户名、密码、手机、验证码才可以注册

router.post('/', async function (ctx, next) {

    let get = ctx.request.query;
    let post = ctx.request.body;

    let code = 0;
    let msg = '';

    if (!post.username || !post.password || !post.phone || !post.verify_code) {

        code = 1;
        msg = '请检查输入！';
        ctx.body = {
            code,
            msg
        };

    } else {

        // 验证码是否正确
        let res_user = await daoUser.list({
            phone: post.phone
        });
        if (res_user.count == 0) {
            code = 2;
            msg = '手机号不存在';
            ctx.body = {
                code,
                msg
            };
        } else {
            if (post.verify_code != res_user.rows[0].verify_code) {
                code = 3;
                msg = '验证码不正确';
                ctx.body = {
                    code,
                    msg
                };
            } else {

                let res_reg = await daoUser.update({
                    username: post.username,
                    password: md5(post.password)
                }, {
                        phone: post.phone
                    });

                msg = '用户注册成功';
                ctx.body = {
                    code,
                    msg
                };
            }
        }

    }

});

module.exports = router.routes();