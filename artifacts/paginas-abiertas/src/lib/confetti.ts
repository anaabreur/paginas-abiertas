export function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    // Basic confetti implementation
    const colors = ['#E8523A', '#4DC8E0', '#F5E642', '#0F1F3D'];
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    confetti.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 3s';
    document.body.appendChild(confetti);

    requestAnimationFrame(() => {
      confetti.style.transform = `translate(${Math.random() * 200 - 100}px, 100vh) rotate(${Math.random() * 720}deg)`;
      confetti.style.opacity = '0';
    });

    setTimeout(() => {
      confetti.remove();
    }, 3000);

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
