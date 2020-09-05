import React,{Component} from 'react';
import {Card,Table,Button} from "antd";
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";

export default class MaterialProgress extends Component {
    state = {
        materialList:[],
    }
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        let _this = this;
        axios.ajax({
            url:'/exam/enquiry/getCaTrainMaterialResult',
            data:{
                params:{
                    courseId:_this.props.courseId,
                    caId:_this.props.caId
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                _this.setState({
                    materialList:res.data.list
                })
            }
        })
    }
    render() {
        const columns = [
            {
                title: '教材名称',
                dataIndex: 'name',

            }, 
            {
                title: '教材种类',
                dataIndex: 'contentType',
                render(contentType){
                    return {1:'视频类教材',2:'文本类教材'}[contentType]
                }
            }, 
            {
                title: '总课时',
                dataIndex: 'allPeriod',
        },{
                title: '已学课时',
                dataIndex: 'nowPeriod',
               
            },
        ];
        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={this.state.materialList}>
                </Table>
            </div>


        );
    }

}