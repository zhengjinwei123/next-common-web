const isServer = typeof window === 'undefined'

function Error({ statusCode }) {
    return (
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    )
  }
  
  Error.getInitialProps = ({ctx }) => {
    // const statusCode = res ? res.statusCode : err ? err.statusCode : 404

    // // if (statusCode === 404) {
    // //     if (res) {
    // //         res.writeHead(302, {location: '/'})
    // //         res.end()
    // //     }
       
    // // }

    if (isServer) {
        ctx.res.writeHead(302, {location: '/'})
        ctx.res.end()
    }
  }
  
  export default Error