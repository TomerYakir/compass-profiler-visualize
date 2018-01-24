import Reflux from 'reflux';
import StateMixin from 'reflux-state-mixin';
import CompassProfilerVisualizeActions from 'actions';
import percentile from 'percentile';
const ns = require('mongodb-ns');

const debug = require('debug')('mongodb-compass:stores:compass-profiler-visualize');

const MAX_SLOW_QUERIES = 10000;

/**
 * Compass Profiler Visualize store.
 */
const CompassProfilerVisualizeStore = Reflux.createStore({

  mixins: [StateMixin.store],

  listenables: CompassProfilerVisualizeActions,
  dataService: null,
  queryShapeDetails: {},
  currentDatabase: null,

  onActivated(appRegistry) {
    appRegistry.on('data-service-connected', (error, dataService) => {
      if (error) {
        this.setState({error: error});
      } else {
        this.dataService = dataService;
      }
    });

    appRegistry.on('database-changed', (namespace) => {
      this.currentDatabase = ns(namespace).database;
      this.loadDataFromServer();
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
      topQueries: [],
      slowQueriesOverTime: [],
      selectedQueries: [],
      profilerLevel: -1,
      operationThreshold: 15,
      error: null
    };
  },

  getQueryShape(query, doc) {
    const shape = {};
    const keys = Object.keys(query);
    for (const key of keys) {
      shape[keys[key]] = 1;
    }
    const shapeKey = JSON.stringify(shape) + ':' + doc.ns + ':' + doc.op;
    if (!this.queryShapeDetails[shapeKey]) {
      this.queryShapeDetails[shapeKey] = {
        'ns': doc.ns,
        'operation': doc.op,
        'query': JSON.stringify(shape),
        'count': 1,
        'min': doc.millis.value,
        'max': doc.millis.value,
        'mean': 0,
        'percNintyFive': 0,
        'sum': doc.millis.value,
        'values': [doc.millis.value]
      };
    } else {
      const details = this.queryShapeDetails[shapeKey];
      details.count++;
      details.min = doc.millis.value < details.min ? doc.millis.value : details.min;
      details.max = doc.millis.value > details.max ? doc.millis.value : details.max;
      details.sum += doc.millis.value;
      details.values.push(doc.millis.value);
      this.queryShapeDetails[shapeKey] = details;
    }
  },

  getSlowQueries() {
    const profileCollectionName = this.currentDatabase + '.system.profile';
    const filter = {'ns': {'$ne': profileCollectionName}};
    const findOptions = {
      fields: { op: true, ns: true, query: true, command: true, millis: true, ts: true },
      skip: 0,
      limit: MAX_SLOW_QUERIES,
      promoteValues: false
    };
    this.dataService.find(profileCollectionName, filter, findOptions, (error, documents) => {
      // console.log("getSlowQueries:after find");
      if (error) {
        // console.error('getSlowQueries:error - ' + error);
        this.setState({error: error});
      } else {
        // console.log("getSlowQueries:no errors");
        const slowQueries = [];
        for (const doc of documents) {
          const docToAdd = {
            'ts': doc.ts,
            'ns': doc.ns,
            'operation': doc.op,
            'duration': doc.millis.value
          };
          if (['insert', 'getmore', 'killcursors'].indexOf(doc.op) > -1 ) { // TODO - implement getMore
            docToAdd.query = 'N/A';
          } else if (['command'].indexOf(doc.op) > -1) {
            docToAdd.query = JSON.stringify(doc.command);
          } else if (['remove', 'update'].indexOf(doc.op) > -1) {
            docToAdd.query = JSON.stringify(doc.query);
          } else { // find
            docToAdd.query = JSON.stringify(doc.query);
            this.getQueryShape(doc.query.filter, doc);
          }
          slowQueries.push(docToAdd);
        }
        const topQueries = [];
        let idx = 0;
        const queryKeys = Object.keys(this.queryShapeDetails);
        for (const key of queryKeys) {
          const details = this.queryShapeDetails[key];
          details.mean = Math.round(details.sum / details.count, 2);
          details.percNintyFive = percentile(95, details.values);
          details.ix = idx;
          topQueries.push(details);
          idx++;
        }
        this.setState({
          topQueries: topQueries,
          slowQueriesOverTime: slowQueries,
          error: null
        });
      }
    });
  },

  loadDataFromServer() {
    if (!this.state.error) {
      this.getProfilerStatus();
      this.getSlowQueries();
    }
  },

  setProfilerConfig(profileLevel, threshold) {
    this.dataService.command(
      this.currentDatabase, {profile: profileLevel, slowms: threshold}, (error) => {
        if (error) {
          this.setState({error: error});
          // console.log('cannot run getProfilerStatus command - ' + error);
        } else {
          this.setState({
            operationThreshold: threshold,
            profilerLevel: profileLevel,
            error: null
          });
        }
      }
    );
  },

  getProfilerStatus() {
    this.dataService.command(this.currentDatabase, {profile: -1}, (error, results) => {
      if (error) {
        this.setState({error: error});
      } else {
        this.error = null;
        this.setState({
          operationThreshold: results.slowms,
          profilerLevel: results.was,
          error: null
        });
      }
    });
  },

  setCurrentQuery(selectedQueries) {
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
      'topQueries': [
        {
          'ix': 1,
          'ns': 'audits.events',
          'operation': 'find',
          'query': '{type: 1, ts: 1}',
          'count': 300,
          'min': 149,
          'max': 16300,
          'mean': 4320,
          'percNintyFive': 8722,
          'sum': 124230
        },
        {
          'ix': 2,
          'ns': 'audits.customerEvents',
          'operation': 'find',
          'query': '{type: 1, ts: 1, customer: 1}',
          'count': 133,
          'min': 112,
          'max': 19300,
          'mean': 5110,
          'percNintyFive': 9722,
          'sum': 77230
        }
      ],
      'slowQueriesOverTime': [
        {
          'id': 1,
          'ts': new Date(Date.UTC(2018, 1, 8, 14, 0, 0)),
          'ns': 'audits.events',
          'operation': 'find',
          'query': "{type: 'sdfsdf', ts: {$gt: 1739992992}}",
          'duration': 10030
        },
        {
          'id': 2,
          'ts': new Date(Date.UTC(2018, 1, 8, 14, 5, 0)),
          'ns': 'audits.events',
          'operation': 'find',
          'query': "{type: 'ababa', ts: {$gt: 1739992992}}",
          'duration': 8192
        },
        {
          'id': 3,
          'ts': new Date(Date.UTC(2018, 1, 8, 14, 6, 0)),
          'ns': 'audits.customerEvents',
          'operation': 'find',
          'query': "{type: 'ababa', ts: {$gt: 1739992992}, customer: 'assas'}",
          'duration': 1282
        }
      ],
      'selectedQueries': [],
      'profilerLevel': 0,
      'operationThreshold': 100
    };
  }

});

export default CompassProfilerVisualizeStore;
export { CompassProfilerVisualizeStore };
