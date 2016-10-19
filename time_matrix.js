"use strict";
var WIDTH = 8000;
var TimeMatrix = (function () {
    function TimeMatrix(container, labels, userSettings) {
        this.numColumns = 0;
        this.settings = {
            ypadding: 3,
            rectHeight: 6,
            rectWidth: 2,
            labelMargin: 30,
            betweenLabelMargin: 15,
            marginTop: 5
        };
        this.numRows = 0;
        container.selectAll("*").remove();
        if (userSettings != null) {
            for (var prop in userSettings) {
                this.settings[prop] = userSettings[prop];
            }
        }
        this.labels = labels;
        this.svg = container.append("svg");
        var labelsG = this.svg.append("g").attr("class", "labels");
        var y = this.settings.marginTop;
        for (var i = 0; i < labels.length; i++) {
            var label = labels[i];
            for (var j = 0; j < label.subLabels.length; j++) {
                var text = (j === 0 ? label.mainLabel + "➝" : "") +
                    label.subLabels[j];
                labelsG.append("text")
                    .attr({
                    x: this.settings.labelMargin,
                    y: y
                })
                    .text(text);
                y += this.settings.rectHeight + this.settings.ypadding;
                this.numRows++;
            }
            var lineY = y - this.settings.rectHeight - this.settings.ypadding +
                this.settings.betweenLabelMargin;
            labelsG.append("line").attr({
                x1: 0,
                y1: lineY,
                x2: WIDTH,
                y2: lineY
            }).style({
                "stroke": "#999",
                "stroke-width": "1px"
            });
            y += this.settings.betweenLabelMargin;
        }
        this.svg.attr({
            width: WIDTH,
            height: y + 10
        });
    }
    TimeMatrix.prototype.addColumn = function (values) {
        if (values.length !== this.numRows) {
            throw Error("The number of provided values much match the number" +
                " of rows");
        }
        var _a = d3.extent(values), min = _a[0], max = _a[1];
        var range = Math.max(Math.abs(min), Math.abs(max));
        var colorScale = d3.scale.linear()
            .domain([-range, 0, range])
            .range(["orange", "white", "blue"])
            .clamp(true);
        var valueIndex = 0;
        var column = this.svg.append("g").attr("class", "column");
        var x = this.settings.labelMargin + 2 +
            this.numColumns * this.settings.rectWidth;
        var y = this.settings.marginTop;
        for (var i = 0; i < this.labels.length; i++) {
            var label = this.labels[i];
            for (var j = 0; j < label.subLabels.length; j++) {
                column.append("rect").attr({
                    x: x,
                    y: y,
                    width: this.settings.rectWidth,
                    height: this.settings.rectHeight
                }).style({
                    fill: colorScale(values[valueIndex]),
                    stroke: "none"
                });
                y += this.settings.rectHeight + this.settings.ypadding;
                valueIndex++;
            }
            y += this.settings.betweenLabelMargin;
        }
        this.numColumns++;
    };
    return TimeMatrix;
}());
exports.TimeMatrix = TimeMatrix;
