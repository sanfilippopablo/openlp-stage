import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'
import ChordFormat from 'chords-format'
import InfoPanel from './InfoPanel'
import Slide from './Slide'
import './App.css'

const chordFormat = new ChordFormat({chordTag: false})

const getSlidesFromOpenLPResults = (results) => results.results.slides.map((slide) => ({
  lines: slide.text.split('\n').map((line) => chordFormat.parseLine(line))
}))

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
      <InfoPanel />
      </div>
    );
  }
}

export default App;
