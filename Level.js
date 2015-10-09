"use strict";

var Grid = require('./Grid');
var constants = require('./constants');
var r = require('./random');

// Define components;
var Start = require('./components/Start');
var Finish = require('./components/Finish');
var components = [
    require('./components/Floaters'),
    require('./components/Cave'),
    require('./components/Chimney'),
    require('./components/Pit'),
    require('./components/WidePit')
];

class Level {
    constructor (difficulty) {
        this.difficulty = difficulty;

        this.components = [];
        this.addComponent(Start);

        var avgNumComponents = Math.max(1, difficulty / 4);
        var numComponents = r.i(avgNumComponents * 0.75, avgNumComponents * 1.25);

        for (var i = 0; i < numComponents; i++) {
            this.addComponent(r.choice(components), difficulty);
        }

        this.addComponent(Finish);

        this.grid = null;
    }

    addComponent (cls) {
        var c = new cls(this.difficulty);
        c.draw();
        this.components.push(c);
    }

    draw () {
        // Default to the "start" component's grid
        var lastComponent = this.components[0];
        this.grid = lastComponent.grid;

        for (let i = 1; i < this.components.length; i++) {
            let component = this.components[i];

            let hallWidth = r.i(1, 4);

            // Find the exit and entrance
            let exit = this.grid.findExit();
            let entrance = component.grid.findEntrance();

            let totalWidth = component.grid.width + this.grid.width + hallWidth;
            let offsetX = totalWidth - component.grid.width;

            let offsetY = exit.floor - entrance.floor;

            // Calculate new height
            // TODO: Optimize this
            let totalHeight = component.grid.height + this.grid.height + Math.abs(offsetY);
            let newGrid = new Grid(totalWidth, totalHeight);

            if (offsetY < 0) { // New one is below old one
                newGrid.add(this.grid, 0, -offsetY);
                newGrid.add(component.grid, offsetX, 0);
                newGrid.clear(
                    this.grid.width,
                    entrance.floor + 1,
                    offsetX - 1,
                    entrance.floor + 1 + Math.max(exit.height, entrance.height) - 1
                );
            } else { // New one is above old one
                newGrid.add(this.grid, 0, 0);
                newGrid.add(component.grid, offsetX, offsetY);
                newGrid.clear(
                    this.grid.width,
                    exit.floor + 1,
                    offsetX - 1,
                    exit.floor + 1 + Math.max(exit.height, entrance.height) - 1
                );
            }

            // Replace current grid with the new one and continue
            this.grid = newGrid;
            this.grid.crop(1, 0, 1, 1);
        }

        this.grid.crop(10, 10, 10, 10);

        // Make sure the final grid is at least x by y

        var finalGrid = new Grid(
            Math.max(40, this.grid.width),
            Math.max(20, this.grid.height)
        );

        finalGrid.add(this.grid);
        this.grid = finalGrid;
    }

    print () {
        this.grid.print();
    }

    saveImage (path) {
        this.grid.saveImage(path);
    }
}

module.exports = Level;