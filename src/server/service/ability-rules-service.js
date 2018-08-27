var abilityConfig = require('./ability-config.json');

var abilityRulesService = function () {
    var getRules = function (username, group) {
        if (abilityConfig[username])
            return abilityConfig[username];
        if (abilityConfig[group])
            return abilityConfig[group];
        return abilityConfig.zero;
    };

    return {
        getRules
    };
}();

module.exports = abilityRulesService;