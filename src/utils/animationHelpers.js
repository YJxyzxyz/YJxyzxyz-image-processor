// 动画辅助函数

/**
 * 创建处理区域高亮效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {string} color 
 */
export function highlightProcessingArea(canvas, x, y, width, height, color = 'rgba(255, 255, 0, 0.3)') {
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

/**
 * 创建像素处理动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} pixelIndex 
 * @param {number} totalPixels 
 * @param {ImageData} currentImageData 
 */
export function animatePixelProcessing(canvas, pixelIndex, totalPixels, currentImageData) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  // 计算当前像素的坐标
  const x = pixelIndex % width;
  const y = Math.floor(pixelIndex / width);
  
  // 更新画布显示当前处理进度
  ctx.putImageData(currentImageData, 0, 0);
  
  // 绘制处理进度指示器
  drawProgressIndicator(canvas, pixelIndex, totalPixels);
  
  // 高亮当前处理的像素区域
  if (pixelIndex % 1000 === 0) {
    const blockSize = 10;
    highlightProcessingArea(canvas, 
      Math.floor(x / blockSize) * blockSize, 
      Math.floor(y / blockSize) * blockSize, 
      blockSize, 
      blockSize, 
      'rgba(0, 255, 0, 0.5)'
    );
  }
}

/**
 * 绘制处理进度指示器
 * @param {HTMLCanvasElement} canvas 
 * @param {number} current 
 * @param {number} total 
 */
