import React, { Component } from 'react'
import dateformat from 'dateformat'
import './Clock.css'

export default class Clock extends Component {
  constructor (props) {
    super(props)
    this.state = {
      time: ''
    }
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      this.setState({time: dateformat(new Date(), 'HH:MM')})
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    return (
      <div className="Clock">{this.state.time}</div>
    )
  }
}
