import React,{Component} from 'react';
import { Card,Button,Modal,Collapse } from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import connect from "react-redux/es/connect/connect";
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";

import HikISCVideoPlay from './HikISCVideoPlayer';
import 'video.js/dist/video-js.min.css';
const Panel = Collapse.Panel;
// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
    {
        type: 'INPUT',
        label: '单位名称',
        field: 'enterpriseName'
    },  
    {
        type: 'INPUT',
        label: '所属区域',
        field: 'areaName',
    }
]
@connect(
    state=>({
       
         recordPerson:state.userName
    })
)

class HikIscVideo extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            videoInfo:{}
          };
    }
    
    params = {
        pageNo:1,
        
    }

    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/videoIsc/getPage',
            data:{
                params: _this.params
            }
        }).then((res)=>{
            if(res.status == "success"){

                let list  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
              })
                })
            }
        })
    }
   

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    handleOperator = (item)=>{
            axios.ajax({
                url:'/videoIsc/getById',
                data:{
                    params:{
                        id:item.id
                    }
                }
            }).then((res)=>{
                if(res.status =='success'){
                    this.setState({
                        isVisible:true,
                        videoInfo:res.data,
                    })
                }
            })
      }
      handleSubmit=()=>{
        const {recordPerson}= this.props;
         const {
             enterpriseId,
             enterpriseName,
             permissionId,
             charger,
             contact,
             areaName,
             area,
             address,
             recordTime,
             level,
             recordContent,
             type,
             handlePersonName,
             handlePersonId,
             handleContent,
            recordPicture1,
            recordPicture2} = this.state.videoInfo;//获取表单的值
             
         const data = {
             enterpriseId,
            enterpriseName,
            permissionId,
            charger,
            contact,
            areaName,
            area,
            address,
            recordPerson,
            recordTime,
            level,
            recordContent,
            type,
            handlePersonName,
            handlePersonId,
            handleContent,
            recordPicture1,
            recordPicture2}
            if((data.type==1&&data.handleContent==undefined)||(data.type==2&&data.handlePersonId==null))
            {
              Modal.error({title:"请填写所有带*号的选项"})
                return
            }
            axios.PostAjax({
                url:'/videoRecord/insert',
                data:{
                    params:{
                        ...data,
                    }
                }
            }).then((res)=>{
                if(res){
                    this.setState({
                        isVisible:false,
                        videoInfo:{},
                    })
                }
            })
        
    }

    render() {
        const columns = [
            {
                title: '单位名称',
                dataIndex: 'enterpriseName',
                
            }, {
                title: '所在区域',
                dataIndex: 'areaName'
            },{
                title: '综合等级',
                dataIndex: 'checkLevel',
               
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{         
                    return  <Button type="primary"  onClick={()=> {this.handleOperator(record)}}>查看视频</Button>
                }
            }
        ];
        return (
            <div>
              <Card>
                <Collapse >
                 <Panel header="查询" key="1" >
                 <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                </Panel>
                </Collapse> 
                </Card>

                <Card style={{marginTop:10}}>
                   
                    <div style={{marginTop:30}}>
                   
                        <ETable
                            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedIds={this.state.selectedIds}
                            selectedItem={this.state.selectedItem}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}                          
                            columns={columns}
                            row_selection = 'checkbox'
                        />
                    </div>
                </Card>
               
                <Modal
                    title={"监控信息"}
                    visible={this.state.isVisible}
                    width={1200}
                    footer={null}
                    maskClosable={false}
                    destroyOnClose={true}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            videoInfo:''
                        })
                    }}
                >
                       <HikISCVideoPlay
                       videoInfo={this.state.videoInfo||{}} 
                       dispatchVideoData={(data)=>{this.setState({videoInfo:data})}}
                       handleSubmit={this.handleSubmit}
                       />
                </Modal>
            </div>
        );
    }
}

export default HikIscVideo;


