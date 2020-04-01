import React,{Component} from 'react';
import CommonTableTitle from './commonTableTitle'

class scanningDynamics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startIndex:0,
            shopList:[
                {
                    name:"龙蚝渔家1",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家2",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家3",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家4",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家5",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家6",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家7",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家8",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家9",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家10",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家11",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家12",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家13",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家14",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                }
            ],
            showList:[
                {
                    name:"龙蚝渔家1",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家2",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家3",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家4",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家5",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家6",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家7",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家8",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家9",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                },
                {
                    name:"龙蚝渔家10",
                    area:"山东省济南市高新区万达广场西楼",
                    state:"无法识别"
                }
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
            <div className='scanningDynamics'>
                <CommonTableTitle title={'店铺扫描动态'}/>
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <div>
                        <table className='scanningDynamicsTable'>
                            <thead>
                            <tr>
                                <td className="td1">店铺名称</td>
                                <td className="td2">店铺地址</td>
                                <td className="td3">违规类型</td>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="tableBody">
                        <table className='scanningDynamicsTable'>
                            <tbody>
                            {this.state.showList.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td className="td1">{item.name}</td>
                                        <td className="td2">{item.area}</td>
                                        <td className="td3">{item.state}</td>
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

export default scanningDynamics