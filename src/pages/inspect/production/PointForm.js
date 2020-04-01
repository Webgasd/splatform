import React,{Component} from 'react';
import {Input,Button} from 'antd';

class PointForm extends Component {
    state={}

    changeInput=(value,option)=>{
        let data = this.props.inspectData||{};
        data[option] = value;
        let list = data.list||[];
        let checkList = list.filter((item)=>item.result!=3);
        let importantList = checkList.filter((item)=>item.importance==2);
        if(importantList.length<3||(checkList.length-importantList.length)<7){
             data.checkResult='未达成检查标准';
             data.resultProcess='未达成检查标准';
             this.props.dispatchInspectData(data);
             return;
        }
        let warnImList = importantList.filter((item)=>item.result==2);
        let warnList = checkList.filter((item)=>item.result==2)
        if(warnList.length==0){
            data.checkResult='符合';
            data.resultProcess='通过';
            data.problem=warnList.map((item)=>item.remark).join('');
            this.props.dispatchInspectData(data);
        }else if(warnImList.length<2&&(((warnList.length)/(checkList.length))<0.3)){
            data.checkResult='基本符合';
            data.resultProcess='书面限令整改';
            data.problem=warnList.map((item)=>item.remark).join('');
            this.props.dispatchInspectData(data);
        }else if(warnImList.length>1||(((warnList.length)/(checkList.length))>0.3)){
            data.checkResult='不符合';
            data.resultProcess='食品生产经营者立即停止食品生产经营活动';
            data.problem=warnList.map((item)=>item.remark).join('');
            this.props.dispatchInspectData(data);
        }
    }

    handleListLarge=(dataList)=>{
        let resultList = [];
        let largeName = (dataList[0]||{}).largeClassName;
        let i = 0;
        resultList[0]=[];
        dataList.forEach((item,index)=>{
            if(item.largeClassName==largeName){
                resultList[i].push(item)
            } else{
                largeName=item.largeClassName;
                i++;
                resultList[i]=[];
                resultList[i].push(item)
            }
        })
        return resultList
    }

    changeList=(value,option,index)=>{
        let  formData= this.props.inspectData||{};
        let list = formData.list||[];
        list[index-1][option] = value;
        this.changeInput(list,'list');
    }
    checkAll=(option)=>{
        let  formData= this.props.inspectData||{};
        let list = formData.list||[];
        if(option=='correct'){
            list = list.map((item)=>{
                item.result=1;
                return item;
            })
        }else if(option=='warnning'){
            list = list.map((item)=>{
                item.result=2;
                return item;
            })
        }else if(option=='miss'){
            list = list.map((item)=>{
                item.result=3;
                return item;
            })
        }else if (option=='null'){
            list = list.map((item)=>{
                item.result=null;
                return item;
            })
        }
        this.changeInput(list,'list');
    }

