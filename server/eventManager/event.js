var Engine = require('json-rules-engine').Engine;
var Rule = require('json-rules-engine').Rule;
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
const IntegrationCollection = require('../sb_models/product/integrations/integrationsList');
const RulesCollection = require('../sb_models/general/rules');
const eventConstants = require('./eventConstants');
const addCustomerIntegrationHandler = require('./addCustomerIntegrationHandler');

//var Engine = require('json-rules-engine');

let eventManager = {
    getEventEmitter: () => {
        return emitter;
    },
    getEventConstants: () => {
        return eventConstants;
    }
}

let arrayOfevents = [String];

// Handle Add Customer Integration Event
emitter.on(eventConstants.addCustomerIntegration, addCustomerIntegrationHandler.eventHandler);

module.exports = eventManager;



