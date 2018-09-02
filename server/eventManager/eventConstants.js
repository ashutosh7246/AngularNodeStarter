let events = {
    addCustomerIntegration: 'addCustomerIntegration',
    operators: { // If you change operator name don't forget to change in database rule also
        mapOperator: 'mapDefaultValue',
        securityPolicyOperator: 'securityPolicyName'
    }
}
module.exports = events;