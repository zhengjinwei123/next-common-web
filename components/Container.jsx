import { cloneElement } from "react"

const style = {
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
}
export default ({children, renderer = <div />}) => {
    const newElement = cloneElement(renderer, {
        style: Object.assign({}, renderer.props.style, style),
        children,
    })

    return newElement
}
