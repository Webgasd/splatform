import React from 'react'
import {Row,Col,Divider} from "antd";
import tubiao from "./image/pic1.png";
class InfoWindow extends React.Component{
    constructor(props){
        super(props)
        this.state={
        }
    }
    render() {
        return (
            <Row >
                <Row style={{backgroundColor:'rgba(0,139,139,0.9)',textAlign:'center',fontFamily:'fantasy',fontweight:'bolder',padding:'10px'}}>网格基本信息</Row>
                <Row style={{padding:'20px',fontFamily:'fantasy',fontweight:'600'}}>
                    <Row>
                        <Row>
                            <Col span={11} style={{backgroundColor:'rgba(204,204,204,0.9)',height:"210px"}}>
                                <div style={{margin:'10px',border:'1px solid #fff',height:'190px',width:'190px',textAlign:'center'}}>
                                    <img src={tubiao} width={'190px'} height={'190px'}  alt={''}/>
                                </div>
                            </Col>
                            <Col span={11} push={1}>
                                <Row span={20}style={{Height:"65px",paddingBottom:'5px'}}>
                                    <Col span={24} style={{backgroundColor:"rgba(242,242,242,0)",padding:"5px"}}>
                                        区域名称：解放路街道
                                    </Col></Row>
                                <Row span={20} style={{Height:"65px",paddingBottom:'5px'}}>
                                    <Col span={24} style={{backgroundColor:"rgba(242,242,242,0)",padding:"5px"}}>
                                        负责人：张三
                                    </Col></Row>
                                <Row span={20} style={{Height:"65px",paddingBottom:'5px'}}>
                                    <Col span={24} style={{backgroundColor:"rgba(242,242,242,0)",padding:"5px"}}>
                                        联系电话：<text style={{fontFamily:'Times New Roman'}}>123212313</text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{backgroundColor:"rgba(242,242,242,0)",paddingBottom:'10px',paddingTop:'10px'}}>
                            <Col style={{paddingLeft:'20px',paddingTop:'10px'}} span={6}>
                                <text style={{fontSize:"16px",fontWeight:'bold'}}>执法人员：</text>
                            </Col>
                            <Col span={1}>
                                <Divider type="vertical" style={{backgroundColor:'grey',height:"40px"}}/>
                            </Col>
                            <Col span={15}style={{marginLeft:'10px'}}>
                                张三，李四，王二麻
                            </Col>
                        </Row>
                        <Row style={{verticalAlign:'middle',marginTop:'10px',marginBottom:'10px',Color:'blue'}}>
                            <Col style={{color:'rgba(24,164,204,1)'}}>辖区企业总计（家）：<text style={{fontFamily:'Times New Roman'}}>123213</text></Col>
                        </Row>
                        <Divider style={{margin:'10px 0',backgroundColor:'#13bcef'}}/>
                        <Row>
                            <Col span={8} style={{color:'#669900'}}>餐饮服务：<text style={{fontFamily:'Times New Roman'}}>123</text></Col>
                            <Col span={8} style={{color:'#FF6600'}}>食品流通：<text style={{fontFamily:'Times New Roman'}} >123</text></Col>
                            <Col span={8} style={{color:'#006699'}}>食品生产：<text style={{fontFamily:'Times New Roman'}}>123</text></Col>
                            <Col span={8} style={{color:'#0099FF'}}>食品经营：<text style={{fontFamily:'Times New Roman'}}>123</text></Col>
                        </Row>
                    </Row>
                </Row>
            </Row>)
    }
}
export default InfoWindow