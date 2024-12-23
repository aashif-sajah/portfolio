const container = document.getElementById("spider-box");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to match container
const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
canvas.width = containerWidth;
canvas.height = containerHeight;

let w = canvas.width;
let h = canvas.height;

const { sin, cos, PI, hypot, min, max } = Math;

function spawn() {
  const pts = many(500, () => ({
    x: rnd(w),
    y: rnd(h),
    len: 0,
    r: 0,
  }));

  const numLegs = 9; // Increased number of legs
  const pts2 = many(numLegs, (i) => ({
    x: cos((i / numLegs) * PI * 2),
    y: sin((i / numLegs) * PI * 2),
  }));

  let seed = rnd(100);
  let tx = rnd(w);
  let ty = rnd(h);
  let x = rnd(w);
  let y = rnd(h);
  let kx = rnd(0.5, 0.5);
  let ky = rnd(0.5, 0.5);
  let walkRadius = pt(rnd(50, 50), rnd(50, 50));
  let r = w / rnd(200, 250); // Reduced radius for shorter legs

  function paintPt(pt) {
    pts2.forEach((pt2) => {
      if (!pt.len) return;
      drawLine(
        lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
        lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
        x + pt2.x * r,
        y + pt2.y * r
      );
    });
    drawCircle(pt.x, pt.y, pt.r);
  }

  return {
    follow(cx, cy) {
      tx = cx;
      ty = cy;
    },

    tick(t) {
      const selfMoveX = cos(t * kx + seed) * walkRadius.x;
      const selfMoveY = sin(t * ky + seed) * walkRadius.y;
      let fx = tx + selfMoveX;
      let fy = ty + selfMoveY;

      x += min(w / 100, (fx - x) / 10);
      y += min(h / 100, (fy - y) / 10);

      let i = 0;
      pts.forEach((pt) => {
        const dx = pt.x - x,
          dy = pt.y - y;
        const len = hypot(dx, dy);
        let r = min(2, w / len / 10); // Adjusted radius scaling
        pt.t = 0;
        const increasing = len < w / 10 && i++ < 8;
        let dir = increasing ? 0.1 : -0.1;
        if (increasing) {
          r *= 1.5;
        }
        pt.r = r;
        pt.len = max(0, min(pt.len + dir, 1));
        paintPt(pt);
      });
    },
  };
}

const spiders = many(2, spawn);

container.addEventListener("pointermove", (e) => {
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  spiders.forEach((spider) => spider.follow(x, y));
});

requestAnimationFrame(function anim(t) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = ctx.strokeStyle = "#fff";
  t /= 1000;
  spiders.forEach((spider) => spider.tick(t));
  requestAnimationFrame(anim);
});

function rnd(x = 1, dx = 0) {
  return Math.random() * x + dx;
}

function drawCircle(x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, PI * 2);
  ctx.fillStyle = color || "#fff";
  ctx.fill();
}

function drawLine(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = "#fff";
  ctx.stroke();
}

function many(n, f) {
  return Array.from({ length: n }, (_, i) => f(i));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function pt(x, y) {
  return { x, y };
}
