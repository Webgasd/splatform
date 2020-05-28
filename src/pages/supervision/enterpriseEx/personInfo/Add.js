import React,{Component} from 'react';
import Person from './Person';
import Check from './Check';
import Record from './Record';


export default class AddForm extends Component{
    state = {
        msgIndex:0,
    };
    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }

    render(){
        return (
            <div style={{height:380,overflowY:'auto'}}>
                <div className='msgIndexBox'>
                    <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>1.人员信息</div>
                    <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>2.调离记录信息</div>
                    <div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>3.晨检记录信息</div>

                </div>
                {this.state.msgIndex ===0?<Person  workTypeList={this.props.workTypeList} />:
                    (this.state.msgIndex ===1?<Record />:<Check />)}
            </div>
        );
    }
}
