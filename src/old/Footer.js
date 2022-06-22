import React, {Component, PureComponent} from 'react';
import './Footer.css';

class GpaToolbox extends Component {
    constructor(props) {
        super(props);
        this.state={
            x: null,
        };
    }

    set_xy() {
        let x=parseFloat(prompt('输入分数(60~100)或绩点(1~4)来换算'));
        if(x && x>=60 && x<=100) { // score
            ;
        } else if(x && x>=1 && x<=4) { // gpa
            x=100-Math.sqrt(1600/3*(4-x));
        } else { // invalid or '' or null
            x=null;
        }

        this.setState({
            x: x,
        });
    }

    render() {
        if(this.state.x===null)
            return (
                <p>绩点公式 <a onClick={this.set_xy.bind(this)}>GPA(x) = 4-3*(100-x)<sup>2</sup>/1600</a></p>
            );
        else {
            let y=4-3*Math.pow(100-this.state.x,2)/1600;
            return (
                <p>绩点公式 <a onClick={this.set_xy.bind(this)}>GPA({this.state.x.toFixed(1)}) = {y.toFixed(3)}</a></p>
            );
        }
    }
}

export default function Footer(props) {
    return (
        <div className="footer">
            <GpaToolbox />
            <br />
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