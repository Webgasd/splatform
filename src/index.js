import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import {Provider} from 'react-redux';
import store from './redux/store';
import {LocaleProvider} from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

ReactDOM.render(
   <Provider store={store}>
       <LocaleProvider locale={zhCN}>
           <Router />
       </LocaleProvider>
   </Provider>, document.getElementById('root'));
