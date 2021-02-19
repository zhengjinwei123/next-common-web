import React from "react"
import createStore from "../store/store"

const isServer = typeof window === "undefined"
const __NEXT_REDUX_STORE__ = "__NEXT_REDUX_STORE__"

function getOrCreateStore(initialState) {
    if (isServer) {
        return createStore(initialState)
    }

    if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = createStore(initialState)
    }
    return window[__NEXT_REDUX_STORE__]
}


export default (Comp) => {
    class WithReduxApp extends React.Component {
        constructor(props) {
            super(props)
            this.reduxStore = getOrCreateStore(props.initialReduxState)
        }

        render() {
            const { Component, pageProps, ...rest } = this.props

            if (pageProps) {
                pageProps.hoc = "hoc"
            }

            return (
                <Comp 
                    reduxStore = {this.reduxStore}
                    {...rest}
                    Component={Component}
                    pageProps={pageProps}
                />
            )
        }
    }

    WithReduxApp.getInitialProps = async (ctx) => {
        let reduxStore = null
        if (isServer) {
            const { req } = ctx.ctx
            const session = req.session
            
            if (session && session.userInfo) {
                let userInfo = {
                    ...session.userInfo,
                    menu: global.userMenus ? global.userMenus[session.userInfo.group_id] : [],
                    time_zone: req.time_zone,
                }

                reduxStore = getOrCreateStore({
                    user: userInfo,
                })
            } else {
                reduxStore = getOrCreateStore()
            }
        } else {
            reduxStore = getOrCreateStore()
        }

        ctx.reduxStore = reduxStore

        let pageProps = {}
        if (typeof Comp.getInitialProps === 'function') {
            pageProps = await Comp.getInitialProps(ctx)
        }

        return {
            ...pageProps,
            initialReduxState: reduxStore.getState()
        }
    }

    return WithReduxApp
}