const _ = require("lodash")
const menus = require("../../modules")


function getMenus(group_id, models) {

    let id_list = [];
    if (_.isEmpty(models)) {
        if (group_id != 1) {
            return []
        }
    } else {
        id_list = models.split(",")
    }

    let retList = [];
    const comment = menus.comment;
    for (var key in menus.menus) {

        if (_.isString(key)) {
            let arr = key.split(",")
            if (arr.length !== comment.length) {
                continue;
            }

            arr[0] = parseInt(arr[0])
            
            var obj = {}
            for (var j = 0; j < comment.length; ++j) {
                obj[comment[j]] = arr[j]
            }

            var childs = [];
            for (var j = 0; j < menus.menus[key].length; ++j) {
                var obj1 = {}
                for (var k = 0; k < comment.length; ++k) {
                    obj1[comment[k]] = menus.menus[key][j][k]
                }
                childs.push(obj1)
            }

            var menuItem = {
                f: obj,
                c: childs
            }

            retList.push(menuItem)
        }
    }

    if (_.isEmpty(id_list)) {
        return retList;
    }

    let tmp = [];
    _.forEach(id_list, (id, idx) => {
        tmp.push(parseInt(id))
    })
    id_list = tmp;

    let retList2 = [];
    for (let i = 0; i < retList.length; i++) {
        let obj = retList[i]

        let newObj = {}

        if (id_list.indexOf(obj.f.id) != -1) {
            newObj.f = obj.f;
            newObj.c = [];

            for (let j = 0 ; j < obj.c.length; j++) {
                if (id_list.indexOf(obj.c[j].id) != -1) {
                    newObj.c.push(obj.c[j])
                }
            }

            retList2.push(newObj)
        }
    }

    return retList2;
}

module.exports = {
    getMenus
}