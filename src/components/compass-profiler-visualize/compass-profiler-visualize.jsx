import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ToggleButton from 'components/toggle-button';

import styles from './compass-profiler-visualize.less';

class CompassProfilerVisualize extends Component {
  static displayName = 'CompassProfilerVisualizeComponent';

  static propTypes = {
    actions: PropTypes.object.isRequired,
    status: PropTypes.oneOf(['enabled', 'disabled'])
  };

  static defaultProps = {
    status: 'enabled'
  };

  onClick = () => {
    this.props.actions.toggleStatus();
  }

  /**
   * Render CompassProfilerVisualize component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <div className={classnames(styles.root)}>
        <h2 className={classnames(styles.title)}>CompassProfilerVisualize Plugin</h2>
        <p>Visualize system profiler. Identify top slow queries and show slow queries over time.</p>
        <p>The current status is: <code>{this.props.status}</code></p>
        <ToggleButton onClick={this.onClick} />
      </div>
    );
  }
}

export default CompassProfilerVisualize;
export { CompassProfilerVisualize };
