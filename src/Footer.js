import React, {Component, PureComponent} from 'react';
import './Footer.css';

export default function Footer(props) {
    return (
        <div className="footer">
            <p>学期GPA和总GPA为公式计算所得，请以学校官方结果为准！</p>
            <p>
                基于&nbsp;
                <a href="https://www.gnu.org/licenses/gpl-3.0.zh-cn.html" target="_blank">GPLv3</a>
                &nbsp;协议在&nbsp;
                <a href="https://github.com/pkuhelper-web/score" target="_blank">GitHub</a>
                &nbsp;开源
            </p>
        </div>
    )
}