    render() {
        const formData=this.props.inspectData||{};
        const list=this.props.inspectData.list||[];
        const importantList=list.filter((item)=>item.importance===2&&item.result);
        const normalList = list.filter((item)=>item.importance!==2&&item.result);
        const warnImList = list.filter((item)=>item.importance===2&&item.result==2);
        const correctImList = list.filter((item)=>item.importance!==2&&item.result==2);
        const checkStatus = this.props.type=='detail'?true:false;
        return(
            <div className='commonEnterpriseBox' style={{marginTop:30}}>
                <div className='permission-title-text' style={{width:140}}>检查要点项处理</div>
                <div style={{textAlign:'center',width:'100%'}}>
                    <Button.Group>
                        <Button disabled={checkStatus} type='primary' onClick={()=>this.checkAll('correct')}>全选符合</Button>
                        <Button disabled={checkStatus} type='primary' onClick={()=>this.checkAll('warnning')}>全选不符合</Button>
                        <Button disabled={checkStatus} type='primary' onClick={()=>this.checkAll('miss')}>全选合理缺项</Button>
                        <Button disabled={checkStatus} type='primary' onClick={()=>this.checkAll('null')}>全选未处理</Button>
                    </Button.Group>
                    <div style={{margin:'15px 20px 0 20px'}}>
                        <table >
                            <tbody>
                            <tr>
                                <td style={{width:'30%'}}>本年度检查次数</td>
                                <td style={{width:'10%'}}><div style={{color:'#FF3300'}}>{formData.checkCount||'0'}</div></td>
                                <td style={{width:'20%'}}>巡查频次</td>
                                <td style={{width:'10%'}}><div style={{color:'#FF3300'}}>{formData.checkFrequence||'0'}</div></td>
                                <td style={{width:'20%'}}>总检查项目数</td>
                                <td style={{width:'10%'}}><div style={{color:'#FF3300'}}>{formData.checkTotal||'0'}</div></td>
                            </tr>
                            <tr>
                                <td colSpan={6}>
                                    重点项（<span className='spanInline' style={{color:'#FF3300'}}>{importantList.length}</span>）项，项目序号分别是（<span className='spanInline' style={{color:'#FF3300'}}> {importantList.map((item)=>(item.seq)).join(',')}</span>），发现问题（<span className='spanInline' style={{color:'#FF3300'}}>{warnImList.length}</span> ）项，项目序号分别是（<span className='spanInline' style={{color:'#FF3300'}}> {warnImList.map((item)=>(item.seq)).join(',')}</span>）
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6}>
                                    一般项（<span className='spanInline' style={{color:'#FF3300'}}>{normalList.length}</span>）项，项目序号分别是（<span className='spanInline' style={{color:'#FF3300'}}> {normalList.map((item)=>(item.seq)).join(',')}</span>），发现问题（<span className='spanInline' style={{color:'#FF3300'}}>{correctImList.length}</span>）项，项目序号分别是（<span className='spanInline' style={{color:'#FF3300'}}> {correctImList.map((item)=>(item.seq)).join(',')}</span>）
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{margin:'20px 10px 0 10px',height:400,overflowY:'auto'}}>
                        <table>
                            <tbody>
                            <tr>
                                <th rowSpan={2} style={{width:'10%'}}>项目</th>
                                <th rowSpan={2} style={{width:'5%'}}>编号</th>
                                <th rowSpan={2} style={{width:'40%'}}>核查内容</th>
                                <th rowSpan={2} style={{width:'3%'}}>重要性</th>
                                <th colSpan={3} style={{width:'20%'}}>结果判定</th>
                                <th rowSpan={2} style={{width:'12%'}}>备注</th>
                                <th rowSpan={2} style={{width:'20%'}}>操作</th>
                            </tr>
                            <tr>
                                <th>符合</th>
                                <th>不符合</th>
                                <th>合理缺项</th>
                            </tr>
                            {this.handleListLarge(list).map((data)=>(
                                data.map((item,index)=>{
                                    if(index==0){
                                        return <tr>
                                            <td rowSpan={data.length}>{item.largeClassName}</td>
                                            <td>{item.seq}</td>
                                            <td style={item.result==2?{background:'#E96A79'}:null}>{item.clauseName}</td>
                                            <td>{item.importance===2?'*':''}</td>
                                            <td><input disabled={checkStatus} type="radio" name={item.key} checked={item.result==1?true:false} value={1} onChange={(e)=>this.changeList(e.target.value,"result",item.key)}/></td>
                                            <td><input disabled={checkStatus} type="radio" name={item.key} checked={item.result==2?true:false} value={2} onChange={(e)=>this.changeList(e.target.value,"result",item.key)}/></td>
                                            <td><input disabled={checkStatus} type="radio" name={item.key} checked={item.result==3?true:false} value={3} onChange={(e)=>this.changeList(e.target.value,"result",item.key)}/></td>
                                            <td><Input disabled={checkStatus} value={item.resultRemark||''}/></td>
                                            <td>{item.result==2?<a disabled={checkStatus}>添加</a>:null}</td>
                                        </tr>
                                    }else{
                                        return <tr>
                                            <td>{item.seq}</td>
                                            <td style={item.result==2?{background:'#E96A79'}:null}>{item.clauseName}</td>
                                            <td>{item.importance===2?'*':''}</td>
                                            <td><input disabled={checkStatus} type="radio" name={item.key} checked={item.result==1?true:false} value={1} onChange={(e)=>this.changeList(e.target.value,"result",item.key)}/></td>
                                            <td><input disabled={checkStatus} type="radio" name={item.key} checked={item.result==2?true:false} value={2} onChange={(e)=>this.changeList(e.target.value,"result",item.key)}/></td>
                                            <td><input disabled={checkStatus} type="radio" name={item.key} checked={item.result==3?true:false} value={3} onChange={(e)=>this.changeList(e.target.value,"result",item.key)}/></td>
                                            <td><Input disabled={checkStatus} value={item.resultRemark||''}/></td>
                                            <td>{item.result==2?<a disabled={checkStatus}>添加</a>:null}</td>
                                        </tr>
                                    }
                                })
                                )
                            )}
                            </tbody>
                        </table>
                    </div>
            </div>
          </div>);
    }
}
export default PointForm;