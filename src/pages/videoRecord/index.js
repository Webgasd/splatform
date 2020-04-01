import React,{Component} from 'react';
import { Card,Button,Modal,Collapse, message } from 'antd';
import  BaseForm  from '../../components/BaseForm';
import ETable from '../../components/ETable';
import Utils from "../../utils";
import axios from "../../axios";
import Record from './Record';
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;
// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
    {
        type: 'INPUT',
        label: '单位名称',
        field: 'enterpriseName'
    },  {
        type: 'INPUT',
        label: '所属区域',
        field: 'areaName'
    }
]


 class videoRecord extends Component{
    state = {
        selectedRowKeys: [], // Check here to configure the default column
      };
    params = {
        pageNo:1
    }

    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/videoRecord/getPageLook',
            data:{
                params:this.params
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

    start = () => {
        
        // ajax request after empty completing
       
          this.setState({
            selectedRowKeys: [],
          })
      }
     
    

    onSelectChange = (selectedRowKeys) => {
        Modal.info('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      }

    handleOperator = (item)=>{
        this.setState({
        title:'巡查记录单',
        isVisible:true,
        videoInfo:item,
        
        })
}
    handleSubmit = ()=>{
        this.setState({
            isVisible:false,
            videoInfo:{}
        })
    }
      
    render() {
        const columns = [
            {
                title: '企业名称',
                dataIndex: 'enterpriseName',
                
            },
            {
                title: '企业地址',
                dataIndex: 'address',
            }, 
            {
                title: '所在区域',
                dataIndex: 'areaName',
            },
            {
                title: '法人/负责人',
                dataIndex: 'charger',
            },
            {
                title: '联系电话',
                dataIndex: 'contact',
            },
            {
                title: '本年度违规总次数',
                dataIndex: 'recordCount',
            },
            {
                title: '操作',
                render:(record)=>{
                    return  <Button onClick={()=> {this.handleOperator(record)}}>查看</Button>
                    
                                 
               
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
                    title={this.state.title}
                    visible={this.state.isVisible}
                    width={1000}
                    destroyOnClose={true}
                    okText={"确定"}
                    cancelText={"取消"}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            videoInfo:''
                        })
                    }}
                >
                <Record
                videoInfo={this.state.videoInfo||{}} 
                dispatchVideoData={(data)=>{this.setState({videoInfo:data})}}/>
                </Modal>
            </div>
        );
    }
}
export default videoRecord
// handleDelete = ()=>{
    //     let item = this.state.selectedItem;
    //     let _this = this;
    //         if(!item){
    //             Modal.info({
    //                 title: '信息',
    //                 content: '请选择一个用户'
    //             })
    //             return;
    //         }
    //         Modal.confirm({
    //             content:'确定要删除此用户吗？',
    //             onOk:()=>{
    //                 axios.ajax({
    //                     url:'/post.json',
    //                     data:{
    //                         params:{
    //                             id:item.id
    //                         }
    //                     }
    //                 }).then((res)=>{
    //                     if(res.status == "success"){

    //                         _this.setState({
    //                             isVisible:false
    //                         })
    //                         _this.requestList();
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // handleSubmit = ()=>{
    //     let type = this.state.type;
    //     let data = this.state.videoInfo;//获取表单的值
    //     axios.PostAjax({
    //         url:type=='create'?'/video/insert':'/video/update',
    //         data:{
    //             params:{
    //                 ...data
    //             }
    //         }
    //     }).then((res)=>{
    //         if(res){
    //             this.setState({
    //                 isVisible:false,
    //                 videoInfo:{}
    //             })
    //             this.requestList();
    //         }
    //     })
    // }