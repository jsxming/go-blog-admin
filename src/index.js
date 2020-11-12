import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, } from 'react-redux';
import store, { persistor, } from '@/redux/persist';
import { PersistGate, } from 'redux-persist/lib/integration/react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import './style/antdreset.less';
import './style/reset.less';
import './style/common.less';
import App from './App';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
// moment.locale('zh-cn');

import AuthComponent from './components/AuthComponent/index';
import AsyncComponent from './components/AsyncComponent/index';
const Login = AsyncComponent(() => import('./view/login/index'));
// const Sider = AsyncComponent(() => import('./view/sider/sider.js'));
const Index = AsyncComponent(() => import('./view/Index/index'));


ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null}
            persistor={persistor}
        >
            <ConfigProvider
                locale={zhCN}>
                <Router>
                    <Switch>

                        <Route component={Login}
                            exact
                            path="/login"
                        ></Route>
                        <Route component={App}
                            path="/app"
                        ></Route>
                        {/* <Route component={Sider}
                        path="/sider"
                    ></Route> */}
                        <AuthComponent component={Index}
                            path="/"
                        ></AuthComponent>
                    </Switch>

                </Router>
            </ConfigProvider>
        </PersistGate>
    </Provider>
    ,
    document.getElementById('root')
);
