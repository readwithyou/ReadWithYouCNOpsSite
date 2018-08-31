let priorityStrings = [];

priorityStrings.push({ name: 'RECOMMENDED', translation: 'message.priority_RECOMMENDED' });
priorityStrings.push({ name: 'OPTIONAL', translation: 'message.priority_OPTIONAL' });
priorityStrings.push({ name: 'NONRECOMMENDED', translation: 'message.priority_NONRECOMMENDED' });
priorityStrings.push({ name: 'UNAVAILABLE', translation: 'message.priority_UNAVAILABLE' });

let courseNameStrings = [];

courseNameStrings.push({ name: '1', translation: 'message.en_course' });
courseNameStrings.push({ name: '2', translation: 'message.sp_course' });
courseNameStrings.push({ name: '3', translation: 'message.cn_course' });
courseNameStrings.push({ name: '4', translation: 'message.en_physical' });
courseNameStrings.push({ name: '5', translation: 'message.en_animal' });
courseNameStrings.push({ name: '6', translation: 'message.en_art' });
courseNameStrings.push({ name: '7', translation: 'message.en_earth_science' });
courseNameStrings.push({ name: '8', translation: 'message.en_archaeology' });
courseNameStrings.push({ name: '9', translation: 'message.en_art_history' });
courseNameStrings.push({ name: '10', translation: 'message.en_animal_young' });
courseNameStrings.push({ name: '11', translation: 'message.en_american_history_culture' });
courseNameStrings.push({ name: '12', translation: 'message.en_grammar_boost' });

let courseTypeStrings = [];

courseTypeStrings.push({ type: 'REGULAR_COURSE', translation: 'message.regular_course' });
courseTypeStrings.push({ type: 'SHORT_COURSE', translation: 'message.short_course' });

let levelStrings = [];
levelStrings.push({ level: 999, translation: 'message.level_999' });
levelStrings.push({ level: 0, translation: 'message.level_0' });
levelStrings.push({ level: 10, translation: 'message.level_10' });
levelStrings.push({ level: 20, translation: 'message.level_20' });
levelStrings.push({ level: 30, translation: 'message.level_30' });
levelStrings.push({ level: 40, translation: 'message.level_40' });
levelStrings.push({ level: 50, translation: 'message.level_50' });
levelStrings.push({ level: 60, translation: 'message.level_60' });
levelStrings.push({ level: 70, translation: 'message.level_70' });

let miscUtility = {
    priorityStrings: priorityStrings,
    levelStrings: levelStrings,
    courseNameStrings: courseNameStrings,
    courseTypeStrings: courseTypeStrings,
    getNameTranslation: function (name) {
        let matchedString = courseNameStrings.filter(t => t.name === name);
        if (!matchedString || matchedString.length === 0) {
            return 'message.undefined';
        }
        return matchedString[0].translation;
    },
    getTypeTranslation: function (type) {
        let matchedString = courseTypeStrings.filter(t => t.type === type);
        if (!matchedString || matchedString.length === 0) {
            return 'message.undefined';
        }
        return matchedString[0].translation;
    }
}

export default miscUtility