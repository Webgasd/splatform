import React,{Component} from 'react';
import {Form} from 'antd';
import BasicMsg from './BasicMsg'
import PaperWork from './PaperWork'
import LicenseInfo from './licenseInformation/index'
import PersonInfo from './personInfo'
import App from './MapPosition'

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
                    <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>许可信息</div>
                    <div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>人员信息</div>
                    <div className={this.state.msgIndex === 3?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,3)}>数据地图</div>
                    <div className={this.state.msgIndex === 4?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,4)}>证照/公示</div>
                </div>
                <div className='msgContent'>
                    <div style={{display:this.state.msgIndex === 0?'block':'none'}}><BasicMsg type={this.props.type}/></div>
                    <div style={{display:this.state.msgIndex === 1?'block':'none'}}><LicenseInfo type={this.props.type}/></div>
                    <div style={{display:this.state.msgIndex === 2?'block':'none'}}><PersonInfo type={this.props.type}/></div>
                    <div style={{display:this.state.msgIndex === 3?'block':'none'}}><App type={this.props.type}/></div>
                    <div style={{display:this.state.msgIndex === 4?'block':'none'}}><PaperWork type={this.props.type}/></div>
                </div>
            </Form>
        );
    }
}
export default Form.create({})(AddForm);