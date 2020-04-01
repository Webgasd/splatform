import React,{Component} from 'react';
import {Form} from 'antd';
import EnterpriseRating from './EnterpriseRating';
import UnDone from './UnDone'



class RatingDetails extends Component{
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
                    <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>完成评级企业信息</div>
                    <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>未完成评级企业信息</div>
                    
                </div>
                <div className='msgContent'>
                    <div style={{display:this.state.msgIndex === 0?'block':'none'}}><EnterpriseRating gradingInfo={this.props.gradingInfo}/></div>
                    <div style={{display:this.state.msgIndex === 1?'block':'none'}}><UnDone gradingInfo={this.props.gradingInfo}/></div>
                    
                </div>
            </Form>
        );
    }
}
export default Form.create({})(RatingDetails);