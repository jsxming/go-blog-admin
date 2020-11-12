import React, { useState } from 'react';
import { Menu } from 'antd';
import { Routes } from '@/route/index';
import { isArray } from '@/util/index';
import { useHistory, useLocation } from 'react-router-dom';


const rootSubmenuKeys = ['/video', '/question', '/feedback', '/setting'];

const { SubMenu } = Menu;

function hasChildren(route) {
    return isArray(route.children) && !route.hiddenChildren;
}

function hasIcon(item) {
    return item.icon ? item.icon : null;
}


function createMenuItem(item) {
    return <Menu.Item
        icon={hasIcon(item)}
        key={item.path}
    >
        {item.title}
    </Menu.Item>;
}


function createSubMenu(route) {
    return <SubMenu
        key={route.path}
        title={route.title}
    >
        {
            route.children.map((item) => {
                //两级导航
                // return createMenuItem(item);
                //多级导航用下面的代码 ！！！
                if (hasChildren(item)) {
                    return createSubMenu(item);
                } else {
                    return createMenuItem(item);
                }
            })
        }
    </SubMenu>;
}

//判断页面权限
function isAuth(path) {
    return [].includes(path);
}

function CreateMenu() {
    const result = [];
    for (let i = 0; i < Routes.length; i++) {
        const item = Routes[i];
        if (hasChildren(item)) {
            result.push(createSubMenu(item));
        } else {
            result.push(createMenuItem(item));
        }
    }
    return result;
}


export default function VMenu() {
    const l = useLocation();
    const rootPath = '/' + l.pathname.split('/')[1];
    const defaultOpenKeys = rootSubmenuKeys.find(item => rootPath.includes(item));
    const history = useHistory();
    const [openKeys, setOpenKeys] = useState([defaultOpenKeys]);
    const go = (val) => {
        if (history.location.pathname === val.key) return;
        history.push(val.key);
    };

    // 控制 只能展开一个子菜单
    const onOpenChange = (val) => {
        const latestOpenKey = val.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(val);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <Menu
            defaultOpenKeys={defaultOpenKeys}
            defaultSelectedKeys={[l.pathname]}
            mode="horizontal"
            onClick={go}
            onOpenChange={onOpenChange}
            openKeys={openKeys}
            style={{ borderRight: 0, overflowY: 'scroll', overflowX: 'hidden' }}
            theme="dark"
        >
            {
                CreateMenu()
            }
        </Menu>
    );
}