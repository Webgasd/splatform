import React,{Component} from 'react';
import CommonTableTitle from './commonTableTitle'

class regulationsNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className='regulationsNumber'>
                <CommonTableTitle title={'监管数量'}/>
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <hr/>
                    <div className='regulationsNumberContent'>
                        <div className='regulationsNumberLabel'>监管企业店铺数量:</div>
                        <div className='regulationsNumberText'><hr/>1</div>
                        <div className='regulationsNumberText'><hr/>2</div>
                        <div className='regulationsNumberText'><hr/>3</div>
                        <div className='regulationsNumberText'><hr/>4</div>
                        <div className='regulationsNumberText'><hr/>5</div>
                    </div>
                    <hr/>
                    <hr/>
                    <div className='regulationsNumberContent'>
                        <div className='regulationsNumberLabel'>已人工复验店铺数量:</div>
                        <div className='regulationsNumberText'><hr/>1</div>
                        <div className='regulationsNumberText'><hr/>2</div>
                        <div className='regulationsNumberText'><hr/>3</div>
                        <div className='regulationsNumberText'><hr/>4</div>
                        <div className='regulationsNumberText'><hr/>5</div>
                    </div>
                    <hr/>
                </div>
            </div>
        )
    }
}

export default regulationsNumber