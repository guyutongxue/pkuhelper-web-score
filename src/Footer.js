import React, {Component, PureComponent} from 'react';
import './Footer.css';

export default function Footer(props) {
    return (
        <div className="footer">
            <p>本项目处于内测阶段。如果界面有显示问题，或者GPA计算与学校不一致，请反馈给开发者 xmcp@pku.edu.cn</p>
            <p>基于 GPLv3 协议在 <a href="https://github.com/pkuhelper-web/score" target="_blank">GitHub</a> 开源</p>
        </div>
    )
}