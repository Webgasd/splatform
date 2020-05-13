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

    state={
        modalVisible:false
    }

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
            return;
        }
        // eslint-disable-next-line default-case
        switch (this.state.msgIndex) {
            case '食品经营':
                return <FoodBusiness type={this.props.type} index={this.state.index}/>
            case '食品生产':
                return <FoodProduction type={this.props.type} index={this.state.index}/>
            case '药品经营':
                return <DrugBusiness type={this.props.type} index={this.state.index}/>
            case '药品生产':
                return <DrugProduction type={this.props.type} index={this.state.index}/>
            case '医疗器械经营':
                return <MedicalDeviceBusiness type={this.props.type} index={this.state.index}/>
            case '医疗器械生产':
                return <MedicalDeviceProduction type={this.props.type} index={this.state.index}/>
            case '化妆品生产':
                return <CosmeticsProduction type={this.props.type} index={this.state.index}/>
            case '小餐饮服务':
                return <SmallRestaurant type={this.props.type} index={this.state.index}/>
            case '小作坊':
                return <SmallWorkshop type={this.props.type} index={this.state.index}/>
            case '工业产品生产':
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

        if(data.foodBusinessList.length !== 0){
            permissionList.push("foodBusiness")
        }
        if(data.smallCaterList.length !== 0){
            permissionList.push("smallCater")
        }
        if(data.smallWorkshopList.length !== 0){
            permissionList.push("smallWorkshop")
        }
        if(data.foodProduceList.length !== 0){
            permissionList.push("foodProduce")
        }
        if(data.drugsBusinessList.length !== 0){
            permissionList.push("drugsBusiness")
        }
        if(data.drugsProduceList.length !== 0){
            permissionList.push("drugsProduce")
        }
        if(data.cosmeticsList.length !== 0){
            permissionList.push("cosmetics")
        }
        if(data.medicalProduceList.length !== 0){
            permissionList.push("medicalProduce")
        }
        if(data.medicalBusinessList.length !== 0){
            permissionList.push("medicalBusiness")
        }
        if(data.industrialProductsList.length !== 0){
            permissionList.push("industrialProducts")
        }

        let permissionFamily = permissionList.join(',')
        let input = {...this.props.input,permissionFamily}
        this.props.changeEnterprise(input)
        this.setState({
            modalVisible:false
        })

    }
    
    render() {
        const formData=this.props.input||{};
        const checkStatus = this.props.type ==='detail'?true:false;

        return (
            <div>
                <Row>
                    <Col span={4}>
                        <div  className='commonEnterpriseBox' style={{marginTop:20,height:560}}>
                            <div className='permission-title-text'>许可证类型</div>
                        
                            {(formData.foodBusinessList?formData.foodBusinessList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"食品经营")}}>{"食品经营"+(index>0?index+1:'')}</Button>))}

                            {(formData.smallCaterList?formData.smallCaterList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"小餐饮服务")}}>{"小餐饮服务"+(index>0?index+1:'')}</Button>))}

                            {(formData.smallWorkshopList?formData.smallWorkshopList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"小作坊")}}>{"小作坊"+(index>0?index+1:'')}</Button>))}

                            {(formData.foodProduceList?formData.foodProduceList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"食品生产")}}>{"食品生产"+(index>0?index+1:'')}</Button>))}

                            {(formData.drugsBusinessList?formData.drugsBusinessList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"药品经营")}}>{"药品经营"+(index>0?index+1:'')}</Button>))}
                            
                            {(formData.drugsProduceList?formData.drugsProduceList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"药品生产")}}>{"药品生产"+(index>0?index+1:'')}</Button>))}
                            
                            {(formData.cosmeticsList?formData.cosmeticsList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"化妆品生产")}}>{"化妆品生产"+(index>0?index+1:'')}</Button>))}
                            
                            {(formData.medicalProduceList?formData.medicalProduceList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"医疗器械生产")}}>{"医疗器械生产"+(index>0?index+1:'')}</Button>))}
                            
                            {(formData.medicalBusinessList?formData.medicalBusinessList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"医疗器械经营")}}>{"医疗器械经营"+(index>0?index+1:'')}</Button>))}
                            
                            {(formData.industrialProductsList?formData.industrialProductsList:[]).map((item,index)=>(  
                            <Button style={{width:'100%',marginTop:6,backgroundColor:'RGB(246, 246, 246)',color:'RGB(0,51,153)'}} onClick={()=>{this.changePermission(index,"工业产品生产")}}>{"工业产品生产"+(index>0?index+1:'')}</Button>))}

                            <div style={{position:"absolute",bottom:20,left: "50%", transform: "translate(-50%, -50%)"}}>
                            <Button onClick={()=>{this.handleSelectBox()}} style={{backgroundColor:"RGB(255, 102, 0)",width:100,color:'white'}} disabled={checkStatus}>类型管理</Button> 
                            </div>
                            
                    
                        </div>
                    </Col>
                    <Col span={20}>  
                        <div className='commonEnterpriseBox' style={{marginTop:20}}>
                            <div className='permission-title-text'>许可信息</div>
                            {this.state.msgIndex?this.getContent():<Empty style={{height:528}} description={<span>点击类型管理添加许可信息</span>}/>}
                        </div>
                    </Col>
                </Row>
                <Modal
                    visible={this.state.modalVisible}
                    destroyOnClose
                    title="选择许可证类型"
                    onOk={this.handleCloseModal}
                    okText="确定"
                    cancelText="取消"
                    maskClosable={false}
                    closable={false}
                    width={640}
                    onCancel={this.handleCloseModal}
            >
                    <SelectBox changePermission={this.changePermission}/>
                </Modal>
        </div>
            
        )
    }
}
export default LicenseInfo;

