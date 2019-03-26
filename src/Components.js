import React from 'react';
import 'semantic-ui-css/semantic.min.css';

class TimersDashboard extends React.Component {

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList />
          <ToggleableTimerForm
            isOpen={false}
          />
        </div>
      </div>
    );
  }
}

export default TimersDashboard;

class EditableTimerList extends React.Component {

  render() {
    return (
      <div id='timers'>
        <EditableTimer
          title='Learn React'
          project='Programming'
          elapsed='12545'
          runningSince={null}
          editFormOpen={false}
        />
        <EditableTimer
          title='Practice Playing the Drums'
          project='Music'
          elapsed='785698'
          runningSince={null}
          editFormOpen={true}
        />
      </div>
    );
  }
}

class ToggleableTimerForm extends React.Component {

  render() {
    if (this.props.isOpen) {
      return (
        <div className="">
          <TimerForm />
        </div>
      );
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button className='ui basic button icon'>
            <i className='plus icon' />
          </button>
        </div>
      );
    }
  }
}

class EditableTimer extends React.Component {

  render() {
    if (!this.props.editFormOpen) {
      return (
        <div className="">
          <Timer
            title={this.props.title}
            project={this.props.project}
            elapsed={this.props.elapsed}
            runningSince={this.props.runningSince}
          />
        </div>
      );
    } else {
      return (
        <div className="">
          <TimerForm
            title={this.props.title}
            project={this.props.project}
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

  render() {
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
              {this.props.elapsed}
            </h2>
          </div>
          <div className='extra content'>
            <span className='right floated edit icon'>
              <i className='edit icon' />
            </span>
            <span className='right floated trash icon'>
              <i className='trash icon' />
            </span>
          </div>
        </div>
        <div className='ui bottom attached blue basic button'>
          Start
        </div>
      </div>
    );
  }
}

class TimerForm extends React.Component {

  render() {
    const submitText = this.props.title ? 'Update' : 'Create'
    return (
      <div className='ui centered card' style={bottomMargin}>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              <input type='text' defaultValue={this.props.title} />
            </div>
            <div className='field'>
              <label>Project</label>
              <input type='text' defaultValue={this.props.project} />
            </div>
            <div className='ui two bottom attached buttons'>
              <button className='ui basic blue button'>
                {submitText}
              </button>
              <button className='ui basic red button'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
