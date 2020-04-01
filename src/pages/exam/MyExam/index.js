import React,{Component} from 'react';
import {Card,Table} from "antd";

export default class MyExam extends Component {
    render() {
        return (
            <div>
                <Card title='我的信息' style={{marginLeft:15,marginRight:15}}>
                    <div className='commonEnterpriseBox'>
                        <table>
                            <tbody>
                            <tr>
                                <td style={{background:'#F2F2F2',width:'10%'}}>姓名：</td>
                                <td style={{width:'15%'}}>阿萨大</td>
                                <td style={{background:'#F2F2F2',width:'10%'}}>身份证号：</td>
                                <td style={{width:'15%'}}>124125125215215</td>
                                <td style={{background:'#F2F2F2',width:'10%'}}>性别：</td>
                                <td style={{width:'15%'}}>男</td>
                                <td rowSpan={6}>
                                    <img src={'http://hbimg.b0.upaiyun.com/5fdcbcac29b6266359fac43b45d67b7d4e1ea37717d8e-ZemOxt_fw658'} style={{height:'230px'}} alt="avatar" />
                                </td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>联系电话：</td>
                                <td>12412421</td>
                                <td style={{background:'#F2F2F2'}}>行业类型：</td>
                                <td>124214</td>
                                <td style={{background:'#F2F2F2'}}>工作种类：</td>
                                <td>124124214</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>课时分值：</td>
                                <td>21</td>
                                <td style={{background:'#F2F2F2'}}>考试合格线：</td>
                                <td>12</td>
                                <td style={{background:'#F2F2F2'}}>考试情况：</td>
                                <td>21</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>考试名称:</td>
                                <td colSpan={5}>214124124</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>企业名称：</td>
                                <td>asfsafsa</td>
                                <td style={{background:'#F2F2F2'}}>社会信用代码：</td>
                                <td>12asfsa</td>
                                <td style={{background:'#F2F2F2'}}>许可类型：</td>
                                <td>21</td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>企业地址：</td>
                                <td colSpan={3}>asfsafsa</td>
                                <td style={{background:'#F2F2F2'}}>许可证号：</td>
                                <td>12asfsa</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>
                <Card title='考试回顾' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                    <Table>

                    </Table>
                </Card>
            </div>


        );
    }

}