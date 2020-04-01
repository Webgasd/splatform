import React,{Component} from 'react';
import { Card,Button,Modal,Collapse, message } from 'antd';
import  BaseForm  from '../../../components/BaseForm';
import ETable from '../../../components/ETable';
import Utils from "../../../utils";
import axios from "../../../axios";
import RatingDetails from './RatingDetails'

const Panel = Collapse.Panel;

// 表单封装，通过构建表单对象，在BaseForm中进行统一渲染
const formList = [
    {
        type: 'INPUT',
        label: '监管所名称',
        field: 'name'
    },
]


 class quantitativeGrading extends Component{
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
        axios.ajax({
            url:'/preAndEd/getPage',
            data:{
                params:_this.params
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
            title:'量化分级详细信息',
            isVisible:true,
            gradingInfo:item,
        })
       
}
    
    render() {
        const columns = [
            {
                title: '监管所名称',
                dataIndex: 'name',
                
            },
            {
                title: '已完成评定企业数目',
                dataIndex: 'ed',
            }, 
            {
                title: '未完成评定企业数目',
                dataIndex: 'pre',
            },
            {
                title: '操作',
                render:(record)=>{
                    return  <Button onClick={()=> {this.handleOperator(record)}}>查看详情</Button>
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
                    width={1200}
                    maskClosable={false}
                    destroyOnClose={true}
                    okText={"确定"}
                    cancelText={"取消"}
                    
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                            gradingInfo:''
                        })
                    }}
                >
                <RatingDetails
                gradingInfo={this.state.gradingInfo||{}} 
                />
                </Modal>
            </div>
        );
    }
}
export default quantitativeGrading
