import React, {Component, PureComponent} from 'react';

import './Layout.css';

export function RowLayout(props) {
    return (
        <div className="layout-row" style={props.style||{}}>
            <div className="layout-row-left">{props.left}</div>
            <div className="layout-row-middle">{props.middle}</div>
            <div className="layout-row-right">{props.right}</div>
        </div>
    )
}

export function VerticalLayout(props) {
    return (
        <div className="layout-vertical">
            <div className="layout-vertical-up">{props.up}</div>
            <div className="layout-vertical-down">{props.down}</div>
        </div>
    )
}