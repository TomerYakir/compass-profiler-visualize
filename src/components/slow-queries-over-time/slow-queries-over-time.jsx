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

    // slow queries
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
      debugger;
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

  render() {
    return (
        <div id="slowQueriesChart"></div>
    );
  }
}

export default SlowQueriesOverTime;
export { SlowQueriesOverTime };
