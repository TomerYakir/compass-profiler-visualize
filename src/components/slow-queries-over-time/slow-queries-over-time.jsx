/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './slow-queries-over-time.less';
import 'react-vis/dist/style.css';
import {
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
  MarkSeries,
  DiscreteColorLegend
} from 'react-vis';


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

  currentGroups = {};
  currentGroupsCnt = 1;

  renderGraph() {
    const data = this.props.slowQueriesOverTime.map((slow) => {
      if (!this.currentGroups[slow.ns]) {
        this.currentGroups[slow.ns] = this.currentGroupsCnt;
        this.currentGroupsCnt++;
      }
      return {
        x: slow.ts,
        y: slow.duration,
        color: this.currentGroups[slow.ns],
        query: slow
      };
    }, this);

    const legend = Object.keys(this.currentGroups).map((k) => {
      return {
        title: k, color: '' + this.currentGroups[k] // TODO
      };
    });

    return (
      <XYPlot
        width={1000}
        height={400}
        xType={'time'}
        colorType="category"
      >
        <XAxis/>
        <YAxis title="ms"/>
        <HorizontalGridLines />
        <VerticalGridLines/>
        <MarkSeries
          data={data}
          onValueClick={(datapoint) => {
            this.props.setCurrentQuery([datapoint.query]);
          }}
        />
        <DiscreteColorLegend items={legend}/>
      </XYPlot>
    );
  }

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
          {this.renderGraph()}
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
