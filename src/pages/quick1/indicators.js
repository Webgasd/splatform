import React, {Component} from 'react';
import {Col, Icon, Row} from "antd";

class indicators extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const list = this.props.office || [];
        return (
            <div className='indicators'>
                {list.map((item, index) => (
                    <Row key={index}
                         style={{height: 100, marginTop: 15, marginRight: 'auto', marginLeft: 'auto', width: 500}}>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <div className='labelContent' style={{
                                        marginLeft: 10,
                                        textAlign: 'center',
                                        width: 100,
                                        fontSize: 10,
                                        color: "#479AD0",
                                        border: '1.5px solid #27527F',
                                        verticalAlign: 'middle'
                                    }}>全局抽检总批次
                                    </div>
                                </td>
                                <td>
                                    <div className='labelContent' style={{
                                        marginLeft: 50,
                                        textAlign: 'center',
                                        width: 90,
                                        fontSize: 10,
                                        color: "#BF6B69",
                                        border: '1.5px solid #BF6B69',
                                        verticalAlign: 'middle'
                                    }}>合格(批次)
                                    </div>
                                </td>
                                <td>
                                    <div className='labelContent' style={{
                                        marginLeft: 40,
                                        textAlign: 'center',
                                        width: 90,
                                        fontSize: 10,
                                        color: "#479AD0",
                                        border: '1.5px solid #27527F',
                                        verticalAlign: 'middle'
                                    }}>不合格(批次)
                                    </div>
                                </td>
                                <td>
                                    <div className='labelContent' style={{
                                        marginLeft: 25,
                                        textAlign: 'center',
                                        width: 90,
                                        fontSize: 10,
                                        color: "#BF6B69",
                                        border: '1.5px solid #BF6B69',
                                        verticalAlign: 'middle'
                                    }}>问题发现率
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <Col span={4} style={{
                            margin: 5,
                            marginLeft: 10,
                            marginRight: 30,
                            background: "#479AD0",
                            height: "30px",
                            width: 100
                        }}>
                            <div className="divfont" style={{
                                fontSize: 19,
                                color: "white",
                                fontWeight: 1000,
                                width: 100,
                                position: 'center'
                            }}>{item.total}</div>
                        </Col>
                        <Col span={3} style={{width: 15}}>
                            <div style={{
                                fontSize: 22,
                                color: "white",
                                fontWeight: 1000,
                                marginLeft: -20,
                                marginRight: -10
                            }}>=
                            </div>
                        </Col>
                        <Col span={4}
                             style={{margin: 5, marginRight: 30, background: "#BF6B69", height: "30px", width: 90}}>
                            <div className="divfont"
                                 style={{fontSize: 19, color: "white", fontWeight: 1000, width: 90}}>{item.yes}</div>
                        </Col>
                        <Col span={3} style={{width: 10}}>
                            <div style={{fontSize: 22, color: "white", fontWeight: 1000, marginLeft: -20}}>+</div>
                        </Col>
                        <Col span={4} style={{
                            margin: 5,
                            marginLeft: 0,
                            marginRight: 0,
                            background: "#479AD0",
                            height: "30px",
                            width: 90
                        }}>
                            <div className="divfont"
                                 style={{fontSize: 19, color: "white", fontWeight: 1000, width: 90}}>{item.no}</div>
                        </Col>
                        <Col span={4} style={{
                            margin: 5,
                            marginLeft: 25,
                            marginRight: 0,
                            background: "#BF6B69",
                            height: "30px",
                            width: 90
                        }}>
                            <div className="divfont" style={{
                                fontSize: 19,
                                color: "white",
                                fontWeight: 1000,
                                width: 90
                            }}>{item.percent}</div>
                        </Col>
                    </Row>
                ))}
            </div>
        )
    }
}

export default indicators