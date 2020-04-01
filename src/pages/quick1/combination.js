import React,{Component} from 'react';
import {Col, Icon, Row} from "antd";

class Combination extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const list=this.props.office||[];
        return (
            <div className="combination">
                {list.map((item,index)=>(
                <Row style={{height:100,marginTop:15,marginLeft:10,width:600}}>
                    <tr>
                    <td><div className='labelContent' style={{marginLeft:16,width:110,color:"#479AD0",border:'1.5px solid #27527F',verticalAlign:'middle'}}>全局抽检总批次</div></td>
                    <td><div className='labelContent' style={{marginLeft:60,width:80,color:"#BF6B69",border:'1.5px solid #BF6B69',verticalAlign:'middle'}}>合格(批次)</div></td>
                    <td><div className='labelContent' style={{marginLeft:65,width:100,color:"#479AD0",border:'1.5px solid #27527F',verticalAlign:'middle'}}>不合格(批次)</div></td>
                    <td><div className='labelContent' style={{marginLeft:45,width:80,color:"#BF6B69",border:'1.5px solid #BF6B69',verticalAlign:'middle'}}>问题发现率</div></td>
                    </tr>
                    <Col span={3} style={{margin:5,marginLeft:20,marginRight:30,background:"#479AD0",height:"30px",width:100}}>
                        <div className="divfont" style={{fontSize:19,color:"white",fontWeight:1000,width:100,position:'center'}}>{item.total}</div>
                    </Col>
                    <Col span={3} style={{width:20}}>
                    <div style={{fontSize:22,color:"white",fontWeight:1000,marginLeft:-10}}>=</div>
                    </Col>
                    <Col span={3} style={{margin:5,marginRight:30,background:"#BF6B69",height:"30px",width:100}}>
                        <div className="divfont" style={{fontSize:19,color:"white",fontWeight:1000,width:100}}>{item.yes}</div>
                    </Col>
                    <Col span={3} style={{width:20}}>
                        <div style={{fontSize:22,color:"white",fontWeight:1000,marginLeft:-10}}>+</div>
                    </Col>
                    <Col span={3} style={{margin:5,marginRight:30,background:"#479AD0",height:"30px",width:100}}>
                        <div className="divfont" style={{fontSize:19,color:"white",fontWeight:1000,width:100}}>{item.no}</div>
                    </Col>
                    <Col span={3} style={{margin:5,marginRight:30,background:"#BF6B69",height:"30px",width:100}}>
                        <div className="divfont" style={{fontSize:19,color:"white",fontWeight:1000,width:100}}>{item.percent}</div>
                    </Col>
                </Row>
                ))}
            </div>
        )
    }
}

export default Combination