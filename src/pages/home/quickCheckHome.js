import React,{Component} from 'react';
import logo from './image/logo.png';
import doctor from './image/doctor.png';
import bottle from  './image/bottle.png';

export default class quickCheckHome extends Component{
    render() {
        return(<div className='quickCheckPage'>
            <div className="outer">
                <div className="outerUp">
                </div>
                <div className="outerDown">
                    <div className="dinnerUp">
                        <img src={logo} className="logo2"/>
                            <span className='wel1'>快检检测数据报送平台</span><br/>
                            <span className='wel2'>Quick inspection data Submitted Platform</span>
                            <img src={doctor} className="upLeft"/>
                                <img src={bottle} className="upRight"/>
                    </div>
                </div>
            </div>
        </div>);
    }
}