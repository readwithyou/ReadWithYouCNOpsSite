'use strict';

var timezoneUtil = function () {
    var getAbbrs = function () {
        return {
            EST: 'Eastern Standard Time/Panama Time',
            EDT: 'Eastern Daylight Time',
            CST: 'Central Standard Time',
            CDT: 'Central Daylight Time',
            MST: 'Mountain Standard Time',
            MDT: 'Mountain Daylight Time',
            PST: 'Pacific Standard Time',
            PDT: 'Pacific Daylight Time',
            JST: 'Japan Standard Time'
        };
    };
    return {
        getAbbrs
    };
}();

module.exports = timezoneUtil;