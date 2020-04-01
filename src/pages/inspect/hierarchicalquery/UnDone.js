import React,{Component} from 'react';
import Utils from "../../../utils";
import axios from "../../../axios";
import { Row, Col ,Input, Modal, Icon,Select,Button,Table, Divider,DatePicker} from 'antd';



class Undone extends Component{
    state={
        visible:false,
        dataList:[],
       }
    params = {
    pageNo:1,
    
    }
       componentDidMount(){
          
        this.requestList()
       }
    
       requestList = ()=>{
         let {dept} = this.props.gradingInfo;
         
        let _this = this;
        axios.ajax({
            url:'/preAndEd/getPagePre',
            data:{
                params:{...this.params,dept:dept}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let dataList  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    dataList:dataList,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
              })
                })
            }
        })
       }
    
    

        render(){
          
            const columns = [
                {
                  title: '单位名称',
                  dataIndex: 'dept',
                },
                
                {
                    title: '企业名称',
                    dataIndex: 'enterprise',
                },
                {
                    title: '法人/负责人',
                    dataIndex: 'person',
                },
                {
                    title: '联系电话',
                    dataIndex: 'phone',
                },
                {
                    title: '监管人员',
                    dataIndex: 'check',
                },
              ];
    
             
            return (
                <div className='commonEnterpriseBox'>
                   
                        <Table 
                        dataSource={this.state.dataList}
                        columns={columns} 
                        pagination={this.state.pagination}/>

                </div>
               
            );
        }

}
export default Undone;