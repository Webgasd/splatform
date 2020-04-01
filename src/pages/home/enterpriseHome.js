import React,{ Component } from 'react';
import logo from './image/logo.png';
import rice from './image/rice.png';
import vegatable from  './image/vegatable.png';

export default class EnterpriseHome extends Component{

    render() {
        return (
            <div className="enterpriseHomePage">
                <div className="outer">
                    <div className="outerUp">
                    </div>
                    <div className="outerDown">
                        <div className="dinnerUp">
                            <img src={logo} className="logo2"/>
                                <span className='wel1'>欢迎进入企业用户</span><br/>
                                <span className='wel2'>Welcome to Enterprise Users</span>
                            {/*<span className='wel1'>欢迎进入市场监管数据管理平台</span><br/>*/}
                            {/*<span className='wel2'>Welcome to Market Supervision And Data Management Platform</span>*/}
                                <img src={rice} className="upLeft"/>
                                    <img src={vegatable} className="upRight"/>
                        </div>
                    </div>
                </div>
            </div>
      );
    }
}
