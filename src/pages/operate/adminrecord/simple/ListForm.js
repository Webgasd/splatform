import React,{Component} from 'react';
import {connect} from 'react-redux'
import {changeInput} from "../../../../redux/action";
import {Button, Col, Input, Row, Select, Modal, Icon} from "antd";
import MaterForm from "./MaterForm";

const Option=Select.Option;
@connect(
    state=>({
        input:state.input
    }),
    {
        changeInput,
    }
)
class ListForm extends Component{
    state={}
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeInput(input);
    }
    changeList=(value,option,index)=>{
        let list = this.props.listType||[];
        list[index][option]=value;
        let input = {...this.props.input,list}
        this.props.changeInput(input);
    }
    plusList=()=>{
        let list = this.props.listType||[];
        list.push({});
        let input = {...this.props.input,list}
        this.props.changeInput(input);
    }
    cutList=()=>{
        let list = this.props.listType||[];
        list.pop();
        let input = {...this.props.input,list}
        this.props.changeInput(input);
    }
    render(){
        const type=this.props.type;
        let list = this.props.listType||[];
        return(
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th>序号</th>
                        <th>菜名</th>
                        <th>原料</th>
                        <th>留样状态</th>
                        <th>留样量</th>
                    </tr>
                    {list.map((item,index)=>(
                        <tr key={index}>
                            <td><Input value={item.seq} onChange={(e)=>this.changeList(e.target.value,"seq",index)} disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.name} onChange={(e)=>this.changeList(e.target.value,"name",index)} disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.material1} onClick={()=>this.setState({isVisible:true,materialName:'material1',Index:index})} disabled={type=='detail'?true:false} suffix={<Icon type="search" />}/></td>
                            <td>
                                <Select value={item.state} style={{width:60}} onChange={(value)=>this.changeList(value,"state",index)}>
                                    <Option value="是" disabled={type=='detail'?true:false}>是</Option>
                                    <Option value="否" disabled={type=='detail'?true:false}>否</Option>
                                </Select>
                            </td>
                            <td>
                                <Row>
                                    <Col span={18}><Input value={item.num} onChange={(e)=>this.changeList(e.target.value,"num",index)} disabled={type=='detail'?true:false}/></Col>
                                    <Col span={2}><div style={{margin:7}}>克</div></Col>
                                </Row>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div style={{marginTop:10}}>
                    <Button type="primary" onClick={this.plusList} icon='plus' disabled={type=='detail'?true:false}/>
                    <Button type="primary" style={{marginLeft:5}} onClick={this.cutList} icon='minus' disabled={type=='detail'?true:false}/>
                </div>
                <Modal
                    width='700px'
                    title="选择原料"
                    visible={this.state.isVisible}
                    destroyOnClose
                    footer={null}
                    okText={"确定"}
                    cancelText={"取消"}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false
                        })
                    }}
                >
                    <MaterForm dispatchMater={(data)=>{
                        this.setState({isVisible:false})
                        this.changeList(data,this.state.materialName,this.state.Index);}}/>
                </Modal>
            </div>
        )
    }
}
export default ListForm;
