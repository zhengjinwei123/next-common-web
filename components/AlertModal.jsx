import React, { useState } from 'react';
import { Modal } from 'antd';
import ReactDOM from "react-dom"
import { cloneElement } from "react"


const AlertModalComponent = ({title, onHide, callback}) => {
    const [isModalVisible, setIsModalVisible] = useState(true);

    const handleOk = () => {
        setIsModalVisible(false);
        if (callback) {
            callback(true, function() {
                onHide()
            })
        } else {
            onHide()
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        if (callback) {
            callback(true, function() {
                onHide()
            })
        } else {
            onHide()
        }
    };

    return (
        <Modal
          title="消息"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确认"
          cancelText="取消">
          <p>{title}</p>
        </Modal>
    )
}

const ShowAlertModal = (title, callback) => {

    if (!title) {
        title = "undefine title"
    }

    const newElement = cloneElement(<AlertModalComponent
        title={title}
        onHide={HideModal}
        callback={callback}/>)

    ReactDOM.render(
        newElement,
        document.getElementById("zjw-alert-container")
    )
}

const HideModal = () => {
    ReactDOM.unmountComponentAtNode(document.getElementById("zjw-alert-container"));
}

export default AlertModalComponent

export {
    ShowAlertModal
}
