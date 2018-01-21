import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class TopQueries extends Component {
  static displayName = 'TopQueries';

  static propTypes = {
    topQueries: PropTypes.array
  };

  static defaultProps = {
    topQueries: []
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
   * Render TopQueries.
   *
   * @returns {React.Component} the rendered component.
   */

  render() {
    return (
          <BootstrapTable
            data={this.props.topQueries}
            striped
            condensed

            hover>
            <TableHeaderColumn isKey width='0' dataField='ix'>Ix</TableHeaderColumn>
            <TableHeaderColumn dataField='ns' width='200' filter={ { type: 'TextFilter', delay: 1000 } } dataSort={ true }>Namespace</TableHeaderColumn>
            <TableHeaderColumn dataField='operation' dataSort={ true }>Operation</TableHeaderColumn>
            <TableHeaderColumn dataField='query' width='300' dataSort={ true }>Query</TableHeaderColumn>
            <TableHeaderColumn dataField='count' dataSort={ true }>Count</TableHeaderColumn>
            <TableHeaderColumn dataField='min' dataSort={ true }>Min (ms)</TableHeaderColumn>
            <TableHeaderColumn dataField='max' dataSort={ true }>Max (ms)</TableHeaderColumn>
            <TableHeaderColumn dataField='mean' dataSort={ true }>Mean (ms)</TableHeaderColumn>
            <TableHeaderColumn dataField='percNintyFive' dataSort={ true }>95-tile (ms)</TableHeaderColumn>
            <TableHeaderColumn dataField='sum' dataSort={ true }>Sum (ms)</TableHeaderColumn>
          </BootstrapTable>
    );
  }
}

export default TopQueries;
export { TopQueries };
