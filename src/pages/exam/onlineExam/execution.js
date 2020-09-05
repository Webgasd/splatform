import React, {Component} from 'react';

class execution extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const judgeList = this.props.judgeList;
        const singleList = this.props.singleList;
        const multipleList = this.props.multipleList;
        return (
            <div className='leftBody' style={{height: document.body.offsetHeight - 175, overflowY: "auto"}}>
                <div className='time'>考试已用时：<strong>{Math.floor(this.props.times / 60)}分钟</strong></div>
                <hr/>
                {judgeList.length ?
                    <div className='questionExecution'>
                        <div className='questionExecutionHeader'>判断题完成情况</div>
                        <div className='questionExecutionContent'>
                            {judgeList.map((item, index) => (
                                <div className={item.check ? 'questionFinish' : 'question'}
                                     key={index}>{index + 1}</div>
                            ))}
                            {/*<div className='question'>4</div>*/}
                        </div>
                    </div> : null}
                {singleList.length ?
                    <div className='questionExecution'>
                        <div className='questionExecutionHeader'>单选题完成情况</div>
                        <div className='questionExecutionContent'>
                            {singleList.map((item, index) => (
                                <div className={item.check ? 'questionFinish' : 'question'}
                                     key={index}>{index + 1}</div>
                            ))}
                            {/*<div className='question'>4</div>*/}
                        </div>
                    </div> : null}
                {multipleList.length ?
                    <div className='questionExecution'>
                        <div className='questionExecutionHeader'>多选题完成情况</div>
                        <div className='questionExecutionContent'>
                            {multipleList.map((item, index) => {
                                const check = item.check || [];
                                return <div className={check.length ? 'questionFinish' : 'question'}
                                            key={index}>{index + 1}</div>
                            })}
                        </div>
                    </div> : null}
                <div className='tips'>注意!</div>
                <hr/>
                <div className='tip1'>请仔细检查完成后，提交答案</div>
                <div className='tip2'>试卷提交后不可返回</div>
                <div className='submitAnswer' onClick={() => this.props.submitAnswer("confirm")}>提交答案</div>
            </div>
        )
    }
}

export default execution