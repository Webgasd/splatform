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
        list.push({
            state:"否",
            num:"150",
            picture:''
        });
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
                        <th>菜品类型</th>
                        <th>菜名</th>
                        <th>原料</th>
                        <th>留样状态</th>
                        <th>留样量</th>
                    </tr>
                    {list.map((item,index)=>(
                        <tr key={index}>
                            <td><Select value={item.type} style={{width:120}} onChange={(value)=>this.changeList(value,"type",index)}>
                                <Option value={1} disabled={type=='detail'?true:false}>主食</Option>
                                <Option value={2} disabled={type=='detail'?true:false}>热菜</Option>
                                <Option value={3} disabled={type=='detail'?true:false}>凉菜</Option>
                                <Option value={4} disabled={type=='detail'?true:false}>汤/奶</Option>
                                <Option value={5} disabled={type=='detail'?true:false}>水果</Option>
                            </Select></td>
                            <td><Input value={item.name} onChange={(e)=>this.changeList(e.target.value,"name",index)} disabled={type=='detail'?true:false}/></td>
                            <td><Input value={item.material1} onClick={()=>this.setState({isVisible:true,materialName:'material1',Index:index})} onChange={(e)=>this.changeList(e.target.value,"material1",index)} disabled={type=='detail'?true:false} suffix={<Icon type="search" />}/></td>
                            <td>
                                <Select value={item.state}  style={{width:60}} onChange={(value)=>this.changeList(value,"state",index)}>
                                    <Option key="0" value="是" disabled={true}>是</Option>
                                    <Option key="1" value="否" disabled={true}>否</Option>
                                </Select>
                            </td>
                            <td>
                                <Row>
                                    <Col span={18}><Input value={item.num==""?150:item.num} defaultValue="150" onChange={(e)=>this.changeList(e.target.value,"num",index)} disabled={type=='detail'?true:false}/></Col>
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
                    width='950px'
                    maskClosable={false}
                    title="选择原料"
                    visible={this.state.isVisible}
                    destroyOnClose
                    footer={null}
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
