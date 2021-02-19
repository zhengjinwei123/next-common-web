import actions from "../actions"
import LocalRuest from "../../lib/local_req"

const userInitalState = {}
const userReducer = (state = userInitalState, action) => {
    switch (action.type) {
        case actions.LOGOUT:
            return {}
        case actions.LOGIN:
          
            return {
                ...state,
                menu: action.payload
            }
        default:
            return state;
    }
}


const logout = (callback) => {
    return (dispatch) => {
        LocalRuest.Post("/user/logout", {}, function (err, data) {
            if (!err) {
                dispatch({
                    type: actions.LOGOUT
                })
            }
            callback && callback(err)
        })
    }
}

const login = (username, password, callback) => {
    return (dispatch) => {
        LocalRuest.Post('/user/login', {
            username: username,
            password: password
        }, function (err, data) {
            callback(err, data)
        })
    }
}


export default {
    userReducer: userReducer,
    actions : {
        logout,
        login,
    }
}