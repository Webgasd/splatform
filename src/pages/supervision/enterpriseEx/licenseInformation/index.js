import React,{Component} from 'react';
import { Row,Col, Button,Modal, Empty} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import FoodProduction from './FoodProduction';
import FoodBusiness from './FoodBusiness';
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
    

    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }

    getContent =()=>{
        
        if(!this.props.input.msgIndex){
            return;
        }
        // eslint-disable-next-line default-case
        switch (this.props.input.msgIndex) {
            case '食品经营':
                return <FoodBusiness type={this.props.type}/>
            case '食品生产':
                return <FoodProduction type={this.props.type}/>
        }
    }
    handleSelectBox=()=>{
        this.setState({
            modalVisible:true
        })
    }
    handleCloseModal=()=>{
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
                        {(formData.permissionList?formData.permissionList:[]).map((item,index)=>{

                            // eslint-disable-next-line default-case
                            switch (item) {
                                case '食品经营':
                                    return <Button>食品经营</Button>
                                case '食品生产':
                                    return <Button>食品生产</Button>
                            }

                        })}
                        <div style={{position:"absolute",bottom:20,left: "50%", transform: "translate(-50%, -50%)"}}>
   
                        <Button onClick={()=>{this.handleSelectBox()}} style={{backgroundColor:"RGB(255, 102, 0)",width:100}}>类型管理</Button> 
                        </div>
                            
                    
                        </div>
                    </Col>
                    <Col span={20}>  
                        <div className='commonEnterpriseBox' style={{marginTop:20}}>
                        <div className='permission-title-text'>许可信息</div>
                        {this.props.input.msgIndex?this.getContent():<Empty description={<span>点击类型管理添加许可信息</span>}/>}
                        
                    
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
                    width={640}
                    onCancel={()=>{
                        this.setState({
                            modalVisible:false,
                        })
                    }}
            >
                    <SelectBox/>
                </Modal>
        </div>
            
        )
    }
}
export default LicenseInfo;

