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
    actions: PropTypes.object.isRequired,
    topQueries: PropTypes.array
  };

  static defaultProps = {
    topQueries: []
  };

  setCurrentQuery = (selectedQueries) => {
    this.props.actions.setCurrentQuery(selectedQueries);
  };

  setProfilerConfig = (profileLevel, threshold) => {
    this.props.actions.setProfilerConfig(profileLevel, threshold);
  };

  transProfilerConfig = (profileLevel) => {
    this.props.actions.transProfilerConfig(profileLevel);
  };

  /**
   * Render CompassProfilerVisualize component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <div className={classnames(styles.main)}>
        <ProfilerStatus
          operationThreshold={this.props.operationThreshold}
          profilerLevel={this.props.profilerLevel}
          toProfilerLevel={this.props.profilerLevel}
          setProfilerConfig={this.setProfilerConfig}
          transProfilerConfig={this.transProfilerConfig}
        />
        <p></p>
        <TopQueries topQueries={this.props.topQueries} />
        <p></p>
        <SlowQueriesOverTime
          slowQueriesOverTime={this.props.slowQueriesOverTime}
          selectedQueries={this.props.selectedQueries}
          setCurrentQuery={this.setCurrentQuery}
          />
      </div>
    );
  }
}

export default CompassProfilerVisualize;
export { CompassProfilerVisualize };
