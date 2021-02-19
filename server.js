const Koa = require("koa")
const Router = require("koa-router")
const Next = require("next")
const Session = require("koa-session")
const Redis = require("ioredis")
const Config = require("./config")
const KoaBody = require("koa-body")
const atob = require("atob")
const routerModules = require("./server/routes/user")
const { tableInitialize } = require("./server/models/sync")
const authMiddleware = require("./server/middlewares/auth")
const {LoadUserGroupMenus} = require("./server/helper/global_cache")

const dev = process.env.NODE_ENV !== "production"
const app = Next({ dev })
const handler = app.getRequestHandler()

const RedisSessionStore = require('./server/session_store')

global.atob = atob

const redis = new Redis(Config.redis)
redis.on('connect', () => {
    console.log("redis connect success")
}).on('error', (err) => {
    console.error("redis connect fail", err)
    process.exit(1)
}).on('ready', () => {
    console.log("redis connect success ready")
})

const { sequelize } = require("./server/mysql_connection")
const authMyql = async () => {
    try {
        await sequelize.authenticate()
    } catch (err) {
        console.error("mysql connect fail", err)
        process.exit(1)
    }
}

authMyql()

tableInitialize(async () => {
    await LoadUserGroupMenus()
});

app.prepare().then( () => {
    const server = new Koa();
    const router = new Router();

    server.keys = ['next gm cookie keys']
    const SESSION_CONFIG = {
        key: 'gid',
        maxAge: 24 * 3600 * 1000,
        store: new RedisSessionStore(redis),
    };

    server.use(KoaBody());
    server.use(Session(SESSION_CONFIG, server))

    authMiddleware(server)
    
    routerModules(router);

    server.use(router.routes())

    // nextjs 渲染
    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        ctx.req.time_zone = Config.time_zone;


        await handler(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.listen(Config.listen_port, () => {
        console.log("server start success on : http://localhost:"+Config.listen_port)
    })
})