import '../styles/globals.css'

import App from "next/app"
import Layout from "../components/Layout"
import { Provider } from "react-redux"
import Router from "next/router"
import withRedux from '../lib/with_redux'
import PageLoading from "../components/PageLoading"
import "antd/dist/antd.css"

class MyApp extends App {
  state = {
    loading: false
  }

  startLoading = () => {
    this.setState({
      loading: true
    })
  }

  stopLoading = () => {
    this.setState({
      loading: false
    })
  }

  componentDidMount() {
    Router.events.on("routeChangeStart", this.startLoading);
    Router.events.on("routeChangeComplete", this.stopLoading)
    Router.events.on("routeChangeError", this.stopLoading)
  }

  componentWillUnmount() {
		Router.events.off('routeChangeStart', this.startLoading)
		Router.events.off('routeChangeComplete', this.stopLoading)
		Router.events.off('routeChangeError', this.stopLoading)
	}

  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <Provider store={ reduxStore }>
        {this.state.loading ? <PageLoading /> : <></> }
        <div id="zjw-loging-container"></div>
        <div id="zjw-alert-container"></div>
        <Layout>
          <Component {...pageProps } />
        </Layout>
    </Provider>
    )
  }
}

export default withRedux(MyApp)
