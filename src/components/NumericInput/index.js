import React from 'react';
import { Input } from 'antd';

export default class NumericInput extends React.Component {
    onChange = e => {
        const { value } = e.target;
        const reg = /^([0-9]*)$/;
        if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
            this.props.onChange(value);
        }
    };

    render() {
        return (
                <Input
                    {...this.props}
                    onChange={this.onChange}
                />
        );
    }
}