import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TopQueries from 'components/top-queries';
import SlowQueriesOverTime from 'components/slow-queries-over-time';

import styles from './compass-profiler-visualize.less';

class CompassProfilerVisualize extends Component {
  static displayName = 'CompassProfilerVisualizeComponent';

  static propTypes = {
    actions: PropTypes.object.isRequired,
    topQueries: PropTypes.array
  };

  static defaultProps = {
    topQueries: []
  };

  onClick = () => {
    this.props.actions.refresh();
  }

  /**
   * Render CompassProfilerVisualize component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <div >
        <h4 className={classnames(styles.title)}>Top Queries</h4>
        <TopQueries topQueries={this.props.topQueries} />
        <p></p>
        <h4 className={classnames(styles.title)}>Slow Queries</h4>
        <SlowQueriesOverTime
          slowQueriesOverTime={this.props.slowQueriesOverTime}
          currentQueryDetails={this.props.currentQueryDetails}
          />
      </div>
    );
  }
}

export default CompassProfilerVisualize;
export { CompassProfilerVisualize };
