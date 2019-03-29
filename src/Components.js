import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import uuid from 'uuid';

import './helpers.js'

class TimersDashboard extends React.Component {

  state = {
    timers: [
      {
        id: uuid.v4(),
        title: 'Learn React',
        project: 'Programming',
        elapsed: 12545,
        runningSince: null
      },
      {
        id: uuid.v4(),
        title: 'Practice Playing the Drums',
        project: 'Music',
        elapsed: 785698,
        runningSince: null
      },
    ],
  }

  // create timer
  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  }

  createTimer = (timer) => {
    const newTimer = window.helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(newTimer)
    });
  }

  // update timer's title, project
  handleUpdateFormSubmit = (timerToUpdate) => {
    this.updateTimer(timerToUpdate);
  }

  // update timer's elapsed
  handleTimerStop = (timerStopped) => {
    this.updateTimer(timerStopped);
  }

  updateTimer = (timerToUpdate) => {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === timerToUpdate.id) {
          if (timer.elapsed !== timerToUpdate.elapsed) {
            return Object.assign({}, timer, {
              elapsed: timerToUpdate.elapsed
            });
          } else {
            return Object.assign({}, timer, {
              elapsed: timerToUpdate.elapsed,
              title: timerToUpdate.title,
              project: timerToUpdate.project,
            });
          }
        } else {
          return timer;
        }
      })
    });
  }

  // delete timer
  handleTimerDelete = (timerId) => {
    this.setState({
      timers: this.state.timers.filter((timer) => timer.id !== timerId)
    });
  }

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList
            timers={this.state.timers}
            formSubmit={this.handleUpdateFormSubmit}
            timerStop={this.handleTimerStop}
            timerDelete={this.handleTimerDelete}
          />
          <ToggleableTimerForm
            isOpen={false}
            formSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    );
  }
}

export default TimersDashboard;

class EditableTimerList extends React.Component {

  render() {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        formSubmit={this.props.formSubmit}
        timerStop={this.props.timerStop}
        timerDelete={this.props.timerDelete}
      />
    ));
    return (
      <div id='timers'>
        {timers}
      </div>
    );
  }
}

class ToggleableTimerForm extends React.Component {

  state = {
    isOpen: false
  }

  // if handleFormToggle is declared as arrow function
  // 'this' inside the function is automatically bound to the component
  // and there is no need to bind this to the function inside of a constructor
  handleFormToggle = () => {
    this.state.isOpen ? this.setState({ isOpen: false }) : this.setState({ isOpen: true });
  }

  handleFormSubmit = (timer) => {
    this.props.formSubmit(timer);
    this.handleFormToggle();
  }

  render() {
    if (this.state.isOpen) {
      return (
        <div className="">
          <TimerForm
            formToggle={this.handleFormToggle}
            formSubmit={this.handleFormSubmit}
          />
        </div>
      );
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button
            className='ui basic button icon'
            onClick={this.handleFormToggle}
          >
            <i className='plus icon' />
          </button>
        </div>
      );
    }
  }
}

class EditableTimer extends React.Component {

  state = {
    editformToggle: false
  }

  handleFormToggle = () => {
    this.state.editformToggle ? this.setState({ editformToggle: false }) : this.setState({ editformToggle: true });
  }

  handleFormSubmit = (timer) => {
    this.props.formSubmit(timer);
    this.handleFormToggle();
  }

  render() {
    if (!this.state.editformToggle) {
      return (
        <div className="">
          <Timer
            id={this.props.id}
            title={this.props.title}
            project={this.props.project}
            elapsed={this.props.elapsed}
            runningSince={this.props.runningSince}
            formToggle={this.handleFormToggle}
            timerStop={this.props.timerStop}
            timerDelete={this.props.timerDelete}
          />
        </div>
      );
    } else {
      return (
        <div className="">
          <TimerForm
            id={this.props.id}
            title={this.props.title}
            project={this.props.project}
            elapsed={this.props.elapsed}
            formToggle={this.handleFormToggle}
            formSubmit={this.handleFormSubmit}
          />
        </div>
      );
    }
  }
}

var bottomMargin = {
  marginBottom: '1em'
};

class Timer extends React.Component {

  state = {
    running: false,
    elapsed: this.props.elapsed
  }

  handleTimerToggle = () => {
    this.state.running ? this.setState({ running: false }) : this.setState({ running: true });
  }

  handleTimerStart = () => {
    this.tick();
    this.handleTimerToggle();
  }

  tick() {
    this.interval = setInterval(() => {
      this.setState({ elapsed: this.state.elapsed + 1000 })
    }, 1000);
  }

  handleTimerStop = () => {
    clearInterval(this.interval);
    this.props.timerStop({
      id: this.props.id,
      elapsed: this.state.elapsed
    });
    this.handleTimerToggle();
  }

  handleTimerDelete = () => {
    this.props.timerDelete(this.props.id);
  }

  render() {
    const elapsedString = window.helpers.renderElapsedString(this.state.elapsed);
    const btnText = this.state.running ? 'Stop': 'Start';
    const btnColor = this.state.running ? 'red': 'blue';
    const btnFunc = this.state.running ? this.handleTimerStop : this.handleTimerStart;
    return (
      <div className='ui centered card' style={bottomMargin}>
        <div className='content'>
          <div className='header'>
            {this.props.title}
          </div>
          <div className='meta'>
            {this.props.project}
          </div>
          <div className='center aligned description'>
            <h2>
              {elapsedString}
            </h2>
          </div>
          <div className='extra content'>
            <span
              className='right floated edit icon'
              onClick={this.props.formToggle}
            >
              <i className='edit icon' />
            </span>
            <span
              className='right floated trash icon'
              onClick={this.handleTimerDelete}
            >
              <i className='trash icon' />
            </span>
          </div>
        </div>
        <div
          className={'ui bottom attached ' + btnColor + ' basic button'}
          onClick={btnFunc}
        >
          {btnText}
        </div>
      </div>
    );
  }
}

class TimerForm extends React.Component {

  state = {
    title: this.props.title || '',
    project: this.props.project || '',
    elapsed: this.props.elapsed || 0
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  }

  handleProjectChange = (e) => {
    this.setState({ project: e.target.value });
  }

  handleFormSubmit = () => {
    this.props.formSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project,
      elapsed: this.state.elapsed
    });
  }

  render() {
    const submitText = this.props.id ? 'Update' : 'Create'
    return (
      <div className='ui centered card' style={bottomMargin}>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              <input
                type='text'
                value={this.state.title}
                onChange={this.handleTitleChange}
              />
            </div>
            <div className='field'>
              <label>Project</label>
              <input
                type='text'
                value={this.state.project}
                onChange={this.handleProjectChange}
              />
            </div>
            <div className='ui two bottom attached buttons'>
              <button
                className='ui basic blue button'
                onClick={this.handleFormSubmit}
              >
                {submitText}
              </button>
              <button
                className='ui basic red button'
                onClick={this.props.formToggle}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
