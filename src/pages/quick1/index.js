import React, { Component } from 'react';
import './style.less';
import { Row, Col } from 'antd'
import SamplingHeader from './samplingHeader'
import FoodType from './foodType'
import CostTop from './costTop'
import FailedTop from './failedTop'
import SpotCost from './spotCost'
import AgencyCost from './agencyCost'
import PlaceSituation from './placeSituation'
import Combination from './combination'
import BusinessSituation from './businessSituation'
import axios from "../../axios";
import Halfpie from './halfpie'
class Samplingstatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempTeamData2: [],
            tempTeamData5: [],
            tempTeamData7: [],
            tempTeamData8: [],
            tempTeamData6: []
        }
    }
    componentDidMount() {
        this.requestList();
    }
    changeMsgIndex(index) {
        this.setState({
            msgIndex: index
        })
    }
    requestList = () => {
        axios.ajax({
            url: '/quickCheckStatistics/getListAll',
            data: {

            }
        }).then((res) => {
            if (res.status == "success") {
                let tempTeamData2 = res.data.list2.map((item) => {
                    return {
                        total2: item.total,
                        team2: item.team,
                        yes2: item.yes,
                        no2: item.no,
                    };
                })
                let tempTeamData6 = res.data.list6.map((item) => {
                    return {
                        total6: item.total,
                        market6: item.market,
                        yes6: item.yes,
                        no6: item.no,
                    };
                })
                let tempTeamData5 = res.data.list5.map((item) => {
                    return {
                        team5: item.team,
                        buy5: item.buy,
                    };
                })
                let tempTeamData7 = res.data.list7.map((item) => {
                    return {
                        name: item.checkName,
                        value: item.no,
                    };
                })
                let tempTeamData8 = res.data.list8.map((item) => {
                    return {
                        name: item.market,
                        value: item.buy,
                    };
                })

                let total1 = res.data.list1.map((item) => {
                    return item.total;
                })
                let yes1 = res.data.list1.map((item) => {
                    return item.yes;
                })
                let no1 = res.data.list1.map((item) => {
                    return item.no;
                })
                let percent1 = res.data.list1.map((item) => {
                    return item.percent;
                })
                let list3 = res.data.list3.map((item) => {
                    return item;
                })
                let office = res.data.list1.map((item) => {
                    return item;
                })
                let total9 = res.data.list9.map((item) => {
                    return item.total;
                })
                let tempTeamData = res.data.list3.map((item) => {
                    return {
                        value: item.total,
                        name: item.type
                    };
                })
                this.setState({
                    list3,
                    total1,
                    total9,
                    no1,
                    yes1,
                    office,
                    percent1,
                    tempTeamData2,
                    tempTeamData6,
                    tempTeamData5,
                    tempTeamData7,
                    tempTeamData8,
                    tempTeamData
                })
            }
        })
    }
    render() {
        return (
            <div className='samplingstatistics' style={{ backgroundImage: "url(" + require("./img/background.png") + ")" }}>
                <SamplingHeader />
                <div className='samplingContent'>


                    <div className='left'>
                        <div className='showBox' style={{ height: '270px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>

                            <FoodType tempTeamData={this.state.tempTeamData || []} />

                        </div>

                        <div className='showBox' style={{ height: '500px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <CostTop list3={this.state.list3} />
                        </div>
                    </div>
                    <div className='center'>
                        <div className='showBox' style={{ height: '380px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <PlaceSituation
                                tempTeamData2={this.state.tempTeamData2}
                                office={this.state.office}
                                percent1={this.state.percent1}
                                yes1={this.state.yes1}
                                no1={this.state.no1}
                                total1={this.state.total1} />
                        </div>

                        <div className='showBox' style={{ height: '390px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <BusinessSituation
                                tempTeamData6={this.state.tempTeamData6}
                                office={this.state.office}
                                percent1={this.state.percent1}
                                yes1={this.state.yes1}
                                no1={this.state.no1}
                                total1={this.state.total1} />
                        </div>
                    </div>

                    <div className='right1'>
                        <div className='showBox' style={{ height: '200px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <SpotCost tempTeamData7={this.state.tempTeamData7} />
                        </div>
                        <div className='showBox' style={{ height: '350px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <AgencyCost tempTeamData5={this.state.tempTeamData5} />
                        </div>
                        <div className='showBox' style={{ height: '205px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <Halfpie
                                tempTeamData8={this.state.tempTeamData8}
                                total9={this.state.total9}
                            />
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Samplingstatistics