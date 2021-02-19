import { Spin } from "antd"
import ReactDOM from "react-dom"
import { cloneElement } from "react"

const LoadingComponent = () => (
    <div id="zjw-loading">
        <Spin size="large" tip="加载中..."/>
        <style jsx>{`
            #zjw-loading {
                position: fixed;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.3);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
            }    
        `}
        </style>
    </div>
)


const showLoading = () => {

    const newElement = cloneElement(<LoadingComponent />)

    ReactDOM.render(
        newElement,
        document.getElementById("zjw-loging-container")
    )
}

const hideLoading = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById("zjw-loging-container"));
}


export default LoadingComponent

export {
    showLoading,
    hideLoading
}
