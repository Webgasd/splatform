import React,{Component} from 'react';
import Utils from "../../../utils";
import axios from "../../../axios";
import {Table} from 'antd';



class EnterpriseRating extends Component{
    state={
        visible:false,
        dataList:[],
        
       }
      params = {
        pageNo:1
    }
       componentDidMount(){
        this.requestList()
       }
    
       requestList = ()=>{
        let {dept} = this.props.gradingInfo;
        let _this = this;
        axios.ajax({
            url:'/preAndEd/getPageEd',
            data:{
              params:{
                ...this.params,
                dept:dept
            }
            }
        }).then((res)=>{
            if(res.status == "success"){
                let dataList  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    dataList,
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
                    title: '评定年度',
                    dataIndex: 'year',
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
                    title: '检查人员',
                    dataIndex: 'check',
                },
                {
                    title: '评定日期',
                    dataIndex: 'date',
                    render:Utils.formatDate
                },
                {
                    title: '评级结果',
                    dataIndex: 'result',
                },
                {
                    title: '检查频次',
                    dataIndex: 'freq',
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
export default EnterpriseRating;