import React,{Component} from 'react';
import echarts from "echarts/lib/echarts";
import {Col, Row} from "antd";
class foodType extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
  
    

    render() {
        return (
            <div>
               <div style={{width:500,margin:'auto',border:'1.5px solid #3CA6DA'}}>
                    <Row type="flex" >
                        {this.props.steplist.map((item,index)=>(
                            <Col>
                                <div className="textButton1" onClick={()=>{this.props.handleOperator('detail',item,index)}}>{this.props.steplist[index]}</div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        )
    }
}

export default foodType