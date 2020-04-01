import React,{Component} from 'react';
import "video-react/dist/video-react.css";
import {message} from "antd";
import { Player } from 'video-react';
import {commonUrl} from "../../../axios/commonSrc";

class tutorial extends React.Component{
    state={
        checkPoint:[0,0,0]
    }

    tick = () => {
        let  {checkPoint} = this.state;
        let  timePoint=[0,0,0];
        const { player } = this.refs.player.getState()
        const currentTime = Math.ceil(player.currentTime)//向上取整,后台要排除0的情况
        const allTime = player.duration;
        timePoint[0] = Math.ceil(allTime*0.3);
        timePoint[1] = Math.ceil(allTime*0.6);
        timePoint[2] = Math.ceil(allTime*0.9);
        const reachPoint = timePoint.indexOf(currentTime)
        if(reachPoint > -1){
            checkPoint[reachPoint] = 1
            this.setState({
                checkPoint:checkPoint
            })
        }
        if(checkPoint.indexOf(0)===-1){
            message.info('已完成学习');

            let {materialInfo} = this.props;
            materialInfo.completionRate=1;
            this.props.dispatchCompletion(materialInfo);
            clearInterval(this.interval);
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.interval);
    }

    submitCheckPoint = () => {
        fetch('https://www.easy-mock.com/mock/59801fd8a1d30433d84f198c/example/user/all').then(res => {
            //触发父组件再次请求数据
            this.props.reCallback()
        })
    }

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

export default tutorial