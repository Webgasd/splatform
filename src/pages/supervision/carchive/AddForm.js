import React,{Component} from 'react';
import MainMsg from './MainMsg';
import RewardMsg from './RewardMsg';

export default class AddForm extends Component{
    state={
        msgIndex:0
    }

    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }
    render(){
        return (
            <div>
                <div className='msgIndexBox'>
                    <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>主体信用档案</div>
                    <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>处罚及表彰</div>
                    {/*<div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>日志</div>*/}
                </div>
                {this.state.msgIndex===0?<MainMsg/>:<RewardMsg/>}
            </div>
        );
    }
}


