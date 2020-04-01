import React,{Component} from 'react';
import LeftBar from './img/leftBar.png'
import RightBar from './img/rightBar.png'

class commonTableTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className='commonTableTitle'>
                <img src={LeftBar} alt={''}/>{this.props.title}<img src={RightBar} alt={''}/>
            </div>
        )
    }
}

export default commonTableTitle