export function drawProgressIndicator(canvas, current, total) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const progress = current / total;
  
  // 绘制进度条背景
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, height - 30, width - 20, 20);
  
  // 绘制进度条
  ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
  ctx.fillRect(12, height - 28, (width - 24) * progress, 16);
  
  // 绘制进度文本
  ctx.fillStyle = 'white';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(progress * 100)}%`, width / 2, height - 16);
  
  ctx.restore();
}

/**
 * 创建扫描线动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} currentRow 
 * @param {number} totalRows 
 */
export function drawScanLine(canvas, currentRow, totalRows) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const y = (currentRow / totalRows) * height;
  
  ctx.save();
  
  // 绘制扫描线
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  
  // 绘制扫描线光晕效果
  const gradient = ctx.createLinearGradient(0, y - 10, 0, y + 10);
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
  gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, y - 10, width, 20);
  
  ctx.restore();
}

/**
 * 创建卷积核可视化
 * @param {HTMLCanvasElement} canvas 
 * @param {number} centerX 
 * @param {number} centerY 
 * @param {number} kernelSize 
 * @param {Array} kernel 
 */
export function visualizeConvolutionKernel(canvas, centerX, centerY, kernelSize = 3, kernel = null) {
  const ctx = canvas.getContext('2d');
  const cellSize = 20;
  const startX = centerX - (kernelSize * cellSize) / 2;
  const startY = centerY - (kernelSize * cellSize) / 2;
  
  ctx.save();
  
  // 绘制卷积核网格
  for (let i = 0; i < kernelSize; i++) {
    for (let j = 0; j < kernelSize; j++) {
      const x = startX + j * cellSize;
      const y = startY + i * cellSize;
      
      // 绘制网格背景
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(x, y, cellSize, cellSize);
      
      // 绘制网格边框
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.strokeRect(x, y, cellSize, cellSize);
      
      // 如果提供了卷积核数据，显示数值
      if (kernel && kernel[i] && kernel[i][j] !== undefined) {
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(kernel[i][j].toString(), x + cellSize/2, y + cellSize/2 + 3);
      }
    }
  }
  
  ctx.restore();
}

/**
 * 创建波纹效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} centerX 
 * @param {number} centerY 
 * @param {number} radius 
 * @param {number} opacity 
 */
export function drawRippleEffect(canvas, centerX, centerY, radius, opacity = 0.5) {
  const ctx = canvas.getContext('2d');
  
  ctx.save();
  ctx.globalAlpha = opacity;
  
  // 创建径向渐变
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(0, 150, 255, 0.8)');
  gradient.addColorStop(0.7, 'rgba(0, 150, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

/**
 * 创建粒子效果
 * @param {HTMLCanvasElement} canvas 
 * @param {Array} particles 
 */
export function drawParticles(canvas, particles) {
  const ctx = canvas.getContext('2d');
  
  ctx.save();
  
  particles.forEach(particle => {
    ctx.globalAlpha = particle.opacity || 1;
    ctx.fillStyle = particle.color || 'white';
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size || 2, 0, Math.PI * 2);
    ctx.fill();
  });
  
  ctx.restore();
}

/**
 * 更新粒子位置
 * @param {Array} particles 
 * @param {number} deltaTime 
 */
export function updateParticles(particles, deltaTime = 16) {
  return particles.map(particle => ({
    ...particle,
    x: particle.x + (particle.vx || 0) * deltaTime / 16,
    y: particle.y + (particle.vy || 0) * deltaTime / 16,
    opacity: Math.max(0, (particle.opacity || 1) - (particle.decay || 0.01))
  })).filter(particle => particle.opacity > 0);
}

/**
 * 创建处理完成的庆祝效果
 * @param {HTMLCanvasElement} canvas 
 */
export function createCompletionEffect(canvas) {
  const { width, height } = canvas;
  const particles = [];
  
  // 创建庆祝粒子
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 4 + 1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      opacity: 1,
      decay: 0.02
    });
  }
  
  return particles;
}


// ==================== 新增算法专用动画效果 ====================

/**
 * 高斯模糊动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {number} radius 
 */
export function animateGaussianBlur(canvas, progress, radius) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  // 绘制模糊半径可视化
  const centerX = width / 2;
  const centerY = height / 2;
  const currentRadius = radius * progress;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, currentRadius * 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * 运动模糊动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {number} angle 
 * @param {number} distance 
 */
export function animateMotionBlur(canvas, progress, angle, distance) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radian = (angle * Math.PI) / 180;
  const currentDistance = distance * progress;
  
  const endX = centerX + Math.cos(radian) * currentDistance * 2;
  const endY = centerY + Math.sin(radian) * currentDistance * 2;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  
  // 绘制箭头
  const arrowSize = 10;
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - arrowSize * Math.cos(radian - Math.PI/6), endY - arrowSize * Math.sin(radian - Math.PI/6));
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - arrowSize * Math.cos(radian + Math.PI/6), endY - arrowSize * Math.sin(radian + Math.PI/6));
  ctx.stroke();
  ctx.restore();
}

/**
 * 径向模糊动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 */
export function animateRadialBlur(canvas, progress) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2;
  
  // 绘制径向线条
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
  ctx.lineWidth = 1;
  
  const numLines = 16;
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2;
    const radius = maxRadius * progress;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius
    );
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * 油画效果动画
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {number} brushSize 
 */
export function animateOilPainting(canvas, progress, brushSize) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  // 模拟画笔轨迹
  const numStrokes = Math.floor(progress * 20);
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  
  for (let i = 0; i < numStrokes; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const length = brushSize * 2;
    const angle = Math.random() * Math.PI * 2;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * 马赛克效果动画
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {number} blockSize 
 */
export function animateMosaic(canvas, progress, blockSize) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  const blocksX = Math.ceil(width / blockSize);
  const blocksY = Math.ceil(height / blockSize);
  const totalBlocks = blocksX * blocksY;
  const currentBlocks = Math.floor(totalBlocks * progress);
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < currentBlocks; i++) {
    const blockX = (i % blocksX) * blockSize;
    const blockY = Math.floor(i / blocksX) * blockSize;
    
    ctx.strokeRect(blockX, blockY, blockSize, blockSize);
  }
  ctx.restore();
}

/**
 * 色相偏移动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {number} hueShift 
 */
export function animateHueShift(canvas, progress, hueShift) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  // 绘制色相环
  const centerX = width - 60;
  const centerY = 60;
  const radius = 40;
  
  ctx.save();
  
  // 绘制色相环背景
  for (let i = 0; i < 360; i++) {
    const angle = (i * Math.PI) / 180;
    ctx.strokeStyle = `hsl(${i}, 100%, 50%)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, angle, angle + 0.02);
    ctx.stroke();
  }
  
  // 绘制当前色相指示器
  const currentHue = hueShift * progress;
  const indicatorAngle = (currentHue * Math.PI) / 180;
  
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(indicatorAngle) * radius,
    centerY + Math.sin(indicatorAngle) * radius
  );
  ctx.stroke();
  
  ctx.restore();
}

