import React, { Component } from 'react';
import { StoreConnector } from 'hadron-react-components';
import CompassProfilerVisualize from 'components/compass-profiler-visualize';
import store from 'stores';
import actions from 'actions';

class Plugin extends Component {
  static displayName = 'CompassProfilerVisualizePlugin';

  /**
   * Connect the Plugin to the store and render.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <StoreConnector store={store}>
        <CompassProfilerVisualize actions={actions} {...this.props} />
      </StoreConnector>
    );
  }
}

export default Plugin;
export { Plugin };
