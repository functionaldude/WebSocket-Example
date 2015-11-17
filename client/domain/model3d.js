/**
 * loadDbEntity creates the objects representing database elements and initializes them accordingly
 *
 * @param mid id of object inside the application
 * @param realId id in the raw database (textfiles)
 * @returns the complete database element object
 *
 * Student TODO (Task: Ajax request): send an ajax asynchronous request for JSON data from the featuresUrl.
 *              Use the appropriate callback function to retrieve and save the received data. Handle the fail
 *              case by setting the features undefined.
 *              Tip: although here the item object doesn't seem to have a setter here, in javascript you can
 *              add new methods/attributes any time. Take a look in client.js:db.load.
 */
function loadDbEntity(mid, realId)
{
    var thumbnailUrl = '../db/thumbnails/m' + realId + '_thumb.png';
    var featuresUrl = '../db/vectorfiles/m' + realId + '.json';

    var item = {
        mid: mid,
        thumbnailUrl: thumbnailUrl,
        featuresUrl: featuresUrl,
        features: undefined
    };

    var callback = function(data){
        item.setFeatures(data.features);
    };

    $.getJSON(featuresUrl, callback);

    return item;
}
/**
 * compareEntity is used for comparing a 3D object (feature vector) in the database with a 3D object that is searched
 *
 * @param dbEntity database object
 * @param param search parameters (item to compare as: ‘param.entity’ and threshold as:  ‘param.threshold’)
 * @returns undefined if the distance is not within the threshold, otherwise tuple containing distance and compared item
 *
 * Student TODO (Task: Feature distance): check if the database object is SIMILAR ENOUGH to the object given as a
 *              parameter by calculating the Euclidean distance between the feature vectors.
 */
function compareEntity(dbEntity, param)
{
    if (dbEntity.features.length != param.entity.features.length){return undefined;}
    var sum = 0;
    for (var i = 0; i < dbEntity.features.length; i++){
        sum += Math.pow((dbEntity.features[i] - param.entity.features[i]),2);
    }
    var dist = Math.sqrt(sum);
    if (dist < param.threshold){
        return [dist, param.entity];
    } else {
        return undefined;
    }
}

function entityView(dbItem)
{
    var viewElement = document.createElement('div');
        var img = document.createElement('img');
        var modelIndex = document.createElement('div');

    img.src = dbItem.thumbnailUrl;
    img.alt = 'select';
    img.draggable = false;

    modelIndex.className = 'index';
    modelIndex.innerText = dbItem.mid;

    viewElement.appendChild(img);
    viewElement.appendChild(modelIndex);
    return viewElement
}

function matchItemView(matchItem)
{
    var viewElement = entityView(matchItem.dbEntity);
        var diffActual = document.createElement('div');
        var diffMax = document.createElement('div');
        var diffVal = document.createElement('div');

    var maxDiffWidth = 100;

    diffActual.style.backgroundColor = '#80CCE6';
    diffActual.style.height = 5;
    diffActual.style.width = maxDiffWidth - matchItem.diff * 2;
    diffActual.style.top = 23;
    diffActual.style.left = 7;
    diffActual.style.position = 'absolute';

    diffMax.style.backgroundColor = '#e8e8e8';
    diffMax.style.height = 5;
    diffMax.style.width = maxDiffWidth;
    diffMax.style.top = 23;
    diffMax.style.left = 7;
    diffMax.style.position = 'absolute';
    diffMax.style.boxShadow = '0 1px 1px rgba(0, 0, 0, 0.15) inset';

    diffVal.innerText = matchItem.diff.toFixed(1);
    diffVal.style.color = '#B1B1B1';
    diffVal.style.top = 21;
    diffVal.style.left = 113;
    diffVal.style.fontSize = 9;
    diffVal.style.position = 'absolute';

    viewElement.appendChild(diffVal);
    viewElement.appendChild(diffMax);
    viewElement.appendChild(diffActual);
    return viewElement
}

function resultHeaderView()
{
}

function parameterView(dbItem)
{
    var queryParameter = document.createElement("div");
    var midCombo = comboBox();
    var threshhold = labeledSlider(10, 25, 17, '±', '', 0, 8);

    queryParameter.onvalid = undefined;
    queryParameter.startQuery = undefined;
    queryParameter.value = undefined;
    queryParameter.setDisabled = function(d)
    {
        midCombo.disabled = d;
        threshhold.setDisabled(d)
    };
    queryParameter.setValue = function(dbItem)
    {
        midCombo.setValue(dbItem)
    };
    queryParameter.value = function()
    {
        return {
            entity: midCombo.value,
            threshold: threshhold.value
        }
    };

    midCombo.id = 'midCombo';
    midCombo.style.position = 'relative';
    midCombo.style.float = 'left';
    midCombo.ondragover  = function(ev) { ev.preventDefault() };
    //midCombo.ondragenter = function(ev) { start.disabled = false }
    //midCombo.ondragleave = function(ev) { start.disabled = true }
    midCombo.itemViewFactory = entityViewPanel;
    midCombo.onValueChanged = function() { queryParameter.onvalid() };
    midCombo.ondrop = function drop(ev)
    {
        ev.preventDefault();
        mid = ev.dataTransfer.getData("text");
        queryParameter.setValue(app.db.data[mid]);
        queryParameter.startQuery()
    };

    midCombo.setValue(dbItem ? dbItem:app.db.data[0], true);
    app.db.data.forEach(function(i) { midCombo.insertItem(i) });

    queryParameter.appendChild(midCombo);
    queryParameter.appendChild(threshhold);
    return queryParameter
}


