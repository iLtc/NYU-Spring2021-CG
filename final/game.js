class Ball {
    static scale = 30

    dead = false;

    is_hitting_paddle = false;

    constructor(x, y, speed, directionX, directionY) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.directionX = directionX;
        this.directionY = directionY;
    }

    hit_detection(other) {
        if (other instanceof Paddle) {
            // Horizontal
            if (
                this.x / Ball.scale > (other.x - 1) / Paddle.scaleX
                && this.x / Ball.scale < (other.x + 1) / Paddle.scaleX
                && Math.abs(this.y / Ball.scale - other.y / Paddle.scaleYZ) < (1 / Ball.scale + 1 / Paddle.scaleYZ)
            ) {
                if (!this.is_hitting_paddle){
                    this.directionY = -this.directionY;
                    this.is_hitting_paddle = true;
                }
            } else {
                this.is_hitting_paddle = false;
            }
        }

        if (other instanceof Brick) {
            // Horizontal
            if (
                this.x / Ball.scale > (other.x - 1) / Brick.scaleX
                && this.x / Ball.scale < (other.x + 1) / Brick.scaleX
                && Math.abs(this.y / Ball.scale - other.y / Brick.scaleYZ) < (1 / Ball.scale + 1 / Brick.scaleYZ)
            ) {
                other.destroyed = true;
                this.directionY = -this.directionY;

                return 'h';
            }
            // Vertical
            else if (
                this.y / Ball.scale > (other.y - 1) / Brick.scaleYZ
                && this.y / Ball.scale < (other.y + 1) / Brick.scaleYZ
                && Math.abs(this.x / Ball.scale - other.x / Brick.scaleX) < (1 / Ball.scale + 1 / Brick.scaleX)
            ) {
                other.destroyed = true;
                this.directionX = -this.directionX;

                return 'v';
            }
        }
    }

    next_frame() {
        if (this.dead)
            return;

        this.x += this.speed * this.directionX;
        this.y += this.speed * this.directionY;

        if (Math.abs(this.x) > Ball.scale - 1)
            this.directionX = -this.directionX;

        if (this.y > Ball.scale - 1)
            this.directionY = -this.directionY;

        if (this.y < - (Ball.scale - 1))
            this.dead = true
    }

    draw() {
        if (this.dead)
            return;

        M.save()
        M.scale(1 / Ball.scale)
        M.translate(this.x, this.y, 0)
        drawMesh(sphereMesh, 'white')
        M.restore();
    }
}

class Paddle {
    static scaleX = 10;
    static scaleYZ = 50;

    x = 0;
    y = -45;

    speedX = 0;

    move_left() {
        this.speedX = -0.5;
    }

    move_right() {
        this.speedX = 0.5;
    }

    stop() {
        this.speedX = 0;
    }

    next_frame() {
        this.x += this.speedX;

        if (this.x < - (Paddle.scaleX - 1))
            this.x = - (Paddle.scaleX - 1);

        if (this.x > Paddle.scaleX - 1)
            this.x = Paddle.scaleX - 1;
    }

    draw() {
        M.save()
        M.scale(1 / Paddle.scaleX, 1 / Paddle.scaleYZ, 1 / Paddle.scaleX)
        M.translate(this.x, this.y, 0)
        drawMesh(cubeMesh, 'red')
        M.restore();
    }
}

class Brick {
    static scaleX = 15;
    static scaleYZ = 40;

    destroyed = false;

    constructor(x, y, color, directionX, directionY, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.directionX = directionX;
        this.directionY = directionY;
        this.speed = speed;
    }

    hit_detection(other) {
        if (other instanceof Paddle) {
            // Horizontal
            if (
                this.x / Brick.scaleX > (other.x - 1) / Paddle.scaleX
                && this.x / Brick.scaleX < (other.x + 1) / Paddle.scaleX
                && Math.abs(this.y / Brick.scaleYZ - other.y / Paddle.scaleYZ) < (1 / Brick.scaleYZ + 1 / Paddle.scaleYZ)
            ) {
                this.directionY = -this.directionY;
            }
            // Vertical
            else if (
                this.y / Brick.scaleYZ > (other.y - 1) / Paddle.scaleYZ
                && this.y / Brick.scaleYZ < (other.y + 1) / Paddle.scaleYZ
                && Math.abs(this.x / Brick.scaleX - other.x / Paddle.scaleX) < (1 / Brick.scaleX + 1 / Paddle.scaleX)
            ) {
                this.directionX = -this.directionX;
            }
        }

        if (other instanceof Brick) {
            // Horizontal
            if (
                this.x / Brick.scaleX > (other.x - 1) / Brick.scaleX
                && this.x / Brick.scaleX < (other.x + 1) / Brick.scaleX
                && Math.abs(this.y / Brick.scaleYZ - other.y / Brick.scaleYZ) < (1 / Brick.scaleYZ + 1 / Brick.scaleYZ)
            ) {
                this.directionY = -this.directionY;
            }
            // Vertical
            else if (
                this.y / Brick.scaleYZ > (other.y - 1) / Brick.scaleYZ
                && this.y / Brick.scaleYZ < (other.y + 1) / Brick.scaleYZ
                && Math.abs(this.x / Brick.scaleX - other.x / Brick.scaleX) < (1 / Brick.scaleX + 1 / Brick.scaleX)
            ) {
                this.directionX = -this.directionX;
            }
        }
    }

    next_frame() {
        if (this.destroyed)
            return;

        this.x += this.speed * this.directionX;
        this.y += this.speed * this.directionY;

        if (Math.abs(this.x) > Brick.scaleX - 1)
            this.directionX = -this.directionX;

        if (Math.abs(this.y) > Brick.scaleYZ - 1)
            this.directionY = -this.directionY;
    }

    draw() {
        if (this.destroyed)
            return;

        M.save();
        M.scale(1 / Brick.scaleX, 1 / Brick.scaleYZ, 1 / Brick.scaleYZ)
        M.translate(this.x, this.y, 0)
        drawMesh(cubeMesh, this.color)
        M.restore();
    }
}