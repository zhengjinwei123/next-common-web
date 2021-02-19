const {sequelize, Sequelize} = require('../mysql_connection')
const { DataTypes } = require('sequelize')

const User = require("./user")
const UserGroup = require("./user_group")
const config = require("../../config")

const tableInitialize = function (callback) {
    sequelize.sync({force: false}).then( async () => {
        console.log("sync complete")

        const now = Date.now()
        const groups = await UserGroup.findAll()
        if (groups.length === 0) {
            await UserGroup.create({
                groupName: "admin",
                models: "",
                groupId: 1,
                createAt: now,
                updateAt: now
            })

            await User.add(config.admin_accout.username, config.admin_accout.password, config.admin_accout.group_id, config.admin_accout.email)
        }

        callback()
    })
}

module.exports = {
    tableInitialize
}

