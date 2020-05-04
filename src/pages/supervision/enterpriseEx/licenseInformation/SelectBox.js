import React,{Component} from 'react';
import { Button,Tooltip} from 'antd';
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

    handleSelect =  (name)=>{
            let data = this.props.input||{};
         if(name == "食品经营"){

            let foodBusinessList=data.foodBusinessList||[];
            foodBusinessList.push({})
            let input = {...this.props.input,foodBusinessList}
            this.props.changeEnterprise(input);

         }else if(name == "小餐饮服务"){

            let smallCaterList=data.smallCaterList||[];
            smallCaterList.push({})
            let input = {...this.props.input,smallCaterList}
            this.props.changeEnterprise(input);

         }else if(name == "小作坊"){

            let smallWorkshopList=data.smallWorkshopList||[];
            smallWorkshopList.push({})
            let input = {...this.props.input,smallWorkshopList}
            this.props.changeEnterprise(input);

         }else if(name == "食品生产"){
             
            let foodProduceList=data.foodProduceList||[];
            foodProduceList.push({})
            let input = {...this.props.input,foodProduceList}
            this.props.changeEnterprise(input);

         }else if(name == "药品经营"){

            let drugsBusinessList=data.drugsBusinessList||[];
            drugsBusinessList.push({})
            let input = {...this.props.input,drugsBusinessList}
            this.props.changeEnterprise(input);

         }else if(name == "药品生产"){

            let drugsProduceList=data.drugsProduceList||[];
            drugsProduceList.push({})
            let input = {...this.props.input,drugsProduceList}
            this.props.changeEnterprise(input);

         }else if(name == "化妆品生产"){

            let cosmeticsList=data.cosmeticsList||[];
            cosmeticsList.push({})
            let input = {...this.props.input,cosmeticsList}
            this.props.changeEnterprise(input);

         }else if(name == "医疗器械生产"){

            let medicalProduceList=data.medicalProduceList||[];
            medicalProduceList.push({})
            let input = {...this.props.input,medicalProduceList}
            this.props.changeEnterprise(input);

         }else if(name == "医疗器械经营"){

            let medicalBusinessList=data.medicalBusinessList||[];
            medicalBusinessList.push({})
            let input = {...this.props.input,medicalBusinessList}
            this.props.changeEnterprise(input);

         }else if(name == "工业产品生产"){

            let industrialProductsList=data.industrialProductsList||[];
            industrialProductsList.push({})
            let input = {...this.props.input,industrialProductsList}
            this.props.changeEnterprise(input);

         }
    }

      handeDelete=(index,type)=>{
        let data = this.props.input||{};
        if(type == "食品经营"){

            let foodBusinessList=data.foodBusinessList||[];
            foodBusinessList.splice(index, 1)
            let input = {...this.props.input,foodBusinessList}
            this.props.changeEnterprise(input)
        }
        if(type == "小餐饮服务"){

            let smallCaterList=data.smallCaterList||[];
            smallCaterList.splice(index, 1)
            let input = {...this.props.input,smallCaterList}
            this.props.changeEnterprise(input)
        }
        if(type == "小作坊"){

            let smallWorkshopList=data.smallWorkshopList||[];
            smallWorkshopList.splice(index, 1)
            let input = {...this.props.input,smallWorkshopList}
            this.props.changeEnterprise(input)
        }
        if(type == "食品生产"){

            let foodProduceList=data.foodProduceList||[];
            foodProduceList.splice(index, 1)
            let input = {...this.props.input,foodProduceList}
            this.props.changeEnterprise(input)
        }
        
        if(type == "药品经营"){

            let drugsBusinessList=data.drugsBusinessList||[];
            drugsBusinessList.splice(index, 1)
            let input = {...this.props.input,drugsBusinessList}
            this.props.changeEnterprise(input)
        }
        if(type == "药品生产"){

            let drugsProduceList=data.drugsProduceList||[];
            drugsProduceList.splice(index, 1)
            let input = {...this.props.input,drugsProduceList}
            this.props.changeEnterprise(input)
        }
        if(type == "化妆品生产"){

            let cosmeticsList=data.cosmeticsList||[];
            cosmeticsList.splice(index, 1)
            let input = {...this.props.input,cosmeticsList}
            this.props.changeEnterprise(input)
        }
        if(type == "医疗器械生产"){

            let medicalProduceList=data.medicalProduceList||[];
            medicalProduceList.splice(index, 1)
            let input = {...this.props.input,medicalProduceList}
            this.props.changeEnterprise(input)
        }
        if(type == "医疗器械经营"){

            let medicalBusinessList=data.medicalBusinessList||[];
            medicalBusinessList.splice(index, 1)
            let input = {...this.props.input,medicalBusinessList}
            this.props.changeEnterprise(input)
        }
        if(type == "工业产品生产"){

            let industrialProductsList=data.industrialProductsList||[];
            industrialProductsList.splice(index, 1)
            let input = {...this.props.input,industrialProductsList}
            this.props.changeEnterprise(input)
        }
        let name =''
        let index1 = ''
        this.props.changePermission(index1,name)
      }
   

   
    render() {
        const formData=this.props.input||{};
        return (
            <div>
                <div className='commonEnterpriseBox' style={{marginTop:5,height:137}}>
                    
                    <div className='permission-title-text'>已选许可证</div>
    
                        {(formData.foodBusinessList?formData.foodBusinessList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"食品经营")}}>{"食品经营"+(index>0?index+1:'')}</Button>))}

                        {(formData.smallCaterList?formData.smallCaterList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"小餐饮服务")}}>{"小餐饮服务"+(index>0?index+1:'')}</Button>))}

                        {(formData.smallWorkshopList?formData.smallWorkshopList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"小作坊")}}>{"小作坊"+(index>0?index+1:'')}</Button>))}

                        {(formData.foodProduceList?formData.foodProduceList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"食品生产")}}>{"食品生产"+(index>0?index+1:'')}</Button>))}

                        {(formData.drugsBusinessList?formData.drugsBusinessList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"药品经营")}}>{"药品经营"+(index>0?index+1:'')}</Button>))}
                        
                        {(formData.drugsProduceList?formData.drugsProduceList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"药品生产")}}>{"药品生产"+(index>0?index+1:'')}</Button>))}
                        
                        {(formData.cosmeticsList?formData.cosmeticsList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"化妆品生产")}}>{"化妆品生产"+(index>0?index+1:'')}</Button>))}
                        
                        {(formData.medicalProduceList?formData.medicalProduceList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"医疗器械生产")}}>{"医疗器械生产"+(index>0?index+1:'')}</Button>))}
                        
                        {(formData.medicalBusinessList?formData.medicalBusinessList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"医疗器械经营")}}>{"医疗器械经营"+(index>0?index+1:'')}</Button>))}
                        
                        {(formData.industrialProductsList?formData.industrialProductsList:[]).map((item,index)=>(  
                        <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.handeDelete(index,"工业产品生产")}}>{"工业产品生产"+(index>0?index+1:'')}</Button>))}
                    
                        <span style={{position:"absolute",bottom:'21em',right: "-4%", transform: "translate(-50%, -50%)"}}>点击按钮删除许可</span>
                        
                </div>

                <div className='commonEnterpriseBox' style={{marginTop:20}}>
                    
                    <div className='permission-title-text'>可选许可证</div>
                        {(this.props.industryList||[]).map((item,index)=>(

                            <Button style={{margin:10,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}}  onClick={()=>{this.handleSelect(item.name)}}>{item.name}</Button>

                        ))}
                </div>
        </div>
            
        )
    }
}
export default SelectBox;

  //     注释部分为许可证加标号的数组逻辑处理
        // const arr=this.props.input.permissionList||[];
        //     const obj = {}; 
        //     for(let i in arr){ 
        //     var item = arr[i].value; 
        //     obj[item] = (obj[item] +1 ) || 1; 
        //     } 
        //     const toArr= []
        //     for (let j in obj) {
        //             let o = {};
        //             o[j] = obj[j];
        //             toArr.push({name:j,key:o[j]}) 
        //         }  