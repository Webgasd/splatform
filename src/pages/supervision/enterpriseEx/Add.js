import React,{Component} from 'react';
import {Form} from 'antd';
import BasicMsg from './BasicMsg'
import Person from './Person'
import Manager from './Manager'
import Another from './Another'
import Spread  from './Spread'

class AddForm extends Component{
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
            <Form layout="inline">
                <div className='msgIndexBox'>
                    <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>企业信息</div>
                    <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>法定代表人信息</div>
                    <div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>食品安全管理人员</div>
                    <div className={this.state.msgIndex === 3?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,3)}>企业其他信息</div>
                    <div className={this.state.msgIndex === 4?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,4)}>企业宣传信息</div>
                </div>
                <div className='msgContent'>
                    <div style={{display:this.state.msgIndex === 0?'block':'none'}}><BasicMsg type={this.props.type}/></div>
                    <div style={{display:this.state.msgIndex === 1?'block':'none'}}><Person type={this.props.type}/></div>
                    <div style={{display:this.state.msgIndex === 2?'block':'none'}}><Manager type={this.props.type}/></div>
                    <div style={{display:this.state.msgIndex === 3?'block':'none'}}><Another type={this.props.type}/></div>
                    <div style={{display:this.state.msgIndex === 4?'block':'none'}}> <Spread type={this.props.type}/></div>
                </div>
            </Form>
        );
    }
}
export default Form.create({})(AddForm);