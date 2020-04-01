import React,{Component} from 'react';
import { List } from 'antd';
import '../style.less';
import './style.less';
import axios from "../../../axios";
import Train from './train';
import { commonUrl } from './../../../axios/commonSrc';
export default class Exam extends Component{
    state={trainList:[],pageStatus:0}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/exam/trainCourse/getCaTrainList',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    trainList:res.data,
                })
            }
        })
    }
    handleExam=(courseId)=>{
            this.setState({
                courseId:courseId,
                pageStatus:1
            })
    }
    handleBack=()=>{
        this.setState({
            pageStatus:0
        })
    }
    render() {
        const {pageStatus} = this.state;
        return(
            <div>
            {pageStatus===0?
          <div className='train-exam-index'>
            <div className='train-course-list'>
                <aside className="menu l">
                    <ul>
                        <li>
                            <h2>本年度<br/>当前您已学习课时：</h2>
                            <p className="progress">00</p>
                            <span className="time">课时</span>
                        </li>
                        <li>
                            <p>温馨提示：<br/>
              <span className="tips"> 学习课程达到<span className="arrive">40</span>课时后<br/>
              才可以进入本年度<br/>从业人员考试</span>
                            </p>
                        </li>
                    </ul>
                </aside>
                <main className="main">
                    <ul>
                        {(this.state.trainList||[]).map((item)=>
                            <li>
                                <div className="imgz l">
                                    {item.picture?<img src={commonUrl+'/upload/picture/'+((JSON.parse(item.picture||JSON.stringify([]))[0])||{}.response||{}).data} alt=""/>:<span>暂无封图</span>}
                                </div>
                                <div className="center l">
                                    <h2 className="classname">
                                        <span className="left-tips" style={item.caScore>0?(item.caScore==(item.bookCourseScore+item.videoCourseScore)?{background:"#239200",border:"1px #239200 solid"}:{background:"#FF5F03"}):null}>{item.caScore>0?(item.caScore==(item.bookCourseScore+item.videoCourseScore)?"已完成":"未完成"):"未开始"}</span>
                                        课程名称：{item.name}
                                        <input type="submit" onClick={()=>this.handleExam(item.id)} value="开始学习" className="btn r"/>
                                    </h2>
                                    <table>
                                        <tr>
                                            <td>文本类教材：{item.materialNumber-item.videoMaterialNumber}本</td>
                                            <td>共计课时：{item.bookCourseScore}课时</td>
                                            <td rowSpan="2">
                                                <div className="total-course">本课程总计课时值：
                                                    <b className="total-course-number">{item.bookCourseScore+item.videoCourseScore}课时</b>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>视频类教材：{item.videoMaterialNumber}本</td>
                                            <td>共计课时:{item.videoCourseScore}课时</td>
                                            <td></td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="right r" style={item.caScore>0?(item.caScore==(item.bookCourseScore+item.videoCourseScore)?{background:"#9ACC98",border: "1px solid #9ACC98"}:{background:"#32CDFF",border: "1px solid #32CDFF"}):null}>
                                    <span className="rl" style={item.caScore>0?(item.caScore==(item.bookCourseScore+item.videoCourseScore)?{background:"#9ACC98"}:{background:"#32CDFF"}):null}>本课程<br/>已学课时</span>
                                    <span className="rr" style={item.caScore>0?(item.caScore==(item.bookCourseScore+item.videoCourseScore)?{background:"#BFDFBF"}:{background:"#8BDFFF"}):null}>{item.caScore}</span>
                                </div>
                            </li>
                        )}
                    </ul>
                </main>


                    {/*<div className='examIndexContent'>*/}
                        {/*<div className='examIndexList'>*/}
                            {/*<List*/}
                                {/*itemLayout="horizontal"*/}
                                {/*dataSource={this.state.trainList}*/}
                                {/*renderItem={item => (*/}
                                    {/*<List.Item extra={<img*/}
                                    {/*height={100}*/}
                                    {/*src={commonUrl+'/upload/picture/'+((JSON.parse(item.picture||JSON.stringify([]))[0])||{}.response||{}).data}/>}>*/}
                                        {/*<List.Item.Meta*/}
                                            {/*title={<a onClick={()=>this.handleExam(item.id)}>{item.name}</a>}*/}
                                            {/*description={'工作种类：'+item.worktype+'    备注：'+item.remark}*/}
                                        {/*/>*/}
                                    {/*</List.Item>*/}
                                {/*)}*/}
                            {/*/>*/}
                        {/*</div>*/}
                    {/*</div>*/}
            </div></div>:<Train handleBack={this.handleBack} courseId={this.state.courseId}/>}</div>
        );
    }
}