function generateId() {
    var date = new Date();
    var id = date.getFullYear().toString().substring(2, 4);

    id = (date.getMonth() < 10) ?
        id + '0' + (date.getMonth() + 1) :
        id + (date.getMonth() + 1);

    id = (date.getDate() < 10) ?
        id + '0' + date.getDate() :
        id + date.getDate();

    id = (date.getHours() < 10) ?
        id + '0' + date.getHours() :
        id + date.getHours();

    id = (date.getMinutes() < 10) ?
        id + '0' + date.getMinutes() :
        id + date.getMinutes();

    id = (date.getSeconds() < 10) ?
        id + '0' + date.getSeconds() :
        id + date.getSeconds();

    return id;
}

module.exports = generateId;