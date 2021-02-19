


const UserModel = require("../models/user")
const UserGroupModel = require("../models/user_group")
const _ = require("lodash")
const utils = require("../utils")
const helper = require("../helper/help")
const {ResetMenuCacheByGroupId, ClearMenuCacheByGroupId} = require("../helper/global_cache")


module.exports = (router) => {
    router.post("/user/login", async (ctx, next) => {
        let username = ctx.request.body.username || '';
        let password = ctx.request.body.password || '';

        let  user = await UserModel.findByName(username)
        if (_.isEmpty(user)) {
            utils.sendError(ctx, "user not found")
            return
        }

        if (user.password !== password) {
            utils.sendError(ctx, "password error")
            return
        }

        if (user.status != 0) {
            utils.sendError(ctx, "has baned")
            return
        }

        let userGroup = await UserGroupModel.findByGroupId(user.userGroup)
        if (_.isEmpty(userGroup)) {
            utils.sendError(ctx, "用户组错误(not exists)")
            return
        }
        ctx.session.userInfo = {
            id: user.id,
            name: user.userName,
            group_id: user.userGroup,
        }
        
        utils.sendMessage(ctx, {})
    })

    router.post("/user/logout", async (ctx, next) => {
        
        ctx.session = null
        utils.sendMessage(ctx, [])
    })

    router.post("/user/groups", async (ctx, next) => {
        const allGroup = await UserGroupModel.findIdNameAll()
        utils.sendMessage(ctx, allGroup)
    })

    router.post("/user/register", async (ctx, next) => {
        let username = ctx.request.body.username;
        let password = ctx.request.body.password;
        let email = ctx.request.body.email;
        let group_id = ctx.request.body.user_group;

        if (_.isEmpty(username) || _.isEmpty(password) || _.isEmpty(email) || group_id <= 0) {
            utils.sendError(ctx, "param should not be empty:" + JSON.stringify(ctx.request.body))
            return
        }

        let user = await UserModel.findByName(username)
        if (!_.isEmpty(user)) {
            utils.sendError(ctx, "用户已存在, 换个用户名试试")
            return
        }
        if (!utils.isEmail(email)) {
            utils.sendError(ctx, "邮箱格式非法")
            return
        }

        user = await UserModel.add(username, password, group_id, email)
        if (_.isEmpty(user)) {
            utils.sendError(ctx, "create user failed")
            return
        }
        utils.sendMessage(ctx, "")
    })

    router.post("/user/list", async (ctx, next) => {
        let users = await UserModel.findAll({
            attributes: ['id', 'user_name', 'email', 'status', 'group_id'],
        })

        const allGroup = await UserGroupModel.findIdNameAll()

        let newUsers = [];
        for (let i = 0; i < users.length; i++) {
            let obj = users[i].toJSON()
            for (let j = 0 ; j < allGroup.length; j++) {
                if (obj.group_id == allGroup[j].group_id) {
                    obj.group_name = allGroup[j].group_name;
                    break;
                }
            }

            newUsers.push(obj);
        }

        utils.sendMessage(ctx, newUsers)
    })

    router.post("/user/update_password", async (ctx, next) => {
        let id = ctx.request.body.id;
        let password = ctx.request.body.password;

        let  user = await UserModel.findById(id)
        if (_.isEmpty(user)) {
            utils.sendError(ctx, "user not exists")
            return;
        }

        if (user.userName === "admin") {
            utils.sendError(ctx, "have no auth")
            return;
        }

        user.password = password

        const userNew = await user.save()
        if (userNew.password === password) {
            utils.sendMessage(ctx, "")
        } else {
            utils.sendError(ctx, "failed")
        }
    })

    router.post("/user/update_email_and_group", async (ctx, next) => {
        let email = ctx.request.body.email;
        let group_id = ctx.request.body.group_id;
        let id = ctx.request.body.id;
        
        const resp = await UserModel.updateEmailAndGroup(id, email, group_id)

        if (_.isArray(resp) && resp.length && resp[0] > 0) {
            utils.sendMessage(ctx, {})
        } else {
            utils.sendError(ctx, "update error")
        }
    })

    router.post("/user/ban", async (ctx, next) => {
        let id = ctx.request.body.id;
        let type = ctx.request.body.type;

        let  user = await UserModel.findById(id)
        if (_.isEmpty(user)) {
            utils.sendError(ctx, "user not exists")
            return;
        }

        if (user.userName === "admin") {
            utils.sendError(ctx, "have not auth")
            return;
        }

        if (type == 0) {
            const resp = await UserModel.banUser(id)

            if (_.isArray(resp) && resp.length && resp[0] > 0) {
                utils.sendMessage(ctx, {})
            } else {
                utils.sendError(ctx, "update error")
            }
        } else {
            const resp = await UserModel.unBanUser(id)

            if (_.isArray(resp) && resp.length && resp[0] > 0) {
                utils.sendMessage(ctx, {})
            } else {
                utils.sendError(ctx, "update error")
            }
        }
    })

    router.post("/user/all_menus", async (ctx, next) => {
        utils.sendMessage(ctx, helper.getMenus(1, ""))
    })

    router.post("/user/add_group", async (ctx, next) => {
        let group_name = ctx.request.body.group_name;
        let models = ctx.request.body.models;

        const userGroup = await UserGroupModel.findByName(group_name)
        if (!_.isEmpty(userGroup)) {
            utils.sendError(ctx, "用户组已存在， 换个名称试试")
            return;
        }

        const newGroup = await UserGroupModel.add(group_name, models)

        if (_.isEmpty(newGroup)) {
            utils.sendError(ctx, "failed")
        } else {
            await ResetMenuCacheByGroupId(newGroup.groupId)
            utils.sendMessage(ctx, "")
        }
    })

    router.post("/user/all_groups", async (ctx, next) => {
        const all_groups = await UserGroupModel.findAll()

        let retList = [];
        for (let i = 0 ; i < all_groups.length; i++) {
            retList.push({
                groupId: all_groups[i].groupId,
                groupName: all_groups[i].groupName,
                id: all_groups[i].id,
                models: helper.getMenus(all_groups[i].groupId, all_groups[i].models)
            })
        }

        utils.sendMessage(ctx, retList)
    })

    router.post("/user/update_group_models", async (ctx, next) => {
        let id = ctx.request.body.id;
        let models = ctx.request.body.models;

        const userGroup = await UserGroupModel.findById(id)
        if (_.isEmpty(userGroup)) {
            utils.sendError(ctx, "用户组不存在")
        } else {
            userGroup.models = models
            const userGroupUpdated = await userGroup.save()
            await ResetMenuCacheByGroupId(userGroupUpdated.groupId)

            utils.sendMessage(ctx, "")
        }
    })

    router.post("/user/group_delete", async (ctx, next) => {
        let id = ctx.request.body.id;

        const userGroup = await UserGroupModel.findById(id)
        const groupId = userGroup.groupId;

        if (_.isEmpty(userGroup)) {
            utils.sendError(ctx, "用户组不存在")
        } else {
            await userGroup.destroy()
            await ClearMenuCacheByGroupId(groupId)
            
            utils.sendMessage(ctx, "")
        }
    })

    router.post("*", async (ctx, next) => {
        utils.sendError(ctx, "invalid request")
    })
}