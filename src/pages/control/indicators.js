import React,{Component} from 'react';

class indicators extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            this.props.type=='1'?
            <div className='indicators'>
              
                <div className='boxHeader'>快检检查指标情况</div>
                <div className='box'>
                    <div className='boxName' style={{backgroundColor:'#5413A8',paddingTop:'2px'}}>不合格批次</div>
                    <div className='boxNumber'>{this.props.no1}</div>
                </div>
                <div className='box'>
                    <div className='boxName' style={{backgroundColor:'#1FB15C',paddingTop:'10px'}}>合格批次</div>
                    <div className='boxNumber'>{this.props.yes1}</div>
                </div>
                <div style={{clear:'both'}}></div>
            </div>:
              <div className='indicators'>
              
              <div className='boxHeader'>抽检检查指标情况</div>
              <div className='box'>
                  <div className='boxName' style={{backgroundColor:'#5413A8',paddingTop:'2px'}}>不合格批次</div>
                  <div className='boxNumber'>{this.props.no2}</div>
              </div>
              <div className='box'>
                  <div className='boxName' style={{backgroundColor:'#1FB15C',paddingTop:'10px'}}>合格批次</div>
                  <div className='boxNumber'>{this.props.yes2}</div>
              </div>
              <div style={{clear:'both'}}></div>
          </div>
        )
    }
}

export default indicators