import React,{Component} from 'react';
import './style.less'
import { Modal,Button } from 'antd';
import Tutorial from './tutorial';
import PdfView from './pdfView';
import axios from "../../../axios";
import {commonUrl} from "../../../axios/commonSrc";

class course extends Component{
    state={materialList:[],courseInfo:{}}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        let _this = this;
        axios.ajax({
            url:'/exam/trainCourse/getCaTrain',
            data:{
                params:{
                    courseId:_this.props.courseId,
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                _this.setState({
                    materialList:res.data.list,
                    courseInfo:res.data.course,
                })
            }
        })
    }

    showTutorial = (item) => {
        this.setState({
            isVideoTutorial: true,
            materialInfo:item
        });
    }
    showPdfView = (item) => {
        this.setState({
            isPdfView: true,
            materialInfo:item
        });
    }

    handleSubmit=()=>{
        axios.PostAjax({
            url:'/exam/trainCourse/submitCaTrain',
            data:{
                params:{list:this.state.materialList,courseId:this.props.courseId}
            }
        }).then((res)=>{
                this.requestList()
            }
        )
    }

    handleCompletion=(data)=>{
        let newList = [];
        newList = this.state.materialList.map((item)=>{
            if(item.id==data.id){
                return data;
            }else {
                return item;
            }
        })
        this.setState({
            materialList:newList
        })

    }

    reCallback = () => {
        alert('2')
        //再次请求后台数据
    }

    render() {
        const textList = this.state.materialList.filter((item)=>item.contentType===2);
        const videoList = this.state.materialList.filter((item)=>item.contentType===1);
        return (
            <div>
                <div className='courseHead'>
                    <div className='firstLine'>
                        <div className='left'>必修课程</div>
                        <div className='middle'>01 餐饮服务视频安全操作规范</div>
                        <div className='right'><Button size="small" style={{marginLeft:20,fontSize:10}} onClick={this.props.handleBack}>返回</Button></div>
                    </div>
                    <hr/>
                    <div className='secondLine'>
                        <div className='left'>文本类课程：{textList.map((item)=>(item.score)).reduce((preValue, curValue) =>
                            preValue + curValue,0)}课时</div>
                        <div className='middle'>视频类教程：{videoList.map((item)=>(item.score)).reduce((preValue, curValue) =>
                            preValue + curValue,0)}课时</div>
                        <div className='right'>已学习：{this.state.materialList.filter((item)=>item.completionRate===1).map((item)=>(item.score)).reduce((preValue, curValue) =>
                            preValue + curValue,0)}课时</div>
                    </div>
                </div>
                <div className='courseContent'>
                    <div className='textTutorial'>
                        <div style={{width:'100%'}}><div className='title'>文本类教程</div></div>
                        <div className='contentBox'>
                            {textList.map((item)=>(
                                <div className='textContent'>
                                    <div className='left' onClick={()=>this.showPdfView(item)}>
                                        <img style={{width:'100%',height:'100%'}} src={commonUrl+'/upload/picture/'+JSON.parse(item.picture)[0].response.data}/></div>
                                    <div className='right'>
                                        <div className='first'>{item.name}<div style={{float:'right'}}>(完成度:{item.completionRate*100||0}%)</div></div>
                                        <div className='second'>{item.remark}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='videoTutorial'>
                        <div style={{width:'100%',height:'100%'}}><div className='title'>视频类教程</div></div>
                        <div className='contentBox'>
                            {videoList.map((item)=>(
                                <div className='videoContent'>
                                    <div className='first' onClick={()=>this.showTutorial(item)}>
                                        <img style={{width:'100%',height:'100%'}} src={commonUrl+'/upload/picture/'+JSON.parse(item.picture)[0].response.data}/>
                                    </div>
                                    <hr/>
                                    <div className='second'>{item.name}<div style={{float:'right'}}>(完成度:{item.completionRate*100||0}%)</div></div>
                                    <div className='third'>{item.remark}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Modal footer={null}
                       width='800px'
                       title="视频教程"
                       visible={this.state.isVideoTutorial}
                       destroyOnClose
                       onCancel={()=>{
                           this.setState({
                               isVideoTutorial:false
                           })
                           this.handleSubmit();
                       }}
                >
                    <Tutorial materialInfo={this.state.materialInfo||{}} dispatchCompletion={(data)=>this.handleCompletion(data)}/>
                </Modal>
                <Modal footer={null}
                       width='800px'
                       title="文本教程"
                       visible={this.state.isPdfView}
                       destroyOnClose
                       onCancel={()=>{
                           this.setState({
                               isPdfView:false
                           })
                           this.handleSubmit();
                       }}
                >
                    <PdfView materialInfo={this.state.materialInfo||{}} dispatchCompletion={(data)=>this.handleCompletion(data)}/>
                </Modal>
            </div>
        )
    }
}

export default course