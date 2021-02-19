import PageLogin from "../components/PageLogin"
import Router, { withRouter } from "next/router"
import { connect } from "react-redux"

const isServer = typeof window === 'undefined'

const Login =  ({user, router}) => {
    if (user && user.id) {
        if (!isServer) {
            router.push("/")
        }
    }

    return (
        <PageLogin />
    )
}

Login.getInitialProps = async ({ctx}) => {
   
    if (isServer) {
        const { req,res } = ctx
        const session = req.session
        if (session && session.userInfo) {
            res.writeHead(302, {location: '/'})
            res.end()
        }
    }
}

export default connect(
    function mapState(state) {
        return {
            user: state.user
        }
    }
)(withRouter(Login))
  