import React,{Component} from 'react';
import "video-react/dist/video-react.css";
import { Player } from 'video-react';
import {commonUrl} from "../../../axios/commonSrc";

export default class VideoView extends React.Component{
    state={}

    render() {
        return (
            <div>
                <Player
                    playsInline
                    poster="/assets/poster.png"
                    src={commonUrl+'/upload/picture/'+JSON.parse(this.props.materialInfo.content)[0].response.data}
                    ref="player"
                />
            </div>
        )
    }
}