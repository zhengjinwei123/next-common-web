import { useState} from "react"
import Router , { withRouter } from "next/router"
import { connect } from "react-redux"
import userReducer from "../store/reducers/user"
import { Layout, Avatar, Dropdown, Menu, Breadcrumb, Tag, PageHeader, BackTop, Switch,Popover   } from "antd"
import {AntdIconComponent} from "./helper"

import LoginPage from "./PageLogin"
const { SubMenu } = Menu

import Link from "next/link"

// import Container from './Container'

const { Header, Content, Footer, Sider } = Layout

import getConfig from "next/config"
// import { PresetStatusColorTypes } from "antd/lib/_util/colors"
const {publicRuntimeConfig}  = getConfig()

import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn'); // en


const footerStyle = {
    textAlign: 'center',
    fontSize: 20,
}

const siderStyle = {
    background: '#f5f5f5',
    left: 0,
    marginLeft: 2,
    marginTop: 100,
    boxShadow: '0 1px 10px rgba(0,0,0,0.8)',
    borderRadius: '4px'
}

const contentStyle = {
    color: 'red',
    overFlow: 'scroll',
    marginLeft: 1,
    marginTop: 100,
    background: '#fefefe',
    paddingLeft: 30,
}

const headerStyle = {
    position: 'fixed',
    height: 80,
    zIndex: 1,
    width: '100%',
    color: 'red',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderBottom: "1px solid #E3E3E3",
    boxShadow: '1px 1px 10px rgba(0,0,0,0.1)',
    background: "url('/static/logo.png') #FFF no-repeat 16px 16px"
}

const siderContentLayoutStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
}

const childrenStyle = {
    paddingLeft: "20px",
    paddingTop: "20px",
    paddingRight: "20px",
    display: "flex",
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
}

const backupStyle = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
}

const MyLayout = ({children, user, logout, router}) => {

    if (!user || !user.id) {
        return (
            <LoginPage />
        )
    }

    const [collapsed, setCollapsed] = useState(false)
    const [locale, setLocale] = useState(zhCN)
 
    const siderCollapseEvent = (collapsed, type) => {
        setCollapsed(collapsed)
    }

    const titleNode = (
        <h2>{publicRuntimeConfig.gm_title}</h2>
    )
    const subTitleNode = (
        <h4><Tag color="geekblue">当前时区: {user.time_zone}</Tag></h4>
    )

    let menu = user.menu
    if (!menu) {
        menu = [];
    }
    const defaultSelectMenuKey = menu && menu.length ? menu[0].f.id : 0;

    let menuNode = (
        <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={[defaultSelectMenuKey]}
            mode="inline"
            theme="light">
            {
                menu.map((val ,k) => {
                    return (
                        <SubMenu key={k} icon={<AntdIconComponent is={val.f.icon}/>} title={val.f.name}>
                            {
                                val.c.map((c, k1) => {
                                    return (<Menu.Item key={k1} icon={<AntdIconComponent is={c.icon}/>} >
                                       <Link href={{
                                           pathname: `/${c.module}`,
                                           query: {
                                               link_list: [publicRuntimeConfig.gm_title, val.f.name, c.name]
                                           }
                                       }}  as={`${c.module}`} shallow={true} replace={true}>
                                           <a>{c.name}</a>
                                       </Link>
                                    </Menu.Item>)
                                })
                            }
                        </SubMenu>
                    )
                })
            }
        </Menu>
    )

    const handleLogout = (e) => {
        e.preventDefault();
        logout()
    }

    const updatePassword = (e) => {
        e.preventDefault();
    }

    const userDropDownNode = () => {
        return (
            <Menu>
                <Menu.Item><a onClick={handleLogout}>登出</a></Menu.Item>
                <Menu.Item><a onClick={updatePassword}>修改密碼</a></Menu.Item>
            </Menu>
        )
    }

    const onLocaleSwitchChange = (checked, e) => {
        e.preventDefault();
        if (checked) {
            setLocale(zhCN)
        } else {
            setLocale(enUS)
        }
    }

    if (!router.query.link_list) {
        router.query.link_list = [publicRuntimeConfig.gm_title];
    }

    return (
        <ConfigProvider locale={locale}>
            <Layout>
                <Header style={headerStyle}>
                    <div className="header-inner">
                        <div className="header-left">
                            <PageHeader
                                backIcon={false}
                                onBack={() => null}
                                title={titleNode}
                                subTitle={subTitleNode}
                            />

                            <PageHeader
                                backIcon={false}
                                onBack={() => null}
                                title={<Switch
                                    onChange={onLocaleSwitchChange}
                                    checkedChildren="中文" unCheckedChildren="English" defaultChecked />}
                                subTitle={<></>}
                            />
                            

                        </div>
                        <div className="header-right">
                           
                            <Dropdown overlay={userDropDownNode}>
                                <Popover placement="leftTop" content={user.name}>
                                    <a href="#">
                                        <Avatar
                                            style={{
                                                    backgroundColor: '#1890ff'
                                            }}
                                            icon={<AntdIconComponent is="UserOutlined" />}
                                        />
                                    </a>
                                </Popover>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Layout style={siderContentLayoutStyle}>
                    <Sider style={siderStyle} collapsible={true} width={250} onCollapse={siderCollapseEvent} >
                        {menuNode}
                    </Sider>
                    <Content style={contentStyle}>
                        <Tag color="magenta">
                            {
                                router.query.link_list && router.query.link_list.length ?
                                <Breadcrumb>
                                {
                                    router.query.link_list.map((val, key) => {
                                        return (
                                            <Breadcrumb.Item key={key}>{val}</Breadcrumb.Item>
                                        )
                                        
                                    })
                                }
                                </Breadcrumb> : <div></div>
                            }
                        
                        </Tag>
                    <div style={childrenStyle}>
                        {children}
                        <BackTop>
                        <div style={backupStyle}>UP</div>
                        </BackTop>
                    </div>
                    </Content>
                </Layout>
                <Footer style={footerStyle}>
                    游戏管理工具
                    <Link href={``}>
                    <a>@www.baidu.com</a>
                    </Link>
                </Footer>

                <style jsx>{`
                    .header-inner {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        height: 100%;
                    }
                    .header-left {
                        display: flex;
                        width: 90%;
                        height: 100%;
                    }
                   

                    .header-right {
                        display: flex;
                        width: 60px;
                        height: 100%;
                        margin-right: 10px;
                        margin-left: 20px;
                    }
                `}
                </style>
                
                <style jsx global>{`
                    #__next {
                        height: 100%;
                    }
                    .ant-layout {
                        min-height: 100%;
                    }
                    .ant-page-header {
                        padding-bottom: 2px;
                    }
                    .ant-layout-header {
                        padding-left: 0;
                        padding-right: 0;
                    }
                    .ant-layout-content {
                        background: #fff;
                    }
                    .ant-layout-sider-trigger {
                    color: #eee;
                    }
                `}</style>
            </Layout>
        </ConfigProvider>
    )
}

export default connect(
    function mapState(state) {
        return {
            user: state.user,
        }
    },
    function mapReducer(dispatch) {
        return {
            logout: (callback) => dispatch(userReducer.actions.logout(callback)),
        }
    }
)(withRouter(MyLayout))