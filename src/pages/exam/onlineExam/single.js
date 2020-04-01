import React,{Component} from 'react';

class single extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const questionInfo = this.props.questionInfo;
        return (
            <div className='questionContent'>
                <div>{this.props.index+1}、{questionInfo.title}（{questionInfo.score}分）</div>
                <hr/>
                <div>A、{questionInfo.optionA}</div>
                <div>B、{questionInfo.optionB}</div>
                <div>C、{questionInfo.optionC}</div>
                <div>D、{questionInfo.optionD}</div>
                <div>
                    <div className={questionInfo.check&&questionInfo.check=='4'?'answerChoose':'UnAnswerChoose'}onClick={()=>{
                        questionInfo.check='4';
                        this.props.dispatchCheck(questionInfo);
                    }}>D</div>
                    <div className={questionInfo.check&&questionInfo.check=='3'?'answerChoose':'UnAnswerChoose'}onClick={()=>{
                        questionInfo.check='3';
                        this.props.dispatchCheck(questionInfo);
                    }}>C</div>
                    <div className={questionInfo.check&&questionInfo.check=='2'?'answerChoose':'UnAnswerChoose'}onClick={()=>{
                        questionInfo.check='2';
                        this.props.dispatchCheck(questionInfo);
                    }}>B</div>
                    <div className={questionInfo.check&&questionInfo.check=='1'?'answerChoose':'UnAnswerChoose'}onClick={()=>{
                        questionInfo.check='1';
                        this.props.dispatchCheck(questionInfo);
                    }}>A</div>
                    <div style={{clear:'both'}}></div>
                </div>
            </div>
        )
    }
}

export default single