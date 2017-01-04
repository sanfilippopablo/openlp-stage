import React, { Component } from 'react'
import Line from './Line'
import './Slide.css'

export default class Slide extends Component {
  defaultProps = {
    active: false
  }

  render () {
    const className = this.props.active ? 'slide active' : 'slide'
    return (
      <div className={className} ref='wrapper'>
        {this.props.lines.map((line, i) => <Line bits={line} key={i} />)}
      </div>
    )
  }
}
