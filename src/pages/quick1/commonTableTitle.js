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
            <div className='commonTableTitle1'
            //  style={{backgroundImage: "url(" + require("./img/3.png") + ")",}}
             >
                <img src={LeftBar} alt={''}/>{this.props.title}<img src={RightBar} alt={''}/>
            </div>
        )
    }
}

export default commonTableTitle