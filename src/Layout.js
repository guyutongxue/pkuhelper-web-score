import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';

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

function _VerticalLayout(props) {
    return (
        <div className={'layout-vertical'+(props.hide_text ? ' score-hide' : '')}>
            <div className="layout-vertical-up">{props.up}</div>
            <div className="layout-vertical-down">{props.down}</div>
        </div>
    )
}

let state_to_props=(state,ownProps)=>({
    hide_text: state.display_switch.hide_text && ownProps.need_hide_text,
});

export let VerticalLayout=connect(state_to_props)(_VerticalLayout);