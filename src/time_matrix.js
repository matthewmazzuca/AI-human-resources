/* Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
"use strict";
/**
 * Arbitrary large number so the user can scroll horizontally
 * when the timeline gets too long.
 */
// TODO(smilkov): Compute and expand the width of the svg on runtime.
var WIDTH = 8000;
/**
 * A timeline visualization of the derivatives of the network weights.
 * Every weight is represented as a row, while columns denote time.
 * Weights coming out of the same node are grouped together and vertically
 * separated from another group.
 */
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
        // Empty the container.
        container.selectAll("*").remove();
        if (userSettings != null) {
            // overwrite the defaults with the user-specified settings.
            for (var prop in userSettings) {
                this.settings[prop] = userSettings[prop];
            }
        }
        this.labels = labels;
        // Draw the labels.
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
                    height: this.settings.rectHeight,
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
//# sourceMappingURL=time_matrix.js.map