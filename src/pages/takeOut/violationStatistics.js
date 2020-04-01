import React,{Component} from 'react';
import CommonTableTitle from './commonTableTitle'

class violationStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startIndex:0,
            shopList:[
                {
                    name:"趵突泉",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"大明湖",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"甸柳",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"东关",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"建新新村",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"解放路",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"龙洞",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"千佛山",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"泉城路",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"文东",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"燕山",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"姚家",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"致远",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
            ],
            showList:[
                {
                    name:"趵突泉",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"大明湖",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"甸柳",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"东关",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"建新新村",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"解放路",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"龙洞",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"千佛山",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"泉城路",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
                {
                    name:"文东",
                    td1:10,
                    td2:10,
                    td3:10,
                    td4:10,
                    td5:10,
                    td6:10
                },
            ]
        }
    }

    tick = () => {
        var {startIndex,shopList,showList} = this.state
        var tempShowList = showList
        var tempStratIndex = startIndex
        if(startIndex+10 === shopList.length) {
            tempStratIndex = -9
            tempShowList.push(shopList[0])
            this.setState({
                showList:tempShowList.slice(1),
                startIndex:tempStratIndex
            })
        }else {
            tempStratIndex=tempStratIndex+1
            tempShowList.push(shopList[tempStratIndex+9])
            this.setState({
                showList:tempShowList.slice(1),
                startIndex:tempStratIndex
            })
        }
    }

    componentDidMount() {
        setInterval(this.tick, 2000);
    }

    render() {
        return (
            <div className='violationStatics'>
                <CommonTableTitle title={'违规统计'}/>
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <div>
                        <table className='violationStaticsTable'>
                            <thead>
                            <tr>
                                <td className="td1">地区</td>
                                <td className="td2">证件未公示</td>
                                <td className="td2">证明不符</td>
                                <td className="td2">查无证照</td>
                                <td className="td2">超范围经营</td>
                                <td className="td2">许可证超期限</td>
                                <td className="td2">无法识别</td>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <div className='tableBody'>
                        <table className='violationStaticsTable'>
                            <tbody>
                            {this.state.showList.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td className="td1" style={{color:'#4FFAFF'}}>{item.name}</td>
                                        <td className="td2" style={{color:'#B41318'}}>{item.td1}</td>
                                        <td className="td2">{item.td1}</td>
                                        <td className="td2">{item.td2}</td>
                                        <td className="td2">{item.td3}</td>
                                        <td className="td2">{item.td4}</td>
                                        <td className="td2">{item.td5}</td>
                                        <td className="td2" style={{color:'#B41318'}}>{item.td6}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default violationStatistics