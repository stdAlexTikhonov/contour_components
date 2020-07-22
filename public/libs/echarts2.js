// div_name   - div name
// object     - chart object, must be created if null
// opt
// function must return object
var div_element = document.getElementById(div_name) ;
var chart = echarts.init(document.getElementById(div_name)) ;
var width  = parseInt(div_element.style['width'], 10) ;
var height = parseInt(div_element.style['height'], 10) ;
chart.resize(width, height) ;
var chartHeight = chart.getHeight() ;
var chartWidth  = chart.getWidth() ;
var baseAxisIndex = 0 ; // номер текущей "основной" оси "слева" - может относиться к нескольким сериям
var addedAxisX = [] ; // массив дополнительных осей (для пустых гридов)
var addedAxisY = [] ;
var timelineIndex = 0 ;
// отладка кнопка
/*function buttonClicked() {
    var o = GLOBAL_MAP['chart']; var r = DrawChart('chart', d, o) ; GLOBAL_MAP['chart'] = r; 
}

var btn = document.createElement('input');
btn.id = 'b1';
btn.type = 'button';
btn.value = 'Кнопка';

document.body.appendChild(btn);
document.getElementById('b1').onclick = buttonClicked ;*/
// отладка
chart.on('click', function (param) {
    if (param.data && param.componentType === 'series') {
        // var cell = opt.cells[param.seriesIndex] ;
        var data = opt.data[param.seriesIndex] ;
        var index = param.dataIndex ;
        if (opt.multi !== undefined ) {
            var row = Math.floor(param.seriesIndex / opt.cells[0].length) ;
            var col = param.seriesIndex - opt.cells[0].length * row ;
            //cell = opt.cells[row][col] ;
            data = opt.data[row][col] ;
        } else if (opt.timeline !== undefined ) {
            //cell = opt.cells[timelineIndex][param.seriesIndex] ;
            data = opt.data[timelineIndex][param.seriesIndex] ;
        }
        var cell = data[index] ; // последний, потом заменить на предпоследний
        if (opt.portal) { // для BI-портала
            chartLinkedReport(cell[cell.length - 2][0], cell[cell.length - 2][1], div_name) ;
        } else { // для репортера
            var ref = ['internal://n-#cell', cell[cell.length - 2]] ;
            document.location.href = ref.join(",") ;
        }
    }
}) ;

chart.on('click', 'yAxis.category', function (param) {
    axisLabelClicked(opt, param) ;
}) ;

chart.on('click', 'xAxis.category', function (param) {
    axisLabelClicked(opt, param) ;
}) ;

chart.on('click', 'timeline', function (param) {
    timelineIndex = param.dataIndex ;
}) ;


function getSeries(gridIndex, ndx) {
    if (opt.coordinateSystem === 'tree' && opt.timeline === undefined || opt.coordinateSystem === 'sankey')
        return opt.series[ndx] ;
    return opt.series[gridIndex][ndx] ;
}

function firstSeries() { 
    return getSeries(0, 0) ;
}

function firstType() {
    return firstSeries().type ;
}

option = {
    backgroundColor: linearGradient(opt.background.color), // фон
    animation: opt.animation,
    legend: fillLegend(opt, opt.legend.show),
    tooltip: {
        show: true,
        showContent: opt.tooltips.isShow,
        trigger: 'item',
        axisPointer: {
            type: 'cross'
        },

        backgroundColor: opt.tooltips.background,
        borderWidth: opt.tooltips.borderWidth,
        borderColor: opt.tooltips.borderColor,
        padding: 5,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowBlur: 3,
        shadowOffsetY: 5,
        textStyle: {
            color: opt.tooltips.color,
            fontStyle: opt.tooltips.style,
            fontWeight: opt.tooltips.weight,
            fontSize: opt.tooltips.size,
        }
    },

    xAxis: [],
    yAxis: [],
    angleAxis: [],
    radiusAxis: [],
    singleAxis: [],
    series: []
};

calcGrid(chartWidth, chartHeight, opt, option, firstType()) ;

