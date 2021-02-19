const {sequelize} = require('../mysql_connection')
const {Sequelize, DataTypes, Model } = require('sequelize')

class User extends Model {
    static async findByName(name) {
        return await this.findOne({where: { user_name: name}})
    }

    static async add(name, password, group_id, email) {
        return await this.create({ userName: name, password: password, userGroup: group_id, email: email, status: 0});
    }

    static async findById(id) {
        return await this.findOne({where: { id: id}})
    }

    static async updateEmailAndGroup(id, email, group_id) {
        return await this.update({
            email,
            userGroup: group_id
        }, {
            where: {
                id
            }
        })
    }

    static async banUser(id) {
        return await this.update({
            status: 1
        }, {
            where: {
                id
            }
        })
    }

    static async unBanUser(id) {
        return await this.update({
            status: 0
        }, {
            where: {
                id
            }
        })
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true, //自动递增
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
    userName: {
        type: DataTypes.STRING(100),
        field: "user_name",
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING(40),
        field: "email",
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING(33),
        field: "password",
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.TINYINT(1),
        field: "status",
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
    userGroup: {
        type: DataTypes.TINYINT,
        field: "group_id",
        allowNull: false, //非空
        validate: {
            notEmpty: true
        }
    },
}, {
    sequelize,
    modelName: 'user',
    freezeTableName: true, // Model 对应的表名将与model名相同
    comment: "用户信息类",
    indexes: [
        { unique: true, fields: ['user_name']}
    ]
})

module.exports = User