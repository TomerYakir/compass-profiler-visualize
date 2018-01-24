/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DataSet, Graph2d } from 'vis';
import 'vis/dist/vis.min.css';
import styles from './slow-queries-over-time.less';

class SlowQueriesOverTime extends Component {
  static displayName = 'SlowQueriesOverTime';

  static propTypes = {
    slowQueriesOverTime: PropTypes.array,
    selectedQueries: PropTypes.array,
    setCurrentQuery: PropTypes.func
  };

  static defaultProps = {
    slowQueriesOverTime: []
  };

  currentGroups = {}
  currentGroupsCnt = 1
  graph2d = null

  componentDidUpdate(prevProps) {
    if (!this.props.slowQueriesOverTime || this.props.slowQueriesOverTime.length === 0) {
      return this.noop();
    }
    if (this.props.slowQueriesOverTime === prevProps.slowQueriesOverTime) {
      return this.noop();
    }

    const container = document.getElementById('slowQueriesChart');

    const items = this.props.slowQueriesOverTime.map((slow) => {
      if (!this.currentGroups[slow.ns]) {
        this.currentGroups[slow.ns] = this.currentGroupsCnt;
        this.currentGroupsCnt++;
      }
      return {
        x: slow.ts,
        y: slow.duration,
        group: this.currentGroups[slow.ns]
      };
    }, this);
    const groups = new DataSet();
    Object.keys(this.currentGroups).map((key) => {
      groups.add({
        id: this.currentGroups[key],
        content: key
      });
    });

    const dataset = new DataSet(items);
    const options = {
      style: 'points',
      legend: true,
      height: '400px',
      dataAxis: {
        left: {
          title: { text: 'ms' }
        }
      }
    };
    this.graph2d = new Graph2d(container, dataset, groups, options);

    this.graph2d.on('click', (props) => {
      const selectedQueries = [];
      const chartStart = this.graph2d.timeAxis.step._start._d;
      const chartEnd = this.graph2d.timeAxis.step._end._d;
      const step = this.graph2d.timeAxis.step.step;
      const threshold = (chartEnd - chartStart) / (3 * (step + 3));
      const slowQueryKeys = Object.keys(this.props.slowQueriesOverTime);
      for (const key of slowQueryKeys) {
        const data = this.props.slowQueriesOverTime[key];
        if (Math.abs(props.time.getTime() - data.ts.getTime()) < threshold) {
          data.id = key;
          selectedQueries.push(data);
          this.props.setCurrentQuery(selectedQueries);
        }
      }
    });
  }

  // A no-operation so that the linter passes for the compass-plugin template,
  // without the need to an ignore rule, because we want the linter to fail when this
  // dependency is "for-real" not being used (ie: in an actual plugin).
  noop = () => {
    const node = ReactDOM.findDOMNode(this);
    return node;
  };

  getCode(selectedQuery) {
    return selectedQuery.query === 'N/A' ? '' : <code>${selectedQuery.query}</code>;
  }

  getCurrentDetails() {
    return this.props.selectedQueries.map((selectedQuery) => {
      return (
        <li className="list-item" key={selectedQuery.id}>
          {selectedQuery.ts.toISOString()} <b>{selectedQuery.operation}</b> {selectedQuery.ns}: {this.getCode(selectedQuery)} took {selectedQuery.duration}ms
        </li>
      );
    });
  }

  /**
   * Render TopQueries.
   *
   * @returns {React.Component} the rendered component.
   */
  render() {
    return (
        <div className={classnames(styles['slow-queries-over-time'])}>
          <h4 className={classnames(styles.title)}>Slow Queries</h4>
          <small>Click on points for details</small>
          <div id="slowQueriesChart"></div>
          <p></p>
          <div className={classnames(styles.details)}>
            <ul>
              {this.getCurrentDetails()}
            </ul>
          </div>
        </div>
    );
  }
}

export default SlowQueriesOverTime;
export { SlowQueriesOverTime };
