import React,{Component} from 'react';
import axios from "../../../../axios";
import Utils from "../../../../utils";
import {Button, Card, Table} from "antd";


export default class SupervisorForm extends Component{
    state={}
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }
    requestList = ()=>{
        let _this = this;
      //  console.log(this.props.sup);
        axios.PostAjax({
            url:this.props.personType=='originName'?'/formatoriginextra/getPage':(this.props.personType=='goodsType'?'/formatmeasurement/getPage':'/formatsupplier/getPage'),
            data:{               
                params:{
                   
                    ..._this.params,
                   
                }

            }}).then((res)=>{
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
    handleOperator=(item)=>{
        if(this.props.personType=='originName'){
        this.props.dispatchSupervisor(item.materialname,item.manufacturer,item.specifications,item.brand,item.materialcategory);
        }
            else{
                this.props.dispatchSupervisor(item.name);
            }
    }
    render(){
        //console.log(this.props.personType)
        const columns = [
            {
                title: '原料名称',
                dataIndex: 'materialname',

            },
            {
                title: '品牌',
                dataIndex: 'brand',

            },
            {
                title: '类别',
                dataIndex: 'materialcategory',

            },
            {
                title: '净含量/规格',
                dataIndex: 'specifications',

            },
            {
                title: '生产商',
                dataIndex: 'manufacturer',

            }, {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                 
                    return <div>
                        <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                        
                          </div>

                }
            }
        ];
         
        const columns2 = [
            {
                title: '企业名称',
                dataIndex: 'name',

            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                 
                    return <div>
                        <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
                        
                          </div>

                }
            }
        ];
        const columns3 = [
            {
                title: '企业名称',
                dataIndex: 'name',

            }
          
        ];
        const columns4 = [
            {
                title: '名称',
                dataIndex: 'name',

            },{
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{
                 
                    return  <Button type="primary" size='small' onClick={() => { this.handleOperator(record)}}>选择</Button>
 
                }
            }
          
        ];
        return (
           
            
            <div>
                <Card style={{marginTop:10}}>
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={this.props.personType=='originName'?columns:(this.props.personType=='supplier'?columns2:(this.props.personType=='goodsType'?columns4:columns3))}
                    />
                </Card>
            </div>
        );
    }
}
