let nameStrings = [];

nameStrings.push({ name: 'CN_COURSE', translation: 'message.cn_course' });
nameStrings.push({ name: 'EN_COURSE', translation: 'message.en_course' });
nameStrings.push({ name: 'SP_COURSE', translation: 'message.sp_course' });
nameStrings.push({ name: 'EN_PHYSICAL', translation: 'message.en_physical' });
nameStrings.push({ name: 'EN_ART', translation: 'message.en_art' });
nameStrings.push({ name: 'EN_ARCHAEOLOGY', translation: 'message.en_archaeology' });
nameStrings.push({ name: 'EN_ANIMAL', translation: 'message.en_animal' });
nameStrings.push({ name: 'EN_CHILDART', translation: 'message.en_child_art' });

let typeStrings = [];

typeStrings.push({ type: 'REGULAR_COURSE', translation: 'message.regular_course' });
typeStrings.push({ type: 'SHORT_COURSE', translation: 'message.short_course' });

let courseUtility = {
    courseNameStrings: nameStrings,
    courseTypeStrings: typeStrings,
    getNameTranslation: function (name) {
        let matchedString = nameStrings.filter(t => t.name === name);
        if (!matchedString || matchedString.length === 0) {
            return 'message.undefined';
        }
        return matchedString[0].translation;
    },
    getTypeTranslation: function (type) {
        let matchedString = typeStrings.filter(t => t.type === type);
        if (!matchedString || matchedString.length === 0) {
            return 'message.undefined';
        }
        return matchedString[0].translation;
    }
}

export default courseUtility