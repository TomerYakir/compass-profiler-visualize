import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './profiler-status.less';
import { Radio, Modal, Button } from 'react-bootstrap';
import '../../../node_modules/react-bootstrap-modal/lib/css/rbm-patch.css';

class ProfilerStatus extends Component {
  static displayName = 'ProfilerStatus';

  static propTypes = {
    profilerLevel: PropTypes.number,
    operationThreshold: PropTypes.number
  };

  static defaultProps = {
    profilerLevel: -1,
    operationThreshold: -1
  };


  componentDidMount() {
    this.noop();
  }

  // A no-operation so that the linter passes for the compass-plugin template,
  // without the need to an ignore rule, because we want the linter to fail when this
  // dependency is "for-real" not being used (ie: in an actual plugin).
  noop = () => {
    const node = ReactDOM.findDOMNode(this);
    return node;
  };

  /**
   *
   * @returns {React.Component} the rendered component.
   */

  getProfilerState() {

    switch (this.props.profilerLevel) {
      case 0: // disabled
        return <span className="pull-right label label-default">DISABLED</span>
        break;
      case 1: // slow operations
        return <span className="pull-right label label-primary">ONLY SLOW OPS</span>
      case 2: // everything
        return <span className="pull-right label label-info">ALL OPERATIONS</span>
      default:
        return <span className="pull-right label label-warning">UNKNOWN</span>
    }
  }

  constructor(props){
    super(props);

    this.state = {
      open: false,
      toProfilerLevel: -1,
      toThreshold: -1
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props != prevProps) {
      this.setState({
        toProfilerLevel: this.props.profilerLevel,
        toThreshold: this.props.operationThreshold
      })
    }
  }

  render() {

    let close = () => this.setState({ open: false });
    let saveAndClose = () => {
      this.props.setProfilerConfig(this.state.toProfilerLevel, parseInt(this.state.toThreshold));
      this.setState({ open: false });
    }
    return (
      <div>
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
                checked={this.state.toProfilerLevel == 0}
                onChange={ (e) => { this.setState({toProfilerLevel: 0}) }} >Profiler Off</Radio>
              <Radio name="groupOptions"
                checked={this.state.toProfilerLevel == 1}
                onChange={ (e) => { this.setState({toProfilerLevel: 1}) }} >Slow Operations Only</Radio>
              <Radio name="groupOptions"
                checked={this.state.toProfilerLevel == 2}
                onChange={ (e) => { this.setState({toProfilerLevel: 2}) }} >All Operations</Radio>
            </div>
            <div className="form-group">
              <label htmlFor="threshold">Threshold (ms):</label>
              <input type="number"
                value={this.state.toThreshold}
                onChange={ (e) => { this.setState({toThreshold: e.target.value }) }}
                className="form-control" id="threshold"></input>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle='primary' onClick={saveAndClose}>
              Save
            </Button>
            <Button onClick={close}>Close</Button>
          </Modal.Footer>
        </Modal>

        <button
          className='btn btn-primary btn-xs'
          onClick={() => this.setState({ open: true }) }>
          Configure Profiler
        </button>
      </div>
    );
  }
}

export default ProfilerStatus;
export { ProfilerStatus };
