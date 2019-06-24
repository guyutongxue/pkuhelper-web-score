import React, {Component, PureComponent} from 'react';
import './Footer.css';

export default function Footer(props) {
    return (
        <div className="footer">
            <p>学期GPA和总GPA为公式计算所得，请以学校官方结果为准！</p>
            <p>基于 GPLv3 协议在 <a href="https://github.com/pkuhelper-web/score" target="_blank">GitHub</a> 开源</p>
        </div>
    )
}