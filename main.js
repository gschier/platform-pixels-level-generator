var Grid = require('./Grid');

//var grid = new Grid(100, 50);
var grid = new Grid(200, 80);

for (var i = 0; i < 40; i++) {
    grid.next();
}

grid.print();
grid.export();

