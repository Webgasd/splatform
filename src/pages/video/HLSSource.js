import React, { Component } from 'react';
import Hls from 'hls.js';

export default class HLSSource extends Component {
    constructor(props, context) {
        super(props, context);
        this.hls = new Hls();
    }

    componentDidMount() {
         this.setHls()
    }
    componentWillReceiveProps() {

    }
    setHls = () => {
        const { src, video } = this.props
        if (Hls.isSupported()) {
            this.hls.loadSource(src);
            this.hls.attachMedia(video);
        }
    }
    play = () => {
        const { video } = this.props
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
        });
    }
    destroy = () => {
        if (this.hls) {
            this.hls.destroy()
        }
    }
    componentWillUnmount() {
        // destroy hls video source
        if (this.hls) {
            this.hls.destroy()
        }
    }

    render() {
        return (
                <source
                src={this.props.src}
                preload="none"
                type={this.props.type || 'application/x-mpegURL'}/>
        );
    }
}