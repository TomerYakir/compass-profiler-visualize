import Reflux from 'reflux';
import StateMixin from 'reflux-state-mixin';
/*
import Connection from 'mongodb-connection-model';
import DataService from 'mongodb-data-service';
*/
import assert from 'assert';
import CompassProfilerVisualizeActions from 'actions';
import percentile from 'percentile';

const debug = require('debug')('mongodb-compass:stores:compass-profiler-visualize');

/**
 * Compass Profiler Visualize store.
 */
const CompassProfilerVisualizeStore = Reflux.createStore({

  mixins: [StateMixin.store],

  listenables: CompassProfilerVisualizeActions,
  dataService: null,
  // mockup: false,
  data: {},
  queryShapeDetails: {},
  currentDatabase: null,

  init() {

  },

  getQueryShape(query, doc) {
    let shape = {};
    const keys = Object.keys(query);
    for (const key in keys) {
      shape[keys[key]] = 1;
    }
    const shapeKey = JSON.stringify(shape) + ":" + doc.ns + ":" + doc.op;
    if (!this.queryShapeDetails[shapeKey]) {
      this.queryShapeDetails[shapeKey] = {
        "ns": doc.ns,
        "operation": doc.op,
        "query": JSON.stringify(shape),
        "count": 1,
        "min": doc.millis.value,
        "max": doc.millis.value,
        "mean": 0,
        "percNintyFive": 0,
        "sum": doc.millis.value,
        "values": [doc.millis.value]
      }
    } else {
      const details = this.queryShapeDetails[shapeKey];
      details["count"]++;
      details["min"] = doc.millis.value < details["min"] ? doc.millis.value : details["min"];
      details["max"] = doc.millis.value > details["max"] ? doc.millis.value : details["max"];
      details["sum"] += doc.millis.value;
      details["values"].push(doc.millis.value);
      this.queryShapeDetails[shapeKey] = details;
    }
  },

  getSlowQueries(databaseName) {
    const MAX_SLOW_QUERIES = 10000;
    // const databaseName = 'euphonia';
    const profileCollectionName = this.currentDatabase + '.system.profile';
    const filter = {"ns": {"$ne": profileCollectionName}};
    const findOptions = {
      fields: { op:true, ns:true, query:true, command:true, millis: true, ts:true },
      skip: 0,
      limit: MAX_SLOW_QUERIES,
      promoteValues: false
    };
    this.dataService.find(profileCollectionName, filter, findOptions, (error, documents) => {
      //console.log("getSlowQueries:after find");
      if (error) {
        console.error('getSlowQueries:error - ' + error);
      } else {
        //console.log("getSlowQueries:no errors");
        const slowQueries = [];
        for (const idx in documents) {
          const doc = documents[idx];
          let docToAdd = {
            "ts": doc.ts,
            "ns": doc.ns,
            "operation": doc.op,
            "duration": doc.millis.value
          }
          if (["insert", "getmore", "killcursors"].indexOf(doc.op) > -1 ) { // TODO - implement getMore
            docToAdd["query"] = "N/A";
          } else if (["command"].indexOf(doc.op) > -1) {
            docToAdd["query"] = JSON.stringify(doc.command);
          } else { // find
            docToAdd["query"] = JSON.stringify(doc.query);
            this.getQueryShape(doc.query.filter, doc);
          }
          slowQueries.push(docToAdd);
        }
        // this.data = this.getMockState();
        const topQueries = [];
        let idx = 0;
        for (const key in this.queryShapeDetails) {
          const details = this.queryShapeDetails[key];
          details["mean"] = Math.round(details["sum"] / details["count"],2);
          details["percNintyFive"] = percentile(95, details["values"]);
          details["ix"] = idx;
          topQueries.push(details);
          idx++;
        }
        this.data.topQueries = topQueries;
        this.data.slowQueriesOverTime = slowQueries;
        this.setState(this.data);
        this.trigger(this.state);
        console.error("getSlowQueries:data updated " + this.data.slowQueriesOverTime.length);
      }
    });
  },

  loadDataFromServer() {
    this.getProfilerStatus();
    this.getSlowQueries();
  },

  onActivated(appRegistry) {

     appRegistry.on('data-service-connected', (error, dataService) => {
       if (error) {
        console.log('onConnected:error - ' + error);
      } else {
        this.dataService = dataService;
      }
     });

     appRegistry.on('database-changed', (namespace) => {
       this.currentDatabase = namespace;
       this.loadDataFromServer();
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
        "selectedQueries": [],
        "profilerLevel": -1,
        "operationThreshold": -1
    };
  },


  setProfilerConfig(profileLevel, threshold) {
    this.dataService.command(this.currentDatabase, {profile: profileLevel, slowms: threshold}, (error, results) => {
      if (error) {
        // console.log('cannot run getProfilerStatus command - ' + error);
      } else {
        this.getProfilerStatus();
      }
    });
  },

  getProfilerStatus() {
    this.dataService.command(this.currentDatabase, {profile: -1}, (error, results) => {
      if (error) {
        // console.log('cannot run getProfilerStatus command - ' + error);
      } else {
        this.data.operationThreshold = results.slowms;
        this.data.profilerLevel = results.was;

        this.setState(this.data);
      }
    });
  },

  setCurrentQuery(selectedQueries) {
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
        "id": 1,
        "ts": new Date(Date.UTC(2018, 1, 8, 14, 0, 0)),
        "ns": "audits.events",
        "operation": "find",
        "query": "{type: 'sdfsdf', ts: {$gt: 1739992992}}",
        "duration": 10030
      },
      {
        "id": 2,
        "ts": new Date(Date.UTC(2018, 1, 8, 14, 5, 0)),
        "ns": "audits.events",
        "operation": "find",
        "query": "{type: 'ababa', ts: {$gt: 1739992992}}",
        "duration": 8192
      },
      {
        "id": 3,
        "ts": new Date(Date.UTC(2018, 1, 8, 14, 6, 0)),
        "ns": "audits.customerEvents",
        "operation": "find",
        "query": "{type: 'ababa', ts: {$gt: 1739992992}, customer: 'assas'}",
        "duration": 1282
      }
    ],
    "selectedQueries": [],
    "profilerLevel": 0,
    "operationThreshold": 100
    }
  }

});

export default CompassProfilerVisualizeStore;
export { CompassProfilerVisualizeStore };
