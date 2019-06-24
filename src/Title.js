import React, {Component, PureComponent} from 'react';
import {GlobalTitle, AppSwitcher} from './infrastructure/widgets';

import './Title.css';

export default function Title(props) {
    return (
        <div className="title-bar">
            <AppSwitcher appid="score" />
            <GlobalTitle text="成绩查询" />
        </div>
    )
}