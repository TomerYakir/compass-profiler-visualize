import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import vis from '../../../node_modules/vis/dist/vis.min.js';
import '../../../node_modules/vis/dist/vis.min.css';

class SlowQueriesOverTime extends Component {
  static displayName = 'SlowQueriesOverTime';

  static propTypes = {
    topQueries: PropTypes.array
  };

  static defaultProps = {
    topQueries: []
  };

  currentGroups = {}
  currentGroupsCnt = 1

  componentDidMount() {

    const TIME_THRESHOLD = 60000; // for chart selection

    var container = document.getElementById("slowQueriesChart");

    var items = this.props.slowQueriesOverTime.map((slow) => {

      if (!this.currentGroups[slow.ns]) {
        this.currentGroups[slow.ns] = this.currentGroupsCnt;
        this.currentGroupsCnt++;
      }
      return {
        x: slow.ts,
        y: slow.duration,
        group: this.currentGroups[slow.ns]
      }
    }, this);

    var groups = new vis.DataSet();
    Object.keys(this.currentGroups).map((key) => {
      groups.add({
        id: this.currentGroups[key],
        content: key
      })
    })

    var dataset = new vis.DataSet(items);
    var options = {
      style:'points',

      legend: true,
      dataAxis: {
        left: {
          title: { text: 'ms' }
        }
      }
    };
    var graph2d = new vis.Graph2d(container, dataset, groups, options);
    graph2d.on('click', (props) => {
      const selectedQueries = [];
      for (const key in this.props.slowQueriesOverTime) {
          const data = this.props.slowQueriesOverTime[key];
          if (Math.abs(props.time.getTime() - data.ts.getTime()) < TIME_THRESHOLD) {
            selectedQueries.push({
              "ns": data.ns,
              "query": data.query
            })
            this.props.setCurrentQuery(selectedQueries);
          }
      }
    })
  }

  // A no-operation so that the linter passes for the compass-plugin template,
  // without the need to an ignore rule, because we want the linter to fail when this
  // dependency is "for-real" not being used (ie: in an actual plugin).


  /**
   * Render TopQueries.
   *
   * @returns {React.Component} the rendered component.
   */

  getCurrentDetails() {
    return this.props.selectedQueries.map((selectedQuery) => {
      return <li className="list-item">
        {selectedQuery.ns}: <code>{selectedQuery.query}</code>
      </li>

    })
  }

  render() {
    return (
        <div>
          <div id="slowQueriesChart"></div>
          <p></p>
          <div>
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
