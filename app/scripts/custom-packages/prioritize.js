var tools = module.exports = makeParent

makeParent.makeParent = makeParent

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

function makeData(val, label) {
    var obj = {
        content: {
            enabled: false,
            label: label,
            value: val
        }

    };
    var thisVal = obj.content.value;

    obj.grouped = (typeof thisVal == 'array' || typeof thisVal == 'object') ? true : false;
    if (!isNaN( Number(label))) {
        obj.grouped = false;
        console.log(val);
        console.log(obj);
        //obj.content = [];
        //obj.content = [];
    }
    return obj;
};