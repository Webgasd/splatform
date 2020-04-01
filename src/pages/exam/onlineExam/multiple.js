import React,{Component} from 'react';

class multiple extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleDispatch=(data)=>{
           let check = this.props.check.split(',');
           let questionInfo = this.props.questionInfo;
           if(check.indexOf(data)!==-1){
               check.splice(check.indexOf(data),1)
           }else {
               check.push(data);
           }
           questionInfo.check=check.join(',');
           this.props.dispatchCheck(questionInfo);
    }

    render() {
        const questionInfo = this.props.questionInfo;
        const check = this.props.check;
        return (
            <div className='questionContent'>
                <div>{this.props.index+1}、{questionInfo.title}（{questionInfo.score}分）</div>
                <hr/>
                <div>A、{questionInfo.optionA}</div>
                <div>B、{questionInfo.optionB}</div>
                <div>C、{questionInfo.optionC}</div>
                <div>D、{questionInfo.optionD}</div>
                <div>
                    <div className={check.indexOf('4')===-1?'UnAnswerChoose':'answerChoose'} onClick={()=>this.handleDispatch('4')}>D</div>
                    <div className={check.indexOf('3')===-1?'UnAnswerChoose':'answerChoose'} onClick={()=>this.handleDispatch('3')}>C</div>
                    <div className={check.indexOf('2')===-1?'UnAnswerChoose':'answerChoose'} onClick={()=>this.handleDispatch('2')}>B</div>
                    <div className={check.indexOf('1')===-1?'UnAnswerChoose':'answerChoose'} onClick={()=>this.handleDispatch('1')}>A</div>
                    <div style={{clear:'both'}}></div>
                </div>
            </div>
        )
    }
}

export default multiple