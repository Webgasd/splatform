import React from 'react'
import { SketchPicker } from 'react-color';
export default class ColorSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color:props.color,
            key:props.objKey,
            displayColorPicker: "none",
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = ()=> {
        let {displayColorPicker,key,color} =this.state;
        displayColorPicker = displayColorPicker=="none"?"block":"none";
        this.setState({displayColorPicker})
        if(displayColorPicker){
            this.props.updateColor(key,color)
        }
        return false
    }
    handleChange = (value)=>{
        let color = value.hex;
        let rgba=value.rgb
        console.log(rgba.valueOf())
        let color1="rgba("+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+")"
        console.log(color1)
        this.setState({color:color1})

    }
    render() {
        let {color,displayColorPicker} = this.state;
        return (
            <div>
                <div onClick={ this.handleClick } style={{background:color,border:"none",lineHeight:"31px",height:31,width:90,verticalAlign: "middle"}}></div>
                {displayColorPicker=="block"?
                    <div style={{position:"absolute",zIndex:66}}>
                        <SketchPicker color={this.state.color} width={340} onChange={this.handleChange} />
                    </div>
                    :null
                }
            </div>
        );
    }
}