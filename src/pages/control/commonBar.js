import React,{Component} from 'react';

class commonBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    chooseColor = () => {
        if(parseInt(this.props.rate) <= 30){
            return <div style={{backgroundColor:'#D81151',width:this.props.rate,height:'8px'}}></div>
        }else if (parseInt(this.props.rate) <= 50) {
            return <div style={{backgroundColor:'#DB8E02',width:this.props.rate,height:'8px'}}></div>
        }else if (parseInt(this.props.rate) <= 70) {
            return <div style={{backgroundColor:'#158FD9',width:this.props.rate,height:'8px'}}></div>
        }else {
            return <div style={{backgroundColor:'#13DA51',width:this.props.rate,height:'8px'}}></div>
        }
     //   console.log(parseInt(this.props.rate))
      
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