import React,{ Component } from 'react';
import {Input, Button, Icon, Modal} from 'antd';
import moment from 'moment';
import SignConfForm from "./signConfForm";
import {commonUrl} from "../../../../axios/commonSrc";

export default class DetailList extends Component{
    state={}
    changeInput =(value,option)=>{
        let data = this.props.bookData;
        data[option] = value;
        this.props.dispatchBookData(data);
    }
    changeList=(value,option,index)=>{
        let data = this.props.bookData;
        let list = data.inspectThingListList||[];
        list[index][option]=value;
        data.inspectThingListList=list;
        this.props.dispatchBookData(data);
    }
    plusList=()=>{
        let data = this.props.bookData;
        let list = data.inspectThingListList||[];
        list.push({});
        data.inspectThingListList=list;
        this.props.dispatchBookData(data);
    }
    cutList=(index)=>{
        let data = this.props.bookData;
        let list = data.inspectThingListList||[];
        list.splice(index,1);
        data.inspectThingListList=list;
        this.props.dispatchBookData(data);
    }
    render() {
        const bookData=this.props.bookData;
        const checkStatus = this.props.type=='detail'?true:false;
        return (
            <div>
             <div className='commonInspectBoxHeadTop'><div className='commonInspectTopText'>行政处罚文书</div></div>
             <div className='commonInspectBoxHeadBottom'>场所/设施/财务清单</div>
            <div className='commonInspectBox'>
            <table>
                <tbody>
                <tr>
                    <th style={{width:80,color:'#ffffff',background:'#0499CC'}}>文书编号</th>
                    <td colSpan={8}><Input disabled={checkStatus} value={bookData.bookNumber} onChange={(e)=>this.changeInput(e.target.value,"bookNumber")} placeholder='请输入文书编号'/></td>
                </tr>
                <tr><td style={{height:0,border:0}}/></tr>
                <tr>
                    <th rowSpan={2}>当事人信息</th>
                    <td style={{width:0,border:0}} rowSpan={2}/>
                    <th style={{width:70}}>当事人<span style={{color:'#FF3300'}}>*</span></th>
                    <td colSpan={6}><Input disabled={checkStatus} value={bookData.concernedPerson} onChange={(e)=>this.changeInput(e.target.value,"concernedPerson")} placeholder='请输入当事人信息'/></td>
                </tr>
                <tr>
                    <th>经营地址</th>
                    <td colSpan={6}><Input disabled={checkStatus} value={bookData.businessAddress} onChange={(e)=>this.changeInput(e.target.value,"businessAddress")} placeholder='请输入经营地址'/></td>
                </tr>
                <tr><td style={{height:0,border:0}}/></tr>
                <tr>
                    <th rowSpan={2+(bookData.inspectThingListList||[]).length} style={{color:'#EA0012'}}>物品清单</th>
                    <td style={{width:0,border:0}} rowSpan={2+(bookData.inspectThingListList||[]).length}/>
                    <th>当事人</th>
                    <th>标称名称/场所</th>
                    <th>规格/型号/场所地址</th>
                    <th>单位</th>
                    <th>数量</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr>
                {(bookData.inspectThingListList||[]).map((item,index)=>
                    <tr>
                        <td>{index+1}</td>
                        <td><Input disabled={checkStatus} value={item.nameAddress} onChange={(e)=>this.changeList(e.target.value,"nameAddress",index)}/></td>
                        <td><Input disabled={checkStatus} value={item.satndardTypeAdress} onChange={(e)=>this.changeList(e.target.value,"satndardTypeAdress",index)}/></td>
                        <td><Input disabled={checkStatus} value={item.unit} onChange={(e)=>this.changeList(e.target.value,"unit",index)}/></td>
                        <td><Input disabled={checkStatus} value={item.number} onChange={(e)=>this.changeList(e.target.value,"number",index)}/></td>
                        <td><Input disabled={checkStatus} value={item.remark} onChange={(e)=>this.changeList(e.target.value,"remark",index)}/></td>
                        <td><Button disabled={checkStatus} onClick={()=>this.cutList(index)}><Icon type='minus'/></Button></td>
                    </tr>
                )}
                <tr>
                    <td colSpan={7}><Button disabled={checkStatus} onClick={this.plusList}><Icon type='plus'/></Button></td>
                </tr>
                <tr><td style={{height:0,border:0}}/></tr>
                </tbody>
            </table>
            <table>
                <tbody>
                <tr>
                    <th style={{width:80}}>记录人核验第一执法人</th>
                    <td><div className='signBox' onClick={checkStatus?null:()=>this.setState({isSignVisible:true,signPerson:1})}>
                        <div className='signBoxLeft'><Icon type='lock'/>签字调取</div>
                        <div className='signBoxRight'><div className='signBoxRightContent'>
                            {bookData.firstExecutivePerson?<img src={commonUrl+"/upload/picture/" +bookData.firstExecutivePerson} style={{height:50}} alt="avatar" />:null}
                        </div></div>
                    </div></td>
                    <th>第二执法人</th>
                    <td><div className='signBox' onClick={checkStatus?null:()=>this.setState({isSignVisible:true,signPerson:2})}>
                        <div className='signBoxLeft'><Icon type='lock'/>签字调取</div>
                        <div className='signBoxRight'><div className='signBoxRightContent'>
                            {bookData.secondExecutivePerson?<img src={commonUrl+"/upload/picture/" +bookData.secondExecutivePerson} style={{height:50}} alt="avatar"/>:null}
                        </div></div>
                    </div></td>
                </tr>
                <tr>
                    <th>记录时间</th>
                    <td colSpan={3}>{moment().format('YYYY-MM-DD')}</td>
                </tr>
                </tbody>
            </table>
                <Modal
                    width='1000px'
                    title="签字列表"
                    visible={this.state.isSignVisible}
                    destroyOnClose
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            isSignVisible:false
                        })
                    }}
                >
                    <SignConfForm
                        signGaId={bookData.supervisorId||''}
                        dispatchSign={(item)=>{
                        this.setState({isSignVisible:false})
                        let bookData = this.props.bookData;
                        let picture = JSON.parse(item.pic||JSON.stringify([]))
                        if(this.state.signPerson==1){
                            bookData.firstExecutivePerson=((((picture||[])[0]||{}).response)||{}).data;
                        }else if(this.state.signPerson==2){
                            bookData.secondExecutivePerson=((((picture||[])[0]||{}).response)||{}).data;
                        }
                        this.props.dispatchBookData(bookData)}}/>
                </Modal>
        </div>
         </div>);
    }
}