import React,{Component} from 'react';
import './style.less';
import ControlHeader from './controlHeader'
import TestBatches from './tesBatches'
import Indicators from './indicators'
import Detection from './detection'
import EnterpriseDynamic from './enterpriseDynamic'
import OnlineRate from './onlineRate'
import ProvinceMap from './provinceMap'
import Chain from './chain'
import axios from "../../axios";

import Map from './img/u10.jpg'

class takeOut extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            tempTeamData2:[],
            tempTeamData5:[],
            tempTeamData7:[],
            tempTeamData8:[],
            enterData:[],
            tempTeamData6:[]   
        }
    }
    componentDidMount(){
        this.requestList();       
    }
    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }
    requestList = ()=>{    
        axios.ajax({
            url:'/ewmacData/getListAll',
            data:{
             
            }
        }).then((res)=>{
            if(res.status == "success"){
                let tempTeamData2 = res.data.list2.map((item)=>{                 
                    return {
                        total2: item.total,
                        team2: item.percent,
                        yes2: item.yes,
                        no2: item.no,
                    };
                }) 
                let tempTeamData6 = res.data.list6.map((item)=>{              
                    return {
                        total6: item.total,
                        market6: item.type,
                        yes6: item.yes,
                        no6: item.no,
                    };
                }) 
                let tempTeamData5 = res.data.list1.map((item)=>{              
                    return {
                        team5: item.team,
                        buy5: item.total,
                    };
                }) 
                let tempTeamData4 = res.data.list4.map((item)=>{              
                    return {
                        team5: item.team,
                        buy5: item.total,
                    };
                }) 
               
              
                let total1  = res.data.list1.map((item)=>{
                    return item.total;
                })  
                let yes1  = res.data.list2.map((item)=>{
                    return item.yes;
                })  
                let no1  = res.data.list2.map((item)=>{
                    return item.no;
                })  
                let yes2  = res.data.list3.map((item)=>{
                    return item.yes;
                })  
                let no2  = res.data.list3.map((item)=>{
                    return item.no;
                })  
                let percent1  = res.data.list1.map((item)=>{
                    return item.percent;
                })  
                let restaurant = res.data.list7.map((item)=>{
                    return item.total;
                }) 
                let supplier = res.data.list8.map((item)=>{
                    return item.total;
                })  
                let list3 = res.data.list3.map((item)=>{
                    return item;
                })  
                let list10 = res.data.list10.map((item)=>{
                    return item;
                }) 
                let enterData = res.data.list9.map((item)=>{
                    return {
                        disinfection: item.disinfection,
                        origin: item.origin,
                        waste: item.waste
                    };
                })  
                let tempTeamData = res.data.list6.map((item)=>{
                    return {
                        value: item.total,
                        name: item.type
                    };
                })  
                let tempTeamData1 = res.data.list5.map((item)=>{
                    return {
                        value: item.total,
                        name: item.type
                    };
                })          
                this.setState({
                    list3,
                    total1,
                    list10,
                    enterData,
                    restaurant,
                    supplier,
                    no1,
                    yes1,
                    no2,
                    yes2,
                    percent1,
                    tempTeamData4,
                    tempTeamData1,
                    tempTeamData2,
                    tempTeamData6, 
                    tempTeamData5, 
                    tempTeamData   
                })
            }
        })
    }
    render() {
        return (
            <div className='control' style={{backgroundImage: "url(" + require("./img/background.png") + ")"}}>
                <ControlHeader/>
                <div className='controlContent'>
                    <div className='left'>
                        <div className='showBox' style={{height:'250px'}}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <TestBatches tempTeamData5={this.state.tempTeamData5}/>
                        </div>
                        <div className='showBox'>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <Indicators type='1' 
                              no1={this.state.no1}
                              yes1={this.state.yes1}
                             />
                        </div>
                        <div className='showBox'>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <Detection 
                            tempTeamData5={this.state.tempTeamData4}
                            />
                        </div>
                        <div className='showBox'>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <Indicators type='2'
                              no2={this.state.no2}
                              yes2={this.state.yes2}/>
                        </div>
                    </div>
                    <div className='center'>
                        <div className='showBox' style={{height:'500px',minWidth:'500px'}}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>

                            <img style={{height:400,width:530,marginRight:10,marginBottom: 10,marginTop:40}} src={Map} alt={''}/>

                        </div>
                        <div className='showBox' style={{height:'348px',minWidth:'500px'}}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>

                        

                        
                        <div className='showBox1'style={{float:'left',width:'250px',marginTop:30}}>
                            
                            <ProvinceMap foodData={this.state.tempTeamData} style={{float:'left',width:'250px'}}/>
                        </div>
                        <div className='showBox1' style={{float:'left',width:'250px',marginTop:30}}>
                        
                            <Chain tempTeamData={this.state.tempTeamData1} style={{float:'left',width:'250px'}}/>
                        </div>
                        </div>
                    </div>
                    <div className='right'>
                        <div className='showBox'>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <EnterpriseDynamic 
                             restaurant={this.state.restaurant}
                             supplier={this.state.supplier}
                             enterData={this.state.enterData}
                            />
                        </div>
                        <div className='showBox' style={{height:508}}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <OnlineRate  list3={this.state.list10}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default takeOut