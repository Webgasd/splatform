import React, {Component} from 'react';
import {Modal} from 'antd';
import Execution from './execution';
import Judge from './judge';
import Single from './single';
import Multiple from './multiple';
import axios from "../../../axios";

const {confirm} = Modal;

class onlineExam extends Component {
    state = {
        topicList: [],
        subjectInfo: {},
        times: 0
    };

    componentDidMount() {
        this.requestList();
        this.interval = setInterval(
            () => {
                this.setState({times: this.state.times + 1})
            },
            1000
        );
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    requestList = () => {
        let _this = this;
        axios.ajax({
            url: '/exam/examType/getCaTopicList',
            data: {
                params: {
                    examId: _this.props.examId,
                    subjectId: _this.props.subjectId
                }
            }
        }).then((res) => {
            if (res.status == "success") {
                _this.setState({
                    topicList: res.data.list,
                    subjectInfo: res.data.subject
                })
            }
        })
    };

    handleList = (data) => {
        let newList = [];
        newList = this.state.topicList.map((item) => {
            if (item.id == data.id) {
                return data;
            } else {
                return item;
            }
        });
        this.setState({
            topicList: newList
        })
    };

    submitAnswer = () => {
        if (this.state.topicList.filter((item) => item.check === null).length > 0) {
            alert("题目未完成");
        } else {
            axios.PostAjax({
                url: '/exam/examType/submitCaTopic',
                data: {
                    params: {
                        examId: this.props.examId,
                        subjectInfo: this.state.subjectInfo,
                        list: this.state.topicList
                    }
                }
            }).then((res) => {
                    this.requestList();
                    this.props.changeStatus();
                }
            )
        }
    }

    render() {
        const judgeList = this.state.topicList.filter((item) => item.type === 1);
        const singleList = this.state.topicList.filter((item) => item.type === 2);
        const multipleList = this.state.topicList.filter((item) => item.type === 3);
        return (
            <div className='onlineExam'>
                <Execution times={this.state.times} judgeList={judgeList || []} singleList={singleList || []}
                           multipleList={multipleList || []} submitAnswer={() => this.submitAnswer()}/>
                <div className='rightBody'>
                    <div className='examHeader'>
                        <div className='header1'>2019年度餐饮食品安全类在线考试</div>
                        <hr/>
                        <div className='header2'>考试时间：{this.state.subjectInfo.examTime || 0}分钟</div>
                        <div className='header2'>考试分值：{this.state.subjectInfo.totalScore || 0}分</div>
                        <div className='header2'>考试合格线：{this.state.subjectInfo.qualifiedScore || 0}分</div>
                    </div>
                    {judgeList.length ?
                        <div className='examContent'>
                            <div className='questionType'>判断题</div>
                            {judgeList.map((item, index) => (
                                <Judge key={index} questionInfo={item} index={index}
                                       dispatchCheck={(data) => this.handleList(data)}/>
                            ))}
                        </div> : null}
                    {singleList.length ?
                        <div className='examContent'>
                            <div className='questionType'>单选题</div>
                            {singleList.map((item, index) => (
                                <Single key={index} questionInfo={item} index={index}
                                        dispatchCheck={(data) => this.handleList(data)}/>
                            ))}
                        </div> : null}
                    {multipleList.length ?
                        <div className='examContent'>
                            <div className='questionType'>多选题</div>
                            {multipleList.map((item, index) => (
                                <Multiple key={index} questionInfo={item} check={item.check || ''} index={index}
                                          dispatchCheck={(data) => this.handleList(data)}/>
                            ))}
                        </div> : null}
                </div>
            </div>
        )
    }
}

export default onlineExam