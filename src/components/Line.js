import React, { Component } from 'react'
import './Line.css'

export default class Line extends Component {
  constructor (props) {
    super(props)
    this.bitsRefs = []
    this.state = {
      offsets: []
    }
  }

  componentDidMount () {
    // Adjust overlapping bits
    this.bitsRefs.forEach((bit, i) => {
      const chord = bit.children[0]
      if (chord) {
        const offset = Math.max(0, chord.offsetWidth - bit.offsetWidth)
        if (offset > 0) {
          bit.style.marginRight = `${offset + 10}px`
        }
      }
    })
  }

  render () {
    return (
      <div className='line'>
        {this.props.bits.map((bit, i) => {
          let offsetMargin = 0
          let chordSpan
          if (bit.chord !== null) {
            chordSpan = <span className='chord'>{bit.chord}</span>
          }
          return (
            <span
              ref={(el) => this.bitsRefs[i] = el}
              className='bit'
              key={i}
              style={{marginRight: `0px`}}>
              {chordSpan}{bit.text}
            </span>)
        })}
      </div>
    )
  }
}
