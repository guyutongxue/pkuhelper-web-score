import React, {Component, PureComponent} from 'react';
import {connect} from 'react-redux';

import './Layout.css';

// stolen from webhole
class ClickHandler extends PureComponent {
    constructor(props) {
        super(props);
        this.state={
            moved: true,
            init_y: 0,
            init_x: 0,
        };
        this.on_begin_bound=this.on_begin.bind(this);
        this.on_move_bound=this.on_move.bind(this);
        this.on_end_bound=this.on_end.bind(this);

        this.MOVE_THRESHOLD=3;
        this.last_fire=0;
    }

    on_begin(e) {
        //console.log('click',(e.touches?e.touches[0]:e).screenY,(e.touches?e.touches[0]:e).screenX);
        this.setState({
            moved: false,
            init_y: (e.touches?e.touches[0]:e).screenY,
            init_x: (e.touches?e.touches[0]:e).screenX,
        });
    }
    on_move(e) {
        if(!this.state.moved) {
            let mvmt=Math.abs((e.touches?e.touches[0]:e).screenY-this.state.init_y)+Math.abs((e.touches?e.touches[0]:e).screenX-this.state.init_x);
            //console.log('move',mvmt);
            if(mvmt>this.MOVE_THRESHOLD)
                this.setState({
                    moved: true,
                });
        }
    }
    on_end(event) {
        //console.log('end');
        if(!this.state.moved && !event.target.closest('.prevent-click-handler'))
            this.do_callback(event);
        this.setState({
            moved: true,
        });
    }

    do_callback(event) {
        if(this.last_fire+100>+new Date()) return;
        this.last_fire=(+new Date());
        this.props.callback(event);
    }

    render() {
        return (
            <div onTouchStart={this.on_begin_bound} onMouseDown={this.on_begin_bound}
                 onTouchMove={this.on_move_bound} onMouseMove={this.on_move_bound}
                 onClick={this.on_end_bound} >
                {this.props.children}
            </div>
        )
    }
}

export function RowLayout(props) {
    return (
        <div className="layout-row" style={props.style||{}}>
            <div className="layout-row-left">{props.left}</div>
            <div className="layout-row-middle">{props.middle}</div>
            <div className="layout-row-right">{props.right}</div>
        </div>
    )
}

class _VerticalLayout extends PureComponent {
    constructor(props) {
        super(props);
        this.state={
            show_extra: false,
        }
    }

    on_click(e) {
        if(this.props.extra && !e.target.closest('a'))
            this.setState((prevState)=>({
                show_extra: !prevState.show_extra,
            }));
    }

    render() {
        return (
            <div className={'layout-vertical'+(this.props.hide_text ? ' score-hide' : '')}>
                <ClickHandler callback={this.on_click.bind(this)}>
                    <div className="layout-vertical-up">{this.props.up}</div>
                    <div className="layout-vertical-down">{this.props.down}</div>
                    {!!this.props.extra &&
                        <div className={
                            'layout-vertical-extra layout-vertical-extra-'+(this.state.show_extra?'show':'hide')
                        }>{this.props.extra}</div>
                    }
                </ClickHandler>
            </div>
        );
    }
}

let state_to_props=(state,ownProps)=>({
    hide_text: state.display_switch.hide_text && ownProps.need_hide_text,
});

export let VerticalLayout=connect(state_to_props)(_VerticalLayout);