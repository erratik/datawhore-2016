var tools = module.exports = makeData
var _ = require('lodash');

makeData.assignValues = assignValues
makeData.writeProperties = writeProperties

var isSimpleProperty = function(value) {

    //if (_.isString(value)) console.log('('+value+') is a string!');
    //if (_.isBoolean(value)) console.log('('+value+') is a boolean!');
    //if (_.isArray(value)) console.log('('+value+') is an array!');
    //if (_.isNumber(value)) console.log('('+value+') is a number!');

    if (_.isString(value) ||  _.isBoolean(value) || _.isArray(value) || _.isNumber(value) ) {
        return true;
    } else {
        return false;
    }

};

function makeAttribute(node, child) {

    var obj = {};

    _.forEach(node, function(n, key) {


        if (isSimpleProperty(n)) {

            obj[key] = {
                content: {
                    label: key,
                    value: n,
                    enabled: false
                },
                grouped: false
            };

        } else {

            var groupedAttr = {
                grouped: true, content: {}
            };



            _.forEach( n, function(item, name) {
                if (isSimpleProperty(item)) {
                    groupedAttr.content[name] = makeData(item, name).content;

                } else {
                    groupedAttr.content[name] = {content: {}, grouped: true, label: name};

                    //console.log('~~~~~~~~~ '+name+' ~~~~~~~~~');

                    _.forEach(item, function(i, k){
                        if (isSimpleProperty(i)) {
                            //console.log(i);
                            groupedAttr.content[name].content[k] = makeData(i, k).content;
                        } else {

                        }
                    });
                    //console.log('....................................');
                }
            });
            obj[key] = groupedAttr;

        }

    });
    //obj.grouped = false;
    //console.log('------------ @end makeAttribute');
    return obj;
};

function makeData(val, label) {
    //console.log('make data running');
    var obj = {
        content: {
            enabled: false,
            label: label,
            value: val
        }

    };
    var thisVal = obj.content.value;

    //obj.grouped = (typeof thisVal == 'object') ? true : false;
    if (_.isArray(val)) {
        obj.content = _.first(val);
        delete obj.content.label;
        delete obj.content.enabled;
        obj.content = makeAttribute(obj.content);
        obj.grouped = true;
    } else {

        obj.grouped = false;
    }
    return obj;
};


function assignValues(node) {
    // todo: this is redundant, you can compress makeAttribute into this?!
    // first, let's set up the simple arrays, strings and boolean properties
    var topLevelProps = makeAttribute(node);
    //console.log(topLevelProps);
    return topLevelProps;

}

function mapAttributeKeys(item, prefix) {
    var keys = {};
    var attributeName = prefix+"__"+item.label;
    keys[attributeName] = {
        friendlyName: item.label
    };
    keys[attributeName].path = prefix+"__"+item.label;
    return keys;
}


function writeProperties(props, current) {
    if (current === undefined) {current = false;}
    var deleting = {};
    var savedProps = {};
    var properties = _.pluck(_.filter(props, {content: { 'enabled':  true }}), 'content');

    var attributeGroup = _.pluck(_.filter(props, 'grouped'), 'content');
    _.forEach(attributeGroup, function(attribute, cle){
        _.forEach(attribute, function(item, key){
            // second level
            if (item.enabled) {
                properties.push(mapAttributeKeys(item, _.findKey(props, {content: attribute}),  {content: attribute}));
            } else if (!item.grouped && !item.enabled){
                //console.log(item.label+' is disabled');
                if (current !== false)
                    delete current[item.label];
            }

            //third level
            if (item.grouped) {
                var innerGroup = _.filter(item.content, 'enabled');
                _.forEach(innerGroup, function(group){
                    console.log(group);
                    var groupKey = _.findKey(item.content, group);
                    var query = {};
                    query[key] = {content: {}};
                    query[key].content[groupKey] = group;

                    if (group !== undefined) {

                        console.log(query);
                        //console.log(findKey(props, {content: query})+'__'+key);
                        //console.log(mapAttributeKeys(_.first(innerGroup), _.findKey(props, {content: query})+'__'+key));

                        properties.push(mapAttributeKeys(group, _.findKey(props, {content: query})+'__'+key,  {content: query}));
                    }

                });
                if (current !== false) {

                    var disabledGroups = _.filter(item.content, 'enabled', false);
                    var disabledGroupKey = _.findKey(item.content, _.first(innerGroup));
                    var disabledQuery = {};
                    disabledQuery[key] = {content: {}};
                    disabledQuery[key].content[disabledGroupKey] = _.first(disabledGroups);

                    deleting[_.findKey(props, {content: disabledQuery})+'__'+key+'__'+disabledGroupKey] = true;
                    //console.log(_.findKey(props, {content: disabledQuery})+'__'+key+'__'+disabledGroupKey);
                    //console.log(disabledGroups);
                }

            }

        });
    });

    _.forEach(properties, function(item, key){

        if (item.label !== undefined) {
            //first & second level
            if (current[item.label] !== undefined) {
                //console.log(current);
                savedProps[item.label] = current[item.label];
            } else {

                savedProps[item.label] = {
                    friendlyName: item.label,
                    path: item.label
                };
            }
        } else {
            // third level
            _.merge(savedProps, item);
            if (_.filter(current, item)) _.merge(savedProps, current);
            if (_.filter(deleting, item) && current !== false) _.reject(savedProps, item);
        }
    });

    return savedProps;

}