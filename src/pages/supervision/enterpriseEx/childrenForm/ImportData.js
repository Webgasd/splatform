import React,{Component} from 'react';
import {Select, Input,Tooltip } from 'antd';
import '../style.less'
import axios from "../../../../axios";
const Option = Select.Option;
const { TextArea } = Input;


class ImportData extends Component{

    state={}

    componentDidMount() {
    }
  
    
    
    
    render() {
        const updateNumbers=this.props.updateNumbers ||0;
        const insertNumbers=this.props.insertNumbers||0;
        const errList=this.props.errList||[];
        const errMsg=this.props.errMsg|| '';
        const importResult = this.props.importResult || 0;
        return (
            <div>
                <div style={{height:'48px',backgroundColor:'RGB(242, 242, 242)',color:'RGB(22,155,213)',
                    textAlign:'center',margin:"-20px -20px 5px -20px"}}>
                    ————根据统一社会信用代码识别后————
                    <div>导入结果如下</div>
                </div>
                {
                    importResult===1?
                    <table className='abnormaltable'>
                        <tbody>
                        <tr>
                            <td>总更新数据量</td>
                            <td><Input value={updateNumbers+insertNumbers+"家"}/></td>
                        </tr>
                        <tr>
                            <td>覆盖更新【已有】企业</td>
                            <td><Input value={updateNumbers+"家"} style={{width:'85%',float:"left"}}/>
                                <Tooltip title="覆盖更新，只更新此次变动的数据数据信息覆盖更新，只做加法，不做减法。原始数据不会变动">
                                    <span style={{fontSize:13,float:"right",color:'#169BD5',marginTop:5}}>说明</span>
                                </Tooltip>
                            </td>
                        </tr>
                    
                        <tr>
                            <td>本次导入【新增】企业</td>
                            <td><Input value={insertNumbers+"家"} style={{width:'85%',float:"left"}}/>
                                <Tooltip title="系统内未发现共同的“统一社会信用代码”企业属于系统【新增】企业企业首次导入，经营状态默认为【新增】状态">
                                    <span style={{fontSize:13,float:"right",color:'#169BD5',marginTop:5}}>说明</span>
                                </Tooltip>
                            </td>
                        </tr> 
                        </tbody>
                    </table>:
                    <table className='abnormaltable'>
                        <tbody>
                        <tr>
                            <td style={{color:'red',fontSize:14}}>错误类型</td>
                            <td><Input value={errMsg}/></td>
                        </tr>
                        {
                            errList.map((item,index)=>{

                            return(<tr>
                                    <td colSpan={2}><Input value={item}/></td>
                                </tr>)
                        })
                        }
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}
export default ImportData;