import React,{Component} from 'react';
import { Button} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";


@connect(
    state=>({
        input:state.enterprise,
        industryList:state.industryList,
    }),
    {
        changeEnterprise,
    }
)
class SelectBox extends Component{

    state={}

    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }

  

    handleSelect =  (value)=>{
        this.setState({
            msgIndex: value[value.length-1]
        })
        let data = this.props.input;
        let permissionList=data.permissionList||[];
        permissionList.push(value)
        data.permissionList=permissionList;
        this.props.changeEnterprise(data);
        this.changeInput(value,"msgIndex")
    }

    
   

   
    render() {
        const formData=this.props.input||{};
        console.log(formData)
        console.log(this.props.industryList)
        const checkStatus = this.props.type ==='detail'?true:false;

        return (
            <div>
                <div className='commonEnterpriseBox' style={{marginTop:5,height:137}}>
                    
                    <div className='permission-title-text'>已选许可证</div>
                       
                        { 
                            (formData.permissionList?formData.permissionList:[]).map((item,index)=>(

                            <Button style={{margin:10}}>{item}</Button>
                            )
                         )
                        }
                       
                </div>

                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                    
                    <div className='permission-title-text'>可选许可证</div>
                        {(this.props.industryList||[]).map((item)=>(

                            <Button style={{margin:10}}  onClick={()=>{this.handleSelect(item.name)}}>{item.name}</Button>

                        ))}
                </div>
        </div>
            
        )
    }
}
export default SelectBox;

