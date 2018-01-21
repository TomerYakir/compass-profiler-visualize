import Reflux from 'reflux';
import StateMixin from 'reflux-state-mixin';
import CompassProfilerVisualizeActions from 'actions';

const debug = require('debug')('mongodb-compass:stores:compass-profiler-visualize');

/**
 * Compass Profiler Visualize store.
 */
const CompassProfilerVisualizeStore = Reflux.createStore({

  mixins: [StateMixin.store],

  listenables: CompassProfilerVisualizeActions,

  mockup: true,
  compass: false,
  data: {},

  init() {
    this.refresh();
  },

  refresh() {
    if (this.mockup) {
      this.data = this.getMockState();
      this.setState(this.data);
    }
  },

  onActivated(appRegistry) {

     appRegistry.on('data-service-connected', (error, dataService) => {
       // dataService is connected or errored.
       // DataService API: https://github.com/mongodb-js/data-service/blob/master/lib/data-service.js
     });

     appRegistry.on('database-changed', (namespace) => {
    //   // The database has changed.
    //   // Namespace format: 'database.collection';
    //   // Collection selected: 'database.collection';
    //   // Database selected: 'database';
    //   // Instance selected: '';
    });

  },

  /**
   * Initialize the Compass Profiler Visualize store state. The returned object must
   * contain all keys that you might want to modify with this.setState().
   *
   * @return {Object} initial store state.
   */
  getInitialState() {
    return {
        "topQueries": [],
        "slowQueriesOverTime": [],
        "selectedQueries": []
    };
  },

  setCurrentQuery(selectedQueries) {
    debugger;
    this.data.selectedQueries = selectedQueries
    this.setState(
      {selectedQueries: selectedQueries}
    );
  },

  /**
   * log changes to the store as debug messages.
   * @param  {Object} prevState   previous state.
   */
  storeDidUpdate(prevState) {
    debug('CompassProfilerVisualize store changed from', prevState, 'to', this.state);
  },

  getMockState() {
    return {
      "topQueries": [
      {
        "ix": 1,
        "ns": "audits.events",
        "operation": "find",
        "query": "{type: 1, ts: 1}",
        "count": 300,
        "min": 149,
        "max": 16300,
        "mean": 4320,
        "percNintyFive": 8722,
        "sum": 124230
      },
      {
        "ix": 2,
        "ns": "audits.customerEvents",
        "operation": "find",
        "query": "{type: 1, ts: 1, customer: 1}",
        "count": 133,
        "min": 112,
        "max": 19300,
        "mean": 5110,
        "percNintyFive": 9722,
        "sum": 77230
      }
    ],
    "slowQueriesOverTime": [
      {
        "ts": new Date(Date.UTC(2018, 1, 8, 14, 0, 0)),
        "ns": "audits.events",
        "operation": "find",
        "query": "{type: 'sdfsdf', ts: {$gt: 1739992992}}",
        "duration": 10030
      },
      {
        "ts": new Date(Date.UTC(2018, 1, 8, 14, 5, 0)),
        "ns": "audits.events",
        "operation": "find",
        "query": "{type: 'ababa', ts: {$gt: 1739992992}}",
        "duration": 8192
      },
      {
        "ts": new Date(Date.UTC(2018, 1, 8, 14, 6, 0)),
        "ns": "audits.customerEvents",
        "operation": "find",
        "query": "{type: 'ababa', ts: {$gt: 1739992992}, customer: 'assas'}",
        "duration": 1282
      }
    ],
    "selectedQueries": []
    }
  }

});

export default CompassProfilerVisualizeStore;
export { CompassProfilerVisualizeStore };
