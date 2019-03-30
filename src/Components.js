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

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  }

  createTimer = (timer) => {
    const newTimer = window.helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(newTimer)
    });
  }

  handleUpdateFormSubmit = (timerToUpdate) => {
    this.updateTimer(timerToUpdate);
  }

  updateTimer = (timerToUpdate) => {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === timerToUpdate.id) {
          return Object.assign({}, timer, {
            title: timerToUpdate.title,
            project: timerToUpdate.project
          });
        } else {
          return timer;
        }
      })
    });
  }

  handleDeleteTimer = (timerId) => {
    this.deleteTimer(timerId);
  }

  deleteTimer = (timerId) => {
    this.setState({
      timers: this.state.timers.filter((timer) => timer.id !== timerId)
    });
  }

  handleStartTimer = (timerId) => {
    this.startTimer(timerId);
  }

  startTimer = (timerId) => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === timerId) {
          return Object.assign({}, timer, {
            runningSince: now
          })
        } else {
          return timer;
        }
      })
    });
  }

  handleStopTimer = (timerId) => {
    this.stopTimer(timerId);
  }

  stopTimer = (timerId) => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === timerId) {
          const elapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + elapsed,
            runningSince: null
          })
        } else {
          return timer;
        }
      })
    });
  }

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList
            timers={this.state.timers}
            formSubmit={this.handleUpdateFormSubmit}
            deleteTimer={this.handleDeleteTimer}
            startTimer={this.handleStartTimer}
            stopTimer={this.handleStopTimer}
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
        deleteTimer={this.props.deleteTimer}
        startTimer={this.props.startTimer}
        stopTimer={this.props.stopTimer}
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

  // if handleFormOpen is declared as arrow function
  // 'this' inside the function is automatically bound to the component
  // and there is no need to bind this to the function inside of a constructor
  handleFormOpen = () => {
    this.state.isOpen ? this.setState({ isOpen: false }) : this.setState({ isOpen: true });
  }

  handleFormSubmit = (timer) => {
    this.props.formSubmit(timer);
    this.handleFormOpen();
  }

  render() {
    if (this.state.isOpen) {
      return (
        <div className="">
          <TimerForm
            formOpen={this.handleFormOpen}
            formSubmit={this.handleFormSubmit}
          />
        </div>
      );
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button
            className='ui basic button icon'
            onClick={this.handleFormOpen}
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
    editFormOpen: false
  }

  handleFormOpen = () => {
    this.state.editFormOpen ? this.setState({ editFormOpen: false }) : this.setState({ editFormOpen: true });
  }

  handleFormSubmit = (timer) => {
    this.props.formSubmit(timer);
    this.handleFormOpen();
  }

  render() {
    if (!this.state.editFormOpen) {
      return (
        <div className="">
          <Timer
            id={this.props.id}
            title={this.props.title}
            project={this.props.project}
            elapsed={this.props.elapsed}
            runningSince={this.props.runningSince}
            formOpen={this.handleFormOpen}
            deleteTimer={this.props.deleteTimer}
            startTimer={this.props.startTimer}
            stopTimer={this.props.stopTimer}
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
            formOpen={this.handleFormOpen}
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

  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  handleDeleteTimer = () => {
    this.props.deleteTimer(this.props.id);
  }

  handleStartTimer = () => {
    this.props.startTimer(this.props.id);
  }

  handleStopTimer = () => {
    this.props.stopTimer(this.props.id);
  }

  render() {
    const elapsedString = window.helpers.renderElapsedString(
      this.props.elapsed, this.props.runningSince
    );
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
              onClick={this.props.formOpen}
            >
              <i className='edit icon' />
            </span>
            <span
              className='right floated trash icon'
              onClick={this.handleDeleteTimer}
            >
              <i className='trash icon' />
            </span>
          </div>
        </div>
        <FormActionButton
          timerIsRunning={!!this.props.runningSince}
          startTimer={this.handleStartTimer}
          stopTimer={this.handleStopTimer}
        />
      </div>
    );
  }
}

class TimerForm extends React.Component {

  state = {
    title: this.props.title || '',
    project: this.props.project || ''
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
      project: this.state.project
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
                onClick={this.props.formOpen}
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


class FormActionButton extends React.Component {

  render() {
    if (this.props.timerIsRunning) {
      return (
        <div
          className='ui bottom attached red basic button'
          onClick={this.props.stopTimer}
        >
          Stop
        </div>
      );
    } else {
      return (
        <div
          className='ui bottom attached green basic button'
          onClick={this.props.startTimer}
        >
          Start
        </div>
      );
    }
  }
}
