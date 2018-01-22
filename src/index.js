import CompassProfilerVisualizePlugin from './plugin';
import CompassProfilerVisualizeActions from 'actions';
import CompassProfilerVisualizeStore from 'stores';

/**
 * A sample role for the component.
 */
const ROLE = {
  name: 'Profiler',
  component: CompassProfilerVisualizePlugin
};

/**
 * Activate all the components in the Compass Profiler Visualize package.
 * @param {Object} appRegistry - The Hadron appRegisrty to activate this plugin with.
 **/
function activate(appRegistry) {
  // Register the CompassProfilerVisualizePlugin as a role in Compass
  //
  // Available roles are:
  //   - Instance.Tab: { name: <String>, component: <React.Component>, order: <Number> }
  //   - Database.Tab: { name: <String>, component: <React.Component>, order: <Number> }
  //   - Collection.Tab: { name: <String>, component: <React.Component>, order: <Number> }
  //   - CollectionHUD.Item: { name <String>, component: <React.Component> }
  //   - Header.Item: { name: <String>, component: <React.Component>, alignment: <String> }

  appRegistry.registerRole('Database.Tab', ROLE);
  appRegistry.registerAction('CompassProfilerVisualize.Actions', CompassProfilerVisualizeActions);
  appRegistry.registerStore('CompassProfilerVisualize.Store', CompassProfilerVisualizeStore);
}

/**
 * Deactivate all the components in the Compass Profiler Visualize package.
 * @param {Object} appRegistry - The Hadron appRegisrty to deactivate this plugin with.
 **/
function deactivate(appRegistry) {
  appRegistry.deregisterRole('Database.Tab', ROLE);
  appRegistry.deregisterAction('CompassProfilerVisualize.Actions');
  appRegistry.deregisterStore('CompassProfilerVisualize.Store');
}

export default CompassProfilerVisualizePlugin;
export { activate, deactivate };
