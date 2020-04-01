import React,{Component} from 'react';
import logo from './image/logo.png';
import enter from './image/enter.png';
import water from  './image/water.png';

export default class spotCheckHome extends Component{
    render() {
        return(<div className='spotCheckPage'>
            <div className="outer">
                <div className="outerUp">
                </div>
                <div className="outerDown">
                    <div className="dinnerUp">
                        <img src={logo} className="logo2"/>
                            <span className='wel1'>抽检机构检测数据报送平台</span><br/>
                            <span className='wel2'>Sampling organization inspection data Submitted Platform</span>
                            <img src={enter} className="upLeft"/>
                            <img src={water} className="upRight"/>
                    </div>
                </div>
            </div>
        </div>);
    }
}