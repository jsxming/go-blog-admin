import React, { useState } from 'react';
import {Route,Switch, useLocation, useHistory} from 'react-router-dom';
import { Layout } from 'antd';
import {Routes} from '@/route/index';
import VMenu from '@/components/Menu';
import { isArray,isValidValue } from '@/util/index';
import Breadcrumb from '@/components/common/breadcrumb';
import {LogoutOutlined} from '@ant-design/icons';
import {SET_MARCH_ROUTE,DELETE_TOKEN} from '@/redux/action-type';
import store from '@/redux/persist';


import  './index.less';
import { useSelector, useDispatch } from 'react-redux';

// const theme = require('@/theme/index');
// theme.init();
const { Header, Sider, Content } = Layout;

function hasChildren(route) {
    return isArray(route.children);
}

function hasComponent(item){
    return isValidValue(item.component);
}

function createRoute(arr,result){
    arr.forEach(item=>{
        if(hasComponent(item)){
            result.push(<Route children={item.component}
                exact
                key={item.path}
                path={item.path}></Route>);
        }
        if(hasChildren(item)){
            createRoute(item.children,result);
        }
    });
}

function createRoutes(){
    const result = [];
    createRoute(Routes,result);
    return result;
}


/**
 *找到与浏览器url匹配的 route 配置项
* @param {Array} arr
* @param {String} pathname
* @param {Array} result
*/
function getBreadcrumpData(){
    const loc  = useLocation();
    const result = [];
    const findRouterMatch = (arr,pathname,result,len=1)=>{
        const names = pathname.split('/').slice(1);
        let pathItem ='';
        for (let index = 0; index < len; index++) {
            pathItem += '/'+names[index];
        }
        const r = arr.find(route=>route.path.includes(pathItem));
        if(typeof r!=='undefined'){
            result.push(r);
            if(isArray(r.children) && names.length>=len ){
                findRouterMatch(r.children,loc.pathname,result,len+1);
            }
        }
    };
    findRouterMatch(Routes,loc.pathname,result);
    return result;
}


export default function Index(){
    const user = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const history = useHistory();
    // const [collapsed,setCollapsed] = useState(false);
    const breadcrump = getBreadcrumpData();

    const logout = ()=>{
        dispatch({type:DELETE_TOKEN});
        console.log(123);
        history.push('/login');
    };

    return (
        <Layout style={{height:'100vh'}}>
            {/* <Sider collapsed={collapsed}
                collapsible
                trigger={null}
            >
                <div className="logo" />
            </Sider> */}
            <Layout className="site-layout">
                <Header className="flex_between layoutHeader" >
                    <Breadcrumb data={breadcrump} ></Breadcrumb>
                    <p className="user"
                        onClick={logout}>
                        <span className="name">{user.userName}</span>
                        <LogoutOutlined style={{color:'#DB5050'}} /></p>
                </Header>
                <Content className="layoutMain" >
                    <Switch>
                        {createRoutes()}
                    </Switch>
                    <footer className="page_foot flex_end">
                        <VMenu></VMenu>
                    </footer>

                </Content>
            </Layout>
        </Layout>
    );
}