function axis(series, name, type, fact, orient, gridIndex, ndx, dataIndex) { // dataIndex - по умолчанию
    if (dataIndex === undefined)
        dataIndex = gridIndex ;
    var chartType = firstType() ;
    var isLink = { flag: false } ;
    hor = chartType === 'HorizontalBar' || chartType === 'PairedBar' || chartType === 'BubbleColumn' ;
    setting = orient === 'x' ? (hor ? opt.yAxis : opt.xAxis) : (hor ? opt.xAxis : opt.yAxis) ;
   // var fontHeight = strSize('A', setting.labels.size) ;

    if (series !== null && type === 'value')
        zeroLine(series.markLine.data, setting, orient) ;
  
    var position = fact !== undefined ? fact.position : (setting.position !== undefined  ? setting.position : (hor ? 'left' : 'bottom')) ;

    var row = Math.floor(gridIndex / opt.colCount) ;
    var col = gridIndex - opt.colCount * row ;

    var addedAxis = opt.multi !== undefined  && gridIndex >= opt.multi.length; // дополнительная ось в пустом окне

    var hide = opt.hideAxis && ((position === 'left' &&  col >  0 && opt.colCount > 1) || 
        (position === 'right' && col < opt.colCount - 1 && opt.colCount > 1) ||
        (position === 'top' &&  row > 0 && opt.rowCount > 1) || (position === 'bottom' && row < opt.rowCount - 1 && opt.rowCount > 1)) ;

    if (opt.multi !== undefined  && opt.hideAxis  && opt.multi.length < opt.colCount * opt.rowCount && row === opt.rowCount - 2 && gridIndex + opt.colCount >= opt.multi.length) {
        var addAxis = axis(null, name, type, fact, orient, gridIndex + opt.colCount, ndx, gridIndex) ;
        if (orient === 'x')
            addedAxisX.push(addAxis) ;
        else 
            addedAxisY.push(addAxis) ;
        }

    var ax =  {
        type: type,
        gridIndex: (opt.timeline !== undefined  ? 0 : gridIndex),
        nameLocation: 'center',
        nameTextStyle: {
            color: setting.title.color,
            fontStyle: setting.title.style,
            fontWeight: setting.title.weight,
            fontSize: setting.title.size
        },
        splitLine: {
            show: setting.grid.show && !addedAxis,
            lineStyle: {
                type: setting.grid.type,
                color: setting.grid.color,
                width: setting.grid.width
            }
        },
        axisPointer: {
            show: setting.axisPointer !== undefined,
        },
        axisLabel: {
            formatter: function (value, index, timelineIndex, dim) { 
                var chartType = firstType() ;
                var hor = chartType === 'HorizontalBar' || chartType === 'PairedBar' || chartType === 'BubbleColumn' ;
                var asetting = dim === 'x' ? (hor ? opt.yAxis : opt.xAxis) : (hor ? opt.xAxis : opt.yAxis) ;
                return axisFormatter(opt, type, fact, value, index, dataIndex, timelineIndex, asetting) ;
            },
            show: setting.labels.show && !hide,
            
            textStyle: {
                color: setting.labels.color,
                fontStyle: setting.labels.style,
                fontWeight: setting.labels.weight,
                fontSize: setting.labels.size,
                fontFamily: 'sans-serif',
            }
        },
        axisLine: {
            show: setting.line.show && !(addedAxis && hide),
            lineStyle: {
                type: hide ? setting.grid.type : setting.line.type,
                color: hide ? setting.grid.color : setting.line.color,
                width: hide ? setting.grid.width : setting.line.width
            }
        },
        axisTick: {
            show: setting.ticks.show && !hide
        },
        boundaryGap: type === 'category'
    } ;
    if (setting.labels.showMinLabel !== undefined)
        ax.axisLabel.showMinLabel = setting.labels.showMinLabel ;
    if (setting.labels.showMaxLabel !== undefined)
        ax.axisLabel.showMaxLabel = setting.labels.showMaxLabel ;

    if (setting.axisPointer) {
        ax.axisPointer.label = {
            borderWidth: setting.axisPointer.borderWidth,
            borderColor: setting.axisPointer.borderColor,
            backgroundColor: setting.axisPointer.background,
            color: setting.axisPointer.color,
            fontStyle: setting.axisPointer.style,
            fontWeight: setting.axisPointer.weight,
            fontSize: setting.axisPointer.size,
            margin: setting.axisPointer.margin,
        } ;
    }
    ax.axisLabel.rotate = setting.labels.rotate ;
    ax.axisLabel.rich = {
        value: {
            fontStyle: setting.labels.style,
            fontWeight: setting.labels.weight,
            fontSize: setting.labels.size,
            fontFamily: 'sans-serif'
        }
    } ;
    if (opt.images !== undefined  && !opt.pictorial) {
        for (var i = 0; i < opt.images.length; i++) {
            var imageName = 'image' + i ;
            ax.axisLabel.rich[imageName] = {
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
    if (opt.links !== undefined ) {
        for (var i = 0; i < opt.links.length; i++) {
            var urlName = 'link' + i ;
            ax.axisLabel.rich[urlName] = {
                link: opt.links[i]
            } ;
        }
    }

    if (addedAxis && type === 'value' && fact !== undefined) {
        ax.min = 0;
        ax.max = fact.max ;
    }
    if (type === 'category' && (addedAxis || (opt.pictorial && chartType == 'Bar') /* || chartType === 'ImageBubble'*/ || 
        opt.links || opt.isOnlyFact || opt.separateColors || /*временно */ opt.onlyTotal))
        ax.data = axisData(opt, setting, isLink, dataIndex) ;
    
    if (opt.coordinateSystem === 'cartesian2d')
        ax.position = position ;
    if (fact !== undefined ) {
        if (fact.log !== undefined  && fact.log === true)
            ax.type = 'log' ;
        if (fact.color !== undefined  && !hide)
            ax.axisLine.lineStyle.color = fact.color ;
        if (ax.axisPointer.label)
            ax.axisPointer.label.precision = /*fact.format.decimal*/2 ;
     
    }
    if (setting.title.show && !hide)
        ax.name = setting.title.text !== undefined  ? setting.title.text : (fact !== undefined ? fact.name : name) ;

    if (setting.width !== undefined)
        ax.width = setting.width ;

    if (setting.title.background !== undefined )
        ax.nameTextStyle.backgroundColor = linearGradient(setting.title.background) ;
    if (setting.labels.background !== undefined )
        ax.axisLabel.textStyle.backgroundColor = linearGradient(setting.labels.background) ;

    if (type === 'value') {
        if (setting.line.tickCount !== undefined )
            ax.splitNumber = setting.line.tickCount ;
        if (setting.line.log === true)
            ax.type = 'log' ;

    }
    if (chartType === 'BubbleBar' && orient === 'y' ||
        chartType === 'BubbleColumn' && orient === 'x') {
        ax.min = 0 ;
        ax.max = 1 ;
    }
    if (fact !== undefined && opt.separateAxis === false && opt.ColumnStack100 === undefined) {
        ax.scale = true ;
        // если min/max заданы вручную
        if (fact.limitMin !== undefined )
            ax.min = fact.limitMin ;
        else if (opt.sameScale && opt.multi !== undefined  && fact.min < 0)
            ax.min = fact.min ;
        if (fact.limitMax !== undefined )  
            ax.max = fact.limitMax ;
        else if (opt.sameScale && opt.multi !== undefined )
            ax.max = opt.maxTotal !== undefined  ? opt.maxTotal : fact.max ;
            /*временно */else if (opt.onlyTotal) {
                ax.max = 0 ;
                ax.scale = true ;
            }
    } else if (fact && opt.separateAxis && opt.sameScale && opt.multi !== undefined  && (hor && orient === 'x' || !hor && orient === 'y')) {
        ax.max = fact.seriesMax[ndx] ;
    }
    ax.hide = hide ;
    if (isLink.flag)
        ax.triggerEvent = true ;
    return ax ;
}

function seriesLabelByType(name, type, gridIndex, ndx) {
    var labels = getSeries(gridIndex, ndx).labels !== undefined  ? getSeries(gridIndex, ndx).labels : opt.labels ;

    var label = {
        normal: {
            show: true,
            position: 'top',
            color: 'black',
            distance: labels.distance
        },
        emphasis: {
            textStyle: {
                fontSize: 20
            }
        }
    };
    if (labels.background !== undefined )
        label.normal.backgroundColor = linearGradient(labels.background) ; 
    
    switch (type) {
        case 'Line':
        case 'Area':
        case 'CurvedArea':
        case 'Scatter':
            label.normal.position = labels.inside ? 'inside' : 'top' ;
            label.normal.distance = labels.distance ;
            break ;
        case 'Bubble':
        case 'BubbleColumn':
        case 'BubbleBar':
         //   label.normal.position = 'inside' ;
            label.normal.distance = labels.distance ;
            break ;
        case 'Bar':
              label.normal.position = opt.ColumnStack || opt.ColumnStack100 ? 'inside' : (labels.inside ? 'insideTop' : 'top') ;
            label.normal.position = opt.ColumnStack || opt.ColumnStack100 ? 'inside' : (labels.inside ? 'insideTop' : 'top') ;
            label.normal.rotate = labels.rotate ;
            break ;
        case 'HorizontalBar':
            label.normal.position = opt.ColumnStack || opt.ColumnStack100 ? 'inside' : (labels.inside ? 'insideRight' : 'right') ;
            break ;
        case 'PairedBar':
            label.normal.position = labels.inside ? (ndx % 2 === 1 ? 'insideRight' : 'insideLeft') : (ndx % 2 === 1 ? 'right' : 'left') ;
            break ;
        case 'Pie':
            label.normal.position = labels.inside ? 'inside' : 'outside' ;
            label.normal.rotate = 0 ;
            break ;
        case 'Pyramid':
            label.normal.position = labels.inside ? 'inside' : 'right' ;
            break ;
        case 'Sunburst':
            label.normal.position = labels.inside ? 'inside' : 'outside' ;
            label.normal.rotate = labels.rotate ;
            break ;
        case 'Candle':
            break ;
        case 'Treemap':
            label.normal.position = 'inside' ;
            break ;
        case 'TagCloud':
            break ;
        case 'Sankey':
            label.normal.position = 'right' ;
            break ;
    }
    if (labels.position !== undefined )
        label.normal.position = labels.position ;

    if (label) {
        label.normal.formatter = function(v) { return labelFormatter(opt, firstType(), labels, v) ; } ;
   
        if (labels.borderColor !== undefined ) { // рамка
            label.normal.borderColor = labels.borderColor ;
            label.normal.borderWidth = labels.borderWidth ;
            label.normal.borderRadius = labels.borderRadius ;
            label.normal.padding = labels.borderPadding ;
        }
        if (labels.shadowColor !== undefined ) { // тень (от рамки)
            label.normal.shadowColor = labels.shadowColor ;
            label.normal.shadowBlur = labels.shadowBlur ;
            label.normal.shadowOffsetX = labels.shadowOffsetX ;
            label.normal.shadowOffsetY = labels.shadowOffsetY ;
        }
        label.normal.rich = fillLabelsRich(opt, type, labels) ;
    }

    return label ;
}

function heatMapData(data, gridIndex) {
    var newData = [] ;
    opt.seriesNamesX = [] ;
    opt.seriesNamesY = [] ;
    for (var index = 0; index < data.length; index++) {
        var rowData = data[index] ;
        for (var i = 0; i < rowData.length; i++) {
            if (index === 0)
                opt.seriesNamesX.push(rowData[i][0]) ;
            newData.push([i, index, rowData[i][1]]) ;
        }
        opt.seriesNamesY.push(opt.series[gridIndex][index].name) ;
    }
    return newData ;
}

function candleData(data, seria) {
    var newData = [] ;
    for (var i = 0; i < data.length; i++) {
        var max = data[i][0] ;
        var min = data[i][1] ;
        var open = data[i].length == 2 ? min : data[i][2] ;
        var close = data[i].length == 2 ? max : data[i][3] ;
                
        newData.push({ value: [ Math.min(min, max), Math.min(open, close), open, Math.max(open, close), Math.max(min, max) ],
            itemStyle: {
                normal: {
                    color: open < close ? opt.candle.increaseColor : opt.candle.decreaseColor,
                    borderWidth: seria.border.width,
                    borderType:  seria.border.type
                }}
        }) ;
    }
    return newData ;
}

function bubbleData(data) {
    var newData = data ;
    for (var i = 0; i < newData.length; i++)
        newData[i].push(0.5) ;
    return newData ;
}

function pictureData(data, gridIndex, type) {
    var newData = [] ;
    var max = opt.facts.y.limitMax !== undefined ? opt.facts.y.limitMax : (opt.multi !== undefined || opt.timeline !== undefined) && !opt.sameScale ? opt.imageColumn.maxList[gridIndex] : opt.facts.y.max ;
    var min = opt.facts.y.limitMin !== undefined ? opt.facts.y.limitMin : (opt.multi !== undefined || opt.timeline !== undefined) && !opt.sameScale ? opt.imageColumn.minList[gridIndex] : opt.facts.y.min ;
    
    for (var i = 0; i < data.length; i++) {
        var onedata = {} ;
        onedata.value = type == 'max' ? 1 : data[i][1];
        onedata.name = data[i][0] ;
        var formatter = data[i][data[i].length - 1] ;
       // var formatter = (opt.multi === undefined && opt.timeline === undefined) ? opt.seriesNameData.formatters[0][i] : opt.seriesNameData[gridIndex].formatters[0][i] ;
        onedata.symbol = opt.images[formatter[0][1]] ;
        if (opt.imageColumn.scale && type !== 'max') {
            var size = Math.max(10, ((data[i][1] - min) * 100 /  (max - min))) ;
            onedata.symbolSize =  [size + '%', '100%'] ;
        }
        newData.push(onedata) ;
    }
    return newData ;
}

function bubblePictureData(data, gridIndex) {
    var newData = [] ;
    for (var i = 0; i < data.length; i++) {
        var formatter = data[i][data[i].length - 1] ;
      //  var formatter = (opt.multi === undefined && opt.timeline === undefined) ? opt.seriesNameData.formatters[0][i] : opt.seriesNameData[gridIndex].formatters[0][i] ;
        var onedata = { 
            value: data[i][1],
            name: data[i][0],
            symbolSize: bubbleSize(data[i][2]),
            symbol: opt.images[formatter[0][1]]
        } ;
        newData.push(onedata) ;
    }
    return newData ;
}
// временно, для росстата - удаление незаданных только в односерийном графике
function getDefinedData(data)
{
    var newData = [] ;
    for (var i = 0; i < data.length; i++) {
        if (data[i][1] !== null)
            newData.push(data[i]) ;
    }
    return newData ;
}

function getData(data, seria, gridIndex) {
    var type = opt.series[gridIndex][0].type ;
    switch (type) {
        case 'Candle':  return candleData(data, seria) ;
        case 'BubbleBar':
        case 'BubbleColumn': return bubbleData(data) ;
        case 'Bar': return opt.pictorial ? pictureData(data, gridIndex, 'all') : data ;
        case 'Bubble': return opt.pictorial ? bubblePictureData(data, gridIndex) : data ;
            //   default:        return opt.sort ? sortData(opt, data, opt.colors) : (opt.removeUndefined !== undefined && opt.removeUndefined ? getDefinedData(data) : data) ;
        default:        return opt.sort ? sortData(opt, data, opt.colors) : data ;
    }
}

function getAreaData(data, type) {
    var newData = [] ;
    for (var i = 0; i < data.length; i++) {
        newData.push([data[i][0], type == 'min' ? data[i][2] : (type == 'average' ? (data[i][1] + data[i][2]) / 2 : data[i][1])]) ;
    }
    return newData ;
}

function bubbleSize(val)
{
    if (val === undefined)
        val = 0 ;
    var zmin = opt.bubble.min ; // размер наменьшего пузыря в процентах от экрана (из стилей)
    var zmax = opt.bubble.max ; // размер наибольшего пузыря в процентах от экрана
    pmin = Math.min(chartWidth / opt.colCount, chartHeight / opt.rowCount) * zmin ; // размер наменьшего пузыря в пикселях
    var pmax = Math.min(chartWidth / opt.colCount, chartHeight / opt.rowCount) * zmax ; // размер наибольшего пузыря в пикселях
    size = (pmin + (val - opt.facts.size.min) * (pmax - pmin) / (opt.facts.size.max - opt.facts.size.min)) * opt.bubble.scale ; // размер текущего пузыря в пикселях, учитывая scale
    return size ;
}

function seriesByType(seria, name, type, ndx, itemStyle, gridIndex, isAxis) {
    var series = {} ;
    // insert отладка emphasis
   /* series.emphasis = {
        itemStyle: {
            color: 'red'
        }
    } ;*/
    // insert
    series.name = name ;
    series.separateColors = opt.separateColors ;
    series.itemStyle = itemStyle ;
    var axisNeeded = false ;
    var hor = false ;
      series.markLine = {symbol: 'none'} ;
    series.markArea = {} ;
      series.markLine.data = [] ;
    series.markArea.data = [] ;
    if (opt.legend.reverse && opt.legend.show && name !== '')
        option.legend.data.unshift(name) ;
    
    if (ndx === 0)
        bostonProps(opt, series.markArea.data) ;
   
    var isLabel = opt.isLabel !== undefined  ? opt.isLabel : (seria !== null  ? seria.isLabel : false) ;

    if (opt.coordinateSystem === 'polar')
        series.coordinateSystem = 'polar';

    switch (type) {
        case 'Spline':
        case 'Line':
        case 'StepLine':
            series.type = 'line' ;
            series.encode = { itemName: 0, y: 1, x: 0, radius: 1, angle: 0 } ;
            series.smooth = type === 'Spline' ; // Кривая
            if (type === 'StepLine') // Лесенка
                series.step ='end' ;
            // свойства узлов
            series.symbolSize = seria.anchor.show ? seria.anchor.size : 0; // размер узла
            series.symbol = seria.anchor.show ? seria.anchor.type : 'none' ; // тип узла
           
            if (seria.anchor.show) {
                series.itemStyle.normal.borderColor = seria.anchor.borderColor ; // контур узла
                series.itemStyle.normal.borderWidth = seria.anchor.borderWidth ; // ширина контура
                series.symbolColor = seria.anchor.color !== 'transparent' ? seria.anchor.color : null; // цвет фона узла
            }

            series.lineStyle = {
                normal: {
                    width: seria.line.width,
                    type: seria.line.type
                }
            } ;
            if (seria.line.shadow) { // тень линии 
                series.lineStyle.normal.shadowColor = 'rgba(0,0,0,0.2)' ;
                series.lineStyle.normal.shadowBlur = 3 ;
                series.lineStyle.normal.shadowOffsetY = 5 ;
            }
            axisNeeded = true ;
            break ;
        case 'Bar':
        case 'HorizontalBar':
        case 'PairedBar':
        case 'Marimekko':
            if (opt.pictorial) { // Столбец-картинка
                series.type = 'pictorialBar' ;
                axisNeeded = isAxis ;
                if (isAxis)
                    series.symbolClip = opt.imageColumn.clip ;
                if (opt.imageColumn.clip)
                    series.symbolBoundingData = (opt.multi !== undefined  || opt.timeline !== undefined ) && !opt.sameScale ? opt.imageColumn.maxList[gridIndex] : opt.facts.y.max ;
                if (opt.imageColumn.repeate) {
                    series.symbolOffset = [opt.imageColumn.offsetX, opt.imageColumn.offsetY] ;
                    series.symbolMargin = opt.imageColumn.margin ;
                }
                series.symbolRepeat = opt.imageColumn.repeate ;
                series.columnWidth = function (d) {
                    return null ;
                } ;
                if (!isAxis)
                    isLabel = false ;
            } else {
                hor = type === 'HorizontalBar' || type === 'PairedBar' ;
                series.encode = { itemName: 0, y: hor ? 0 : 1, x: hor ? 1 : 0, radius: hor ? 0 : 1, angle: hor ? 1 : 0 } ; 
                series.type = 'bar' ;
            
                if (opt.ColumnStack === true || type === 'PairedBar' || opt.ColumnStack100 === true)
                    series.stack = 'stack' + '_' + gridIndex ;
                if (opt.ColumnStack100 === true)
                    series.stack100 = 'stack100' ;

                series.columnWidth = function (d) {
                    if (type !== 'Marimekko')
                        return null ;
                    var v = d[2] ; // текущее значение факта X
                    if (v === undefined)
                        return 0 ;
              
                    var data = opt.timeline === undefined && opt.multi === undefined ? opt.data : opt.data[gridIndex] ;
                    var total = 0 ;
                    // переделать indexes !!! 
                    for (var j = 0 ; j < data.length; j++) {
                        for (var i = 0; i < data[j].length; i++) {
                            var value = data[j][i][2] ;
                            if (value === undefined)
                                continue ;
                            total += value ;             
                        }
                    }
                    return (v * 100 / total) + '%' ;
              
                } ;
                if (type === 'Marimekko')
                    series.mekko = true ;
            
                if (opt.coordinateSystem === 'polar') {
                    if (ndx === 0) {
                        if (hor) {
                            option.radiusAxis.push(axis(series, seria.categoryName, 'category', undefined, 'x', gridIndex, ndx)) ;
                            option.angleAxis.push(axis(series, name, 'value', opt.facts.y, 'y', gridIndex, ndx)) ;
                            option.angleAxis[0].boundaryGap = ['0%', '25%'] ;
                        } else {
                            option.angleAxis.push(axis(series, seria.categoryName, 'category', undefined, 'x', gridIndex, ndx)) ;
                            option.radiusAxis.push(axis(series, name, 'value', opt.facts.y, 'y', gridIndex, ndx)) ;
                        }
                    }
                } else
                    axisNeeded = true ;
                series.barWidth = opt.barWidth + '%' ;
                series.barGap = 0 ;
            }
            break ;
        case 'Area':
        case 'CurvedArea':
            series.type = 'line' ;
            series.encode = { itemName: 0, y: 1, x: 0, radius: 1, angle: 0 } ;
            // свойства линии
            series.lineStyle = {
                normal: {
                    width: seria.line.width,
                    type: seria.line.type
                }
            } ;
            // свойства узлов
            series.symbolSize = seria.anchor.show ? seria.anchor.size : 0; // размер узла
            series.symbol = seria.anchor.show ? seria.anchor.type : 'none' ; // тип узла
           
            if (seria.anchor.show) {
                series.itemStyle.normal.borderColor = seria.anchor.borderColor ; // контур узла
                series.itemStyle.normal.borderWidth = seria.anchor.borderWidth ; // ширина контура
                series.symbolColor = seria.anchor.color !== 'transparent' ? seria.anchor.color : null; // цвет фона узла
            }
            if (opt.AreaStack === true)
                series.stack = 'stack' + '_' + gridIndex ;
            else if (seria.AreaBand === true)
                series.stack = 'band' + ndx + '_' + gridIndex ;
            series.smooth = type === 'CurvedArea' ;
            if (seria.AreaBand === undefined || isAxis == false)
                series.areaStyle = { opacity: 0.7} ;
            axisNeeded = isAxis ;
            break ;
        case 'Pie':
            series.type = 'pie' ;
            series.encode = { itemName: [0], value: [1]} ;
            series.selectedMode = opt.pie.selectedMode ;
            series.selectedOffset = opt.pie.selectedOffset ;
            series.roseType = false ; // 'radius', 'area', false
            series.radius = opt.pie.pieSizes ;
            series.startAngle = opt.pie.pieStartAngle ;
            //  series.avoidLabelOverlap = true ; // временно
            series.avoidLabelOverlap = false;
            break ;
        case 'Card':
            series.type = 'kpi' ;
            series.encode = { itemName: [0], value: [1]} ;
            series.selectedMode = false ;
            
            isLabel = false ;
            if (opt.card.borderColor !== undefined) {
                series.itemStyle.normal.borderColor = opt.card.borderColor ;
                series.itemStyle.normal.borderWidth = opt.card.borderWidth ;
            }
            series.marginLeft = opt.card.marginLeft ;
            series.marginRight = opt.card.marginRight ;
            series.marginTop = opt.card.marginTop ;
            series.marginBottom = opt.card.marginBottom ;
            series.margin = opt.card.margin ;
            // insert
            series.itemStyle.normal.color = linearGradient(opt.card.background) ;
            // insert
                  //  shadowBlur ... ,
               // shadowColor ... ,
              //  shadowOffsetX: 0 ,
              //  shadowOffsetY: 0 ,
              //  opacity ... 

            series.label = {
                normal: {
                    show: true,
                    
                }//,
               // emphasis: {
               //     textStyle: {
               //         fontSize: 20
               //     }
              //  }
            };
            series.label.normal.formatter = function(v) { return labelFormatter(opt, 'kpi', opt.labels, v) ; } ;
            series.label.normal.rich = kpiLabelsRich(opt, opt.labels) ;
           // if (opt.labels.factHeader !== undefined ) {
            //    series.label.normal.rich.factHeader = {} ;
            //    fillText(series.label.normal.rich.factHeader, opt.labels.factHeader) ;
           // }
            if (opt.labels.factValue !== undefined ) {
                series.label.normal.rich.factValue = {} ;
                fillText(series.label.normal.rich.factValue, opt.labels.factValue) ;
            }
            for (var i = 0; i < opt.labels.indName.length; i++) {
              //  var name = opt.labels.indName + i ;
                series.label.normal.rich.indName = {} ;
                fillText(series.label.normal.rich.indName, opt.labels.indName[i]) ;
            }
            break ;
        case 'Scatter':
        case 'Bubble':
        case 'BubbleColumn':
        case 'BubbleBar':
            series.type = 'scatter' ;
            itemStyle.normal.opacity = 1 ;
            axisNeeded = true ;
            hor = type === 'BubbleColumn' ;
            //            series.singleAxisIndex = ndx ;
            //            series.coordinateSystem = 'singleAxis' ;
            var index = 0 ;
            if (opt.facts.x == null) {
                series.encode = { itemName: 0 } ;
                index = 1 ;
            } else {
                series.encode = { } ;
                series.encode.x = opt.facts.x.id + index ;
            }
            if (opt.facts.y)
                series.encode.y = opt.facts.y.id + index ;
            if (opt.facts.size)
                series.encode.size = opt.facts.size.id + index ;
            if (type == 'BubbleBar')
                series.encode.y = series.encode.size + 1 ;
            else if (type == 'BubbleColumn')
                series.encode.x = series.encode.size + 1 ;

            if (opt.coordinateSystem == 'polar') {
                series.encode.radius = 1 ;
                series.encode.angle = 0 ;
            }
            series.itemStyle.normal.opacity = 1 ;

            // свойства узлов
            
            if (type === 'Scatter' && seria.anchor.show) {
                series.itemStyle.normal.borderColor = seria.anchor.borderColor ; // контур узла
                series.itemStyle.normal.borderWidth = seria.anchor.borderWidth ; // ширина контура
                series.symbolColor = seria.anchor.color !== 'transparent' ? seria.anchor.color : null; // цвет фона узла
            }

            series.symbolSize = function (d, p) {
                if (type === 'Scatter') {
                    return seria.anchor.show ? seria.anchor.size : 0; // размер узла
                } else if (opt.isOnlyFact) {
                    var size = Math.min(chartWidth / opt.colCount, chartHeight / opt.rowCount);
                    return (size * opt.bubble.max + size * opt.bubble.min) / 2;
                }
                var v = d[series.encode.size] ; // текущее значение факта-размера
                if (v === undefined)
                    return 0 ;
                
                if (type === 'BubbleBar' || type === 'BubbleColumn') {
                    var zmin = opt.bubble.min ; // размер наменьшего пузыря в процентах от экрана (из стилей)
                    var count = 0 ;
                    var h = opt.subtitle.show ? chartHeight - strSize('A', opt.subtitle.size) : chartHeight ;
                    var data = opt.timeline === undefined && opt.multi === undefined ? opt.data : opt.data[gridIndex] ;
                    var min = opt.sameScale ? opt.facts.size.min : null;
                    var max = opt.sameScale ? opt.facts.size.max : null;
                    // переделать indexes !!!
                    for (var i = 0; i < data[0].length; i++) {
                        var value = data[0][i][series.encode.size] ;
                        if (value === undefined)
                            continue ;
                        if (!opt.sameScale) {
                            min = min === null ? value : Math.min(min, value) ;
                            max = max === null ? value : Math.max(max, value) ;
                        }
                        count += 1 ;
                           
                    }
                    var w = type === 'BubbleBar' ? Math.min(chartWidth / opt.colCount /count,  h * 0.8 / opt.rowCount) : Math.min(h / opt.rowCount / count, chartWidth / opt.colCount) ;
                    pmin = w * zmin ; // размер наменьшего пузыря в пикселях
                    size = pmin + (v - min) * (w - pmin) / (max - min) ;
                    return size ;
                    /* var w = 100 / count ; // переделать на проценты
                     var pmin = w * zmin ; // размер наменьшего пузыря в процентах
                     size = pmin + (v - opt.facts.size.min) * (w - pmin) / (opt.facts.size.max - opt.facts.size.min) ;
                     return size + '%' ;  */   
                }
              
                return bubbleSize(v) ;
               
            },
			series.symbol = (type === 'Scatter') ? (seria.anchor.show ? seria.anchor.type : 'none') : 'circle' ; // тип узла
            break ;
        case 'Pyramid':
            series.type = 'funnel' ;
            series.top    = 0 ;
            series.bottom = 0 ;
            series.minSize = '0%';
            series.maxSize = opt.pyramid.size + '%' ;
            series.encode = { itemName: [0], seriesName: [0], value: [1] } ;
            series.sort = opt.pyramid.sort ; // пирамида или воронка
            series.gap = opt.pyramid.sliced ? 5 : 0 ; // отдельные слои
            break ;
        case 'Sunburst':
            series.type = 'sunburst' ;
            series.radius = opt.pieSizes ;
            series.labelRects = [] ;
            series.levels = [] ;
            var level0 = {
                itemStyle: {
                    color: 'gray'
                }
            } ;
            var levelMid = {
                label: {
                    show: false
                }
            } ;
            var levelLast = {
                label: {
                    show: opt.isLabel,
                   // minAngle : 2,
                   // distance : 8,
                  //  position: 'outside',
                    //maximus                    textBorderColor : 'white',
                    //maximus                    textBorderWidth : 2,
                 //   color: '#687284',
                 //   fontSize: 12,
                }
            } ;
            series.levels.push(level0) ;
            for (var i = 0; i < opt.levels - 1; i++)
                series.levels.push(levelMid) ;
            series.levels.push(levelLast) ;
            break ;
        case 'Treemap':
            series.type = 'treemap' ;
            series.left = 0 ;
            series.top = 0 ;
            series.right = 0 ;
            series.bottom = 0 ;
            series.roam = false ;
            series.zoomToNodeRatio = 1 ; // растягивать выбранный на весь экран
            series.leafDepth = seria.levelsCount ; // количество уровней
            series.drillDownIcon = '➧' ;
            series.colorAlpha = [0.5, 0.3] ;
            series.visibleMin = 300 ; // минимальная площадь узла для отображения
            if (seria.levels !== undefined ) {
                var levels = [] ;
                var level = {} ;
                level = { itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 0,
                        gapWidth: 1
                    }
                },
                    upperLabel: {
                        normal: {
                            show: false
                        }
                    } 
                } ;
                levels.push(level) ;
                for (var i = 0; i < seria.levelsCount; i++) {
                    var index = Math.min(i, seria.levels.length - 1) ;
                    level =  { itemStyle: {
                        normal: {
                            borderColor: seria.levels[index].borderColor,
                            borderWidth: seria.levels[index].borderWidth,
                            gapWidth: 1
                        }
                    },
                        upperLabel: {
                            normal: {
                                show: seria.levels[index].show,
                                height: 30,
                                color: seria.levels[index].color,
                                fontStyle: seria.levels[index].style,
                                fontWeight: seria.levels[index].weight,
                                fontSize: seria.levels[index].size,
                                position: seria.levels[index].position
                            },
                            emphasis: {
                                show: seria.levels[index].show,
                                position: seria.levels[index].position,
                                fontSize: seria.levels[index].size + 2,
                            }
                        } 
                    } ;
                    if (seria.levels[index].background !== undefined )
                        level.upperLabel.normal.backgroundColor = linearGradient(seria.levels[index].background) ;
                    levels.push(level) ;
                }
                series.levels = levels ;
            }
            break ;
        case 'TagCloud':
            series.type = 'wordCloud' ;
            series.sizeRange = opt.tagCloud.sizeFont ;

            series.shape = opt.tagCloud.shape ;
            series.rotationRange = opt.tagCloud.rotationRange ;
            series.rotationStep = opt.tagCloud.rotationStep ;
            series.width = opt.tagCloud.width ;
            series.height = opt.tagCloud.height ;
            series.autoSize = {
                enable: true,
                minSize: 14
            } ;
            // var maskImage = new Image() ;
            // maskImage.src = opt.tagCloud.image ;
            // series.maskImage = maskImage ;
            
            series.textStyle = {
                normal: {
                    //  fontFamily: opt.labels.labelFont,
                    fontWeight: opt.labels.labelWeight,
                    fontStyle: opt.labels.labelStyle,
                    fontSize: opt.labels.size
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333',
                    color: 'red'
                }
            } ;
            isLabel = false ;
            break ;
        case 'Gauge':
            series.type = 'gauge' ;
            isLabel = false ;
            var rowCount = opt.gauge.sizes[0] ;
            var colCount = opt.gauge.sizes[1] ;

            var row = Math.floor(ndx / colCount) ;
            var col = ndx - colCount * row ;

            if (opt.gauge.gaugeSize === -1) { // масштабируемый размер
                var stepx = 100 / colCount ;
                var stepy = 100 / rowCount ;
                series.radius = (100 / Math.max(rowCount, colCount)) + '%' ;
          
                series.center = [(col * stepx + stepx / 2) + '%', (row * stepy + stepy / 2) + '%'] ;
                //series.center.push((col * stepx + stepx / 2) + '%') ;
                // series.center.push((row * stepy + stepy / 2) + '%') ;
            } else { // заданный размер  
                series.radius = opt.gauge.gaugeSize / 2  - opt.gauge.margin ;
                var deltax =(chartWidth - colCount * opt.gauge.gaugeSize) / 2 ;
                var deltay = (chartHeight - rowCount * opt.gauge.gaugeSize) / 2 ;
                series.center = [] ;
                series.center.push(deltax + opt.gauge.margin + col * opt.gauge.gaugeSize + series.radius) ;
                series.center.push(deltay + opt.gauge.margin + row * opt.gauge.gaugeSize + series.radius) ;
            }
            var mindex = ndx ;
            if (opt.gauge.maxMin !== undefined )
                mindex = Math.min(ndx, opt.gauge.maxMin.length - 1) ;           
            series.min = opt.gauge.maxMin !== undefined  ? opt.gauge.maxMin[mindex][0] : opt.facts.y.min ;
            series.max = opt.gauge.maxMin !== undefined  ? opt.gauge.maxMin[mindex][1] : opt.facts.y.max ;
            series.startAngle =  opt.gauge.type === 'half' ? 180 : 225 ; // полукруглый
            series.endAngle = opt.gauge.type === 'half' ? 0 : -45 ;
            if (opt.gauge.type === 'half')
                series.detail = { show: true, offsetCenter: [0, '20%'] } ;

            series.splitNumber = opt.gauge.splitNumber1 ; // большие отметки

            series.axisTick = { // промежуточные отметки
                splitNumber: opt.gauge.splitNumber2,
                length: 24,
                lineStyle: {      
                    color: 'auto'
                }
            };

            // Цветовая шкала
            var colors = [] ;
            var gcolors = opt.gauge.colors.length === 1 ?  opt.gauge.colors[0] : opt.gauge.colors[ndx] ;
           
            for (var i = 0; i < gcolors.length; i++) {
                var ar = [] ;
                ar.push(gcolors[i][0]) ; // значение
                ar.push(simpleLinearGradient(gcolors[i][1], gcolors[i][2])) ; // градиент
                colors.push(ar) ;
            }
            var axisLine = {
                lineStyle: {
                    width: 20,
                    type: 'solid',
                    shadowColor:	'rgba(0,0,0,0.5)',
                    shadowBlur:	10,
                    shadowOffsetY:	10,
                    color: colors,
                }
            } ;
            series.axisLine = axisLine ;
            // Стрелка
            series.itemStyle = { 
                color: linearGradient(opt.gauge.arrow),
                borderColor: '#000',
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
            } ;
            // Метки на оси
            series.axisLabel = {
                show: opt.axis.labels.show,
                fontStyle: opt.axis.labels.style,
                fontWeight: opt.axis.labels.weight,
                fontSize: opt.axis.labels.size,
                color: opt.axis.labels.color,
                formatter: function (value, index) {
                    var format = opt.facts.y.format;
                    return valueFormatter(value, format) ;
                }
            };
            series.detail = {
                formatter: function (value, index) {
                    var format = opt.facts.y.format;
                    return valueFormatter(value, format) ;
                }
            };
            if (opt.labels.fact !== undefined ) {
                series.detail.show = true ;
                series.detail.fontStyle = opt.labels.fact.style ;
                series.detail.fontWeight = opt.labels.fact.weight ;
                fontSize = opt.labels.fact.size ;
                series.detail.color = opt.labels.fact.color ;
            }
            break ;
        case 'HeatMap':
            series.type = 'heatmap' ;
            var axisX = axis(null, name, 'category', undefined, 'x', opt.seriesNamesX, gridIndex, ndx) ;
            axisX.data = opt.seriesNamesX ;
            option.xAxis.push(axisX) ;
            var axisY = axis(null, firstSeries().categoryNameY, 'category', undefined, 'y', opt.seriesNamesY, gridIndex, ndx) ;
            axisY.data = opt.seriesNamesY ;
            option.yAxis.push(axisY) ;
            series.xAxisIndex = gridIndex ;
            series.yAxisIndex = gridIndex ;
           
            option.visualMap = fillLegend(opt, opt.legend.showVisualMap) ;

            option.visualMap.min = opt.facts.y.min ;
            option.visualMap.max = opt.facts.y.max ;
            option.visualMap.calculable = true ;
            option.visualMap.realtime = false ;
            option.visualMap.inRange = {
                    color: opt.colors
                } ;
            
            break ;
        case 'Sankey':
            series.type = 'sankey' ;
            series.orient = opt.sankey.orient ;
            series.nodeGap = opt.sankey.nodeGap ;
            series.nodeWidth = opt.sankey.nodeWidth ;
            series.left = opt.sankey.left + '%' ; 
            series.right = opt.sankey.right + '%' ;
            series.top = opt.sankey.top + '%' ; 
            series.bottom = opt.sankey.bottom + '%' ;
            series.label = { distance: 5 } ;
            series.label.formatter = function(v) {
                return sankeyLabel(v.name) ;
            } ;
         //   isLabel = true ;
            break ;
        case 'Candle':
            series.type = 'boxplot' ; 
            axisNeeded = true ;
            isLabel = false ;
            break ;
    }
    if (opt.visualMap !== undefined ) {
        option.visualMap = { } ;
        option.visualMap.orient = 'horizontal' ;
        option.visualMap.left = 'center' ;
        option.visualMap.type = 'piecewise' ;
        option.visualMap.pieces = opt.visualMap ;
    }
    // оси
    if (axisNeeded) {
        if (ndx === 0) {
            if (opt.coordinateSystem === 'polar') {
                option.angleAxis.push(axis(series, name, 'category', undefined, 'x', gridIndex, ndx)) ;
                option.radiusAxis.push(axis(series, name, 'value', opt.facts.y, 'y', gridIndex, ndx)) ;
            } else {
                
              //  if (opt.facts.x === undefined /*&& opt.separateAxis === false*/)
                 //   name = seria.categoryName ;
                if (hor) {
                    option.xAxis.push(axis(series, name, 'value', opt.facts.y, 'x', gridIndex, ndx)) ;
                    option.yAxis.push(axis(series, seria.categoryName, 'category', undefined, 'y', gridIndex, ndx)) ;
                    baseAxisIndex = option.xAxis.length - 1 ;
                }
                else {
                    if (series.type === 'boxplot')
                        option.xAxis.push(axis(series, seria.categoryName, 'category', undefined, 'x', gridIndex, ndx)) ; // name?
                    else
                        option.xAxis.push(axis(series, seria.categoryName, opt.facts.x === undefined ? 'category' : 'value', opt.facts.x, 'x', gridIndex, ndx)) ;
                    option.yAxis.push(axis(series, name, 'value', opt.facts.y, 'y', gridIndex, ndx)) ;
                    baseAxisIndex = option.yAxis.length - 1 ;
                }
            }
        }
        else if (seria.factAxis !== undefined ) { // отдельная ось по факту
            if (hor)
                option.xAxis.push(axis(series, name, 'value', seria.factAxis, 'x', gridIndex, ndx)) ;   
            else 
                option.yAxis.push(axis(series, name, 'value', seria.factAxis, 'y', gridIndex, ndx)) ;   
        }
        if (hor) {
            if (opt.coordinateSystem === 'cartesian2d') {
                series.yAxisIndex = option.yAxis.length - 1 ;
                series.xAxisIndex = seria.factAxis !== undefined  ? option.xAxis.length - 1  : baseAxisIndex ;
            } else { // дописать для polar мульти измерения
               // series.yAxisIndex = option.yAxis.length - 1 ;
              //  series.xAxisIndex = seria.factAxis !== undefined  ? option.xAxis.length - 1  : baseAxisIndex ;
            }
        } else {
            if (opt.coordinateSystem === 'cartesian2d') {
                series.xAxisIndex = option.xAxis.length - 1 ;
                series.yAxisIndex = seria.factAxis !== undefined  ? option.yAxis.length - 1 : baseAxisIndex ;
            } else {
                // дописать для polar мульти измерения
            }
        }
    }
    if (opt.separateAxis === true && option.yAxis.length > 0 && option.yAxis[0].type === 'value' && ndx < opt.separateAxisCount) {
        if (ndx !== 0) {
            option.yAxis.push(axis(series, name, 'value', opt.facts.y, 'y', gridIndex, ndx)) ;
            series.yAxisIndex = option.yAxis.length - 1 ;
        }
        if (opt.series.length  > 1)
            option.yAxis[series.yAxisIndex].position = 'left' ;

        if (!option.yAxis[series.yAxisIndex].hide) {
            if (seria.color !== undefined )
                option.yAxis[series.yAxisIndex].axisLine.lineStyle.color = seria.color ;
            else if (option.colors !== undefined )
                option.yAxis[series.yAxisIndex].axisLine.lineStyle.color = option.colors[ndx % option.colors.length] ;
            if (name !== undefined  && name.length > 0)
                option.yAxis[series.yAxisIndex].name = name ;
        }
    }
    // target line и target zone
    // insert
     if (option.yAxis.length !== 0 || option.xAxis.length !== 0) { 
         targetLine(series.markLine.data, opt.facts.y, opt.facts.x, seria.targets === undefined ? null : seria.targets) ;
         targetArea(series.markArea.data, opt.facts.y, opt.facts.x, seria.targets === undefined ? null : seria.targets) ;
     }
    // insert
    if (isLabel)  // свойства меток
        series.label = seriesLabelByType(name, type, gridIndex, ndx) ;

    return series ;
} // end seriesByType

if (opt.coordinateSystem === 'polar') {
    option.polar = {} ;
}
if (opt.colors !== undefined ) {
    option.color = seriesColors(opt, opt.colors) ;
}

option.graphic = [] ;
if (opt.background.image !== undefined )  // картинка-фон
    option.graphic.push(image(opt, chartWidth, chartHeight, opt.background.image, 0, 0)) ;
//if (opt.watermarkImage !== undefined ) // водяной знак
//   option.graphic.push(image(opt, chartWidth, chartHeight, opt.watermarkImage, 1, option.graphic.length)) ;

if (opt.subtitle.text !== undefined ) {
    option.title.subtext = opt.subtitle.text ;
    option.title.subtextStyle = {
        color: opt.subtitle.color,
        fontSize: opt.subtitle.size,
        fontStyle: opt.subtitle.style,
        fontWeight: opt.subtitle.weight,
    };
}         
if (opt.legend.show) {
    option.legend.type = opt.legend.type ;
    // размер маркера легенды в зависимости от размера шрифта
    var ht = strSize("AA", opt.legend.size) ;
    option.legend.itemHeight = ht ;
    option.legend.itemWidth = ht * 25 / 14 ;

    if (opt.legend.reverse)
        option.legend.data = [] ;
}

var itemStyle = { normal: { }} ;
var gridIndex = 0 ; 
var type = firstType() ;

if (opt.coordinateSystem === 'tree') {
    var series = seriesByType(firstSeries(), '', type , 0, itemStyle, gridIndex, true) ;
    series.data = opt.data ;
    option.series.push(series) ;
   
} else if (opt.coordinateSystem === 'sankey') {
    if (opt.colors === undefined)
        itemStyle.normal.color = seriesColor(firstSeries().color, firstSeries().gradientType, firstSeries().fillGradient, opt.coordinateSystem === 'tree') ;
    if (firstSeries().border !== undefined ) {
        itemStyle.normal.borderColor = firstSeries().border.color ;
        itemStyle.normal.borderWidth = firstSeries().border.width ;
        itemStyle.normal.borderType = firstSeries().border.type ;
    }
    var series = seriesByType(null, 'sankey', type , 0, itemStyle, gridIndex, true) ;
    series.data = opt.data ;
    series.links = opt.links ;
    
    option.series.push(series) ;
   
} else if (type === 'Gauge') { // отдельная серия на каждое значение
    var data = opt.data[0] ;
    opt.gauge.sizes = optimalRowsColsCount(chartWidth, chartHeight, data.length) ;
    for (var i = 0; i < data.length; i++) {
        var series = seriesByType(firstSeries(), firstSeries().name, type, i, itemStyle, gridIndex, true) ;
        series.data = [{ value: data[i][1], name: data[i][0] }] ;
        option.series.push(series) ;
    }
}  else if (type === 'TagCloud' || type === 'Pyramid' || type === 'Pie' || type === 'Card' || opt.isOnlyFact && !opt.pictorial/* || opt.separateColors*/) { // всегда одна серия
    if (opt.colors === undefined)
        itemStyle.normal.color = seriesColor(firstSeries().color, firstSeries().gradientType, firstSeries().fillGradient, opt.coordinateSystem === 'tree') ;
    if (firstSeries().border !== undefined ) {
        itemStyle.normal.borderColor = firstSeries().border.color ;
        itemStyle.normal.borderWidth = firstSeries().border.width ;
        itemStyle.normal.borderType = firstSeries().border.type ;
    }
    var data = opt.data[0] ;
    var seriesName = opt.isOnlyFact ? 'Facts' : firstSeries().name ;
    var series = seriesByType(firstSeries(), seriesName, firstSeries().type, 0, itemStyle, gridIndex, true) ;
    series.data = [] ;
    for (var i = 0; i < data.length; i++) {
        if (type === 'TagCloud')
            series.data.push({ value: data[i][1], name: data[i][0], 
                textStyle: {
                    normal: {
                        color: opt.colors[i]
                    }}}) ;
      //  else if (type === 'BubbleBar' || type === 'BubbleColumn')
       //     series.data.push([ data[i][1], name: data[i][0]}) ;
        else if (type === 'Pyramid' || type === 'Pie' || type === 'Card' || opt.isOnlyFact)
            series.data.push({ value: data[i][1], name: data[i][0]}) ;
      /*  else if (type === 'Bubble' || type === 'Marimekko')
            series.data.push({ value: [data[i][1], data[i][2]], name: data[i][0], 
                itemStyle: {
                    color: opt.colors[i]
                }}) ;
        else
            series.data.push({ value: data[i][1], name: data[i][0], 
                itemStyle: {
                        color: opt.colors[i]
                   }}) ;*/
    }
    option.series.push(series) ;
} else { 
    
    var gridCount = opt.multi === undefined ? 1 : opt.multi.length ;

    for (var gridIndex = 0; gridIndex < gridCount; gridIndex++) {
        if (opt.timeline !== undefined )
            gridIndex = opt.maxSeriesIndex ;
        var ndx = 0 ;
        var data = opt.timeline === undefined && opt.multi === undefined ? opt.data : opt.data[gridIndex] ;

        if (type === 'HeatMap') {
            var data1 = heatMapData(data, gridIndex) ;
            var series = seriesByType(firstSeries(), firstSeries().categoryName, type, ndx, itemStyle, gridIndex, true) ;
            series.data = data1 ;
            option.series.push(series) ;
            continue ;
        }
           opt.series[gridIndex].forEach(function(seria) { // цикл по сериям
            if (seria.type === 'PairedBar' && ndx > 1) {
                ++ndx ;
                return ;
            } else if (opt.pictorial && ndx > 0) {
                ++ndx ;
                return ;
            }
              
            var itemStyle ;

            if (type === 'Candle')
                itemStyle = { borderColor: opt.series.length === 1 ? 'black' : seria.color } ;
            else {
                itemStyle = {
                    normal: {
                        color: opt.separateColors ? null : seria.type === 'Area' || seria.type === 'CurvedArea' ? 
                            seria.color : seriesColor(seria.color, seria.gradientType, seria.fillGradient, opt.coordinateSystem === 'tree'),
                    }} ;
                if (seria.type === 'Area' || seria.type === 'CurvedArea')
                    itemStyle.normal.areaStyle = { color: opt.separateColors ? null : seriesColor(seria.color, seria.gradientType, seria.fillGradient, opt.coordinateSystem === 'tree') } ;

                if (seria.border !== undefined ) {
                    itemStyle.normal.borderColor = seria.border.color ;
                    itemStyle.normal.borderWidth = seria.border.width ;
                    itemStyle.normal.borderType = seria.border.type ;
                }
            }
          
            var series = seriesByType(seria, seria.name, seria.type, ndx, itemStyle, gridIndex, true) ;

                if (seria.AreaBand === true)
                    series.data = getAreaData(data[ndx], 'min') ;
                else
                    series.data = getData(data[ndx], seria, gridIndex) ;

                if (opt.pictorial && opt.imageColumn && opt.imageColumn.clip) {
                    var series2 = seriesByType(seria, seria.name, seria.type, ndx, itemStyle, gridIndex, false) ;
                    series2.data = pictureData(data[ndx], gridIndex, 'max') ;
                    series2.xAxisIndex = series.xAxisIndex ;
                    series2.yAxisIndex = series.yAxisIndex ;
                    series2.animationDuration = 0 ;
                    series2.label = {} ;
                    series2.label.show = false ;
                    var itemStyle2 = { normal: { }} ;
                    itemStyle2.normal.color = opt.imageColumn.background ;
                    series2.itemStyle = itemStyle2 ;
                    option.series.push(series2) ;
                }
                option.series.push(series) ;
                // линия регрессии
                if (opt.regLinesProps !== undefined ) {
                    var rseries = regressionSeries(opt) ;
                    rseries.xAxisIndex = series.xAxisIndex ;
                    rseries.yAxisIndex = series.yAxisIndex ;
                    var rdata = regressionData(opt, series.data) ;
                    rseries.data = rdata.points ;
                    rseries.markPoint.label.normal.formatter = rdata.expression ;
                    rseries.markPoint.data =  [{ coord: rdata.points[rdata.points.length - 1] }] ;
                    option.series.push(rseries) ;
                }
                //regressionLine(series.markLine.data, opt.timeline === underfine ? (opt.multi === underfine ? opt.regLines : opt.regLines[gridIndex]) : opt.regLines[0]) ;
              
            if (seria.AreaBand === true) {
                var series2 = seriesByType(seria, seria.name, seria.type, ndx, itemStyle, gridIndex, false) ;
                series2.data = getAreaData(data[ndx], 'max') ;
                series2.xAxisIndex = series.xAxisIndex ;
                series2.yAxisIndex = series.yAxisIndex ;
                series2.stack = series.stack ;
                option.series.push(series2) ;

                if (opt.averageLine !== undefined ) {
                    var series3 = {} ;
                    series3.type = 'line' ;
                    series3.smooth = series.smooth === true ;
                    series3.symbol = 'none' ;
                    series3.lineStyle = {
                        normal: {
                            type: opt.averageLine.type,
                            color: opt.averageLine.color,
                            width: opt.averageLine.width
                        }
                    } ;
                    series3.data = getAreaData(data[ndx], 'average') ;
                    series3.xAxisIndex = series.xAxisIndex ;
                    series3.yAxisIndex = series.yAxisIndex ;
                    option.series.push(series3) ;

                }
            } else
                averageLine(opt, series.markLine.data) ;
            ++ndx ;
        }) ; // цикл по сериям
    } // цикл по гридам
   
}

if (type === 'PairedBar') {
    var fx = opt.facts.y.id + 1 ;
    if (opt.timeline === undefined && opt.multi === undefined) {
        opt.data[0].forEach(function(j) {
            j[fx] = -j[fx] ;
        } ) ;
    } else {
        opt.data.forEach(function(i) {
            i[0].forEach(function(j) {
                j[fx] = -j[fx] ;
            } ) ;
        }) ;
    }
    option.xAxis[0].max = function(x) { return + Math.max(opt.facts.y.min, opt.facts.y.max) } ;
    option.xAxis[0].min = function(x) { return - Math.max(opt.facts.y.min, opt.facts.y.max) } ;
    option.xAxis[0].axisLabel.formatter = function (value, index) { return echarts.format.addCommas(Math.abs(value)) ; } ;
    option.xAxis[0].axisPointer = { label: { show: false } } ;

    option.tooltip.trigger = 'axis' ;
    option.tooltip.formatter = function(params) {
        var name = '';
        var values = '';
        for (var i in params) {
            var d = params[i] ;
            if (opt.tooltips.isName)
                name = d.name + '<br/>';
            values += d.marker + d.seriesName + '：' + echarts.format.addCommas(Math.abs(d.data[fx])) + '<br/>' ;
        }
        return name + values ;
    } ;
}
// подсказки для всех
if (option.tooltip.formatter === undefined)
    option.tooltip.formatter = function(v) { return tooltipFormatter(opt, type, v) ; } ;

if (opt.timeline === undefined) {
    for (var i = 0; i < addedAxisX.length; i++)
        option.xAxis.push(addedAxisX[i]) ;
    for (var i = 0; i < addedAxisY.length; i++)
        option.yAxis.push(addedAxisY[i]) ;

    // масштабирование данных
    var dataZoomList = [] ;
    hor = firstType() === 'HorizontalBar' || firstType() === 'PairedBar' ;
  
    for (var i = 0; i < opt.rowCount; i++) {
        dataZoom(opt, firstType(), 'y', dataZoomList, i, -1, "slider") ;
        dataZoom(opt, firstType(), 'y', dataZoomList, i, -1, "inside") ;
    }
    for (var i = 0; i < opt.colCount; i++) {
        dataZoom(opt, firstType(), 'x', dataZoomList, -1, i, "slider") ;
        dataZoom(opt, firstType(), 'x', dataZoomList, -1, i, "inside") ;
    }

    if (dataZoomList.length > 0)
        option.dataZoom = dataZoomList ;
    // insert

    // insert
    chart.setOption(option, true) ;
} else {
    timeline = {
        axisType: 'category',
        show: opt.timelineSettings.show,
        autoPlay: opt.timelineSettings.autoPlay,
        rewind: opt.timelineSettings.rewind,
        playInterval: opt.timelineSettings.playInterval,
        
        //data: opt.timeline,
        label: {
            color: opt.timelineSettings.label.color,
            fontStyle: opt.timelineSettings.label.style,
            fontWeight: opt.timelineSettings.label.weight,
            fontSize: opt.timelineSettings.label.size,
            backgroundColor: linearGradient(opt.timelineSettings.label.background)
        }
    } ;
    fillTimeLine(timeline, opt.timelineSettings.pos) ;
    var tdata = [] ;
    for (var i = 0; i < opt.timeline.length; i++) {
        tdata.push({
            value: opt.timeline[i],
            tooltip: {
                formatter: '{b}'
            }
        }) ;
    }
    timeline.data = tdata ;
    if (opt.timelineSettings.line !== undefined  || opt.timelineSettings.shadow !== undefined ) {
        timeline.lineStyle = {} ;
        if (opt.timelineSettings.line !== undefined ) {
            timeline.lineStyle.show = opt.timelineSettings.line.show ;
            timeline.lineStyle.color = opt.timelineSettings.line.color ;
            timeline.lineStyle.width = opt.timelineSettings.line.width ;
            timeline.lineStyle.type = opt.timelineSettings.line.type ;
        }
        if (opt.timelineSettings.shadow !== undefined ) {
            timeline.lineStyle.shadowColor = opt.timelineSettings.shadow.shadowColor ;
            timeline.lineStyle.shadowBlur = opt.timelineSettings.shadow.shadowBlur ;
            timeline.lineStyle.shadowOffsetX = opt.timelineSettings.shadow.shadowOffsetX ;
            timeline.lineStyle.shadowOffsetY = opt.timelineSettings.shadow.shadowOffsetY ;   
        }
    }
    if (opt.timelineSettings.symbol !== undefined ) {
        timeline.symbol = opt.timelineSettings.symbol.image !== undefined  ? opt.timelineSettings.symbol.image : opt.timelineSettings.symbol.type ;
        timeline.symbolSize = opt.timelineSettings.symbol.size ;
        timeline.symbolRotate = opt.timelineSettings.symbol.rotate ;            
    }
 
    option.timeline = timeline ;
    var optionTl = {} ;
    optionTl.baseOption = option ;
    optionTl.options = [] ;

    if (opt.sameScale && opt.ColumnStack100 === undefined) {
        var h = type === 'HorizontalBar' || type === 'PairedBar' ;
        var xfact = h ? opt.facts.y : opt.facts.x ;
        var max = type === 'Candle' ? candleMax(opt) : (opt.maxTotal !== undefined  ? opt.maxTotal : opt.facts.y.max) ;

        option.xAxis.forEach(function(axis)      { if (axis.type === 'value') { if (xfact.min < 0) axis.min = xfact.min ; axis.max = xfact.max ; } } ) ;
        option.yAxis.forEach(function(axis)      { if (axis.type === 'value') { if (opt.facts.y.min < 0) axis.min = opt.facts.y.min ; axis.max = max ; } } ) ;
        option.radiusAxis.forEach(function(axis) { if (axis.type === 'value') { if (opt.facts.y.min < 0) axis.min = opt.facts.y.min ; axis.max = opt.facts.y.max ; } } ) ;
        option.angleAxis.forEach(function(axis)  { if (axis.type === 'value') { if (opt.facts.y.min < 0) axis.min = opt.facts.y.min ; axis.max = opt.facts.y.max ; } } ) ;
        option.singleAxis.forEach(function(axis) { if (axis.type === 'value') { if (opt.facts.y.min < 0) axis.min = opt.facts.y.min ; axis.max = opt.facts.y.max ; } } ) ;
    }

    var t_ndx = 0 ;
    opt.timeline.forEach(function(line) 
    { // timeline
        var opt_t = {
            title:   { subtext: line,
                subtextStyle: {
                    color: opt.subtitle.color,
                    fontSize: opt.subtitle.size,
                    fontStyle: opt.subtitle.style,
                    fontWeight: opt.subtitle.weight
                }
            },
            series: []
        } ;
        // вставка данных оси категорий, если есть динамическая сортировка
        if (opt.sort) {
            hor = type === 'HorizontalBar' || type === 'PairedBar' || type === 'BubbleColumn' ;
            var axises = hor ? optionTl.baseOption.yAxis : optionTl.baseOption.xAxis ;
            if (axises[0].type === 'category') {
                var isLink = { flag: false } ;
        
                var adata = axisData(opt, hor ? opt.yAxis : opt.xAxis, isLink, t_ndx) ;
                if (hor) {
                    opt_t.yAxis = [] ;
                    opt_t.yAxis.push({'data': adata}) ;
                } else {
                    opt_t.xAxis = [] ;
                    opt_t.xAxis.push({'data': adata}) ;
                }
            }
        }
         
        var ndx = 0 ;
        opt.series[t_ndx].forEach(function(seria) {
            if (seria.type === 'PairedBar' && ndx > 1) {
                ++ndx ;
                return ;
            }
           
            var series = {} ;
            series.name = seria.name ;
            if (seria.type === 'HeatMap') {
                if (ndx > 0) {
                    ++ndx ;
                    return ;
                }
                series.data = heatMapData(opt.data[t_ndx]) ;
            } else if (opt.coordinateSystem === 'tree') {
                series.data = opt.data[t_ndx] ;
                if (seria.type === 'Treemap') {
                    option.grid.bottom = '10%' ;
                    option.timeline.bottom = '3%' ;
                } 
            } else {
                 if (seria.AreaBand === true)
                     series.data = getAreaData(opt.data[t_ndx][ndx], 'min') ;
                 else
                     series.data = getData(opt.data[t_ndx][ndx], seria, t_ndx) ;
                series.markLine = {symbol: 'none'} ;
                series.markLine.data = [] ;
               
            }
            if (opt.pictorial && opt.imageColumn.clip) {
                var series2 = {} ;
                series2.data = pictureData(opt.data[t_ndx][ndx], t_ndx, 'max') ;
                series2.label = {} ;
                series2.label.show = false ;
                var itemStyle2 = { normal: { }} ;
                itemStyle2.normal.color = opt.imageColumn.background ;
                series2.itemStyle = itemStyle2 ;
                opt_t.series.push(series2) ;
            } 
            opt_t.series.push(series) ;
            if (seria.AreaBand === true) {
                var series2 = {} ;
                series2.data = getAreaData(opt.data[t_ndx][ndx], 'max') ;
                opt_t.series.push(series2) ;
            }
            // линия регрессии
            if (opt.regLinesProps !== undefined ) {
                var rseries = {} ;
                var rdata = regressionData(opt, opt.data[t_ndx][ndx]) ;
                rseries.data = rdata.points ;
                rseries.markPoint = {
                    label: {
                        normal: {     
                            formatter: rdata.expression,    
                        }
                    },
                    data: [{
                        coord: rdata.points[rdata.points.length - 1]
                    }]
                } ;
              
                opt_t.series.push(rseries) ;
            }
            ++ndx ;
        }) ;
        while (opt_t.series.length < opt.maxSeriesCount) {
            var series = {} ;
            series.name = '' ;
            series.data = null ;
            opt_t.series.push(series) ;
        }
        optionTl.options.push(opt_t) ;
        ++t_ndx ;
    }) ;
    chart.setOption(optionTl, true) ;
}
return chart ;

