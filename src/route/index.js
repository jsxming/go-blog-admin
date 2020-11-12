import React from 'react';
import { UserOutlined, LaptopOutlined, } from '@ant-design/icons';
import AsyncComponent from '@/components/AsyncComponent/index';

const Home = AsyncComponent(() => import('@/view/home/home'));
const Article = AsyncComponent(() => import('@/view/article/article'));
const Student = AsyncComponent(() => import('@/view/student/student'));
const Product = AsyncComponent(() => import('@/view/product/product'));
const ProductEdit = AsyncComponent(() => import('@/view/product/edit'));


/**
 * 字段说明
 * title
 * path
 * icon 导航图标
 * component 组件
 * children 子组件
 * hiddenChildren default:undefined，true 的时候不显示该导航下的children
 */
export const Routes = [
    {
        title: '首页',
        path: '/home',
        icon: <UserOutlined />,
        component: <Home />
    },
    {
        title: '文章',
        path: '/article',
        icon: <LaptopOutlined />,
        component: <Article />
    },
    // {
    //     title:'学员管理',
    //     path:'/student',
    //     icon:<LaptopOutlined />,
    //     component:<Student/>
    // },
    // {
    //     title:'商品管理',
    //     path:'/product',
    //     icon:<LaptopOutlined />,
    //     component:<Product/>,
    //     hiddenChildren:true,
    //     children:[
    //         {
    //             title:'编辑商品',
    //             path:'/product/edit/:id',
    //             component:<ProductEdit/>
    //         }
    //     ]
    // },
];