import React from 'react'
import './style.less'
import { unitName } from "../../axios/commonSrc";

export default class Footer extends React.Component {
    render() {
        return (
            <div className="footer">
                版权所有：{unitName}市场监督管理局（推荐使用谷歌浏览器，可以获得更佳操作页面体验） 技术支持：济南云科睿信息科技有限公司
                {/*山东正元冶达科技发展有限公司*/}
                {/*中国移动通信集团山东有限公司临清分公司*/}
                {/*山东德全信息系统工程有限公司*/}
                {/*济南云科睿信息科技有限公司*/}
                {/*青岛世纪亿联信息科技有限公司*/}
            </div>
        );
    }
}