import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'
import ChordFormat from 'chords-format'
import './App.css'

const chordFormat = new ChordFormat({chordTag: false})

const getSlidesFromOpenLPResults = (results) => results.results.slides.map((slide) => ({
  lines: slide.text.split('\n').map((line) => chordFormat.parseLine(line))
}))

class Line extends Component {
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

class Slide extends Component {
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

class App extends Component {
  constructor (props) {
    super(props)
    this.slideRefs = []
    this.state = {
      slides: [],
      currentItem: '',
      currentSlide: 0,
      offset: 0,
      offsets: []
    }
  }

  componentDidUpdate () {
    console.log(this.refs)
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      fetch('/api/poll', {headers: {'Accept': 'application/json'}})
        .then((response) => response.json())
        .then((data) => {
          if (data.results.item !== this.state.currentItem) {
            fetch('/api/controller/live/text', {headers: {'Accept': 'application/json'}})
              .then((response => response.json()))
              .then((data) => {
                this.setState({
                  slides: getSlidesFromOpenLPResults(data),
                  currentItem: data.results.item,
                  currentSlide: data.results.slide,
                  offset: 0,
                  offsets: []
                })
              })
          } else if (data.results.slide !== this.state.currentSlide) {
            this.setState({
              currentSlide: data.results.slide,
              offset: this.refs[data.results.slide]
            })
            this.setState({
              offset: this.slideRefs[data.results.slide].refs.wrapper.offsetTop
            })

          }
        })
    }, 500)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div className="App">
        <Motion
          defaultStyle={{offset: 0}}
          style={{offset: spring(this.state.offset, {stiffness: 150, damping: 15})}}
        >
          {interpolatedStyle => (
            <div className="Slides" style={{transform: `translateY(-${interpolatedStyle.offset}px)`}}>
              {this.state.slides.map((s, i) => (
                <Slide
                  lines={s.lines}
                  key={i}
                  index={i}
                  active={i === this.state.currentSlide}
                  ref={(el) => this.slideRefs[i] = el}
                />
              ))}
            </div>
          )}
      </Motion>
      </div>
    );
  }
}

export default App;
