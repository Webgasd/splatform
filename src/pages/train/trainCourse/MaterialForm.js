import React,{Component} from 'react';
import axios from "../../../axios";
import Utils from "../../../utils";
import {Button, Card, Collapse, Table,Row,Col,Icon} from "antd";
import BaseForm from "../../../components/BaseForm";
const Panel = Collapse.Panel;

const formList = [
    {
        type: 'INPUT',
        label: '行业类别',
        field: 'industryCategory',
    },
    {
        type: 'INPUT',
        label: '工作种类',
        field: 'workType',
    },
]

export default class MaterialForm extends Component{
    state={}
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
            url:'/exam/trainMaterial/getPageByType',
            data:{
                params:{
                    ..._this.params,
                    typeId:this.props.operateType
                }
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
    handleOperator=(item)=>{
        let checkList=this.props.selectedList;
        checkList.push(item);
        this.props.dispatchSelected(Array.from(new Set(checkList)));
    }
    spliceList=(id)=>{
        let checkList=this.props.selectedList;
        checkList=checkList.filter(item=>item.id!==id);
        this.props.dispatchSelected(checkList);
    }

    render(){
        const columns = [
            {
                title: 'id',
                dataIndex: 'key',

            }, {
                title: '培训教材名称',
                dataIndex: 'name'
            },{
                title: '行业类别',
                dataIndex: 'industryName',

            },{
                title: '工作种类',
                dataIndex: 'workTypeName',
            },{
                title: '课程分值',
                dataIndex: 'score',
            },
            {
                title: '教材类别',
                dataIndex: 'contentType',
                render(contentType){
                    if (contentType == 1) {
                        return "视频教材"
                    } else {
                        return "文本教材"
                    }
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>添加</Button>
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
                    <Row>
                        <Col span={16}>
                            <Table
                                size='small'
                                dataSource={this.state.list}
                                pagination={this.state.pagination}
                                columns={columns}
                            />
                        </Col>
                        <Col span={7} offset={1}>
                            <Card  size='small' title={"已选内容"}>
                                {
                                    this.props.selectedList.map((item,index)=>(
                                        <div onClick={()=>this.spliceList(item.id)}>{item.name}<Icon style={{ color: '#FF3300' }} type="close" /></div>
                                    ))
                                }
                            </Card>
                        </Col>
                    </Row>

                </Card>
            </div>
        );
    }
}
