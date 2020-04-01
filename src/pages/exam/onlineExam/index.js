import React, {Component} from 'react';
import {List} from 'antd';
import './style.less';
import '../style.less'
import axios from "../../../axios";
import Utils from "../../../utils";
import OnlineExam from './exam';
import MyExam from './myExam';

export default class Exam extends Component {
    state = {examList: [], pageStatus: 0}

    componentDidMount() {
        this.requestList();
    }

    requestList = () => {
        axios.ajax({
            url: '/exam/examType/getCaExamList',
            data: {
                params: {}
            }
        }).then((res) => {
            if (res.status == "success") {
                this.setState({
                    examList: res.data,
                })
            }
        })
    }
    handleExam = (examId, subjectId, remark) => {
        if (remark == '点击进入考试') {
            this.setState({
                examId: examId,
                subjectId: subjectId,
                pageStatus: 1
            })
        }
        if (remark == '已完成考试') {
            this.setState({
                examId: examId,
                subjectId: subjectId,
                pageStatus: 2
            })
        }
    }

    render() {
        const {pageStatus} = this.state;
        return (
            <div>
                {pageStatus === 0 ?
                    <div className='train-exam-index'>
                        <div className='exam-course-list'>
                            <aside className="menu l">
                                <ul>
                                    <li>
                                        <h2>2019年度<br/>当前您考试情况：</h2>
                                        <p className="progress">未开始</p>
                                    </li>
                                    <li>
                                        <p>恭喜!<br/>
                                            您已到达40课时<br/>
                                            可以进行从业人员考试<br/>
                                            <br/>
                                            预祝您考试顺利

                                        </p>
                                    </li>
                                </ul>
                            </aside>
                            <main className="main">
                                <ul>
                                    {(this.state.examList || []).map((item, index) =>
                                        <li key={index}>
                                            <div className="imgz l">
                                                <img src="#" alt=""/>
                                                <span>暂无封图</span>
                                                {/*<img src="../images/e3.png " alt="" srcSet="" style="width:70px;height:80px;position: relative;left: 10px;top:-10px;"/>*/}
                                            </div>


                                            <div className="center l">
                                                <h2 className="classname " style={item.remark == "点击进入考试" ? {
                                                    border: "1px solid #289BCA",
                                                    background: "#289BCA"
                                                } : {background: "#404040"}}>
                                                    考试名称：{item.name}
                                                    <input type="submit" value={item.remark} className="btn r"
                                                           onClick={() => this.handleExam(item.id, item.subjectId, item.remark)}/>
                                                </h2>
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <td>考试时间：{item.examTime}分钟</td>
                                                        <td>考试分值：{item.totalScore}分</td>
                                                        <td>考试合格线：{item.qualifiedScore}分</td>
                                                        <td className="active">从业人员资格证号:</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={3}>考试日期:&nbsp;&nbsp;&nbsp;&nbsp;
                                                            {Utils.formatDateNoTime(item.startTime) + " 至 " + Utils.formatDateNoTime(item.endTime)}</td>
                                                        <td className="active2"></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="right r">
                                                <span className="rl">考试情况</span>
                                                <span className="rr">未开始</span>

                                            </div>
                                        </li>
                                    )}

                                    {/*<li>*/}
                                    {/*<div className="imgz l">*/}
                                    {/*<img src="#" alt=""/>*/}
                                    {/*<span>暂无封图</span>*/}
                                    {/*</div>*/}
                                    {/*<div className="center l">*/}
                                    {/*<h2 className="classname " style={{background: "#404040"}}>*/}
                                    {/*课程名:2018年流通食品安全操作规范考试*/}
                                    {/*<input type="submit" value="已过期" className="btn r"/></h2>*/}

                                    {/*<table>*/}
                                    {/*<tr>*/}
                                    {/*<td>考试时间：30分钟</td>*/}
                                    {/*<td>考试分值：500分</td>*/}
                                    {/*<td>考试合格线：60分</td>*/}
                                    {/*<td className="active">从业人员资格证号:</td>*/}
                                    {/*</tr>*/}
                                    {/*<tr>*/}
                                    {/*<td>考试用时：20分钟</td>*/}
                                    {/*<td>考试日期：2018-08-09</td>*/}
                                    {/*<td>&nbsp;&nbsp;&nbsp;&nbsp;考试分值：55分</td>*/}
                                    {/*<td className="active2"></td>*/}
                                    {/*</tr>*/}

                                    {/*</table>*/}


                                    {/*</div>*/}
                                    {/*<div className="right r" style={{background: "#FF990C",border: "1px solid #FF990C"}}>*/}
                                    {/*<span className="rl" style={{background: "#FF990C"}}>考试情况</span>*/}
                                    {/*<span className="rr" style={{background: "#FFBF72",color: "#FA6612"}}>不合格</span>*/}

                                    {/*</div>*/}
                                    {/*</li>*/}
                                    {/*<li>*/}
                                    {/*<div className="imgz l">*/}
                                    {/*<img src="#" alt=""/>*/}
                                    {/*<span>暂无封图</span>*/}
                                    {/*</div>*/}

                                    {/*<div className="center l">*/}
                                    {/*<h2 className="classname " style={{background: "#404040"}}>课程名称：2017年餐饮服务食品安全考试*/}
                                    {/*<input type="submit" value="已过期" className="btn r"/></h2>*/}

                                    {/*<table>*/}


                                    {/*<tr>*/}
                                    {/*<td>考试时间：30分钟</td>*/}
                                    {/*<td>考试分值：500分</td>*/}
                                    {/*<td>考试合格线：60分</td>*/}
                                    {/*<td className="active">从业人员资格证号:</td>*/}
                                    {/*</tr>*/}
                                    {/*<tr>*/}
                                    {/*<td>考试用时：</td>*/}
                                    {/*<td>考试日期：2017-08-09</td>*/}
                                    {/*<td>&nbsp;&nbsp;&nbsp;&nbsp;考试分值：</td>*/}
                                    {/*<td className="active2">*/}
                                    {/*<span className="elect-number">LX2017000001</span></td>*/}
                                    {/*</tr>*/}
                                    {/*</table>*/}
                                    {/*</div>*/}
                                    {/*<div className="right r" style={{background:"#9BCD16" ,border: "1px solid #9BCD16"}}>*/}
                                    {/*<span className="rl" style={{background:"#9BCD16"}}>考试情况</span>*/}
                                    {/*<span className="rr" style={{background:"#BFDF76"}}>合格</span>*/}
                                    {/*</div>*/}
                                    {/*</li>*/}
                                </ul>
                            </main>
                            {/*<div className='examIndexContent'>*/}
                            {/*<div className='examIndexList'>*/}
                            {/*<List*/}
                            {/*itemLayout="horizontal"*/}
                            {/*dataSource={this.state.examList}*/}
                            {/*renderItem={item => (*/}
                            {/*<List.Item>*/}
                            {/*<List.Item.Meta*/}
                            {/*title={<a onClick={()=>this.handleExam(item.id,item.subjectId,item.remark)}>{item.name}</a>}*/}
                            {/*description={"测试时间："+Utils.formatDate(item.startTime)+'--'+Utils.formatDate(item.endTime)+"--->"+item.remark}*/}
                            {/*/>*/}
                            {/*</List.Item>*/}
                            {/*)}*/}
                            {/*/>*/}
                            {/*</div>*/}
                            {/*</div>*/}
                        </div>
                    </div> : pageStatus === 1 ?
                        <OnlineExam examId={this.state.examId} changeStatus={() => this.setState({pageStatus: 2})}
                                    subjectId={this.state.subjectId}/> :
                        <MyExam examId={this.state.examId} subjectId={this.state.subjectId}/>}
            </div>
        );
    }
}