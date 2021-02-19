
const AntdComponent = ({is, children, ...restProps}) => {
    const Tag = require("antd")[is]

    if (!Tag) {
        return false
    }

    return <Tag {...restProps}>{children}</Tag>
}

const AntdIconComponent = ({is}) => {
    const Tag = require("@ant-design/icons")[is]

    if (!Tag) {
        return false
    }

    return <Tag />
}

export {
    AntdComponent,
    AntdIconComponent
};