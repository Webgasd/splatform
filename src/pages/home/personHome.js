import React,{ Component } from "react";
import logo from './image/logo.png';
import work from './image/work.png';
import work2 from  './image/work2.png';

export default class PersonHome extends Component{
    render() {
        return (<div className='personHomePage'>
            <div className="outer">
                <div className="outerUp">
                </div>
                <div className="outerDown">
                    <div className="dinnerUp">
                        <img src={logo} className="logo2"/>
                            <span className='wel1'>欢迎进入从业人员培训考试平台</span><br/>
                            <span className='wel2'>Welcome to Practitioner Training and Examination Platform</span>
                            <img src={work} className="upLeft"/>
                                <img src={work2} className="upRight"/>
                    </div>
                </div>
            </div>
        </div>);
    }
}