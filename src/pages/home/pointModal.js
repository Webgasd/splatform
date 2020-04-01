import React from 'react';
import {Col, Modal, Row} from 'antd'
class pointModal extends React.Component{
    constructor(props){
        super(props)
    }
    state={
        LicenseVisiable:false,
        BaseInfoVisiable:false,
        CorporationVisiable:false,
        CheckVisiable:false
    }
    render() {
        const data=this.props.data;
        const modal1=(<Modal
            title="许可信息"
            visible={this.state.LicenseVisiable}
            onOk={()=>this.setState({LicenseVisiable:false})}
            onCancel={()=>this.setState({LicenseVisiable:false})}
            footer={false}
            mask={false}
            // centered={true}
        >
            <p>许可信息</p>
        </Modal>);
        const modal2=(<Modal
            title="基本信息"
            visible={this.state.BaseInfoVisiable}
            onOk={()=>this.setState({BaseInfoVisiable:false})}
            onCancel={()=>this.setState({BaseInfoVisiable:false})}
            footer={false}
            mask={false}
        >
            <p>基本信息</p>
        </Modal>);
        const modal3=(<Modal
            title="法人信息"
            visible={this.state.CorporationVisiable}
            onOk={()=>this.setState({CorporationVisiable:false})}
            onCancel={()=>this.setState({CorporationVisiable:false})}
            footer={false}
            mask={false}
        >
            <p>法人信息</p>
        </Modal>);
        const modal4=(<Modal
            title="检查信息"
            visible={this.state.CheckVisiable}
            onOk={()=>this.setState({CheckVisiable:false})}
            onCancel={()=>this.setState({CheckVisiable:false})}
            footer={false}
            mask={false}
        >
            <p>检查信息</p>
        </Modal>);
        return (
        <Row>
            <Row><Col>企业名称：{data.enterpriseName}</Col></Row>
            <Row><Col>店名：{data.shopName}</Col></Row>
            <Row><Col>企业法人：{data.legalPerson}</Col></Row>
            <Row><Col>联系电话：{data.cantacts}</Col></Row>
            <Row><Col>办公地址：{data.businessAddress}</Col></Row>
            <Row>
                <Col span={6}><a onClick={()=>this.setState({LicenseVisiable:true})}>许可信息:</a></Col>
                <Col span={6}><a onClick={()=>this.setState({BaseInfoVisiable:true})}>基本信息</a></Col>
                <Col span={6}><a onClick={()=>this.setState({CorporationVisiable:true})}>法人信息</a></Col>
                <Col span={6}><a onClick={()=>this.setState({BaseInfoVisiable:true})}>检查信息</a></Col>
            </Row>
            {modal1}{modal2}{modal3}{modal4}
        </Row>
        );
    }
}
export default pointModal