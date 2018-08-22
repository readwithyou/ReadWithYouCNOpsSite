let tzStrings = [];

tzStrings.push({ tz: 'Asia/Shanghai', translation: 'message.tz_shanghai' });
tzStrings.push({ tz: 'Asia/Tokyo', translation: 'message.tz_tokyo' });
tzStrings.push({ tz: 'America/New_York', translation: 'message.tz_new_york' });
tzStrings.push({ tz: 'America/Chicago', translation: 'message.tz_chicago' });
tzStrings.push({ tz: 'America/Los_Angeles', translation: 'message.tz_los_angeles' });
tzStrings.push({ tz: 'America/Denver', translation: 'message.tz_denver' });
tzStrings.push({ tz: 'America/Phoenix', translation: 'message.tz_phoenix' });
tzStrings.push({ tz: 'America/Panama', translation: 'message.tz_panama' });
tzStrings.push({ tz: 'Europe/Berlin', translation: 'message.tz_berlin' });
tzStrings.push({ tz: 'Canada/Atlantic', translation: 'message.tz_canada_atlantic' });
tzStrings.push({ tz: 'Canada/Central', translation: 'message.tz_canada_central' });
tzStrings.push({ tz: 'Canada/Eastern', translation: 'message.tz_canada_eastern' });
tzStrings.push({ tz: 'Canada/Mountain', translation: 'message.tz_canada_mountain' });
tzStrings.push({ tz: 'Canada/Newfoundland', translation: 'message.tz_canada_newfoundland' });
tzStrings.push({ tz: 'Canada/Pacific', translation: 'message.tz_canada_pacific' });
tzStrings.push({ tz: 'Canada/Saskatchewan', translation: 'message.tz_canada_saskatchewan' });
tzStrings.push({ tz: 'Canada/Yukon', translation: 'message.tz_canada_yukon' });

let tzUtility = {
    tzStrings: tzStrings,
    getTranslation: function (tz) {
        let matchedTzString = tzStrings.filter(t => t.tz === tz);
        if (!matchedTzString || matchedTzString.length === 0) {
            return 'message.undefined';
        }
        return matchedTzString[0].translation;
    }
}

export default tzUtility