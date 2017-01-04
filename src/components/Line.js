import React, { Component } from 'react'
import './Line.css'

export default class Line extends Component {
  render () {
    return (
      <div className='line'>
        {this.props.bits.map((bit, i) => {
          let offsetMargin = 0
          let chordSpan
          if (bit.chord !== null) {
            chordSpan = <span className='chord'>{bit.chord}</span>
            offsetMargin = Math.max(0, bit.chord.length - bit.text.length + 1.3)
          }
          return (
            <span
              className='bit'
              key={i}
              style={{marginRight: offsetMargin + 'em'}}>
              {chordSpan}{bit.text}
            </span>)
        })}
      </div>
    )
  }
}
