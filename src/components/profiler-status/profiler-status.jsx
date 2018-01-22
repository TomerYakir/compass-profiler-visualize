import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './profiler-status.less';

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

  render() {
    return (
      <div>
        <h4 className={classnames(styles.title)}>Profiler Status</h4>
      </div>
    );
  }
}

export default ProfilerStatus;
export { ProfilerStatus };
