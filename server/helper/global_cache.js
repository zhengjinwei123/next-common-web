const UserGroupModel = require("../models/user_group")
const _ = require("lodash")
const helper = require("./help")

global.userMenus = {};
global.menuPathMap = {};

const LoadUserGroupMenus = async () => {
    const userGroupAll = await UserGroupModel.findAll();
    _.forEach(userGroupAll, (userGroup, index) => {
        const groupId = userGroup.groupId


        const menus = helper.getMenus(groupId, userGroup.models)
       
        global.userMenus[groupId] = menus;
        global.menuPathMap[groupId] = {}

        global.menuPathMap[groupId]["/"] = 0;
        _.forEach(menus, (m, idx) => {
            _.forEach(m.c, (c, index) => {
                global.menuPathMap[groupId]["/" + c.module] = 0;
            })
        })
    })

    console.log("LoadUserGroupMenus finished")
}

const ResetMenuCacheAll = async () => {
    await LoadUserGroupMenus()
}

const ResetMenuCacheByGroupId = async (groupId) => {
    const userGroup = await UserGroupModel.findByGroupId(groupId);
    if (_.isEmpty(userGroup)) {
        return
    }

    const menus = helper.getMenus(groupId, userGroup.models)

    global.userMenus[groupId] = menus;
    global.menuPathMap[groupId] = {}

    global.menuPathMap[groupId]["/"] = 0;
    _.forEach(menus, (m, idx) => {
        _.forEach(m.c, (c, index) => {
            global.menuPathMap[groupId]["/" + c.module] = 0;
        })
    })
}

const ClearMenuCacheByGroupId = async (groupId) => {
    if (!_.isUndefined(global.userMenus[groupId])) {
        delete global.userMenus[groupId];
        delete global.menuPathMap[groupId];
    }
}


module.exports = {
    LoadUserGroupMenus,
    ResetMenuCacheAll,
    ResetMenuCacheByGroupId,
    ClearMenuCacheByGroupId
}