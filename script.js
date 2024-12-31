const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

// Kích thước canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Mảng lưu pháo hoa
let fireworks = [];

// Lớp pháo hoa
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 3; // Kích thước ban đầu
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`; // Màu sắc ngẫu nhiên
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.opacity = 1;
        this.particles = [];
        this.exploded = false;
    }

    // Tạo các mảnh vụn khi pháo hoa nổ
    explode() {
        for (let i = 0; i < 200; i++) { // Số lượng mảnh vụn nhiều hơn
            let angle = Math.random() * Math.PI * 2; // Chọn góc ngẫu nhiên để phân tán mảnh vụn
            let speed = Math.random() * 8 + 3; // Tốc độ phân tán mạnh mẽ hơn

            let particle = {
                x: this.x,
                y: this.y,
                radius: Math.random() * 4 + 2, // Kích thước mảnh vụn vừa phải
                color: `hsl(${Math.random() * 360}, 100%, 60%)`, // Màu sắc rực rỡ
                speedX: Math.cos(angle) * speed, // Phân tán mảnh vụn theo hướng ngẫu nhiên trong vòng tròn
                speedY: Math.sin(angle) * speed,
                opacity: 1,
                brightness: Math.random() * 0.5 + 0.5, // Độ sáng mạnh mẽ
                glow: Math.random() * 10 + 5 // Thêm hiệu ứng phát sáng
            };
            this.particles.push(particle);
        }
        this.exploded = true;
    }

    update() {
        if (!this.exploded) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.02;
            if (this.opacity <= 0) {
                this.explode(); // Gọi hàm explode để tạo các mảnh vụn
            }
        }
    }

    draw() {
        // Vẽ pháo hoa (trước khi nổ)
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.closePath();

        // Vẽ các mảnh vụn khi pháo hoa đã nổ
        if (this.exploded) {
            this.particles.forEach((particle, index) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.opacity -= 0.015; // Mờ dần mảnh vụn
                particle.radius *= 0.98; // Giảm kích thước của mảnh vụn
                particle.brightness -= 0.01; // Giảm độ sáng của mảnh vụn

                // Thêm hiệu ứng phát sáng
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = particle.glow;

                // Vẽ mảnh vụn với hiệu ứng phát sáng
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${parseInt(particle.color.slice(4, 7))}, ${parseInt(particle.color.slice(8, 11))}, ${parseInt(particle.color.slice(12, 15))}, ${particle.opacity * particle.brightness})`;
                ctx.fill();
                ctx.closePath();

                // Xóa các mảnh vụn khi đã mờ đi
                if (particle.opacity <= 0) {
                    this.particles.splice(index, 1);
                }
            });
        }

        ctx.shadowBlur = 0; // Tắt hiệu ứng phát sáng khi không vẽ mảnh vụn
    }
}

// Tạo pháo hoa ngẫu nhiên
function createFireworks(x, y) {
    fireworks.push(new Firework(x, y));
}

// Cập nhật canvas
function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();

        if (firework.opacity <= 0 && firework.particles.length === 0) {
            fireworks.splice(index, 1); // Xóa pháo hoa khi đã nổ hoàn toàn
        }
    });

    requestAnimationFrame(updateCanvas);
}

// Lắng nghe sự kiện click để bắn pháo hoa
canvas.addEventListener("click", (event) => {
    createFireworks(event.clientX, event.clientY);
});

// Tự động bắn pháo hoa
setInterval(() => {
    createFireworks(Math.random() * canvas.width, Math.random() * canvas.height);
}, 300); // Giảm thời gian giữa các vụ nổ

// Khởi chạy
updateCanvas();
