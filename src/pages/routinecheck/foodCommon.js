import React,{Component} from 'react';
import './style.less';

import moment from 'moment';
import TestBatches from './tesBatches'

import Everylink from './everylink'
import Circle from './circle'
import Dcircle from './dcircle'
import axios from "../../axios";


class takeOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFullScreen: false,
            msgIndex:0
          
        }
    }
    componentDidMount() {
        this.requestList();
        
    }
  
  
    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/inspect/dailyFood/getStatistics',
            data:{
                params:{
                    checkDate:moment().format('YYYY')
                }
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let enterpriseNumberA = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.numberEnterprise 

                })
                let sum = 0;
                enterpriseNumberA.forEach(item => {
                    sum += item
                })
                let enterpriseNumber = sum;
             
                let checkEnterpriseA = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.checkEnterprise 

                })
                let sumc = 0;
                checkEnterpriseA.forEach(item => {
                    sumc += item
                })
                let checkEnterprise = sumc;
             
                let enterpriseNumberB = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.numberEnterprise +
                        res.data.areaCount[item.id].foodCirculate.numberEnterprise +
                        res.data.areaCount[item.id].foodProduce.numberEnterprise

                })
                let sum1 = 0;
                enterpriseNumberB.forEach(item => {
                    sum1 += item
                })
                let enterpriseNumber1 = sum1;
  
                
                let haveCheckT1 = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.haveCheck 

                })
                let sumh = 0;
                haveCheckT1.forEach(item => {
                    sumh += item
                })
                let haveCheckT = sumh;


                let shouldCheckT1 = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.shouldCheck 

                })
                let sumt = 0;
                shouldCheckT1.forEach(item => {
                    sumt += item
                })
                let shouldCheckT = sumt;

                let enterpriseMarkA = res.data.enterpriseMarkA.foodCommon;
                let enterpriseMarkB = res.data.enterpriseMarkB.foodCommon ;
                let enterpriseMarkC = res.data.enterpriseMarkC.foodCommon;
                let enterpriseMarkD = res.data.enterpriseMarkD.foodCommon ;
                let enterpriseMarkN = res.data.enterpriseMarkN.foodCommon;

                let areaName = res.data.areaList.map((item, i) => {
                    item.key = i;
                    return item.name;
                })
                let shouldCheck = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.shouldCheck 

                })
                let haveCheck = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.haveCheck 

                })
                let numberEnterprise1 = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.numberEnterprise 
                       

                })
                let checkEnterprise1 = res.data.areaList.map((item) => {
                    return res.data.areaCount[item.id].foodCommon.checkEnterprise 
                })
                let shouldCheck1 = res.data.areaList.map((item) => {
                    // return {
                    //     foodCommon: res.data.areaCount[item.id].foodCommon.shouldCheck,
                    //     foodCirculate: res.data.areaCount[item.id].foodCirculate.shouldCheck,
                    //     foodProduce: res.data.areaCount[item.id].foodProduce.shouldCheck,

                    // };
                    return [
                        res.data.areaCount[item.id].foodCommon.shouldCheck,
                        res.data.areaCount[item.id].foodCirculate.shouldCheck,
                        res.data.areaCount[item.id].foodProduce.shouldCheck,

                    ]
                    //  return  res.data.areaCount[item.id].foodCommon.shouldCheck, res.data.areaCount[item.id].foodCirculate.shouldCheck, res.data.areaCount[item.id].foodProduce.shouldCheck


                })
                let haveCheck1 = res.data.areaList.map((item) => {

                    return [
                        res.data.areaCount[item.id].foodCommon.haveCheck,
                        res.data.areaCount[item.id].foodCirculate.haveCheck,
                        res.data.areaCount[item.id].foodProduce.haveCheck,

                    ]

                })
               

                let enterpriseData = checkEnterprise /enterpriseNumber;
                let checkData=haveCheckT/shouldCheckT;
                this.setState({
                    enterpriseNumber: enterpriseNumber,
                    enterpriseNumber1:enterpriseNumber1,
                    checkEnterprise: checkEnterprise,
                    enterpriseMarkA: enterpriseMarkA,
                    enterpriseMarkB: enterpriseMarkB,
                    enterpriseMarkC: enterpriseMarkC,
                    enterpriseMarkD: enterpriseMarkD,
                    enterpriseMarkN: enterpriseMarkN,
                    enterpriseData: enterpriseData,
                    areaName: areaName,
                    shouldCheck: shouldCheck,
                    haveCheck: haveCheck,
                    shouldCheck1: shouldCheck1,
                    haveCheck1: haveCheck1,
                    shouldCheckT:shouldCheckT,
                    haveCheckT:haveCheckT,
                    checkData:checkData,
                    numberEnterprise1:numberEnterprise1,
                    checkEnterprise1:checkEnterprise1,

                })
              //  console.log(enterpriseNumber)
            }
        })
    }
    render() {
        return (
            <div className='control'  >
            
                <div className='bigbox1' style={{float:'left',width:'68%'}} >
                <div className='box1' style={{ width: '33%' }} >
                        <div className='grid1' style={{height:'250px'}}>
                        <div className='textbox1' >
                          检查覆盖率                          
                          </div>
                          <div className='textbox3' style={{marginTop:'10%' }}>
                          全局辖区企业                 
                          </div>
                          <div className='textbox3' style={{color:'#B4F551',marginTop:'10%',fontSize:24, backgroundColor:'#7D8A9B'}}>
                          {this.state.enterpriseNumber}               
                          </div>
                          <div className='textbox3' style={{marginTop:'10%',color:'black',  width: '13%'}}>
                          家               
                          </div>
                          <div className='textbox3' style={{ }}>
                          已覆盖检查                 
                          </div>
                          <div className='textbox3' style={{ color:'#B4F551',backgroundColor:'#7D8A9B',fontSize:24}}>
                          {this.state.checkEnterprise}                  
                          </div>
                          <div className='textbox3' style={{  width: '13%',color:'black'}}>
                          家              
                          </div>
                        </div>
                        <div className='grid4' style={{}}>
                        <div className='textbox2' style={{}}>
                        检查<br/>覆盖率
                        
                          </div>
                        
                    <Dcircle
                                enterpriseData={this.state.enterpriseData}/>
                        </div>
                        </div>  

                        <div className='grid2' style={{}}>
                        <div className='textbox1' style={{ backgroundColor:'#80CACB'}}>
                          等级情况
                           
                          </div> 
                          <div className='textbox3' style={{ border:'1px solid #FFFFFF',backgroundColor:'#A4C93E', fontSize:28,width: '18%',marginTop:'5%',borderRadius:'50%' }}>
                          A                 
                          </div>
                          <div className='textbox3' style={{color:'#B4F551',border:'1px solid #A4C93E',width: '38%',marginTop:'5%',fontSize:24, backgroundColor:'#7D8A9B'}}>
                          {this.state.enterpriseMarkA}               
                          </div>
                          <div className='textbox3' style={{marginTop:'5%',color:'black', backgroundColor:'#A4C93E', fontSize:18,color:'white',borderRadius:'10%',  width: '20%'}}>
                          家               
                          </div>
                          <div className='textbox3' style={{border:'1px solid #FFFFFF', backgroundColor:'#F5CE45',fontSize:28, width: '18%',marginTop:'5%',borderRadius:'50%' }}>
                          B                
                          </div>
                          <div className='textbox3' style={{color:'#B4F551',border:'1px solid #F5CE45',width: '38%',marginTop:'5%',fontSize:24, backgroundColor:'#7D8A9B'}}>
                          {this.state.enterpriseMarkB}                    
                          </div>
                          <div className='textbox3' style={{marginTop:'5%',color:'black', backgroundColor:'#F5CE45',fontSize:18,color:'white',borderRadius:'10%', width: '20%'}}>
                          家               
                          </div>
                          <div className='textbox3' style={{border:'1px solid #FFFFFF',backgroundColor:'#EC6F2D', fontSize:28, width: '18%',marginTop:'5%',borderRadius:'50%' }}>
                          C                 
                          </div>
                          <div className='textbox3' style={{color:'#B4F551',border:'1px solid #EC6F2D',width: '38%',marginTop:'5%',fontSize:24, backgroundColor:'#7D8A9B'}}>
                          {this.state.enterpriseMarkC}                   
                          </div>
                          <div className='textbox3' style={{marginTop:'5%',color:'black',backgroundColor:'#EC6F2D',fontSize:18,color:'white',borderRadius:'10%', width: '20%'}}>
                          家               
                          </div>
                          <div className='textbox3' style={{border:'1px solid #FFFFFF',backgroundColor:'#EB4827', fontSize:28, width: '18%',marginTop:'5%',borderRadius:'50%' }}>
                          D                
                          </div>
                          <div className='textbox3' style={{color:'#B4F551',width: '38%',border:'1px solid #EB4827',marginTop:'5%',fontSize:24, backgroundColor:'#7D8A9B'}}>
                          {this.state.enterpriseMarkD}                
                          </div>
                          <div className='textbox3' style={{marginTop:'5%',color:'black',backgroundColor:'#EB4827',fontSize:18,color:'white',borderRadius:'10%', width: '20%'}}>
                          家               
                          </div>
                          <div className='textbox3' style={{border:'1px solid #FFFFFF',backgroundColor:'#CDCB42', fontSize:28, width: '18%',marginTop:'5%',borderRadius:'50%' }}>
                          未                 
                          </div>
                          <div className='textbox3' style={{color:'#B4F551',width: '38%',border:'1px solid #CDCB42',marginTop:'5%',fontSize:24, backgroundColor:'#7D8A9B'}}>
                          {this.state.enterpriseMarkN}                   
                          </div>
                          <div className='textbox3' style={{marginTop:'5%',color:'black',backgroundColor:'#CDCB42',fontSize:18,color:'white',borderRadius:'10%', width: '20%'}}>
                          家               
                          </div>
                        </div>
                        <div className='box1' >
                        <div className='grid1' style={{height:'250px',marginLeft:0}}>
                        <div className='textbox1' style={{ backgroundColor:'#5BC9FA'}}>
                        检查完成率
                           
                          </div>
                          <div className='textbox3' style={{marginTop:'10%', backgroundColor:'#F19E38'}}>
                          应检查次数                 
                          </div>
                          <div className='textbox3' style={{color:'#F19E38', width: '35%',marginTop:'10%',fontSize:24, backgroundColor:'#7D8A9B'}}>
                          {this.state.shouldCheckT}                
                          </div>
                          <div className='textbox3' style={{marginTop:'10%',backgroundColor:'#F19E38',color:'black',  width: '13%'}}>
                         次              
                          </div>
                          <div className='textbox3' style={{ backgroundColor:'#F19E38' }}>
                          已检查次数                 
                          </div>
                          <div className='textbox3' style={{ color:'#F19E38', width: '35%',backgroundColor:'#7D8A9B',fontSize:24}}>
                          {this.state.haveCheckT}             
                          </div>
                          <div className='textbox3' style={{backgroundColor:'#F19E38', width: '13%',color:'black'}}>
                          次              
                          </div>
                          </div>
                          <div className='grid4' style={{marginLeft:0}}>
                          <div className='textbox2' style={{  backgroundColor:'#80CACB'}}>
                          检查<br/>完成率
                           
                          
                          </div>
                        
                       <Circle
                         checkData={this.state.checkData}
       
                               />
                          </div>
                          </div>
                          <div className='box2' style={{}}>
                          <div className='textbox1' style={{backgroundColor:'#80CACB' }}>
                          各执法单位检查家数与检查次数对比图                           
                          </div>
                          <TestBatches
                          areaName={this.state.areaName}
                          shouldCheck={this.state.shouldCheck}
                          haveCheck={this.state.haveCheck}
                          checkEnterprise={this.state.checkEnterprise1}
                          numberEnterprise={this.state.numberEnterprise1}
                               />
                          </div>
                          </div>

                          <div className='grid3' style={{ borderRadius:10}}>
                          <div className='textbox1' style={{ borderRadius:'7px 7px 0 0 ', backgroundColor:'#A4C93E'}}>
                          各环节任务完成情况
                           
                          </div>
                          <Everylink
                           areaName={this.state.areaName}
                           shouldCheck1={this.state.shouldCheck1}
                           haveCheck1={this.state.haveCheck1}
                           enterpriseNumber={this.state.enterpriseNumber1}
                        //    totalstepitem={this.state.totalstepitem} teamitem={this.state.teamitem} teamyes={this.state.teamyes} teamno={this.state.teamno} teamtotal={this.state.teamtotal}
                           />
                          </div>
                          
                         
                    </div>
                  
                    
           
                    
        )
    }
}

export default takeOut