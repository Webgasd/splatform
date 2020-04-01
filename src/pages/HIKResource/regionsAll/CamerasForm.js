import React,{Component} from 'react';
import {Table} from 'antd';
import axios from '../../../axios'
import Utils from "../../../utils";
import {unitName} from '../../../axios/commonSrc'

 class CameraForm extends Component{
   state={
    cameraList:[],
   }
  params = {
      pageNo:1,
      pageSize:50,
      region:unitName
}
   componentDidMount(){
    this.requestList()
   }


   requestList = ()=>{
       console.log("执行摄像头列表request")
    let _this = this;
    axios.ajax({
        url:'/HIKResource/getPageCamerasByRegions',
        data:{
            params:{
                ...this.params,
                regionIndexCode:this.props.userInfo.indexCode
            }
        }
    }).then((res)=>{
        if(res.data.code=="0"){
            let cameraList  = res.data.data.list.map((item,i)=>{
                item.key = i;
                 return item;
            })
            this.setState({
                cameraList,
            })
        }
        else if (res.data.code=="0x02401008")
        {
            alert("权限未开放,请联系管理员")
        }
    })
   
   }

   
  
    render(){
        const columns = [
            {
              title: '区域索引代码',
              dataIndex: 'regionIndexCode',
            },
            {
                title: '相机索引代码',
                dataIndex: 'cameraIndexCode',
              },
            {
                title: '监控点名称',
                dataIndex: 'cameraName',
            },
          ];

        
        return (
            <div>
                    <Table 
                    dataSource={this.state.cameraList}
                    columns={columns} 
                    />
            </div>
        );
    }
}
export default CameraForm