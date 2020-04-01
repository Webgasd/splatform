import React,{Component} from 'react';
import {Input,Select,Radio,Checkbox,Row,Col} from 'antd';
const Option = Select.Option;

export default class AddForm extends Component{
    handleTitle=(event)=>{
        let value = this.props.topicData;
        value.title = event.target.value;
        this.props.dispatchTopicData(value);
    }
    handleScore=(event)=>{
        let value = this.props.topicData;
        value.score = event.target.value;
        this.props.dispatchTopicData(value);
    }
    handleOptionA=(event)=>{
        let value = this.props.topicData;
        value.optionA = event.target.value;
        this.props.dispatchTopicData(value);
    }
    handleOptionB=(event)=>{
        let value = this.props.topicData;
        value.optionB = event.target.value;
        this.props.dispatchTopicData(value);
    }
    handleOptionC=(event)=>{
        let value = this.props.topicData;
        value.optionC = event.target.value;
        this.props.dispatchTopicData(value);
    }
    handleOptionD=(event)=>{
        let value = this.props.topicData;
        value.optionD = event.target.value;
        this.props.dispatchTopicData(value);
    }
    handleStatus=(event)=>{
        let value = this.props.topicData;
        value.status = event;
        this.props.dispatchTopicData(value);
    }
    handleType=(event)=>{
        let value = this.props.topicData;
        value.type = event;
        this.props.dispatchTopicData(value);
    }
    handleAnswer=(event)=>{
        let value = this.props.topicData;
        value.answer = event.target.value;
        this.props.dispatchTopicData(value);
    }
    handleMAnswer=(event)=>{
        let value = this.props.topicData;
        value.answer = event.join(',');
        this.props.dispatchTopicData(value);
    }
    render(){
        const checkStatus = this.props.type=='detail'?true:false;
        const judgement = <div className='commonEnterpriseBox'>
            <table>
                <tbody>
            <tr>
            <td >答案</td>
            <td  colSpan={5}><Radio.Group value={this.props.topicData.answer}onChange={this.handleAnswer} disabled={checkStatus}>
                <Radio value={'1'}>正确</Radio>
                <Radio value={'2'}>错误</Radio>
            </Radio.Group></td>
        </tr></tbody>
            </table>
        </div>
        const single = <div className='commonEnterpriseBox'>
            <table>
                <tbody>
            <tr>
                <td>选项A：</td>
                <td colSpan={5}><Input value={this.props.topicData.optionA||''} onChange={this.handleOptionA} disabled={checkStatus}/></td>
            </tr>
            <tr>
                <td>选项B：</td>
                <td colSpan={5}><Input  value={this.props.topicData.optionB||''} onChange={this.handleOptionB} disabled={checkStatus}/></td>
            </tr>
            <tr>
                <td>选项C：</td>
                <td colSpan={5}><Input value={this.props.topicData.optionC||''} onChange={this.handleOptionC} disabled={checkStatus}/></td>
            </tr>
            <tr>
                <td>选项D：</td>
                <td colSpan={5}><Input value={this.props.topicData.optionD||''} onChange={this.handleOptionD} disabled={checkStatus}/></td>
            </tr>
            <tr>
                <td >答案</td>
                <td  colSpan={5}>
                    <Radio.Group value={this.props.topicData.answer}onChange={this.handleAnswer} disabled={checkStatus}>
                        <Radio value={'1'}>A</Radio>
                        <Radio value={'2'}>B</Radio>
                        <Radio value={'3'}>C</Radio>
                        <Radio value={'4'}>D</Radio>
                    </Radio.Group></td>
            </tr></tbody>
            </table>
        </div>

        const multiple =<div className='commonEnterpriseBox'>
            <table>
                <tbody>
            <tr>
                <td>选项A：</td>
                <td><Input value={this.props.topicData.optionA||''} onChange={this.handleOptionA} disabled={checkStatus}/></td>
            </tr>
            <tr>
                <td>选项B：</td>
                <td><Input value={this.props.topicData.optionB||''} onChange={this.handleOptionB} disabled={checkStatus}/></td>
            </tr>
            <tr>
                <td>选项C：</td>
                <td><Input value={this.props.topicData.optionC||''} onChange={this.handleOptionC} disabled={checkStatus}/></td>
            </tr>
            <tr>
            <td>选项D：</td>
            <td><Input value={this.props.topicData.optionD||''} onChange={this.handleOptionD} disabled={checkStatus}/></td>
        </tr>
            <tr>
                <td >答案</td>
                <td  colSpan={5}><Checkbox.Group value={this.props.topicData.answer}onChange={this.handleMAnswer} style={{ width: '100%' }} disabled={checkStatus}>
                    <Row>
                        <Col span={6}>
                            <Checkbox value={'1'}>A</Checkbox>
                        </Col>
                        <Col span={6}>
                            <Checkbox value={'2'}>B</Checkbox>
                        </Col>
                        <Col span={6}>
                            <Checkbox value={'3'}>C</Checkbox>
                        </Col>
                        <Col span={6}>
                            <Checkbox value={'4'}>D</Checkbox>
                        </Col>
                    </Row>
                </Checkbox.Group></td>
            </tr></tbody>
            </table>
            </div>

        return (
            <div>
                    <div className='commonEnterpriseBox'>
                        <table>
                            <tbody>
                            <tr>
                                <td>题型:</td>
                                <td colSpan={3}>
                                <Select value={this.props.topicData.type||''} onChange={this.handleType} style={{ width: 200 }} disabled={checkStatus}>
                                    <Option value={1} key={1}>判断题</Option>
                                    <Option value={2} key={2}>单选题</Option>
                                    <Option value={3} key={3}>多选题</Option>
                                </Select></td>
                                <td>状态:</td>
                                <td>
                                 <Select  value={this.props.topicData.status||''} onChange={this.handleStatus} style={{ width: 200 }} disabled={checkStatus}>
                                    <Option value={1} key={1}>开启</Option>
                                    <Option value={2} key={2}>关闭</Option>
                                </Select></td>
                                <td>分数：</td>
                                <td><Input value={this.props.topicData.score||0} onChange={this.handleScore} disabled={checkStatus}/></td>
                            </tr>
                            <tr>
                                <td>问题/题目：</td>
                                <td colSpan={7}><Input value={this.props.topicData.title||''} onChange={this.handleTitle} disabled={checkStatus}/></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                {this.props.topicData.type===3?multiple:(this.props.topicData.type===2?single:judgement)}
            </div>
        );
    }
}
