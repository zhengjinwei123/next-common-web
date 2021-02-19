import { createStore, combineReducers, applyMiddleware } from "redux"
import ReduxThunk from "redux-thunk"
import { composeWithDevTools  } from "redux-devtools-extension"
import userReducer from "./reducers/user"

const allReducers = combineReducers({
    user: userReducer.userReducer
})

export default function initializeStore(state) {
    const store = createStore(
        allReducers,
        Object.assign(
            {}, {
                user: {},
            }, state
        ),
        composeWithDevTools(applyMiddleware(ReduxThunk))
    )

    return store;
}

