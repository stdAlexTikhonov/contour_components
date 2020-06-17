var colorTool = echarts.color ;
// для форматирования
var maskRegex = /[0-9\-+#]/;
var notMaskRegex = /[^\d\-+#]/g;

function getIndex(mask) {
    return mask.search(maskRegex);
}

function processMask(mask, decimalPoint, separator) {
	var maskObj = {};
	var len = mask.length;
	var start = getIndex(mask);
    maskObj.prefix = start > 0 ? mask.substring(0, start) : "";

    // Reverse string: not an ideal method if there are surrogate pairs
    var end = getIndex(mask.split("").reverse().join(""));
    var offset = len - end;
    var substr = mask.substring(offset, offset + 1);
    // Add 1 to offset if mask has a trailing decimal/comma
	var indx = offset + ((substr === "." || (substr === ",")) ? 1 : 0);
    maskObj.suffix = end > 0 ? mask.substring(indx, len) : "";

    maskObj.mask = mask.substring(start, indx);
    maskObj.maskHasNegativeSign = maskObj.mask.charAt(0) === "-";
    maskObj.maskHasPositiveSign = maskObj.mask.charAt(0) === "+";

    // Search for group separator & decimal; anything not digit,
    // not +/- sign, and not #
    var result = maskObj.mask.match(notMaskRegex);
    if (result == null) result = [' '] ;
    if (result.length == 1) result.push('.') ;
    // Treat the right most symbol as decimal
    maskObj.decimal = (result && result[result.length - 1]) || ".";
    if (decimalPoint !== undefined) { // временно
        maskObj.mask = maskObj.mask.replace(maskObj.decimal, 'dec') ;
        maskObj.decimal = decimalPoint ;
    }
    // Treat the left most symbol as group separator
    maskObj.separator = (result && result[1] && result[0]) || ",";
    if (separator !== undefined) { // временно
        maskObj.mask = maskObj.mask.replace(maskObj.separator, 'sep') ;
        maskObj.separator = separator ;
    }
   
    if (decimalPoint !== undefined)
        maskObj.mask = maskObj.mask.replace('dec', decimalPoint) ;
    if (separator !== undefined)
        maskObj.mask = maskObj.mask.replace('sep', separator) ;

    // Split the decimal for the format string if any
    result = maskObj.mask.split(maskObj.decimal);
    maskObj.integer = result[0];
    maskObj.fraction = result[1];
    return maskObj;
}

function processValue(value, maskObj, options) {
    var isNegative = false;
    var valObj = { };
    valObj.value = value ;
    if (value < 0) {
        isNegative = true;
        // Process only abs(), and turn on flag.
        valObj.value = -valObj.value;
    }

    valObj.sign = isNegative ? "-" : "";

    // Fix the decimal first, toFixed will auto fill trailing zero.
    valObj.value = Number(valObj.value).toFixed(maskObj.fraction && maskObj.fraction.length);
    // Convert number to string to trim off *all* trailing decimal zero(es)
    valObj.value = Number(valObj.value).toString();

    // Fill back any trailing zero according to format
    // look for last zero in format
    var posTrailZero = maskObj.fraction && maskObj.fraction.lastIndexOf("0");
    var valInteger = "0" ;
    var valFraction = "" ;
    var list = valObj.value.split(".");
    if (list.length > 0)
        valInteger = list[0];
    if (list.length > 1)
        valFraction = list[1];
    //var [valInteger = "0", valFraction = ""] = valObj.value.split(".");
    if (!valFraction || (valFraction && valFraction.length <= posTrailZero)) {
        valFraction = posTrailZero < 0
            ? ""
            : (Number("0." + valFraction).toFixed(posTrailZero + 1)).replace("0.", "");
    }

    valObj.integer = valInteger;
    valObj.fraction = valFraction;
    addSeparators(valObj, maskObj);

    // Remove negative sign if result is zero
    if (valObj.result === "0" || valObj.result === "") {
        // Remove negative sign if result is zero
        isNegative = false;
        valObj.sign = "";
    }

    if (!isNegative && maskObj.maskHasPositiveSign) {
        valObj.sign = "+";
    } else if (isNegative && maskObj.maskHasPositiveSign) {
        valObj.sign = "-";
    } else if (isNegative) {
        valObj.sign = options && options.enforceMaskSign && !maskObj.maskHasNegativeSign
            ? ""
            : "-";
    }

    return valObj;
}

function addSeparators(valObj, maskObj) {
    valObj.result = "";
    // Look for separator
    var szSep = maskObj.integer.split(maskObj.separator);
    // Join back without separator for counting the pos of any leading 0
    var maskInteger = szSep.join("");

    var posLeadZero = maskInteger && maskInteger.indexOf("0");
    if (posLeadZero > -1) {
        while (valObj.integer.length < (maskInteger.length - posLeadZero)) {
            valObj.integer = "0" + valObj.integer;
        }
    } else if (Number(valObj.integer) === 0) {
        valObj.integer = "";
    }

    // Process the first group separator from decimal (.) only, the rest ignore.
    // get the length of the last slice of split result.
    var posSeparator = (szSep[1] && szSep[szSep.length - 1].length);
    if (posSeparator) {
        var len = valObj.integer.length;
        var offset = len % posSeparator;
        for (var indx = 0; indx < len; indx++) {
			valObj.result += valObj.integer.charAt(indx);
            // -posSeparator so that won't trail separator on full length
			if (!((indx - offset + 1) % posSeparator) && indx < len - posSeparator) {
				valObj.result += maskObj.separator;
        }
}
} else {
		valObj.result = valObj.integer;
}

valObj.result += (maskObj.fraction && valObj.fraction)
    ? maskObj.decimal + valObj.fraction
    : "";
return valObj;
}
// конец форматирования

function sortData(opt, data, colors) {
    data.sort(function (a, b) { return a[1] - b[1]; }) ;
    if (opt.maxDimValueCount !== undefined && data.length > opt.maxDimValueCount) {
        var start = !opt.showFirst ? 0 : data.length - opt.maxDimValueCount ;
        data.splice(start, opt.maxDimValueCount) ;
    }
    if (colors != null && opt.separateColors) {
        var newData = [] ;
        for (var i = 0; i < data.length; i++) {
            var formatter = data[i][data[i].length - 1]; // последний
        
            newData.push({ value: data[i],
            itemStyle: {
                normal: {
                    color: colors[formatter[0][0]]
                  
                }}
        }) ;
        }
        return newData ;
    }
    return data ;
}

function sankeyLabel(v) {
// метка для графика Сэнкея, где name состоит из заголовка измерения + значение измерения
    if (v === undefined )
        return null;

    var list = v.split('+') ;
    return list.length > 0 ? list[0] : v;
}

function strSize(text, fontsize) {
    // высота текста text
    var str = document.createTextNode(text) ;

    var obj = document.createElement('A') ;
    obj.style.fontSize = fontsize + 'px';
    obj.style.margin = 0 + 'px';
    obj.style.padding = 0 + 'px';
    obj.appendChild(str) ;
    document.body.appendChild(obj) ;
    var ht = obj.offsetHeight;
    document.body.removeChild(obj) ;
    return ht;
}

function optimalRowsColsCount(width, height, count) {
    // для заданного размера окна width, height и количества элементов count оптимальное расположение их по строкам и столбцам
    var size = [];
    size.push(count == 1 ? 1 : Math.max(1, Math.round(Math.sqrt(count * height / width)))) ;
    size.push(count == 1 ? 1 : Math.max(1, Math.ceil(count / size[0]))) ;
    return size;
}

function linearGradient(list) {
    // градиент по массиву узлов
    if (list === undefined )
        return null;
    if (list.length === 1)
        return list[0];
    var x2 = list[0] === 1 ? 0 : 1;
    var y2 = list[0] === 1 ? 1 : 0;
    var stops = [];
    var index = 1;
    while (index < list.length) {
        stops.push({ offset: list[index], color: list[index + 1] }) ;
        index += 2;
    }
    var color = new echarts.graphic.LinearGradient(0, 0, x2, y2, stops) ;
    return color;
}

function calcGrid(width, height, opt, option, type) {
    var hor = type === 'HorizontalBar' || type === 'PairedBar';
    var xSetting = hor ? opt.yAxis : opt.xAxis ;
    var ySetting = hor ? opt.xAxis : opt.yAxis;
    var yZoom = xSetting !== undefined && xSetting.dataZoom !== undefined ? 8 : 0;
    var xZoom = ySetting !== undefined && ySetting.dataZoom !== undefined ? 8 : 0;

    // рассчет количества сеток для мультиграфиков
    if (opt.multi === undefined ) {
        option.grid = { // один график
            right: 0 + xZoom + '%',
            left: 0,
            bottom: 0 + yZoom + '%',
            top: 0,
            containLabel: true
        };
        option.title = {
            show: opt.subtitle.show,
            left: opt.subtitle.align
        };
        opt.rowCount = 1;
        opt.colCount = 1;
    } else { // много графиков
        var ndx = 0;
        var leftAxis = 0;
        var rightAxis = 0;
        var topAxis = 0;
        var bottomAxis = 0;
        opt.series[0].forEach(function (seria) {
            if (ndx === 0) {
                bottomAxis += 1;
                leftAxis += 1;
            }
            else if (seria.factAxis !== undefined ) {
                switch (seria.factAxis.position) {
                    case 'right': rightAxis += 1; break;
                    case 'left': leftAxis += 1; break;
                    case 'top': topAxis += 1; break;
                    case 'bottom': bottomAxis += 1; break;
                }
            }
            ndx+= 1;
        }) ;

        var gridCount = opt.multi === undefined  ? 1 : opt.multi.length;
        var sizes = [] ;
        sizes = optimalRowsColsCount(width, height, gridCount) ;
        opt.rowCount = sizes[0];
        opt.colCount = sizes[1];

        option.grid = [];
        if (opt.subtitle.show)
            option.title = [];
        else
            option.title = { show: false };
        var deltaAxis = 0.15;
        var margin = 0.02;
        var hide = opt.hideAxis;
        var deltay = hide ? (100 - yZoom) / (opt.rowCount + deltaAxis * (topAxis + bottomAxis) + ((opt.rowCount - 1) * margin)) : (100 - yZoom) / opt.rowCount;
        var deltax = hide ? (100 - xZoom) / (opt.colCount + deltaAxis * (leftAxis + rightAxis) + ((opt.colCount - 1) * margin)) : (100 - xZoom) / opt.colCount;

        var gridIndex = 0;
        var y = 0;
        for (var i = 0; i < opt.rowCount; i+= 1) {
            var x = 0;
            height = deltay;
            if (hide)
                height += (i == opt.rowCount - 1 ? bottomAxis * deltaAxis * deltay : 0) + (i === 0 ? topAxis * deltaAxis * deltay : 0) ;

            //  y += height ;

            for (var j = 0; j < opt.colCount; j += 1) {
                width = deltax;
                var margin2 = 0;
                if (hide) {
                    width += (j === 0 ? leftAxis * deltaAxis * deltax : 0) + (j == opt.colCount - 1 ? rightAxis * deltaAxis * deltax : 0) ;
                    margin2 = (j < opt.colCount && opt.colCount > 1) ? margin : 0;
                }
                option.grid.push({
                    width: width - margin2 * 100 + '%',
                    left: x + '%',
                    top: y + '%',
                    height: height + '%',
                    containLabel: true,
                }) ;

                if (opt.subtitle.show && gridIndex < gridCount) {
                    var xTitle;
                  /*  var fontSize = opt.subtitle.size;
                    var fontFamily = '';
                    var fontWeight = textStyleModel.get('fontWeight');
                    var fontStyle = textStyleModel.get('fontStyle');
                    var font = fontStyle + ' ' + fontWeight + ' '
                        + fontSize + 'px "' + fontFamily;
                    font = trim(font);*/
                   // var font = 'normal normal 10.64px Microsoft YaHei';

                   // var kuku = measureText(opt.multi[gridIndex], font).width;

                    switch (opt.subtitle.align) {
                        case 'left': xTitle = x + '%'; break;
                        case 'center': xTitle = x + width / 2 + '%'; break;
                        case 'right': xTitle = x + width + '%'; break;
                    }
                     
                    option.title.push({
                        text: opt.multi[gridIndex],
                        x: xTitle,
                        y: y + 0.05 * height + '%',
                        textStyle: {
                            color: opt.subtitle.color,
                            fontSize: opt.subtitle.size,
                            fontStyle: opt.subtitle.style,
                            fontWeight: opt.subtitle.weight
                        },
                        backgroundColor: linearGradient(opt.subtitle.background),
                        textAlign: opt.subtitle.align
                    });
                }
                x += width;

                gridIndex+= 1;
                if (!opt.hideAxis && gridIndex == gridCount)
                    break;
            }
            y += height;
        }
    }
}

function image(opt, width, height, filename, zlevel, index) {
    // картинка
    var img = {
        id: 'img' + index,
        type: 'image',
        left: opt.background.left,
        top: opt.background.top,
        zlevel: zlevel,
        scale: [opt.background.scale, opt.background.scale],
        style: {
            image: filename,
            width: opt.background.stretchx ? width : opt.background.width,
            height: opt.background.stretchy ? height : opt.background.height,
            opacity: opt.background.opacity
        }
    };
    return img ;
}

function format2(fmt, value) {
   if (isNaN(Number(value))) // Invalid inputs
       return value;
   var mask = fmt.format === undefined ? "#.##" : fmt.format ;
  
    var options = {} ;
    
    var maskObj = processMask(mask, fmt.decimalPoint, fmt.separator);
    var valObj = processValue(value, maskObj, options);
    maskObj.prefix = maskObj.prefix.replace(/[\']/g, '') ;
    maskObj.suffix = maskObj.suffix.replace(/[\']/g, '') ;
return maskObj.prefix + valObj.sign + valObj.result + maskObj.suffix;
}

function valueFormatter(v, fmt) {
    if (v === undefined  || fmt === undefined || v == null)
        return v;
    return format2(fmt, v) ;
}

function dataZoom(opt, type, orient, dataZoomList, row, col, zoomType) {
    // масштабирование данных
    var dataZ = {};
    dataZ.type = zoomType;
    if (zoomType == 'inside') {
        dataZ.moveOnMouseWheel = true;
        dataZ.zoomOnMouseWheel = false;
        dataZ.preventDefaultMouseMove = false;
    }
    hor = type == 'HorizontalBar' || type == 'PairedBar';
    setting = orient === 'x' ? (hor ? opt.yAxis : opt.xAxis) : (hor ? opt.xAxis : opt.yAxis) ;
    // opt.seriesNameData[gridIndex]
    if (orient === 'x' && option.xAxis.length === 0 || orient == 'y' && option.yAxis.length === 0)
        return;
    if (setting.dataZoom !== undefined ) {
        if (setting.dataZoom.intervalType === 'value') {
            dataZ.startValue = setting.dataZoom.start;
            dataZ.endValue = setting.dataZoom.end;
        } else {
            dataZ.start = setting.dataZoom.start;
            dataZ.end = setting.dataZoom.end;
        }
        if (zoomType == 'slider') {
            dataZ.showDetail = setting.dataZoom.showDetail;
        }
        dataZ.zoomLock = setting.dataZoom.zoomLock;
        var axisList = [];
        var axis = orient == 'x' ? option.xAxis : option.yAxis;
        for (var i = 0; i < axis.length; i+= 1) {
            var arow = Math.floor(axis[i].gridIndex / opt.colCount) ;
            var acol = axis[i].gridIndex - opt.colCount * arow;
            if (row != -1 && row == arow || col != -1 && col == acol)
                axisList.push(i) ;
        }
        if (orient == 'x')
            dataZ.xAxisIndex = axisList;
        else
            dataZ.yAxisIndex = axisList;
        dataZoomList.push(dataZ);
    }
}

function regressionData(opt, data) {
    var type = opt.regLinesProps.type;
    var newData = [];
    if (opt.facts.x !== undefined )
        newData = data;
    else {
        for (var i = 0; i < data.length; i+= 1) {
            newData.push([i + 1, data[i][1]]) ;
        }
    }
    var regression = type == "polynomial" ? ecStat.regression(type, newData, opt.regLinesProps.order) : ecStat.regression(type, newData) ;

    if (opt.facts.x === undefined ) {
        for (var i = 0; i < regression.points.length; i += 1) {
            regression.points[i] = [data[i][0], regression.points[i][1]];
        }
    } else
        regression.points.sort(function (a, b) {
            return a[0] - b[0];
        }) ;
    return regression;
}

function regressionSeries(opt) {
    // серия для линии регрессии
    var series = {};
    //  series.name = 'regression' ;
    series.type = 'line';
    series.lineStyle = {
        normal: {
            type: opt.regLinesProps.lineType,
            color: opt.regLinesProps.color,
            width: opt.regLinesProps.width
        }
    };
    series.smooth = opt.regLinesProps.type == 'linear' || opt.regLinesProps.type == 'linearThroughOrigin' ? false : true;
    series.showSymbol = false;
    series.markPoint = {
        itemStyle: {
            normal: {
                color: 'transparent'
            }
        },
        label: {
            normal: {
                show: opt.regLinesProps.showLabel,
                position: 'left',
                textStyle: {
                    color: '#333',
                    fontSize: 14
                }
            }
        }
    };
    return series;
}

function zeroLine(markLineData, setting, orient) {
    // нулевая линия
    if (setting.zeroLine === undefined )
        return;
    var line = {};
    line.name = '0';
    if (orient == 'y')
        line.yAxis = 0;
    else
        line.xAxis = 0;
    line.lineStyle = {
        normal: {
            type: setting.zeroLine.type,
            color: setting.zeroLine.color,
            width: setting.zeroLine.width
        }
    };
    markLineData.push(line) ;
}

function averageLine(opt, markLineData) {
    // средняя линия
    if (opt.averageLine === undefined )
        return;
    var line = {};
    line.name = 'average';
    line.type = 'average';

    line.lineStyle = {
        normal: {
            type: opt.averageLine.type,
            color: opt.averageLine.color,
            width: opt.averageLine.width
        }
    };
    markLineData.push(line) ;

}

function fillTargets(data, targets, isY, isLine) {
    if (targets !== null ) {
        var count = isLine ? 1 : 2;

        targets.forEach(function (target) {
            if (target.values.length == count) {
                var el1 = { name: target.name };
                el1.label = {
                    show: target.labelShow,
                    position: 'end',
                    formatter: '{b}'
                };
                if (isY)
                    el1.yAxis = target.values[0];
                else
                    el1.xAxis = target.values[0];

                if (isLine) // свойства линии
                    el1.lineStyle = {
                        normal: {
                            type: target.type,
                            color: target.color,
                            width: target.width
                        }
                    };
                else // свойства заливки
                    el1.itemStyle = { color: linearGradient(target.color) };
                if (isLine)
                    data.push(el1) ;
                else { // вторая точка, если это зона
                    var el2 = {};
                    if (isY)
                        el2.yAxis = target.values[1];
                    else
                        el2.xAxis = target.values[1];
                    data.push([el1, el2]) ;
                }
            }
        }) ;
    }
}

function targetLine(markLineData, factY, factX, targets) {

    fillTargets(markLineData, factY === undefined || factY.targets === undefined ? null : factY.targets, true, true); // по факту Y

    if (factX !== undefined && factX.targets !== undefined) // по факту X, если X - числовая ось
        fillTargets(markLineData, factX.targets, false, true) ;

    fillTargets(markLineData, targets, false, true) ; // если ось X - категории
}

function targetArea(markAreaData, factY, factX, targets) {  // target zone
    fillTargets(markAreaData, factY === undefined || factY.targets === undefined ? null : factY.targets, true, false); // по факту Y

    if (factX !== undefined && factX.targets !== undefined) // по факту X, если X - числовая ось
        fillTargets(markAreaData, factX.targets, false, false) ;

    fillTargets(markAreaData, targets, false, false) ; // если ось X - категории
}

function fillText(label, style) {
    label.color = style.color;
    label.backgroundColor = style.background;
    label.fontSize = style.size;
    label.fontStyle = style.style;
    label.fontWeight = style.weight;
    if (style.textBorderColor !== undefined ) { // контур текста
        label.textBorderColor = style.textBorderColor;
        label.textBorderWidth = style.textBorderWidth;
    }
    // label.fontFamily = 'Open Sans Condensed' ;
}

function simpleLinearGradient(c1, c2, isVert) { // простой градиент по двум цветам, isVert = true  - вертикальный
    var color = new echarts.graphic.LinearGradient(0, 0, isVert ? 0 : 1, isVert ? 1 : 0, [{
        offset: 0,
        color: c1
    }, {
        offset: 1,
        color: c2
    }]) ;
    return color;
}

function bostonProps(opt, markAreaData) {
    // Бостонская матрица
    if (opt.isBoston === undefined )
        return;
    var pos = ['insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'];
    var y = 0;
    for (var row = 0; row < 2; row+= 1) {
        var x = 0;
        for (var col = 0; col < 2; col+= 1) {
            var i = row * 2 + col;
            var data = [];
            data.push({
                itemStyle: {
                    borderColor: opt.bostonData.lineColor,
                    borderWidth: opt.bostonData.lineWidth,
                    color: opt.bostonData.colors[i],
                },
                label: {
                    show: opt.bostonData.textShow,
                    color: opt.bostonData.color,
                    fontStyle: opt.bostonData.style,
                    fontWeight: opt.bostonData.weight,
                    fontSize: opt.bostonData.size,
                    backgroundColor: linearGradient(opt.bostonData.background),
                    position: pos[i]
                },
                name: opt.bostonData.texts[i],
                x: x + '%',
                y: y + '%'
            }) ;
            data.push({
                x: x + opt.bostonData.width[col] + '%',
                y: y + opt.bostonData.height[row] + '%'
            }) ;
            markAreaData.push(data) ;
            x += opt.bostonData.width[col];
        }
        y += opt.bostonData.height[row];
    }
}

function barGradient3d(color, dark, light, isVert) {
    var stops = [];
    stops.push({ offset: 0.0, color: light }) ;
    stops.push({ offset: 0.1, color: 'rgb(250, 250, 250)' }) ;
    stops.push({ offset: 0.3, color: light }) ;
    stops.push({ offset: 0.4, color: color }) ;
    stops.push({ offset: 0.6, color: dark }) ;
    stops.push({ offset: 0.8, color: color }) ;
    stops.push({ offset: 0.9, color: dark }) ;
    stops.push({ offset: 1, color: light }) ;

    return new echarts.graphic.LinearGradient(0, 0, isVert ? 0 : 1, isVert ? 1 : 0, stops) ;
}

function radialGradient(color) {
    var c2 = colorTool.modifyHSL(color, null, null, 0.8) ;
    return new echarts.graphic.RadialGradient(0.75, 0.25, 1, [{ offset: 0, color: c2 }, { offset: 1, color: color }]) ;
}

function darkColor(color, coef) {
    var hsl = colorTool.rgba2hsla(colorTool.parse(color)) ;
    return colorTool.modifyHSL(color, null, null, hsl[2] - hsl[2] * coef / 100) ;
}

function lightColor(color, coef) {
    var hsl = colorTool.rgba2hsla(colorTool.parse(color)) ;
    return colorTool.modifyHSL(color, null, null, hsl[2] + (1 - hsl[2]) * coef / 100) ;
}

function bubbleGradient(color, dark, light) {
    return new echarts.graphic.RadialGradient(0.3, 0.3, 1, [{ offset: 0, color: 'rgba(255, 255, 255, 255)' }, { offset: 0.3, color: light }, { offset: 1, color: dark }]) ;
}

function pieGradient(color, dark) {
    return echarts.graphic.RadialGradient(0.5, 0.5, 1, [{ offset: 0, color: color }, { offset: 0.9, color: color }, { offset: 1, color: dark }]) ;
}

function seriesColor(color, gradientType, fillGradient, isTree) {
    if (fillGradient !== undefined)
        return linearGradient(fillGradient);
    if (gradientType === undefined || isTree) // пока не реализован градиент для дерева
        return color;
    switch (gradientType) {
        case 'Hor': return simpleLinearGradient(darkColor(color, 30), lightColor(color, 30), false);
        case 'Vert': return simpleLinearGradient(darkColor(color, 30), lightColor(color, 30), true);
        case 'Hor3d': return barGradient3d(color, darkColor(color, 20), lightColor(color, 30), false);
        case 'Vert3d': return barGradient3d(color, darkColor(color, 20), lightColor(color, 30), true);
        case 'Pie': return pieGradient(color, darkColor(color, 50));
        case 'Bubble': return bubbleGradient(color, darkColor(color, 20), lightColor(color, 20));
        case 'Solid': return color;
    }
    return color;
}

function seriesColors(opt, colors) {
    var newColors = [];
    for (var i = 0; i < colors.length; i += 1) {
        var seria = opt.series[0].length > 0 ? opt.series[0][0] : opt.series[0];
        newColors.push(seriesColor(colors[i], seria.gradientType, seria.fillGradient));
    }
    return newColors;
}

function candleTooltip(opt, v) {
    var list = [];
    var data = opt.data[v.seriesIndex][v.dataIndex];
    if (data.length == 2) { // Мин, макс
        list.push('Min: ' + valueFormatter(data[1], opt.facts.y.format)) ;
        list.push('Max: ' + valueFormatter(data[0], opt.facts.x.format)) ;
    } else { // Биржевой
        list.push('Low: ' + valueFormatter(data[1], opt.facts.y.format)) ;
        list.push('High: ' + valueFormatter(data[0], opt.facts.x.format)) ;
        list.push('Open: ' + valueFormatter(data[2], opt.facts.size.format)) ;
        list.push('Close: ' + valueFormatter(data[3], opt.facts.f4.format)) ;
    }
    return list.join('<br/>') ;
}

function candleMax(opt) {
    var max = opt.facts.x.max;
    max = Math.max(max, opt.facts.y.max) ;
    if (opt.facts.size !== undefined )
        max = Math.max(max, opt.facts.size.max) ;
    if (opt.facts.f4 !== undefined )
        max = Math.max(max, opt.facts.f4.max) ;
    return max;
}

function fillLegend(opt, isShow) {
    var legend = {};
    legend.show = isShow;
    if (isShow) {
        if (opt.legend.background !== undefined )
            legend.backgroundColor = linearGradient(opt.legend.background) ;
        legend.borderColor = opt.legend.borderColor;
        legend.borderWidth = opt.legend.borderWidth;
        legend.borderRadius = 4;
        legend.orient = opt.legend.orient;
        legend.padding = 5;

        if (opt.legend.orient == 'vertical') {
            if (opt.legend.left)
                legend.left = 'left';
            else
                legend.right = 'right';
            legend.top = 'middle';
        } else {
            if (opt.legend.top)
                legend.top = 'top';
            else
                legend.bottom = 'bottom';
            legend.left = 'center';
        }
        legend.textStyle = {
            color: opt.legend.color,
            fontSize: opt.legend.size,
            fontStyle: opt.legend.style,
            fontWeight: opt.legend.weight
        };
    }
    return legend;
}

function fillTimeLine(timeline, position) {
    switch (position) {
        case 'top':
            timeline.orient = 'horizontal';
            timeline.y = 0;
            break;
        case 'bottom':
            timeline.orient = 'horizontal' ;
            break;
        case 'left':
            timeline.orient = 'vertical';
            timeline.x = 0;
            timeline.y = 10;
            timeline.width = 55;
            timeline.height = '90%' ; 
            break;
        case 'right':
            timeline.orient = 'vertical';
            timeline.x = null;
            timeline.x2 = 0;
            timeline.y = 10;
            timeline.width = 55;
            timeline.height = '90%';
            break;
    }
}

function getFactLabel(opt, value, fact, format) {
    var formats = fact === null  ? format : fact.format;
    return valueFormatter(value, formats) ;
}

function factLabel(opt, type, v, format) {
    // метка для факта
    var value = v.value.length > 1 ? v.value[1] : v.value;
    if (type == 'PairedBar') // только положительные для двойного столбца
        value = Math.abs(value) ;

    var fact = opt.facts !== undefined  ? (opt.facts.y === undefined  ? opt.facts.size : opt.facts.y) : null;
    var list = [];
    list.push(getFactLabel(opt, value, fact, format)) ;
    if ((type == 'Bubble' || type == 'Marimekko') && v.value.length > 2)
        list.push(getFactLabel(opt, v.value[2], opt.facts.size === undefined ? null : opt.facts.size, format));
    var sep = type == 'Bubble' ? '\n' : ', ';
    return list.join(sep) ;
}

function axisLabelClicked(opt, param) {
    // событие клика на метку оси
    if (opt.portal)
        return;
    var linkKey = echarts.number.linkText(param.event.target.style.text) ; // ключ линка типа link10
    if (linkKey !== undefined  && linkKey.substr(0, 4) == 'link') {
        var index = linkKey.substr(4, linkKey.length - 4) ;
        var link = opt.links[index] ; // url
        var ref = ['internal://n-#link', link] ;
        document.location.href = ref.join(",") ;
    }
}

function axisData(opt, setting, isLink, gridIndex) {
    // массив меток на оси
    var list = [];

    var data = opt.timeline !== undefined || opt.multi !== undefined ? opt.data[gridIndex] : opt.data ;
    data = data[0] ;
    if (opt.sort)
        data = sortData(opt, data, null) ;


    for (var i = 0; i < data.length; i += 1) { // кол-во отметок
        var formatter = data[i][data[i].length - 1]; // последний
        var seriesNames = [];

        for (var j = 0; j < formatter.length; j += 1)
            seriesNames.push(opt.seriesNames[formatter[j][0]]);

        var names = { value: seriesNames.join(" - ") };
        if (formatter.length > 0 && formatter[0][2] != -1) {
            // есть link - цвет и подчеркивание
            names.textStyle = { color: setting.labels.urlColor, textDecoration: 'underline' };
            isLink.flag = true;
        }
        list.push(names);
    }
    return list;
}
// формирует строку для подсказки факта, добавляет в list
function factTooltip(opt, list, values)
{
    var format = opt.format;
    if (opt.facts === undefined ) {
        list.push(valueFormatter(values, format));
        return;
    }

    if (opt.facts.x !== undefined ) { // факт X
        format = opt.facts.x.format ;
        list.push(valueFormatter(values[0], format)) ;
    }
    if (opt.facts.y !== undefined ) { // факт Y
        format = opt.facts.y.format ;
        list.push(valueFormatter(values.length > 1 ? values[1] : values, format)) ;
    }
    if (opt.facts.size !== undefined  && values.length > 2) { // факт Size
        format = opt.facts.size.format;
        var index = opt.facts.y !== undefined  ? 2 : 1 ; // для гор. или верт. bubble
        list.push(valueFormatter(values[index], format)) ;
    }
}
// форматтер для подсказок
function tooltipFormatter(opt, type, v)
{
    var list = [] ;
   // if (type == 'Card')
    //    return '' ; // временно, реализовать подсказки для карточек
    if (v !== undefined  && v.length !== 2) { // временно!!!
        if (opt.coordinateSystem == 'sankey') {
            if (v.data !== undefined ) {
                if (v.data.name !== undefined )
                    return sankeyLabel(v.data.name) ;
                else if (v.data.source !== undefined  && v.data.target !== undefined )
                    return sankeyLabel(v.data.source) + ' - ' + sankeyLabel(v.data.target) + ' ' + v.data.value ;
            }
            else
                return null ;
        }
        if (v.value !== undefined ) {
            // ------- Заголовок серии -------
            if (opt.tooltips.isSeriesName && v.seriesName !== undefined  && v.seriesName.length > 0)
                list.push(v.marker + v.seriesName) ;

            // ------- Измерение -------
            if (opt.tooltips.isName && type != 'HeatMap') { // Измерение
                if (opt.coordinateSystem === 'tree') {
                    var names = [] ;
                    v.treePathInfo.forEach(function(info) { 
                        if (info.name !== '')
                            names.push(info.name) ;
                    } ) ;
                    list.push(v.marker + names.join(' - ')) ;
                } else if ((opt.facts === undefined || opt.facts.x === undefined) && v.value.length > 1) // первый элемент - название
                    list.push(v.value[0]);
                else {// первый элемент - факт X
                    list.push(opt.seriesNames[v.dataIndex]);
                }
            }
            // ------- Факт -------
            if (opt.tooltips.isValue) { // Факт
                if (type === 'Candle')
                    list.push(candleTooltip(opt, v)) ;
                else if (type == 'HeatMap')
                    list.push(valueFormatter(v.value[2], opt.facts.y.format)) ;
                else
                    factTooltip(opt, list, v.value) ;
            }
        } else if (v.name !== undefined )
            return v.name ;

    }
    return list.join('<br/>') ;
}
// форматтер для меток оси
function axisFormatter(opt, type, fact, value, index, gridIndex, timelineIndex, setting) {

    if (type === 'category' && index !== undefined) {
        var list = [];
        // insert
        var data = opt.timeline !== undefined ? opt.data[timelineIndex] : (opt.multi !== undefined ? opt.data[gridIndex] : opt.data);
        data = data[0];
        if (opt.sort)
            data = sortData(opt, data, null) ;
        var formatters = data[index][data[index].length - 1]; // последний

        /*if (index < formatters.length) {
            // insert
            var formatter = formatters[index];*/
        var flag = setting.labels.textAndImage;

        for (var i = 0; i < formatters.length; i = i + 1) {
            var imageAndTextList = [];
            // ImageOnly TextOnly TextBesideImage TextBelowImage TextUnderImage TextOverImage
            var sep = flag === 'TextUnderImage' || flag === 'TextOverImage' ? '\n' : ' ';
            // var text = '';
            if (flag !== 'ImageOnly')
                imageAndTextList.push('{value|' + opt.seriesNames[formatters[i][0]] + '}'); // текст
        //   var text = '{value|' + opt.seriesNames[formatters[i][0]] + '}';

            if (formatters[i][1] != -1 && flag !== 'TextOnly') {
                var imageName = 'image' + formatters[i][1];
                imageName = '{' + imageName + '| }'
                if (flag === 'TextUnderImage' || flag === 'TextBesideImage')
                    imageAndTextList.unshift(imageName);
                else
                    imageAndTextList.push(imageName);
            }
            var text = imageAndTextList.join(sep);

            /*if (formatters[i][1] != -1) { // картинка
                var imageName = 'image' + formatters[i][1];
                    text += ' {' + imageName + '| }';
            }*/
           // text += '{value|' + opt.seriesNames[formatters[i][0]] + '}';
            if (formatters[i][2] != -1) { // ссылка
                var urlName = 'link' + formatters[i][2];
                    text += ' {' + urlName + '| }';
                }
                list.push(text);
            }
        //} // insert

        return list.join(setting.labels.separator);
    }
    else {
        var format;
        if (opt.ColumnStack100)
            format = {
                decimal: 0,
                prefix: '',
                sep: false,
                suffix: '%'
            };
        else if (fact !== undefined)
            format = fact.format;
        return valueFormatter(value, format) ;
    }
}
function kpiLabelFormatter(opt, v) {
    var card = opt.card;
    var data = opt.timeline !== undefined ? v.value : opt.data[0][v.dataIndex];
    var list = [];
    var formatters = data[data.length - 1][0]; // последний
    card.list.forEach(function(str) {
        switch (str) {
            case 'Actual': // всегда, факт Y
                var imageName = '' ;
                if (opt.facts.y.image !== undefined)
                    imageName = '{imageFact| }'

                list.push(imageName + '{factName|' + opt.facts.y.name + '}' + '{factValue|' +  valueFormatter(data[1], opt.facts.y.format) + '}') ;
               // list.push('{factValue|' + data[1] + '}') ;
                break ;
            case 'Plan': // может быть задан, факт X
                if (opt.facts.x != undefined) {
                    var imageName = '' ;
                    if (opt.facts.x.image !== undefined)
                        imageName = '{imagePlan| }'
                    list.push(imageName + '{planName|' + opt.facts.x.name + '}' + '{planValue|' + valueFormatter(data[0], opt.facts.x.format) + '}');
                  //  list.push('{planValue|' + data[0] + '}');
                }
                break ;
            case 'Percent': // если задан X
                if (opt.facts.x != undefined) {
                    list.push('{planValue|' + data[1] *data[0] / 100  + '}');
                }
                break ;
            case 'Object':
                break ;
            case 'IndicatorName': // всегда
                if (opt.labels.indName.length > 0) {
                    var image = '';
                    if (formatters[1] != -1)
                        image = '{image' + formatters[1] + '| }';
                    list.push(image + '{indicator|' + opt.seriesNames[v.dataIndex] + '}');
                }
                break ;
            case 'Unit':
                break ;

        }
    });
    return list.join('\n');
}


function kpiLabelsRich(opt, labels)
{
    rich = {} ;
    opt.card.list.forEach(function (str) {
        switch (str) {
            case 'Actual': // всегда, факт Y
                rich.factName = {} ;
                rich.factValue = {} ;
                fillText(rich.factName, opt.facts.y.factHeader) ;
                rich.factName.wrap = true ;
                rich.factName.width = opt.card.maxFactWidth ;
                fillText(rich.factValue, opt.facts.y.factValue) ;
                if (opt.facts.y.image !== undefined) {
                    rich.imageFact = {
                        width: opt.facts.y.imageWidth,
                        height: opt.facts.y.imageHeight,
                        trueHeight: opt.facts.y.imageHeight,
                        align: 'center',
                        backgroundColor: {
                            image: opt.facts.y.image
                        }
                    } ;
                }
                break ;
            case 'Plan': // может быть задан, факт X
                if (opt.facts.x != undefined) {
                    rich.planName = {} ;
                    rich.planName.wrap = true ;
                    rich.planName.width = opt.card.maxFactWidth ;
                    rich.planValue = {} ;
                    fillText(rich.planName, opt.facts.x.factHeader) ;
                    fillText(rich.planValue, opt.facts.x.factValue) ;
                    if (opt.facts.x.image !== undefined) {
                        rich.imagePlan = {
                            width: opt.facts.x.imageWidth,
                            height: opt.facts.x.imageHeight,
                            trueHeight: opt.facts.x.imageHeight,
                            align: 'center',
                            backgroundColor: {
                                image: opt.facts.x.image
                            }
                        } ;
                    }
                }
                break ;
            case 'Percent': // если задан X
               
                break ;
            case 'Object':
                break ;
            case 'IndicatorName': // всегда
                if (labels.indName.length > 0) {
                    rich.indicator = {};
                    fillText(rich.indicator, labels.indName[0]);
                    rich.indicator.wrap = true;
                }
                break ;
            case 'Unit':
                break ;
        }
    });
    if (opt.images !== undefined) {
        for (var i = 0; i < opt.images.length; i++) {
            var imageName = 'image' + i ;
            rich[imageName] = {
                width: opt.imageSizes[i][0],
                height: opt.imageSizes[i][1],
                trueHeight: opt.imageSizes[i][1],
                align: 'center',
                backgroundColor: {
                    image: opt.images[i]
                }
               
            } ; 
        }
    }
    return rich ;
}
// форматтер для меток графика
function labelFormatter(opt, type, labels, v)
{
    if (type === 'kpi')
        return kpiLabelFormatter(opt, v);
    var list = [] ;
    var after = false ;
    if (labels.series !== undefined) {
        after = labels.name !== undefined || labels.fact !== undefined && v.value !== undefined || labels.percent !== undefined && v.percent !== undefined ;
        list.push(labels.series.lineBefore + '{series|' + labels.series.separatorBefore + v.seriesName + (after ? labels.series.separatorAfter : '') + '}' + after ? labels.series.lineAfter : '');
    }
    if (labels.name !== undefined) {
        after = labels.fact !== undefined && v.value !== undefined || labels.percent !== undefined && v.percent !== undefined;
        list.push(labels.name.lineBefore + '{name|' + labels.name.separatorBefore + v.name + (after ? labels.name.separatorAfter : '') + '}' + (after ? labels.name.lineAfter : ''));
    }
    if (labels.fact !== undefined && v.value !== undefined) {
        after = labels.percent !== undefined && v.percent !== undefined;
        valueName = factLabel(opt, type, v, opt.format) ;
        list.push(labels.fact.lineBefore + '{value|' + labels.fact.separatorBefore + valueName + (after ? labels.fact.separatorAfter : '') + '}' + (after ? labels.fact.lineAfter : ''));
    }
    if (labels.percent !== undefined  && v.percent !== undefined) {
        var value = v.percent ;
        value = value.toFixed(labels.percentDecimals) ; // знаков после запятой для процента
        list.push(labels.percent.lineBefore + '{percent|' + labels.percent.separatorBefore + value + '%' + '}') ;
    }
    return list.join("") ;  
}

function fillLabelsRich(opt, type, labels) 
{
    if (type === 'kpi')
        return kpiLabelsRich(opt, labels);
    rich = {} ;
    if (labels.series !== undefined ) {
        rich.series = {} ;
        fillText(rich.series, labels.series) ;
    }
    if (labels.name !== undefined ) {
        rich.name = {} ;
        fillText(rich.name, labels.name) ;
    }
    if (labels.fact !== undefined ) {
        rich.value = {} ;
        fillText(rich.value, labels.fact) ;
    }
    if (labels.percent !== undefined ) {
        rich.percent = {} ;
        fillText(rich.percent, labels.percent) ;
    }
    rich.hr = {
        width: '100%',
        borderColor: labels.lineColor,
        borderWidth: labels.lineWidth,
        height: 0,
        lineHeight: 10
    } ;
    return rich ;
}

