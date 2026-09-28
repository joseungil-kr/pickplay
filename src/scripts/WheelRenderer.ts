import type { Participant } from './selectionState';

export interface WheelItem extends Participant {
  color: string;
}

export class WheelRenderer {
  private readonly context: CanvasRenderingContext2D;
  private items: WheelItem[] = [];
  private angle = 0;
  private frame = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('룰렛을 그릴 수 없습니다.');
    this.context = context;
  }

  setItems(items: WheelItem[]) {
    this.items = items;
    this.draw();
  }

  async spinTo(index: number) {
    const start = this.angle;
    const segment = (Math.PI * 2) / this.items.length;
    const target = -(index * segment + segment / 2) - Math.PI / 2;
    const turns = Math.PI * 2 * (5 + Math.floor(Math.random() * 2));
    const end = target + Math.ceil((start - target) / (Math.PI * 2)) * Math.PI * 2 + turns;
    const startedAt = performance.now();
    const duration = 2800;

    await new Promise<void>((resolve) => {
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        this.angle = start + (end - start) * eased;
        this.draw();
        if (progress < 1) this.frame = requestAnimationFrame(animate);
        else resolve();
      };
      this.frame = requestAnimationFrame(animate);
    });
  }

  reset() {
    cancelAnimationFrame(this.frame);
    this.angle = 0;
    this.draw();
  }

  private draw() {
    const size = Math.min(this.canvas.clientWidth || 320, 420);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = size * pixelRatio;
    this.canvas.height = size * pixelRatio;
    this.canvas.style.height = `${size}px`;
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    this.context.clearRect(0, 0, size, size);

    const center = size / 2;
    const radius = center - 6;
    if (!this.items.length) return;
    const segment = (Math.PI * 2) / this.items.length;

    this.items.forEach((item, index) => {
      const start = this.angle + index * segment;
      const end = start + segment;
      this.context.beginPath();
      this.context.moveTo(center, center);
      this.context.arc(center, center, radius, start, end);
      this.context.closePath();
      this.context.fillStyle = item.color;
      this.context.fill();
      this.context.strokeStyle = '#ffffff';
      this.context.lineWidth = this.items.length <= 4 ? 3 : 2;
      this.context.stroke();

      this.context.save();
      this.context.translate(center, center);
      const labelAngle = start + segment / 2;
      const flipLabel = Math.cos(labelAngle) < 0;
      this.context.rotate(flipLabel ? labelAngle + Math.PI : labelAngle);
      this.context.fillStyle = '#ffffff';
      this.context.font = `700 ${Math.max(10, Math.min(16, 144 / this.items.length))}px system-ui, sans-serif`;
      this.context.textAlign = flipLabel ? 'left' : 'right';
      this.context.textBaseline = 'middle';
      this.context.shadowColor = 'rgba(0, 0, 0, .22)';
      this.context.shadowBlur = 1;
      this.context.fillText(this.truncate(item.label), flipLabel ? -(radius - 18) : radius - 18, 0);
      this.context.restore();
    });

    this.context.beginPath();
    this.context.arc(center, center, radius, 0, Math.PI * 2);
    this.context.strokeStyle = '#102a43';
    this.context.lineWidth = 2;
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(center, center, 28, 0, Math.PI * 2);
    this.context.fillStyle = '#ffffff';
    this.context.fill();
    this.context.strokeStyle = '#102a43';
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.beginPath();
    this.context.arc(center, center, 8, 0, Math.PI * 2);
    this.context.fillStyle = '#102a43';
    this.context.fill();
  }

  private truncate(label: string) {
    return label.length > 8 ? `${label.slice(0, 7)}…` : label;
  }
}