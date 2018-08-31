'use strict';

var timezoneUtil = function () {
    let tzStrings = [];

    tzStrings.push({ tz: 'Asia/Shanghai', translation: 'China Standard Time' });
    tzStrings.push({ tz: 'Asia/Tokyo', translation: 'Tokyo' });
    tzStrings.push({ tz: 'America/New_York', translation: 'EST' });
    tzStrings.push({ tz: 'America/Panama', translation: 'Panama Time' });
    tzStrings.push({ tz: 'America/Chicago', translation: 'CST' });
    tzStrings.push({ tz: 'America/Los_Angeles', translation: 'PST' });
    tzStrings.push({ tz: 'America/Denver', translation: 'MST' });
    tzStrings.push({ tz: 'America/Phoenix', translation: 'Phoenix Time' });
    tzStrings.push({ tz: 'Europe/Berlin', translation: 'Germany(Berlin, Munich) Time' });
    tzStrings.push({ tz: 'Canada/Atlantic', translation: 'Canada Atlantic Time (Halifax Time)' });
    tzStrings.push({ tz: 'Canada/Central', translation: 'Canada Central Time (Winnipeg Time)' });
    tzStrings.push({ tz: 'Canada/Eastern', translation: 'Canada Eastern Time (Ottawa Time)' });
    tzStrings.push({ tz: 'Canada/Mountain', translation: 'Canada Mountain Time (Edmonton Time)' });
    tzStrings.push({ tz: 'Canada/Newfoundland', translation: 'Canada Newfoundland Time' });
    tzStrings.push({ tz: 'Canada/Pacific', translation: 'Canada Pacific Time (Vancouver Time)' });
    tzStrings.push({ tz: 'Canada/Saskatchewan', translation: 'Canada Saskatchewan Time' });
    tzStrings.push({ tz: 'Canada/Yukon', translation: 'Canada Yukon Time' });

    var getTZString = function (tz) {
        let matchedTzString = tzStrings.filter(t => t.tz === tz);
        if (!matchedTzString || matchedTzString.length === 0) {
            return tz;
        }
        return tzStrings.filter(t => t.tz === tz)[0].translation;
    }
    return {
        getTZString
    };
}();

module.exports = timezoneUtil;