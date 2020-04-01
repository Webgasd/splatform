import React,{Component} from 'react';
import CommonBar from './commonBar'

class onlineRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const list = this.props.list3||[];
        return (
            <div className='onlineRate1'>
                <div className='boxHeader'>各所企业上线率</div>
                <div className='box' style={{height:450,  overflow:'auto',width:350}} >
                    <table className='detectionTable1'>
                        <thead>
                            <tr>
                                <td style={{textAlign:'left',color:'#5a5978'}}>所属所队</td>
                                <td style={{color:'#5a5978'}}>入网企业</td>
                                <td></td>
                                <td style={{color:'#5a5978'}}>上线率</td>
                            </tr>
                        </thead>
                        <tbody >
                        {list.map((item,index)=>( 
                            <tr>
                                <td style={{textAlign:'left'}}>{item.name}</td>
                                <td>{item.total}</td>
                                <td><CommonBar rate={item.percent}/></td>
                                <td style={{color:'#d80051'}}>{item.percent}</td>
                            </tr>
                            ))}

                            {/* <tr>
                                <td style={{textAlign:'left'}}>大明湖街道</td>
                                <td>100</td>
                                <td><CommonBar rate={29}/></td>
                                <td style={{color:'#d80051'}}>29%</td>
                            </tr>
                            <tr>
                                <td style={{textAlign:'left'}}>智远街道</td>
                                <td>150</td>
                                <td><CommonBar rate={50}/></td>
                                <td style={{color:'#d80051'}}>50%</td>
                            </tr>
                            <tr>
                                <td style={{textAlign:'left'}}>东关街道</td>
                                <td>150</td>
                                <td><CommonBar rate={30}/></td>
                                <td style={{color:'#d80051'}}>30%</td>
                            </tr> */}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default onlineRate