import React, { Component } from 'react'
import './Line.css'

export default class Line extends Component {
  render () {
    return (
      <div className='line'>
        {this.props.bits.map((bit, i) => {
          let chordSpan = bit.chord ? <span className='chord'>{bit.chord}</span> : null
          let leftMargin = 0
          if (bit.chord !== null) {
            leftMargin = Math.max(0, bit.chord.length - bit.text.length + 1.3)
          }
          return <span className='bit' key={i} style={{marginRight: leftMargin + 'em'}}>{chordSpan}{bit.text}</span>
        })}
      </div>
    )
  }
}
