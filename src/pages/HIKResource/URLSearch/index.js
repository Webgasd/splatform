import React,{Component} from 'react';
import {Card, Button, Form, Select, Modal, message, Row, Col, Icon, Collapse} from 'antd';
import axios from "../../../axios";
import  BaseForm  from './../../../components/BaseForm';
import {unitName} from '../../../axios/commonSrc'

const { Panel } = Collapse;
const formList = [
    // {
    //     type: 'SELECT',
    //     label: '版本号',
    //     field: 'version',
    //     width: 150,
    //     list: [{id: 'v1.0.0', name: 'v1.0.0'}, {id: 'v1.2.0', name: 'v1.2.0'},{id: 'v1.3.0', name: 'v1.3.0'}]
    // },
    {
        type: 'INPUT',
        label: '监控点索引',
        field: 'cameraIndexCode'
    },
    {
        type: 'SELECT',
        label: '码流类型',
        field: 'streamType',
        width: 150,
        list: [{id: '0', name: '主码流'}, {id: '1', name: '子码流'},{id: '2', name: '第三码流'}]
    },
    {
        type: 'SELECT',
        label: '取流协议',
        field: 'protocol',
        width: 150,
        list: [{id: 'rtsp', name: 'RTSP协议'}, {id: 'rtmp', name: 'RTMP协议'},{id: 'hls', name: 'HLS协议'}]
    },
    {
        type: 'SELECT',
        label: '传输协议',
        field: 'transmode',
        width: 150,
        list: [{id: '0', name: 'UDP'}, {id: '1', name: 'TCP'}]
    }
]
class URLSearch extends Component{
    state={
        selectedRowKeys: [], // Check here to configure the default column
        headStatus:false,
        comAmount:'3000',
        perAmount:'300',
        initialValue:'',
        url:""
    }
    params = {
        pageNo:1,
        pageSize:50,
        region:unitName
    }



    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){

    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/HIKResource/getPageCamerasByCamerasIndex',
            data:{
                params:this.params
            }
        }).then((res)=> {
            if (res.status == "success" && res.data.code == "0") {
                // let list  = res.result.item_list.map((item,i)=>{
                    Modal.success({
                            title: 'URL',
                            content: res.data.data.url,
                    })
            }
            else if (res.status == "success" && res.data.code == "0x01b01301"){
                Modal.error({
                    title: 'URL',
                    content: "无此监控点位，请检查监控点索引是否正确！",
                })
            }
            else{
                Modal.error({
                    title: 'URL',
                    content: "请求错误，请检查搜索项！",
                })
            }
        })
    }

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render() {
        return (
            <div>
                <Collapse accordion>
                    <Panel header="查询监控点位信息" key="1">
                        <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
            </div>
        );
    }
}
export default URLSearch;