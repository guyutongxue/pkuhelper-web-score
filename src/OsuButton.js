import React, {Component, PureComponent} from 'react';

import './OsuButton.css';

export default function OsuButton(props) {
    return (
        <div className="osu-frame">
            <button className="osu-button" disabled={props.disabled} onClick={props.onClick}>
                {props.button_text}
            </button>
            <p>{props.text}</p>
        </div>
    )
}