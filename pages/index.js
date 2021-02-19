import Head from 'next/head'
// import styles from '../styles/Home.module.css'

import { useEffect } from "react"
import { Button, Icon } from "antd"
import Router, { withRouter } from "next/router"
import { connect } from "react-redux"
import LRU from "lru-cache"

const cache = new LRU({
  maxAge: 1000 * 60 * 10 
})

const isServer = typeof window === 'undefined'
const Index = ({user, router}) => {

  return (
    <div>welcome</div>
  )
}


export default connect(
  function mapState(state) {
    return {
      user: state.user,
    }
  }
)(withRouter(Index))
