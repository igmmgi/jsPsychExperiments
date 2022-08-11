const p5js = new p5((sketch) => {
    sketch.setup = () => {
        sketch.background(100);
        sketch.createCanvas(window.innerWidth, window.innerHeight);
    };
});

function white_square() {
    return function() {
        p5js.background(0);
        p5js.fill(255);
        p5js.rect(100, 100, 50, 50);
    };
};

function red_square() {
    return function() {
        p5js.background(0);
        p5js.fill(255, 0, 0);
        p5js.rect(300, 300, 50, 50);
    };
};

p5js.mouseClicked = function() {
    p5js.draw = white_square();
};

p5js.keyPressed = function() {
    p5js.draw = red_square();
};

