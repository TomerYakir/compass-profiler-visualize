import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TopQueries from 'components/top-queries';
import SlowQueriesOverTime from 'components/slow-queries-over-time';
import ProfilerStatus from 'components/profiler-status';
import styles from './compass-profiler-visualize.less';

class CompassProfilerVisualize extends Component {
  static displayName = 'CompassProfilerVisualizeComponent';

  static propTypes = {
    actions: PropTypes.object,
    topQueries: PropTypes.array,
    operationThreshold: PropTypes.number,
    profilerLevel: PropTypes.number,
    slowQueriesOverTime: PropTypes.array,
    selectedQueries: PropTypes.array,
    error: PropTypes.any
  };

  static defaultProps = {
    topQueries: [],
    operationThreshold: 15,
    profilerLevel: -1,
    slowQueriesOverTime: [],
    selectedQueries: [],
    error: null
  };

  /**
   * TODO: Render the error case with the error message.
   */
  renderError() {
    return (
      <div className={classnames(styles.main)}>
        {this.props.error.message}
      </div>
    );
  }

  /**
   * Render CompassProfilerVisualize component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    if (this.props.error) {
      return this.renderError();
    }
    return (
      <div className={classnames(styles.main)}>
        <ProfilerStatus
          operationThreshold={this.props.operationThreshold}
          profilerLevel={this.props.profilerLevel}
          setProfilerConfig={this.props.actions.setProfilerConfig}
        />
        <p></p>
        <TopQueries topQueries={this.props.topQueries} />
        <p></p>
        <SlowQueriesOverTime
          slowQueriesOverTime={this.props.slowQueriesOverTime}
          selectedQueries={this.props.selectedQueries}
          setCurrentQuery={this.props.actions.setCurrentQuery}
        />
      </div>
    );
  }
}

export default CompassProfilerVisualize;
export { CompassProfilerVisualize };
