import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './profiler-status.less';
import { Radio, Modal, Button } from 'react-bootstrap';
import 'react-bootstrap-modal/lib/css/rbm-patch.css';

const PROFILER_STATE = {
  0: 'DISABLED',
  1: 'ONLY SLOW OPS',
  2: 'ALL OPERATIONS'
};

class ProfilerStatus extends Component {
  static displayName = 'ProfilerStatus';

  static propTypes = {
    profilerLevel: PropTypes.number,
    operationThreshold: PropTypes.number,
    setProfilerConfig: PropTypes.func
  };

  static defaultProps = {
    profilerLevel: -1,
    operationThreshold: 15
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      toProfilerLevel: props.profilerLevel,
      toThreshold: props.operationThreshold
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      toProfilerLevel: nextProps.profilerLevel,
      toThreshold: nextProps.operationThreshold
    });
  }

  getProfilerState() {
    return (
      <span className="pull-right label label-default">
        {PROFILER_STATE[this.props.profilerLevel]}
      </span>
    );
  }

  render() {
    const close = () => this.setState({ open: false });
    const saveAndClose = () => {
      this.props.setProfilerConfig(this.state.toProfilerLevel, parseInt(this.state.toThreshold, 10));
      this.setState({ open: false });
    };

    return (
      <div className={classnames(styles['profiler-status'])}>
        <span className="pull-right label label-info">Threshold: {this.props.operationThreshold}ms</span>
        {this.getProfilerState()}

        <Modal
           show={this.state.open} onHide={close} >
          <Modal.Header closeButton>
            <Modal.Title>Configure Profiler</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <Radio name="groupOptions"
                checked={this.state.toProfilerLevel === 0}
                onChange={ () => { this.setState({toProfilerLevel: 0}); }} >Profiler Off</Radio>
              <Radio name="groupOptions"
                checked={this.state.toProfilerLevel === 1}
                onChange={ () => { this.setState({toProfilerLevel: 1}); }} >Slow Operations Only</Radio>
              <Radio name="groupOptions"
                checked={this.state.toProfilerLevel === 2}
                onChange={ () => { this.setState({toProfilerLevel: 2}); }} >All Operations</Radio>
            </div>
            <div className="form-group">
              <label htmlFor="threshold">Threshold (ms):</label>
              <input type="number"
                value={this.state.toThreshold}
                onChange={ (e) => { this.setState({toThreshold: e.target.value }); }}
                className="form-control" id="threshold"/>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="primary" onClick={saveAndClose}>
              Save
            </Button>
            <Button onClick={close}>Close</Button>
          </Modal.Footer>
        </Modal>

        <button
          className="btn btn-primary btn-xs"
          onClick={() => this.setState({ open: true }) }>
          Configure Profiler
        </button>
      </div>
    );
  }
}

export default ProfilerStatus;
export { ProfilerStatus };
