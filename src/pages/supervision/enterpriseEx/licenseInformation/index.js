import React,{Component} from 'react';
import { Row,Col, Button,Modal, Empty} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import FoodProduction from './FoodProduction';
import FoodBusiness from './FoodBusiness';
import DrugBusiness from './DrugBusiness';
import DrugProduction from './DrugProduction';
import MedicalDeviceBusiness from './MedicalDeviceBusiness';
import MedicalDeviceProduction from './MedicalDeviceProduction';
import CosmeticsProduction from './CosmeticsProduction';
import SmallRestaurant from './SmallRestaurant';
import SmallWorkshop from './SmallWorkshop';
import IndustrialProduct from './IndustrialProduct'
import SelectBox from './SelectBox';


@connect(
    state=>({
        input:state.enterprise,
        industryList:state.industryList,
    }),
    {
        changeEnterprise,
    }
)
class LicenseInfo extends Component{

   state={ modalVisible:false }

    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeEnterprise(input);
    }
    

    changePermission=(index,name)=>{
        this.setState({
            msgIndex:name,
            index
        })
    }

    getContent =()=>{
        
        if(!this.state.msgIndex){
            let permissionFamily = this.props.input.permissionFamily || ''
            let permissionFirst =  permissionFamily.split(',')[0]
            if(permissionFirst){
                this.setState({
                    msgIndex: permissionFirst,
                    index:0
                })
            }
            
            return;
        }
        // eslint-disable-next-line default-case
        switch (this.state.msgIndex) {
            case 'foodBusiness':
                return <FoodBusiness type={this.props.type} index={this.state.index}/>
            case 'foodProduce':
                return <FoodProduction type={this.props.type} index={this.state.index}/>
            case 'drugsBusiness':
                return <DrugBusiness type={this.props.type} index={this.state.index}/>
            case 'drugsProduce':
                return <DrugProduction type={this.props.type} index={this.state.index}/>
            case 'medicalBusiness':
                return <MedicalDeviceBusiness type={this.props.type} index={this.state.index}/>
            case 'medicalProduce':
                return <MedicalDeviceProduction type={this.props.type} index={this.state.index}/>
            case 'cosmeticsUse':
                return <CosmeticsProduction type={this.props.type} index={this.state.index}/>
            case 'smallCater':
                return <SmallRestaurant type={this.props.type} index={this.state.index}/>
            case 'smallWorkshop':
                return <SmallWorkshop type={this.props.type} index={this.state.index}/>
            case 'industrialProducts':
                return <IndustrialProduct type={this.props.type} index={this.state.index}/>
        }
    }
    handleSelectBox=()=>{
        this.setState({
            modalVisible:true
        })
    }
    handleCloseModal=()=>{
        const data = this.props.input||{}
        let permissionList=[]

        if(data.foodBusinessList&&data.foodBusinessList.length !== 0){
            permissionList.push("foodBusiness")
        }
        if(data.smallCaterList&&data.smallCaterList.length !== 0){
            permissionList.push("smallCater")
        }
        if(data.smallWorkshopList&&data.smallWorkshopList.length !== 0){
            permissionList.push("smallWorkshop")
        }
        if(data.foodProduceList&&data.foodProduceList.length !== 0){
            permissionList.push("foodProduce")
        }
        if(data.drugsBusinessList&&data.drugsBusinessList.length !== 0){
            permissionList.push("drugsBusiness")
        }
        if(data.drugsProduceList&&data.drugsProduceList.length !== 0){
            permissionList.push("drugsProduce")
        }
        if(data.cosmeticsList&&data.cosmeticsList.length !== 0){
            permissionList.push("cosmeticsUse")
        }
        if(data.medicalProduceList&&data.medicalProduceList.length !== 0){
            permissionList.push("medicalProduce")
        }
        if(data.medicalBusinessList&&data.medicalBusinessList.length !== 0){
            permissionList.push("medicalBusiness")
        }
        if(data.industrialProductsList&&data.industrialProductsList.length !== 0){
            permissionList.push("industrialProducts")
        }

        let permissionFamily = permissionList.join(',')
        let input = {...this.props.input,permissionFamily}
        this.props.changeEnterprise(input)
        this.setState({
            modalVisible:false,
            msgIndex:'',
            index:''
        })

    }
    
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type ==='detail'?true:false;

        return (
            <div>
                <Row>
                    <Col span={4}>
                        <div  className='commonEnterpriseBox1' style={{marginTop:20,height:560}}>
                            <div className='permission-title-text'>许可证类型</div>
                        
                            {(formData.foodBusinessList?formData.foodBusinessList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "foodBusiness"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"foodBusiness")}}>
                                {"食品经营"+(index>0?index+1:'')}
                            </div>))}

                            {(formData.smallCaterList?formData.smallCaterList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "smallCater"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"smallCater")}}>
                                {"小餐饮服务"+(index>0?index+1:'')}
                            </div>))}

                            {(formData.smallWorkshopList?formData.smallWorkshopList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "smallWorkshop"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"smallWorkshop")}}>
                                {"小作坊"+(index>0?index+1:'')}
                            </div>))}

                            {(formData.foodProduceList?formData.foodProduceList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "foodProduce"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"foodProduce")}}>
                                {"食品生产"+(index>0?index+1:'')}
                            </div>))}

                            {(formData.drugsBusinessList?formData.drugsBusinessList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "drugsBusiness"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"drugsBusiness")}}>
                                {"药品经营"+(index>0?index+1:'')}
                            </div>))}
                            
                            {(formData.drugsProduceList?formData.drugsProduceList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "drugsProduce"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"drugsProduce")}}>
                                {"药品生产"+(index>0?index+1:'')}
                            </div>))}
                            
                            {(formData.cosmeticsList?formData.cosmeticsList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "cosmeticsUse"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"cosmeticsUse")}}>
                                {"化妆品生产"+(index>0?index+1:'')}
                            </div>))}
                            
                            {(formData.medicalProduceList?formData.medicalProduceList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "medicalProduce"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"medicalProduce")}}>
                                {"医疗器械生产"+(index>0?index+1:'')}
                                </div>))}
                            
                            {(formData.medicalBusinessList?formData.medicalBusinessList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "medicalBusiness"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"medicalBusiness")}}>
                                {"医疗器械经营"+(index>0?index+1:'')}
                            </div>))}
                            
                            {(formData.industrialProductsList?formData.industrialProductsList:[]).map((item,index)=>(  
                            <div className={(this.state.msgIndex&&this.state.index>=0&&this.state.msgIndex === "industrialProducts"&&this.state.index === index)?
                                'permissionButtonOnClick':'permissionButtonNoClick'} 
                                onClick={()=>{this.changePermission(index,"industrialProducts")}}>
                                {"工业产品生产"+(index>0?index+1:'')}
                            </div>))}

                            <div style={{position:"absolute",bottom:20,left: "50%", transform: "translate(-50%, -50%)"}}>
                            <Button onClick={()=>{this.handleSelectBox()}} style={{backgroundColor:"RGB(255, 102, 0)",width:100,color:'white'}} disabled={checkStatus}>类型管理</Button> 
                            </div>
                            
                    
                        </div>
                    </Col>
                    <Col span={20}>  
                        <div className='commonEnterpriseBox1' style={{marginTop:20}}>
                            <div className='permission-title-text'>许可信息</div>
                            {formData.permissionFamily?this.getContent():<Empty style={{height:528}} description={<span>点击类型管理添加许可信息</span>}/>}
                        </div>
                    </Col>
                </Row>
                <Modal
                    visible={this.state.modalVisible}
                    destroyOnClose
                    title="选择许可证类型"
                    maskClosable={false}
                    width={640}
                    onCancel={this.handleCloseModal}
                    footer={[<Button type = "primary" onClick={()=>this.handleCloseModal()}>确定</Button>]}
            >
                    <SelectBox changePermission={this.changePermission}/>
                </Modal>
        </div>
            
        )
    }
}
export default LicenseInfo;

