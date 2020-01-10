import React, {Component, PureComponent} from 'react';

import './OsuButton.css';

export default class OsuButton extends Component {
    constructor(props) {
        super(props);
        this.on_keypress_bound=this.on_keypress.bind(this);
    }

    on_keypress(e) {
        if((e.code==='Enter' || e.code==='Space') && !this.props.disabled)
            this.props.onClick();
    }

    componentDidMount() {
        window.addEventListener('keypress',this.on_keypress_bound);
    }
    componentWillUnmount() {
        window.removeEventListener('keypress',this.on_keypress_bound)
    }

    render() {
        return (
            <div className="osu-frame">
                <button className="osu-button" disabled={this.props.disabled} onClick={this.props.onClick}>
                    {this.props.button_text}
                </button>
                <p className="osu-text">{this.props.text}</p>
            </div>
        );
    }
}