import React,{Component} from 'react';

class judge extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let questionInfo = this.props.questionInfo;
        return (
                <div className='questionContent'>
                    <div>{this.props.index+1}、{questionInfo.title}（{questionInfo.score}分）</div>
                    <hr/>
                    <div>
                        <div className={questionInfo.check&&questionInfo.check=='2'?'answerChoose':'UnAnswerChoose'} onClick={()=>{
                            questionInfo.check='2';
                            this.props.dispatchCheck(questionInfo);
                        }}>错误</div>
                        <div className={questionInfo.check&&questionInfo.check=='1'?'answerChoose':'UnAnswerChoose'}onClick={()=>{
                            questionInfo.check='1';
                            this.props.dispatchCheck(questionInfo);
                        }}>正确</div>
                        <div style={{clear:'both'}}></div>
                    </div>
                </div>
        )
    }
}

export default judge