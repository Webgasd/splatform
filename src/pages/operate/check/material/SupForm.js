import React,{Component} from 'react';
import axios from "../../../../axios";
import moment from 'moment';
import {Button, Card, Collapse, Input} from "antd";
import connect from "react-redux/es/connect/connect";
import {changeInput} from "../../../../redux/action";

@connect(
    state=>({
        input:state.input
    }),
    {
        changeInput,
    }
)

 class SupForm extends Component{
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
            url:'/formatsupplier/getByName' ,
            data:{               
                params:{
                    name:this.props.sup
                 }
            }}).then((res)=>{
                if(res.status == "success"){


                    let data  = res.data;
                    let organ =data.organ;
                    let address =data.address;
                    let principal =data.principal;
                    let type =data.type;
                    let start =data.start;
                    let phone =data.phone;
                    let name =data.name;
                    let number =data.number;
                    let license =data.license;
                    let supplierSize =data.supplierSize;
                    let person =data.person;
                    let end =data.end;
                    let stype =data.stype;
                    this.setState({
                        data:{...data},
                        organ,
                        address ,
                        principal,
                        type ,
                        start ,
                        phone ,
                        name,
                        number ,
                        license ,
                        supplierSize,
                        person ,
                        end,
                        stype
                    })
                   // console.log(data.organ)
                }
                })

    }
   
    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };
 
    render(){
//const da=this.state.data;
      //  console.log(da)异步
        return (
          
              
                    <div className="commonEnterpriseBox">
                    <table>
                        <tbody>
                        <tr>
                            <th style={{width:80}}>地址</th>
                            <td style={{width:160}}><Input  value={this.state.address} /></td>
                            <th>营业执照号</th>
                            <td >
                                <Input  value={this.state.number} />
                            </td>
                        </tr>
                        <tr>
                            <th>类型</th>
                            <td ><Input  value={this.state.stype} /></td>
                            <th>流通许可证号</th>
                            <td ><Input  value={this.state.license} /></td>
                        </tr>
                        <tr>
                            <th>主体类型</th>
                            <td ><Input  value={this.state.type} /></td>
                            <th>许可范围</th>
                            <td ><Input  value={this.state.supplierSize} /></td>
                        </tr>
                        <tr>
                            <th>发证机关</th>
                            <td ><Input  value={this.state.organ} /></td>
                            <th>发证时间</th>
                            <td ><Input  value={moment(this.state.start).format('YYYY-MM-DD')} /></td>
                        </tr>
                        <tr>
                            <th>联系人</th>
                            <td ><Input  value={this.state.person} /></td>

                            <th>有效期限</th>
                            <td ><Input  value={moment(this.state.end).format('YYYY-MM-DD')} /></td>
                        </tr>
                        <tr>
                            <th>联系电话</th>
                            <td ><Input  value={this.state.phone} /></td>
                            <th>负责人</th>
                            <td ><Input  value={this.state.principal} /></td>
                        </tr>
                        </tbody>
                    </table>
                    </div>


        );
    }
}
export default SupForm;