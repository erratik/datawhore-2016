var tools = module.exports = makeParent
var _ = require('lodash');
makeParent.makeParent = makeParent
makeParent.makeParentNode = makeParentNode

function makeParent(nodeParent, objParent) {
    // var obj;
    var _nodeKeys = Object.keys(nodeParent);
    for (var i = 0; i < _nodeKeys.length; i++) {

        var content = nodeParent[_nodeKeys[i]];
        if (content !== null) {
            var that = nodeParent[_nodeKeys[i]];
            var array = !isNaN( Number(_nodeKeys[i]));

            objParent[_nodeKeys[i]] = makeData(that, _nodeKeys[i]);

            var _label = [];
            if (array) {
                //console.log(_nodeKeys[i] + "...x    ");
                //console.log(_nodeKeys[i-1]);
                _label.push(_nodeKeys[i]);
            }

            //console.log(_label);

            var injected = objParent[_nodeKeys[i]];
            if (injected.grouped
                && typeof injected.content.value == 'object'
                || typeof injected.content.value == 'boolean') {
                objParent[_nodeKeys[i]].content = makeParent(injected.content.value, {});

            } else {

            //console.log(typeof injected.content.value);
                //console.log(!isNaN(Number(injected.content.label)));
                //console.log(typeof injected.content.value);
                //if (typeof injected.content.value == 'boolean') {
                //
                //    console.log(typeof injected.content.value);
                //}
                if (!isNaN(Number(injected.content.label))) {
                    //console.log(typeof injected.content.value);
                    //console.log(injected);

                }
            }

        }
    }
    ;
    return objParent;
};

function makeParentNode(nodeParent, objParent) {
    // var obj;
    var _nodeKeys = Object.keys(nodeParent);
    for (var i = 0; i < _nodeKeys.length; i++) {
        //console.log('label | nodeParentLabel: '+ _nodeKeys[i]);

        var content = nodeParent[_nodeKeys[i]];
        if (content !== null) {

            if (Array.isArray(content)) {

                //console.log('val   | nodeParentContentType: array');
                //console.log(content);
            } else {


                if (typeof content == 'boolean' || typeof content == 'string') {

                    objParent[_nodeKeys[i]] = makeData(content, _nodeKeys[i]);
                    var injected = objParent[_nodeKeys[i]].content.value;


                } else {
                    var makeObjParent = function(objParent, content, _nodeKeys) {

                        objParent[_nodeKeys] = makeData(content, _nodeKeys);
                        var nInjection = objParent[_nodeKeys];
                        var _injectedKeys = Object.keys(nInjection.content.value);


                        for (var n = 0; n < _injectedKeys.length; n++) {
                            //console.log(nInjection.content.value[_injectedKeys[n]]);

                                if (Array.isArray(nInjection.content.value[_injectedKeys[n]])) {

                                    //console.log('i guess this is an array and needs some other shit going on');
                                    //console.log(_injectedKeys[n]);
                                    //console.log(nInjection.content.value[_injectedKeys[n]]);
                                } else if (typeof nInjection.content.value[_injectedKeys[n]] == 'object') {

                                    //console.log('i guess this is an object and needs makeData or makeParent?');
                                    //console.log(_injectedKeys[n]);
                                    //console.log(nInjection.content.value[_injectedKeys[n]]);
                                    //console.log(objParent[_nodeKeys]);
                                    //console.log(makeObjParent(nInjection, nInjection.content.value[_injectedKeys[n]], _injectedKeys[n]));

                                }

                            nInjection.content.value[_injectedKeys[n]] = makeData(nInjection.content.value[_injectedKeys[n]], _injectedKeys[n]);

                            //console.log(nInjection[_injectedKeys[n]]);

                        }
                    };

                    makeObjParent(objParent, content, _nodeKeys[i]);

                }
                console.log('val   | nodeParentContentType: '+ typeof content);

                if (Array.isArray(injected)) {
                    //console.log(injected);
                } else if (typeof injected == 'object') {

                   /*
                   console.log('ˆ ˆ ˆ ˆ ˆ ˆ ');
                    //console.log(injected);

                    // find out if any of the object's values are actually arrays
                    var _injectedKeys = Object.keys(injected);
                    //console.log(injected);

                    for (var n = 0; n < _injectedKeys.length; n++) {
                        if (Array.isArray(injected[_injectedKeys[n]])) {

                            console.log('i guess this is an array and needs some other shit going on');
                            console.log(_injectedKeys[n]);
                            console.log(injected[_injectedKeys[n]]);
                        } else if (typeof injected[_injectedKeys[n]] == 'object') {

                            console.log('i guess this is an object and needs makeData or makeParent?');
                            console.log(_injectedKeys[n]);
                            console.log(injected[_injectedKeys[n]]);
                        }
                        //console.log(makeData(injected, _injectedKeys[i]));
                    }
                    */
                } else {
                    if (typeof injected == 'boolean' || typeof injected == 'string')  {

                        console.log('injected content ('+injected+') : '+ typeof injected);
                    } else {

                        console.log('injected content: '+ typeof injected);
                    }

                }


            }
            //console.log('val   | nodeParentContent exists');
        } else {

            //console.log('nodeParentContent does not exist');
        }

        //console.log('- - - - - - - - - - - - - - - - - - - - - - -');
        //    var that = nodeParent[_nodeKeys[i]];
        //    var array = !isNaN( Number(_nodeKeys[i]));
        //
        //    objParent[_nodeKeys[i]] = makeData(that, _nodeKeys[i]);
        //
        //    var injected = objParent[_nodeKeys[i]];
        //    if (injected.grouped
        //        && typeof injected.content.value == 'object'
        //        || typeof injected.content.value == 'boolean') {
        //        objParent[_nodeKeys[i]].content = makeParent(injected.content.value, {});
        //
        //    } else {
        //
        //    }
        //
    };
    console.log(objParent);
    return objParent;
};

function makeData(val, label) {
    var obj = {
        content: {
            enabled: false,
            label: label,
            value: val
        }

    };
    var thisVal = obj.content.value;

    obj.grouped = (typeof thisVal == 'object') ? true : false;
    if (Array.isArray(val)) {
        //obj.content.value = JSON.stringify(val);
        //obj.grouped = false;
        //console.log(val);
        //console.log(obj);
        //obj.content = [];
        //obj.content = [];
    }
    return obj;
};