/**
 * 旋转变换动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {number} angle 
 */
export function animateRotation(canvas, progress, angle) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const currentAngle = angle * progress;
  const radian = (currentAngle * Math.PI) / 180;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  // 绘制旋转轴
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.stroke();
  
  // 绘制旋转角度指示
  const radius = Math.min(width, height) / 4;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, radian);
  ctx.stroke();
  
  // 绘制角度文本
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${Math.round(currentAngle)}°`, centerX, centerY - radius - 20);
  
  ctx.restore();
}

/**
 * 鱼眼效果动画
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {number} strength 
 */
export function animateFisheye(canvas, progress, strength) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(centerX, centerY);
  
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
  ctx.lineWidth = 2;
  ctx.setLineDash([3, 3]);
  
  // 绘制同心圆表示鱼眼效果范围
  const numCircles = 5;
  for (let i = 1; i <= numCircles; i++) {
    const radius = (maxRadius / numCircles) * i * progress;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * 霓虹发光动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 */
export function animateNeonGlow(canvas, progress) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  // 创建发光效果
  const glowIntensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
  
  ctx.save();
  ctx.shadowColor = `rgba(0, 255, 255, ${glowIntensity})`;
  ctx.shadowBlur = 20 * glowIntensity;
  
  // 绘制发光边框
  ctx.strokeStyle = `rgba(0, 255, 255, ${0.8 * glowIntensity})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  ctx.restore();
}

/**
 * 波浪变形动画效果
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {number} amplitude 
 * @param {number} frequency 
 */
export function animateWaveDistortion(canvas, progress, amplitude, frequency) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 100, 0, 0.7)';
  ctx.lineWidth = 2;
  
  // 绘制波浪线
  const numWaves = 5;
  for (let i = 0; i < numWaves; i++) {
    const y = (height / numWaves) * i + height / (numWaves * 2);
    
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const waveY = y + Math.sin((x * frequency + progress * Math.PI * 2) * 0.01) * amplitude * progress;
      if (x === 0) {
        ctx.moveTo(x, waveY);
      } else {
        ctx.lineTo(x, waveY);
      }
    }
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * 获取算法对应的动画函数
 * @param {string} algorithmId 
 * @returns {Function|null}
 */
export function getAnimationFunction(algorithmId) {
  const animations = {
    // 基础滤镜类动画
    gaussianBlur: animateGaussianBlur,
    motionBlur: animateMotionBlur,
    radialBlur: animateRadialBlur,
    
    // 艺术效果类动画
    oilPainting: animateOilPainting,
    mosaic: animateMosaic,
    
    // 颜色处理类动画
    hueShift: animateHueShift,
    
    // 几何变换类动画
    rotation: animateRotation,
    fisheye: animateFisheye,
    waveDistortion: animateWaveDistortion,
    
    // 特效类动画
    neonGlow: animateNeonGlow
  };
  
  return animations[algorithmId] || null;
}

/**
 * 通用算法动画效果（用于没有专门动画的算法）
 * @param {HTMLCanvasElement} canvas 
 * @param {number} progress 
 * @param {string} algorithmName 
 */
export function animateGenericAlgorithm(canvas, progress, algorithmName) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  // 绘制处理进度扫描线
  const scanY = height * progress;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, scanY);
  ctx.lineTo(width, scanY);
  ctx.stroke();
  
  // 绘制算法名称
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 200, 30);
  ctx.fillStyle = 'white';
  ctx.font = '14px Arial';
  ctx.fillText(`处理中: ${algorithmName}`, 15, 30);
  
  ctx.restore();
}

