import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import styles from './top-queries.less';

class TopQueries extends Component {
  static displayName = 'TopQueries';

  static propTypes = {
    topQueries: PropTypes.array
  };

  static defaultProps = {
    topQueries: []
  };

  /**
   * Render TopQueries.
   *
   * @returns {React.Component} the rendered component.
   */
  render() {
    return (
      <div className={classnames(styles['top-queries'])}>
        <h4 className={classnames(styles.title)}>Top Queries</h4>
          <BootstrapTable
            data={this.props.topQueries}
            striped
            condensed
            hover>
            <TableHeaderColumn isKey width="0" dataField="ix">Ix</TableHeaderColumn>
            <TableHeaderColumn dataField="ns" width="200" filter={ { type: 'TextFilter', delay: 1000 } } dataSort>Namespace</TableHeaderColumn>
            <TableHeaderColumn dataField="operation" dataSort>Operation</TableHeaderColumn>
            <TableHeaderColumn dataField="query" width="300" dataSort>Query</TableHeaderColumn>
            <TableHeaderColumn dataField="count" dataSort>Count</TableHeaderColumn>
            <TableHeaderColumn dataField="min" dataSort>Min (ms)</TableHeaderColumn>
            <TableHeaderColumn dataField="max" dataSort>Max (ms)</TableHeaderColumn>
            <TableHeaderColumn dataField="mean" dataSort>Mean (ms)</TableHeaderColumn>
            <TableHeaderColumn dataField="percNintyFive" dataSort>95-tile (ms)</TableHeaderColumn>
            <TableHeaderColumn dataField="sum" dataSort>Sum (ms)</TableHeaderColumn>
          </BootstrapTable>
        </div>
    );
  }
}

export default TopQueries;
export { TopQueries };
