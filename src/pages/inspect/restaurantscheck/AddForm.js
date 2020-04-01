import React,{Component} from 'react';
import BookForm from './BookForm';
import CheckForm from './CheckForm';
import PointForm from './PointForm';
import ResultForm from './ResultForm';
import Collection from './Collection';


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
        const BaseForm = <div><CheckForm inspectData={this.props.inspectData} dispatchInspectData={this.props.dispatchInspectData} type={this.props.type}/>
            <PointForm inspectData={this.props.inspectData} dispatchInspectData={this.props.dispatchInspectData} type={this.props.type}/>
            <ResultForm inspectData={this.props.inspectData} dispatchInspectData={this.props.dispatchInspectData} type={this.props.type}/></div>;
        return (
            <div>
                    <div className='msgIndexBox'>
                        <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>1.基本信息</div>
                        <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>2.文书处理</div>
                        <div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>3.现场取证</div>
                    </div>
                <div style={{height:600,overflow:'auto'}}>
                    {this.state.msgIndex ===0?BaseForm:(this.state.msgIndex===1?
                        <BookForm inspectData={this.props.inspectData} dispatchInspectData={this.props.dispatchInspectData} type={this.props.type}/>:
                        <Collection inspectData={this.props.inspectData} dispatchInspectData={this.props.dispatchInspectData} type={this.props.type}/>)}
                </div>
            </div>
        );
    }
}
