import React, {Component} from 'react'
import './enterpriseNotice.css'
import Return from './icon/return_left.png'
import Clock from './icon/clock.png'

export default class EnterpriseNotice extends Component {
    render() {
        return (
            <div className="EnterpriseNotice">
                <div className="EnterpriseNotice-title">
                    <img src={Return}
                         style={{width: "20px", float: "left", padding: "10px"}}
                         alt="返回"
                         onClick={() => window.history.back()}/>
                    <span style={{marginLeft: "-40px"}}>通知公告详情</span>
                </div>
                <div className="EnterpriseNotice-body">
                    <div><h2>地点</h2></div>
                    <div style={{fontSize: "1rem", color: "#999"}}>
                        <img src={Clock}
                             style={{width: "16px", paddingRight: "5px"}}
                             alt=""/>
                        2018-11-26 10:34:44
                    </div>
                    <div><p>地点</p></div>
                </div>
            </div>
        );
    }
}