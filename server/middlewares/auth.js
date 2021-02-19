const _ = require("lodash")

module.exports = (server) => {
    server.use( async (ctx, next) => {
        const {path, method } = ctx;

        if (method === 'GET') {
            if (path !== "/login" && !path.startsWith("/_next/") && !path.startsWith("/favicon.ic") &&
               !path.startsWith("/static/")) {
                if (!ctx.session.userInfo) {
                    ctx.redirect("/login")
                } else {
                    // 权限控制
                    const group_id = ctx.session.userInfo.group_id
                    if (!_.isUndefined(global.menuPathMap[group_id]) && _.isUndefined(global.menuPathMap[group_id][path])) {
                        ctx.redirect("/")
                    } else {
                        await next()
                    }
                }
            } else {
                await next()
            }
        } else {
            if (!ctx.session.userInfo && !path.startsWith("/user/login")) {
                ctx.body = "invalid request"
            } else {
                await next()
            }
        }
    })
}