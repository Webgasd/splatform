import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Collapse, Table, Row, Col, Icon} from "antd";
import BaseForm from "../../../../components/BaseForm";
const Panel = Collapse.Panel;

const formList = [
    {
        type: 'INPUT',
        label: '姓名',
        field: 'name',
    },
]

export default class SupervisorForm extends Component{
    state={}
    params = {
        pageNo:1,
        department:this.props.deptId||'',
        gridId:this.props.gridId||null
    }
    //调用封装好的axios.requestList()获取角色数据
    componentDidMount(){
        this.requestList();
        this.requestDept();
    }
    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/supervision/ga/getPage',
            data:{
                    params:{...this.params,department:[this.params.department]}
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

    requestDept = ()=>{
        axios.noLoadingAjax({
            url:'/sys/dept/getAll',
            //url:'/government.json',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    deptList:res.data,
                })
            }
        })
    }


    handleOperator=(item)=>{
        let checkList=this.props.selectedList;
        checkList.push(item);
        this.props.dispatchSupervisor(Array.from(new Set(checkList)));
    }
    spliceList=(id)=>{
        let checkList=this.props.selectedList;
        checkList=checkList.filter(item=>item.id!==id);
        this.props.dispatchSupervisor(checkList);
    }
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render(){
        let _this=this;
        const columns = [
            {
                title: '单位名称',
                dataIndex: 'unitName',

            },{
                title: '部门',
                dataIndex: 'department',
                render(department){
                    let data = (_this.state.deptList||[]).find((item)=>item.id==department)||{};
                    return data.name;
                }
            },
            {
                title: '姓名',
                dataIndex: 'name',

            }, {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>添加</Button>


                }
            }
        ];
        return (
            <div>
                <Card style={{marginTop:10}}>
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>
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
