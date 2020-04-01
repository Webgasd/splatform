import React,{Component} from 'react';

class commonBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    chooseColor = () => {
        if(this.props.rate <= 20){
            return <div style={{backgroundColor:'#D81151',width:this.props.rate+'%',height:'8px'}}></div>
        }else if (this.props.rate <= 40) {
            return <div style={{backgroundColor:'#DB8E02',width:this.props.rate+'%',height:'8px'}}></div>
        }else{
            return <div style={{backgroundColor:'#158FD9',width:this.props.rate+'%',height:'8px'}}></div>
        }
    }

    render() {
        return (
            <div className='maxLength'>
                {this.chooseColor()}
            </div>
        )
    }
}

export default commonBar