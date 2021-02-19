const {sequelize, Sequelize} = require('../mysql_connection')
const { DataTypes, Model, QueryTypes } = require('sequelize')


class UserGroup extends Model {
    static async findById(id) {
        return await this.findOne({where: { id: id}})
    }

    static async findByGroupId(id) {
        return await this.findOne({where: { group_id: id}})
    }

    static async findByName(group_name) {
        return await this.findOne({where: { group_name }})
    }

    static async findIdNameAll() {
        return await sequelize.query("SELECT `group_id`,`group_name` FROM `user_group`", { type: QueryTypes.SELECT });
    }

    static async getNum() {
        const n = await this.count()
        return n;
    }

    static async add(group_name, models) {
        const group_id = await this.getNum() + 1
        const now = Date.now()
        const newGroup = await this.create({
            groupName: group_name,
            models: models, 
            groupId: group_id,
            createAt: now,
            updateAt: now
        })
        return newGroup
    }
}

UserGroup.init({
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true, //自动递增
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
    groupId: {
        type: DataTypes.TINYINT(2),
        field: "group_id",
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
    groupName: {
        type: DataTypes.STRING(100),
        field: "group_name",
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
    models: {
        type: DataTypes.STRING(2048),
        field: "models",
        allowNull: true, //非空
    },
}, {
    sequelize,
    modelName: 'user_group',
    freezeTableName: true, // Model 对应的表名将与model名相同
    comment: "用户组类",
    indexes: [
        { unique: true, fields: ['group_name']},
        { unique: true, fields: ['group_id']}
    ]
})


module.exports = UserGroup