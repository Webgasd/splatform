import React,{Component} from 'react';
import {Card,Table,Button} from "antd";
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";
import { Typography, Space } from 'antd';

const { Text } = Typography;
export default class TopicReview extends Component {
    state = {
        topicList:[],
    }
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        let _this = this;
        axios.ajax({
            url:'/exam/enquiry/getCaTopicResult',
            data:{
                params:{
                    examCaId:_this.props.examCaId,
                    caId:_this.props.caId,
                    subjectId:_this.props.subjectId,
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                _this.setState({
                    topicList:res.data.list
                })
            }
        })
    }
    render() {
        const columns = [
            {
                title: '题目名称',
                dataIndex: 'title',
                render:(text,record)=>{
                    if(record.check){
                        if(record.type===1||record.type===2){
                            return record.check===record.answer?text:<Text type="danger">{text}</Text>
                           }
                       else{
                         if( (record.check.indexOf('1') !== -1) === (record.answer.indexOf('1') !== -1) &&
                               (record.check.indexOf('2') !== -1) === (record.answer.indexOf('2') !== -1) &&
                               (record.check.indexOf('3') !== -1) === (record.answer.indexOf('3') !== -1) &&
                               (record.check.indexOf('4') !== -1) === (record.answer.indexOf('4') !== -1) ){
                             return  text
                         }else{
                             return <Text type="danger">{text}</Text>
                         }
                       }
                    }
                    else{return <Text type="danger">{text}</Text>}
                }
            }, 
            {
                title: '题型',
                dataIndex: 'type',
                render(type,record){
                    if(record.check){
                        if(record.type===1||record.type===2){
                            return record.check===record.answer? {1:'判断',2:'单选',3:'多选'}[type] : <Text type="danger">{{1:'判断',2:'单选',3:'多选'}[type]}</Text>
                           }
                           else{
                            if( (record.check.indexOf('1') !== -1) === (record.answer.indexOf('1') !== -1) &&
                                  (record.check.indexOf('2') !== -1) === (record.answer.indexOf('2') !== -1) &&
                                  (record.check.indexOf('3') !== -1) === (record.answer.indexOf('3') !== -1) &&
                                  (record.check.indexOf('4') !== -1) === (record.answer.indexOf('4') !== -1) ){
                                return  {1:'判断',2:'单选',3:'多选'}[type]
                            }else{
                                return <Text type="danger">{{1:'判断',2:'单选',3:'多选'}[type]}</Text>
                            }
                          }

                    }else{ return <Text type="danger">{{1:'判断',2:'单选',3:'多选'}[type]}</Text>}   
                }
            }, 
            {
                title: '正确答案',
                dataIndex: 'answer',
                render:(text,record)=>{
                    if(record.check){
                        if(record.type===1||record.type===2){
                            return record.check===record.answer?text:<Text type="danger">{text}</Text>
                           }
                       else{
                         if( (record.check.indexOf('1') !== -1) === (record.answer.indexOf('1') !== -1) &&
                               (record.check.indexOf('2') !== -1) === (record.answer.indexOf('2') !== -1) &&
                               (record.check.indexOf('3') !== -1) === (record.answer.indexOf('3') !== -1) &&
                               (record.check.indexOf('4') !== -1) === (record.answer.indexOf('4') !== -1) ){
                             return  text
                         }else{
                             return <Text type="danger">{text}</Text>
                         }
                       }
                    }else{ return <Text type="danger">{text}</Text>}
                    
                }
            },
            {
                title: '选择答案',
                dataIndex: 'check',
                render:(text,record)=>{
                    if(record.check){
                        if(record.type===1||record.type===2){
                            return record.check===record.answer?text:<Text type="danger">{text}</Text>
                           }
                       else{
                         if( (record.check.indexOf('1') !== -1) === (record.answer.indexOf('1') !== -1) &&
                               (record.check.indexOf('2') !== -1) === (record.answer.indexOf('2') !== -1) &&
                               (record.check.indexOf('3') !== -1) === (record.answer.indexOf('3') !== -1) &&
                               (record.check.indexOf('4') !== -1) === (record.answer.indexOf('4') !== -1) ){
                             return  text
                         }else{
                             return <Text type="danger">{text}</Text>
                         }
                       }
                    }else{ return <Text type="danger">{text}</Text>}
                    
                }
               
            },
            
        ];
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.topicList}>
                </Table>
            </div>


        );
    }

}