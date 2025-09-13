// 图像处理算法工具函数

/**
 * 获取图像数据
 * @param {HTMLCanvasElement} canvas 
 * @returns {ImageData}
 */
export function getImageData(canvas) {
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * 设置图像数据
 * @param {HTMLCanvasElement} canvas 
 * @param {ImageData} imageData 
 */
export function putImageData(canvas, imageData) {
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
}

/**
 * 复制图像数据
 * @param {ImageData} imageData 
 * @returns {ImageData}
 */
export function cloneImageData(imageData) {
  const clonedData = new Uint8ClampedArray(imageData.data);
  return new ImageData(clonedData, imageData.width, imageData.height);
}

/**
 * 灰度化算法
 * @param {ImageData} imageData 
 * @param {Function} onProgress 进度回调
 * @returns {Promise<ImageData>}
 */
export async function grayscaleAlgorithm(imageData, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const data = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    // 使用加权平均法计算灰度值
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    
    data[i] = gray;     // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
    // data[i + 3] 保持不变 (Alpha)
    
    // 每处理一定数量的像素后调用进度回调
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 反色算法
 * @param {ImageData} imageData 
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function invertAlgorithm(imageData, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const data = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    data[i] = 255 - data[i];         // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
    // data[i + 3] 保持不变 (Alpha)
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 亮度调整算法
 * @param {ImageData} imageData 
 * @param {number} brightness 亮度值 (-100 到 100)
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function brightnessAlgorithm(imageData, brightness = 0, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const data = result.data;
  const totalPixels = imageData.width * imageData.height;
  const brightnessValue = brightness * 2.55; // 转换为 0-255 范围
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    data[i] = Math.max(0, Math.min(255, data[i] + brightnessValue));         // R
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightnessValue)); // G
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightnessValue)); // B
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 对比度调整算法
 * @param {ImageData} imageData 
 * @param {number} contrast 对比度值 (-100 到 100)
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function contrastAlgorithm(imageData, contrast = 0, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const data = result.data;
  const totalPixels = imageData.width * imageData.height;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));         // R
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128)); // G
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128)); // B
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 简单模糊算法（均值模糊）
 * @param {ImageData} imageData 
 * @param {number} radius 模糊半径
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function blurAlgorithm(imageData, radius = 1, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      let r = 0, g = 0, b = 0, count = 0;
      
      // 计算周围像素的平均值
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = (ny * width + nx) * 4;
            r += data[index];
            g += data[index + 1];
            b += data[index + 2];
            count++;
          }
        }
      }
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = Math.round(r / count);
      resultData[resultIndex + 1] = Math.round(g / count);
      resultData[resultIndex + 2] = Math.round(b / count);
      resultData[resultIndex + 3] = data[resultIndex + 3]; // 保持 alpha
      
      if (pixelIndex % 500 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 边缘检测算法（Sobel算子）
 * @param {ImageData} imageData 
 * @param {number} threshold 阈值
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function edgeDetectionAlgorithm(imageData, threshold = 128, onProgress = () => {}) {
  // 先转换为灰度图
  const grayData = await grayscaleAlgorithm(imageData);
  const result = cloneImageData(imageData);
  const { width, height } = imageData;
  const gray = grayData.data;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // Sobel算子
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      let gx = 0, gy = 0;
      
      // 应用Sobel算子
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          const pixel = gray[index]; // 灰度值
          
          gx += pixel * sobelX[dy + 1][dx + 1];
          gy += pixel * sobelY[dy + 1][dx + 1];
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const edge = magnitude > threshold ? 255 : 0;
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = edge;
      resultData[resultIndex + 1] = edge;
      resultData[resultIndex + 2] = edge;
      resultData[resultIndex + 3] = 255;
      
      if (pixelIndex % 500 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 锐化算法
 * @param {ImageData} imageData 
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function sharpenAlgorithm(imageData, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // 锐化卷积核
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      let r = 0, g = 0, b = 0;
      
      // 应用卷积核
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          const weight = kernel[dy + 1][dx + 1];
          
          r += data[index] * weight;
          g += data[index + 1] * weight;
          b += data[index + 2] * weight;
        }
      }
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = Math.max(0, Math.min(255, r));
      resultData[resultIndex + 1] = Math.max(0, Math.min(255, g));
      resultData[resultIndex + 2] = Math.max(0, Math.min(255, b));
      resultData[resultIndex + 3] = data[resultIndex + 3];
      
      if (pixelIndex % 500 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 浮雕效果算法
 * @param {ImageData} imageData 
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function embossAlgorithm(imageData, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // 浮雕卷积核
  const kernel = [
    [-2, -1, 0],
    [-1, 1, 1],
    [0, 1, 2]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      let r = 0, g = 0, b = 0;
      
      // 应用卷积核
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          const weight = kernel[dy + 1][dx + 1];
          
          r += data[index] * weight;
          g += data[index + 1] * weight;
          b += data[index + 2] * weight;
        }
      }
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = Math.max(0, Math.min(255, r + 128));
      resultData[resultIndex + 1] = Math.max(0, Math.min(255, g + 128));
      resultData[resultIndex + 2] = Math.max(0, Math.min(255, b + 128));
      resultData[resultIndex + 3] = data[resultIndex + 3];
      
      if (pixelIndex % 500 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

// ==================== 基础滤镜类算法 ====================

/**
 * 高斯模糊算法
 * @param {ImageData} imageData 
 * @param {number} radius 模糊半径
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function gaussianBlurAlgorithm(imageData, radius = 2, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // 生成高斯核
  const kernelSize = Math.ceil(radius * 2) * 2 + 1;
  const kernel = [];
  const sigma = radius / 3;
  let sum = 0;
  
  for (let i = 0; i < kernelSize; i++) {
    kernel[i] = [];
    for (let j = 0; j < kernelSize; j++) {
      const x = i - Math.floor(kernelSize / 2);
      const y = j - Math.floor(kernelSize / 2);
      const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      kernel[i][j] = value;
      sum += value;
    }
  }
  
  // 归一化核
  for (let i = 0; i < kernelSize; i++) {
    for (let j = 0; j < kernelSize; j++) {
      kernel[i][j] /= sum;
    }
  }
  
  const halfKernel = Math.floor(kernelSize / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      let r = 0, g = 0, b = 0;
      
      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const nx = x + kx - halfKernel;
          const ny = y + ky - halfKernel;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = (ny * width + nx) * 4;
            const weight = kernel[ky][kx];
            
            r += data[index] * weight;
            g += data[index + 1] * weight;
            b += data[index + 2] * weight;
          }
        }
      }
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = Math.round(r);
      resultData[resultIndex + 1] = Math.round(g);
      resultData[resultIndex + 2] = Math.round(b);
      resultData[resultIndex + 3] = data[resultIndex + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 运动模糊算法
 * @param {ImageData} imageData 
 * @param {number} distance 模糊距离
 * @param {number} angle 模糊角度（度）
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function motionBlurAlgorithm(imageData, distance = 10, angle = 0, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  const radian = (angle * Math.PI) / 180;
  const dx = Math.cos(radian);
  const dy = Math.sin(radian);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let i = 0; i < distance; i++) {
        const nx = Math.round(x + dx * i);
        const ny = Math.round(y + dy * i);
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const index = (ny * width + nx) * 4;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          count++;
        }
      }
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = count > 0 ? Math.round(r / count) : data[resultIndex];
      resultData[resultIndex + 1] = count > 0 ? Math.round(g / count) : data[resultIndex + 1];
      resultData[resultIndex + 2] = count > 0 ? Math.round(b / count) : data[resultIndex + 2];
      resultData[resultIndex + 3] = data[resultIndex + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 径向模糊算法
 * @param {ImageData} imageData 
 * @param {number} strength 模糊强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function radialBlurAlgorithm(imageData, strength = 10, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const blurAmount = (distance / maxDistance) * strength;
      
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let i = 0; i < Math.ceil(blurAmount); i++) {
        const factor = i / blurAmount;
        const nx = Math.round(centerX + dx * factor);
        const ny = Math.round(centerY + dy * factor);
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const index = (ny * width + nx) * 4;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          count++;
        }
      }
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = count > 0 ? Math.round(r / count) : data[resultIndex];
      resultData[resultIndex + 1] = count > 0 ? Math.round(g / count) : data[resultIndex + 1];
      resultData[resultIndex + 2] = count > 0 ? Math.round(b / count) : data[resultIndex + 2];
      resultData[resultIndex + 3] = data[resultIndex + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 中值滤波算法
 * @param {ImageData} imageData 
 * @param {number} radius 滤波半径
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function medianFilterAlgorithm(imageData, radius = 1, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const rValues = [], gValues = [], bValues = [];
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = (ny * width + nx) * 4;
            rValues.push(data[index]);
            gValues.push(data[index + 1]);
            bValues.push(data[index + 2]);
          }
        }
      }
      
      rValues.sort((a, b) => a - b);
      gValues.sort((a, b) => a - b);
      bValues.sort((a, b) => a - b);
      
      const medianIndex = Math.floor(rValues.length / 2);
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = rValues[medianIndex];
      resultData[resultIndex + 1] = gValues[medianIndex];
      resultData[resultIndex + 2] = bValues[medianIndex];
      resultData[resultIndex + 3] = data[resultIndex + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 双边滤波算法
 * @param {ImageData} imageData 
 * @param {number} spatialSigma 空间标准差
 * @param {number} intensitySigma 强度标准差
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function bilateralFilterAlgorithm(imageData, spatialSigma = 10, intensitySigma = 20, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  const radius = Math.ceil(spatialSigma * 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const centerIndex = pixelIndex * 4;
      const centerR = data[centerIndex];
      const centerG = data[centerIndex + 1];
      const centerB = data[centerIndex + 2];
      
      let r = 0, g = 0, b = 0, weightSum = 0;
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = (ny * width + nx) * 4;
            const pixelR = data[index];
            const pixelG = data[index + 1];
            const pixelB = data[index + 2];
            
            // 空间权重
            const spatialWeight = Math.exp(-(dx * dx + dy * dy) / (2 * spatialSigma * spatialSigma));
            
            // 强度权重
            const intensityDiff = Math.sqrt(
              (pixelR - centerR) * (pixelR - centerR) +
              (pixelG - centerG) * (pixelG - centerG) +
              (pixelB - centerB) * (pixelB - centerB)
            );
            const intensityWeight = Math.exp(-(intensityDiff * intensityDiff) / (2 * intensitySigma * intensitySigma));
            
            const weight = spatialWeight * intensityWeight;
            
            r += pixelR * weight;
            g += pixelG * weight;
            b += pixelB * weight;
            weightSum += weight;
          }
        }
      }
      
      resultData[centerIndex] = Math.round(r / weightSum);
      resultData[centerIndex + 1] = Math.round(g / weightSum);
      resultData[centerIndex + 2] = Math.round(b / weightSum);
      resultData[centerIndex + 3] = data[centerIndex + 3];
      
      if (pixelIndex % 500 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 拉普拉斯锐化算法
 * @param {ImageData} imageData 
 * @param {number} strength 锐化强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function laplacianSharpenAlgorithm(imageData, strength = 1, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // 拉普拉斯算子
  const kernel = [
    [0, -1, 0],
    [-1, 4, -1],
    [0, -1, 0]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      let r = 0, g = 0, b = 0;
      
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          const weight = kernel[dy + 1][dx + 1];
          
          r += data[index] * weight;
          g += data[index + 1] * weight;
          b += data[index + 2] * weight;
        }
      }
      
      const originalIndex = pixelIndex * 4;
      resultData[originalIndex] = Math.max(0, Math.min(255, data[originalIndex] + r * strength));
      resultData[originalIndex + 1] = Math.max(0, Math.min(255, data[originalIndex + 1] + g * strength));
      resultData[originalIndex + 2] = Math.max(0, Math.min(255, data[originalIndex + 2] + b * strength));
      resultData[originalIndex + 3] = data[originalIndex + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 非锐化掩模算法
 * @param {ImageData} imageData 
 * @param {number} amount 锐化量
 * @param {number} radius 模糊半径
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function unsharpMaskAlgorithm(imageData, amount = 1.5, radius = 1, onProgress = () => {}) {
  // 先创建模糊版本
  const blurred = await blurAlgorithm(imageData, radius, (progress) => {
    onProgress(progress * 0.5, 0, null);
  });
  
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const blurredData = blurred.data;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.5 + (pixelIndex / totalPixels) * 0.5;
    
    // 计算锐化
    resultData[i] = Math.max(0, Math.min(255, data[i] + amount * (data[i] - blurredData[i])));
    resultData[i + 1] = Math.max(0, Math.min(255, data[i + 1] + amount * (data[i + 1] - blurredData[i + 1])));
    resultData[i + 2] = Math.max(0, Math.min(255, data[i + 2] + amount * (data[i + 2] - blurredData[i + 2])));
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * Sobel边缘检测算法（增强版）
 * @param {ImageData} imageData 
 * @param {number} threshold 阈值
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function sobelEdgeAlgorithm(imageData, threshold = 128, onProgress = () => {}) {
  const grayData = await grayscaleAlgorithm(imageData, (progress) => {
    onProgress(progress * 0.3, 0, null);
  });
  
  const result = cloneImageData(imageData);
  const { width, height } = imageData;
  const gray = grayData.data;
  const resultData = result.data;
  const totalPixels = width * height;
  
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixelIndex = y * width + x;
      const progress = 0.3 + (pixelIndex / totalPixels) * 0.7;
      
      let gx = 0, gy = 0;
      
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          const pixel = gray[index];
          
          gx += pixel * sobelX[dy + 1][dx + 1];
          gy += pixel * sobelY[dy + 1][dx + 1];
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const edge = magnitude > threshold ? 255 : 0;
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = edge;
      resultData[resultIndex + 1] = edge;
      resultData[resultIndex + 2] = edge;
      resultData[resultIndex + 3] = 255;
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}


// ==================== 艺术效果类算法 ====================

/**
 * 油画效果算法
 * @param {ImageData} imageData 
 * @param {number} brushSize 笔刷大小
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function oilPaintingAlgorithm(imageData, brushSize = 4, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const intensityCount = new Array(256).fill(0);
      const avgR = new Array(256).fill(0);
      const avgG = new Array(256).fill(0);
      const avgB = new Array(256).fill(0);
      
      for (let dy = -brushSize; dy <= brushSize; dy++) {
        for (let dx = -brushSize; dx <= brushSize; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = (ny * width + nx) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            const intensity = Math.round((r + g + b) / 3);
            intensityCount[intensity]++;
            avgR[intensity] += r;
            avgG[intensity] += g;
            avgB[intensity] += b;
          }
        }
      }
      
      let maxCount = 0;
      let maxIndex = 0;
      for (let i = 0; i < 256; i++) {
        if (intensityCount[i] > maxCount) {
          maxCount = intensityCount[i];
          maxIndex = i;
        }
      }
      
      const resultIndex = pixelIndex * 4;
      if (maxCount > 0) {
        resultData[resultIndex] = Math.round(avgR[maxIndex] / maxCount);
        resultData[resultIndex + 1] = Math.round(avgG[maxIndex] / maxCount);
        resultData[resultIndex + 2] = Math.round(avgB[maxIndex] / maxCount);
      } else {
        resultData[resultIndex] = data[resultIndex];
        resultData[resultIndex + 1] = data[resultIndex + 1];
        resultData[resultIndex + 2] = data[resultIndex + 2];
      }
      resultData[resultIndex + 3] = data[resultIndex + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 水彩效果算法
 * @param {ImageData} imageData 
 * @param {number} intensity 强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function watercolorAlgorithm(imageData, intensity = 0.8, onProgress = () => {}) {
  // 先应用高斯模糊
  const blurred = await gaussianBlurAlgorithm(imageData, 2, (progress) => {
    onProgress(progress * 0.5, 0, null);
  });
  
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const blurredData = blurred.data;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.5 + (pixelIndex / totalPixels) * 0.5;
    
    // 混合原图和模糊图
    const blendFactor = intensity;
    resultData[i] = Math.round(data[i] * (1 - blendFactor) + blurredData[i] * blendFactor);
    resultData[i + 1] = Math.round(data[i + 1] * (1 - blendFactor) + blurredData[i + 1] * blendFactor);
    resultData[i + 2] = Math.round(data[i + 2] * (1 - blendFactor) + blurredData[i + 2] * blendFactor);
    
    // 增加饱和度
    const r = resultData[i] / 255;
    const g = resultData[i + 1] / 255;
    const b = resultData[i + 2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const enhancedSaturation = Math.min(1, saturation * 1.3);
    
    if (max > 0) {
      const factor = enhancedSaturation / saturation || 1;
      resultData[i] = Math.round(Math.max(0, Math.min(255, (r - min) * factor + min)) * 255);
      resultData[i + 1] = Math.round(Math.max(0, Math.min(255, (g - min) * factor + min)) * 255);
      resultData[i + 2] = Math.round(Math.max(0, Math.min(255, (b - min) * factor + min)) * 255);
    }
    
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 铅笔素描算法
 * @param {ImageData} imageData 
 * @param {number} intensity 强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function pencilSketchAlgorithm(imageData, intensity = 0.8, onProgress = () => {}) {
  // 转换为灰度
  const grayData = await grayscaleAlgorithm(imageData, (progress) => {
    onProgress(progress * 0.3, 0, null);
  });
  
  // 反色
  const invertedData = await invertAlgorithm(grayData, (progress) => {
    onProgress(0.3 + progress * 0.3, 0, null);
  });
  
  // 高斯模糊
  const blurredData = await gaussianBlurAlgorithm(invertedData, 3, (progress) => {
    onProgress(0.6 + progress * 0.2, 0, null);
  });
  
  const result = cloneImageData(imageData);
  const { width, height } = imageData;
  const gray = grayData.data;
  const blurred = blurredData.data;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < gray.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.8 + (pixelIndex / totalPixels) * 0.2;
    
    // 颜色减淡混合模式
    const base = gray[i];
    const blend = blurred[i];
    let sketch = blend === 255 ? 255 : Math.min(255, (base * 255) / (255 - blend));
    
    sketch = Math.round(sketch * intensity + base * (1 - intensity));
    
    resultData[i] = sketch;
    resultData[i + 1] = sketch;
    resultData[i + 2] = sketch;
    resultData[i + 3] = 255;
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 卡通化算法
 * @param {ImageData} imageData 
 * @param {number} levels 颜色级别
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function cartoonAlgorithm(imageData, levels = 8, onProgress = () => {}) {
  // 先应用双边滤波平滑图像
  const smoothed = await bilateralFilterAlgorithm(imageData, 10, 80, (progress) => {
    onProgress(progress * 0.7, 0, null);
  });
  
  const result = cloneImageData(smoothed);
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  // 量化颜色
  const step = 255 / (levels - 1);
  
  for (let i = 0; i < resultData.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.7 + (pixelIndex / totalPixels) * 0.3;
    
    resultData[i] = Math.round(Math.round(resultData[i] / step) * step);
    resultData[i + 1] = Math.round(Math.round(resultData[i + 1] / step) * step);
    resultData[i + 2] = Math.round(Math.round(resultData[i + 2] / step) * step);
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 马赛克算法
 * @param {ImageData} imageData 
 * @param {number} blockSize 块大小
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function mosaicAlgorithm(imageData, blockSize = 10, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalBlocks = Math.ceil(width / blockSize) * Math.ceil(height / blockSize);
  let processedBlocks = 0;
  
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      const progress = processedBlocks / totalBlocks;
      
      let r = 0, g = 0, b = 0, count = 0;
      
      // 计算块的平均颜色
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          count++;
        }
      }
      
      const avgR = Math.round(r / count);
      const avgG = Math.round(g / count);
      const avgB = Math.round(b / count);
      
      // 应用平均颜色到整个块
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          resultData[index] = avgR;
          resultData[index + 1] = avgG;
          resultData[index + 2] = avgB;
          resultData[index + 3] = data[index + 3];
        }
      }
      
      processedBlocks++;
      if (processedBlocks % 10 === 0) {
        onProgress(progress, processedBlocks, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalBlocks, result);
  return result;
}

/**
 * 点彩画算法
 * @param {ImageData} imageData 
 * @param {number} dotSize 点的大小
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function pointillismAlgorithm(imageData, dotSize = 6, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  
  // 先填充白色背景
  for (let i = 0; i < resultData.length; i += 4) {
    resultData[i] = 255;
    resultData[i + 1] = 255;
    resultData[i + 2] = 255;
    resultData[i + 3] = 255;
  }
  
  const totalDots = Math.ceil(width / dotSize) * Math.ceil(height / dotSize);
  let processedDots = 0;
  
  for (let y = 0; y < height; y += dotSize) {
    for (let x = 0; x < width; x += dotSize) {
      const progress = processedDots / totalDots;
      
      // 获取区域的平均颜色
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < dotSize && y + dy < height; dy++) {
        for (let dx = 0; dx < dotSize && x + dx < width; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          count++;
        }
      }
      
      const avgR = Math.round(r / count);
      const avgG = Math.round(g / count);
      const avgB = Math.round(b / count);
      
      // 绘制圆点
      const centerX = x + dotSize / 2;
      const centerY = y + dotSize / 2;
      const radius = dotSize / 2;
      
      for (let dy = 0; dy < dotSize && y + dy < height; dy++) {
        for (let dx = 0; dx < dotSize && x + dx < width; dx++) {
          const distance = Math.sqrt((dx - dotSize/2) * (dx - dotSize/2) + (dy - dotSize/2) * (dy - dotSize/2));
          if (distance <= radius) {
            const index = ((y + dy) * width + (x + dx)) * 4;
            resultData[index] = avgR;
            resultData[index + 1] = avgG;
            resultData[index + 2] = avgB;
            resultData[index + 3] = 255;
          }
        }
      }
      
      processedDots++;
      if (processedDots % 50 === 0) {
        onProgress(progress, processedDots, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalDots, result);
  return result;
}

/**
 * 蜡笔效果算法
 * @param {ImageData} imageData 
 * @param {number} intensity 强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function crayonAlgorithm(imageData, intensity = 0.7, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // 添加纹理和噪声
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    
    // 创建蜡笔纹理
    const noise = (Math.sin(x * 0.1) + Math.sin(y * 0.1)) * 20;
    const texture = Math.random() * 30 - 15;
    
    let r = data[i] + noise + texture;
    let g = data[i + 1] + noise + texture;
    let b = data[i + 2] + noise + texture;
    
    // 增加对比度
    r = ((r / 255 - 0.5) * 1.2 + 0.5) * 255;
    g = ((g / 255 - 0.5) * 1.2 + 0.5) * 255;
    b = ((b / 255 - 0.5) * 1.2 + 0.5) * 255;
    
    resultData[i] = Math.max(0, Math.min(255, Math.round(r * intensity + data[i] * (1 - intensity))));
    resultData[i + 1] = Math.max(0, Math.min(255, Math.round(g * intensity + data[i + 1] * (1 - intensity))));
    resultData[i + 2] = Math.max(0, Math.min(255, Math.round(b * intensity + data[i + 2] * (1 - intensity))));
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 炭笔效果算法
 * @param {ImageData} imageData 
 * @param {number} intensity 强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function charcoalAlgorithm(imageData, intensity = 0.8, onProgress = () => {}) {
  // 先转换为灰度
  const grayData = await grayscaleAlgorithm(imageData, (progress) => {
    onProgress(progress * 0.3, 0, null);
  });
  
  // 边缘检测
  const edgeData = await sobelEdgeAlgorithm(grayData, 50, (progress) => {
    onProgress(0.3 + progress * 0.4, 0, null);
  });
  
  const result = cloneImageData(imageData);
  const { width, height } = imageData;
  const gray = grayData.data;
  const edge = edgeData.data;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < gray.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.7 + (pixelIndex / totalPixels) * 0.3;
    
    const grayValue = gray[i];
    const edgeValue = edge[i];
    
    // 结合灰度和边缘信息
    let charcoal = Math.max(0, 255 - grayValue - edgeValue * 0.5);
    
    // 添加纹理
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const texture = Math.sin(x * 0.05) * Math.sin(y * 0.05) * 20;
    
    charcoal = Math.max(0, Math.min(255, charcoal + texture));
    charcoal = Math.round(charcoal * intensity + grayValue * (1 - intensity));
    
    resultData[i] = charcoal;
    resultData[i + 1] = charcoal;
    resultData[i + 2] = charcoal;
    resultData[i + 3] = 255;
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 版画效果算法
 * @param {ImageData} imageData 
 * @param {number} threshold 阈值
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function woodcutAlgorithm(imageData, threshold = 128, onProgress = () => {}) {
  // 转换为灰度
  const grayData = await grayscaleAlgorithm(imageData, (progress) => {
    onProgress(progress * 0.5, 0, null);
  });
  
  const result = cloneImageData(imageData);
  const { width, height } = imageData;
  const gray = grayData.data;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < gray.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.5 + (pixelIndex / totalPixels) * 0.5;
    
    const grayValue = gray[i];
    
    // 二值化处理
    const binary = grayValue > threshold ? 255 : 0;
    
    // 添加版画纹理
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const woodGrain = Math.sin(y * 0.1) * 10;
    
    let woodcut = binary + woodGrain;
    woodcut = Math.max(0, Math.min(255, woodcut));
    
    resultData[i] = woodcut;
    resultData[i + 1] = woodcut;
    resultData[i + 2] = woodcut;
    resultData[i + 3] = 255;
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 抽象艺术算法
 * @param {ImageData} imageData 
 * @param {number} complexity 复杂度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function abstractArtAlgorithm(imageData, complexity = 5, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    
    // 创建抽象图案
    const pattern1 = Math.sin(x * 0.01 * complexity) * Math.cos(y * 0.01 * complexity);
    const pattern2 = Math.sin((x + y) * 0.005 * complexity);
    const pattern3 = Math.cos(Math.sqrt(x * x + y * y) * 0.01 * complexity);
    
    const factor = (pattern1 + pattern2 + pattern3) / 3;
    
    let r = data[i] + factor * 100;
    let g = data[i + 1] + factor * 80;
    let b = data[i + 2] + factor * 120;
    
    // 色彩偏移
    const hueShift = factor * 60;
    const temp = r;
    r = Math.max(0, Math.min(255, g + hueShift));
    g = Math.max(0, Math.min(255, b + hueShift));
    b = Math.max(0, Math.min(255, temp + hueShift));
    
    resultData[i] = Math.round(r);
    resultData[i + 1] = Math.round(g);
    resultData[i + 2] = Math.round(b);
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}


// ==================== 颜色处理类算法 ====================

/**
 * RGB转HSV
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @returns {Array} [h, s, v]
 */
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff) % 6;
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else {
      h = (r - g) / diff + 4;
    }
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  
  const s = max === 0 ? 0 : diff / max;
  const v = max;
  
  return [h, s, v];
}

/**
 * HSV转RGB
 * @param {number} h 
 * @param {number} s 
 * @param {number} v 
 * @returns {Array} [r, g, b]
 */
function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

/**
 * 色相偏移算法
 * @param {ImageData} imageData 
 * @param {number} hueShift 色相偏移量（-180到180）
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function hueShiftAlgorithm(imageData, hueShift = 30, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { data } = imageData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
    const newH = (h + hueShift + 360) % 360;
    const [r, g, b] = hsvToRgb(newH, s, v);
    
    resultData[i] = r;
    resultData[i + 1] = g;
    resultData[i + 2] = b;
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 饱和度增强算法
 * @param {ImageData} imageData 
 * @param {number} saturation 饱和度倍数（0-3）
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function saturationEnhanceAlgorithm(imageData, saturation = 1.5, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { data } = imageData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
    const newS = Math.min(1, s * saturation);
    const [r, g, b] = hsvToRgb(h, newS, v);
    
    resultData[i] = r;
    resultData[i + 1] = g;
    resultData[i + 2] = b;
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 色彩平衡算法
 * @param {ImageData} imageData 
 * @param {number} temperature 色温（-100到100）
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function colorBalanceAlgorithm(imageData, temperature = 0, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { data } = imageData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  // 色温调整矩阵
  const tempFactor = temperature / 100;
  const rFactor = 1 + tempFactor * 0.3;
  const gFactor = 1;
  const bFactor = 1 - tempFactor * 0.3;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    resultData[i] = Math.max(0, Math.min(255, data[i] * rFactor));
    resultData[i + 1] = Math.max(0, Math.min(255, data[i + 1] * gFactor));
    resultData[i + 2] = Math.max(0, Math.min(255, data[i + 2] * bFactor));
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 单色保留算法
 * @param {ImageData} imageData 
 * @param {number} targetHue 目标色相（0-360）
 * @param {number} tolerance 容差（0-180）
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function selectiveColorAlgorithm(imageData, targetHue = 120, tolerance = 30, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { data } = imageData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
    
    // 计算色相差异
    let hueDiff = Math.abs(h - targetHue);
    if (hueDiff > 180) {
      hueDiff = 360 - hueDiff;
    }
    
    // 如果不在目标色相范围内，转为灰度
    if (hueDiff > tolerance) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      resultData[i] = gray;
      resultData[i + 1] = gray;
      resultData[i + 2] = gray;
    } else {
      resultData[i] = data[i];
      resultData[i + 1] = data[i + 1];
      resultData[i + 2] = data[i + 2];
    }
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 互补色算法
 * @param {ImageData} imageData 
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function complementaryColorAlgorithm(imageData, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { data } = imageData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
    const complementaryH = (h + 180) % 360;
    const [r, g, b] = hsvToRgb(complementaryH, s, v);
    
    resultData[i] = r;
    resultData[i + 1] = g;
    resultData[i + 2] = b;
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 色彩量化算法
 * @param {ImageData} imageData 
 * @param {number} levels 颜色级别数
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function colorQuantizationAlgorithm(imageData, levels = 16, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { data } = imageData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  const step = 256 / levels;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    resultData[i] = Math.floor(data[i] / step) * step;
    resultData[i + 1] = Math.floor(data[i + 1] / step) * step;
    resultData[i + 2] = Math.floor(data[i + 2] / step) * step;
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}


// ==================== 复古风格化类算法 ====================

/**
 * 复古胶片算法
 * @param {ImageData} imageData 
 * @param {number} intensity 强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function vintageFilmAlgorithm(imageData, intensity = 0.8, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    
    // 胶片色调调整
    r = r * 1.1 + 20;
    g = g * 0.95 + 10;
    b = b * 0.8 - 10;
    
    // 增加对比度
    r = ((r / 255 - 0.5) * 1.2 + 0.5) * 255;
    g = ((g / 255 - 0.5) * 1.2 + 0.5) * 255;
    b = ((b / 255 - 0.5) * 1.2 + 0.5) * 255;
    
    // 添加轻微的棕褐色调
    const sepia = 0.3;
    const sepiaR = (r * 0.393 + g * 0.769 + b * 0.189) * sepia + r * (1 - sepia);
    const sepiaG = (r * 0.349 + g * 0.686 + b * 0.168) * sepia + g * (1 - sepia);
    const sepiaB = (r * 0.272 + g * 0.534 + b * 0.131) * sepia + b * (1 - sepia);
    
    resultData[i] = Math.max(0, Math.min(255, Math.round(sepiaR * intensity + data[i] * (1 - intensity))));
    resultData[i + 1] = Math.max(0, Math.min(255, Math.round(sepiaG * intensity + data[i + 1] * (1 - intensity))));
    resultData[i + 2] = Math.max(0, Math.min(255, Math.round(sepiaB * intensity + data[i + 2] * (1 - intensity))));
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 褪色效果算法
 * @param {ImageData} imageData 
 * @param {number} fadeAmount 褪色程度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function fadedAlgorithm(imageData, fadeAmount = 0.6, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { data } = imageData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    // 降低饱和度和对比度
    const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
    const newS = s * (1 - fadeAmount * 0.7);
    const newV = v * (1 - fadeAmount * 0.3) + fadeAmount * 0.3;
    const [r, g, b] = hsvToRgb(h, newS, newV);
    
    // 添加轻微的白色覆盖
    const whiteOverlay = fadeAmount * 0.2;
    resultData[i] = Math.round(r * (1 - whiteOverlay) + 255 * whiteOverlay);
    resultData[i + 1] = Math.round(g * (1 - whiteOverlay) + 255 * whiteOverlay);
    resultData[i + 2] = Math.round(b * (1 - whiteOverlay) + 255 * whiteOverlay);
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 暗角效果算法
 * @param {ImageData} imageData 
 * @param {number} intensity 强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function vignetteAlgorithm(imageData, intensity = 0.8, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const vignette = 1 - Math.pow(distance / maxDistance, 2) * intensity;
      
      const index = pixelIndex * 4;
      resultData[index] = Math.round(data[index] * vignette);
      resultData[index + 1] = Math.round(data[index + 1] * vignette);
      resultData[index + 2] = Math.round(data[index + 2] * vignette);
      resultData[index + 3] = data[index + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 颗粒噪点算法
 * @param {ImageData} imageData 
 * @param {number} amount 噪点数量
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function filmGrainAlgorithm(imageData, amount = 0.3, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { data } = imageData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    // 生成随机噪点
    const noise = (Math.random() - 0.5) * amount * 100;
    
    resultData[i] = Math.max(0, Math.min(255, data[i] + noise));
    resultData[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    resultData[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 高对比度黑白算法
 * @param {ImageData} imageData 
 * @param {number} contrast 对比度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function highContrastBWAlgorithm(imageData, contrast = 2, onProgress = () => {}) {
  // 先转换为灰度
  const grayData = await grayscaleAlgorithm(imageData, (progress) => {
    onProgress(progress * 0.5, 0, null);
  });
  
  const result = cloneImageData(grayData);
  const { data } = grayData;
  const resultData = result.data;
  const totalPixels = imageData.width * imageData.height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.5 + (pixelIndex / totalPixels) * 0.5;
    
    const gray = data[i];
    
    // 应用高对比度
    let newGray = ((gray / 255 - 0.5) * contrast + 0.5) * 255;
    newGray = Math.max(0, Math.min(255, newGray));
    
    resultData[i] = newGray;
    resultData[i + 1] = newGray;
    resultData[i + 2] = newGray;
    resultData[i + 3] = 255;
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}


// ==================== 几何变换类算法 ====================

/**
 * 旋转变换算法
 * @param {ImageData} imageData 
 * @param {number} angle 旋转角度（度）
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function rotationAlgorithm(imageData, angle = 45, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // 清空结果数据
  for (let i = 0; i < resultData.length; i += 4) {
    resultData[i] = 0;
    resultData[i + 1] = 0;
    resultData[i + 2] = 0;
    resultData[i + 3] = 255;
  }
  
  const radian = (angle * Math.PI) / 180;
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      // 计算旋转后的坐标
      const dx = x - centerX;
      const dy = y - centerY;
      const newX = Math.round(dx * cos - dy * sin + centerX);
      const newY = Math.round(dx * sin + dy * cos + centerY);
      
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const sourceIndex = (newY * width + newX) * 4;
        const targetIndex = pixelIndex * 4;
        
        resultData[targetIndex] = data[sourceIndex];
        resultData[targetIndex + 1] = data[sourceIndex + 1];
        resultData[targetIndex + 2] = data[sourceIndex + 2];
        resultData[targetIndex + 3] = data[sourceIndex + 3];
      }
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 透视变换算法
 * @param {ImageData} imageData 
 * @param {number} perspective 透视强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function perspectiveAlgorithm(imageData, perspective = 0.5, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      // 透视变换
      const normalizedY = y / height;
      const scale = 1 - normalizedY * perspective;
      const newX = Math.round((x - width / 2) * scale + width / 2);
      const newY = y;
      
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const sourceIndex = (newY * width + newX) * 4;
        const targetIndex = pixelIndex * 4;
        
        resultData[targetIndex] = data[sourceIndex];
        resultData[targetIndex + 1] = data[sourceIndex + 1];
        resultData[targetIndex + 2] = data[sourceIndex + 2];
        resultData[targetIndex + 3] = data[sourceIndex + 3];
      } else {
        const targetIndex = pixelIndex * 4;
        resultData[targetIndex] = 0;
        resultData[targetIndex + 1] = 0;
        resultData[targetIndex + 2] = 0;
        resultData[targetIndex + 3] = 255;
      }
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 鱼眼效果算法
 * @param {ImageData} imageData 
 * @param {number} strength 强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function fisheyeAlgorithm(imageData, strength = 0.5, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(centerX, centerY);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxRadius) {
        const normalizedDistance = distance / maxRadius;
        const fisheyeDistance = normalizedDistance * normalizedDistance * strength + normalizedDistance * (1 - strength);
        const scale = fisheyeDistance / normalizedDistance;
        
        const newX = Math.round(centerX + dx * scale);
        const newY = Math.round(centerY + dy * scale);
        
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
          const sourceIndex = (newY * width + newX) * 4;
          const targetIndex = pixelIndex * 4;
          
          resultData[targetIndex] = data[sourceIndex];
          resultData[targetIndex + 1] = data[sourceIndex + 1];
          resultData[targetIndex + 2] = data[sourceIndex + 2];
          resultData[targetIndex + 3] = data[sourceIndex + 3];
        } else {
          const targetIndex = pixelIndex * 4;
          resultData[targetIndex] = data[pixelIndex * 4];
          resultData[targetIndex + 1] = data[pixelIndex * 4 + 1];
          resultData[targetIndex + 2] = data[pixelIndex * 4 + 2];
          resultData[targetIndex + 3] = data[pixelIndex * 4 + 3];
        }
      } else {
        const targetIndex = pixelIndex * 4;
        resultData[targetIndex] = data[pixelIndex * 4];
        resultData[targetIndex + 1] = data[pixelIndex * 4 + 1];
        resultData[targetIndex + 2] = data[pixelIndex * 4 + 2];
        resultData[targetIndex + 3] = data[pixelIndex * 4 + 3];
      }
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 桶形畸变算法
 * @param {ImageData} imageData 
 * @param {number} distortion 畸变强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function barrelDistortionAlgorithm(imageData, distortion = 0.3, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const dx = (x - centerX) / centerX;
      const dy = (y - centerY) / centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const distortedDistance = distance * (1 + distortion * distance * distance);
      const scale = distance === 0 ? 1 : distortedDistance / distance;
      
      const newX = Math.round(centerX + dx * centerX * scale);
      const newY = Math.round(centerY + dy * centerY * scale);
      
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const sourceIndex = (newY * width + newX) * 4;
        const targetIndex = pixelIndex * 4;
        
        resultData[targetIndex] = data[sourceIndex];
        resultData[targetIndex + 1] = data[sourceIndex + 1];
        resultData[targetIndex + 2] = data[sourceIndex + 2];
        resultData[targetIndex + 3] = data[sourceIndex + 3];
      } else {
        const targetIndex = pixelIndex * 4;
        resultData[targetIndex] = 0;
        resultData[targetIndex + 1] = 0;
        resultData[targetIndex + 2] = 0;
        resultData[targetIndex + 3] = 255;
      }
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 波浪变形算法
 * @param {ImageData} imageData 
 * @param {number} amplitude 振幅
 * @param {number} frequency 频率
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function waveDistortionAlgorithm(imageData, amplitude = 20, frequency = 0.02, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const waveX = Math.sin(y * frequency) * amplitude;
      const waveY = Math.sin(x * frequency) * amplitude;
      
      const newX = Math.round(x + waveX);
      const newY = Math.round(y + waveY);
      
      if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
        const sourceIndex = (newY * width + newX) * 4;
        const targetIndex = pixelIndex * 4;
        
        resultData[targetIndex] = data[sourceIndex];
        resultData[targetIndex + 1] = data[sourceIndex + 1];
        resultData[targetIndex + 2] = data[sourceIndex + 2];
        resultData[targetIndex + 3] = data[sourceIndex + 3];
      } else {
        const targetIndex = pixelIndex * 4;
        resultData[targetIndex] = data[pixelIndex * 4];
        resultData[targetIndex + 1] = data[pixelIndex * 4 + 1];
        resultData[targetIndex + 2] = data[pixelIndex * 4 + 2];
        resultData[targetIndex + 3] = data[pixelIndex * 4 + 3];
      }
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 漩涡效果算法
 * @param {ImageData} imageData 
 * @param {number} strength 强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function swirlAlgorithm(imageData, strength = 1, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(centerX, centerY);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxRadius) {
        const angle = Math.atan2(dy, dx);
        const swirlAngle = angle + (maxRadius - distance) / maxRadius * strength;
        
        const newX = Math.round(centerX + distance * Math.cos(swirlAngle));
        const newY = Math.round(centerY + distance * Math.sin(swirlAngle));
        
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
          const sourceIndex = (newY * width + newX) * 4;
          const targetIndex = pixelIndex * 4;
          
          resultData[targetIndex] = data[sourceIndex];
          resultData[targetIndex + 1] = data[sourceIndex + 1];
          resultData[targetIndex + 2] = data[sourceIndex + 2];
          resultData[targetIndex + 3] = data[sourceIndex + 3];
        } else {
          const targetIndex = pixelIndex * 4;
          resultData[targetIndex] = data[pixelIndex * 4];
          resultData[targetIndex + 1] = data[pixelIndex * 4 + 1];
          resultData[targetIndex + 2] = data[pixelIndex * 4 + 2];
          resultData[targetIndex + 3] = data[pixelIndex * 4 + 3];
        }
      } else {
        const targetIndex = pixelIndex * 4;
        resultData[targetIndex] = data[pixelIndex * 4];
        resultData[targetIndex + 1] = data[pixelIndex * 4 + 1];
        resultData[targetIndex + 2] = data[pixelIndex * 4 + 2];
        resultData[targetIndex + 3] = data[pixelIndex * 4 + 3];
      }
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}


// ==================== 纹理特效类算法 ====================

/**
 * 浮雕增强算法（与原有浮雕效果不同的增强版）
 * @param {ImageData} imageData 
 * @param {number} depth 深度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function embossEnhancedAlgorithm(imageData, depth = 2, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // 增强浮雕卷积核
  const kernel = [
    [-2 * depth, -1 * depth, 0],
    [-1 * depth, 1, 1 * depth],
    [0, 1 * depth, 2 * depth]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      let r = 0, g = 0, b = 0;
      
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          const weight = kernel[dy + 1][dx + 1];
          
          r += data[index] * weight;
          g += data[index + 1] * weight;
          b += data[index + 2] * weight;
        }
      }
      
      const resultIndex = pixelIndex * 4;
      resultData[resultIndex] = Math.max(0, Math.min(255, r + 128));
      resultData[resultIndex + 1] = Math.max(0, Math.min(255, g + 128));
      resultData[resultIndex + 2] = Math.max(0, Math.min(255, b + 128));
      resultData[resultIndex + 3] = data[resultIndex + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 金属质感算法
 * @param {ImageData} imageData 
 * @param {number} metallic 金属感强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function metallicAlgorithm(imageData, metallic = 0.8, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    
    // 计算金属反射效果
    const reflection = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 50;
    
    let r = data[i] + reflection;
    let g = data[i + 1] + reflection;
    let b = data[i + 2] + reflection;
    
    // 增加对比度和饱和度
    r = ((r / 255 - 0.5) * 1.5 + 0.5) * 255;
    g = ((g / 255 - 0.5) * 1.5 + 0.5) * 255;
    b = ((b / 255 - 0.5) * 1.5 + 0.5) * 255;
    
    // 添加金属色调
    r = r * 1.1;
    g = g * 1.05;
    b = b * 0.9;
    
    resultData[i] = Math.max(0, Math.min(255, Math.round(r * metallic + data[i] * (1 - metallic))));
    resultData[i + 1] = Math.max(0, Math.min(255, Math.round(g * metallic + data[i + 1] * (1 - metallic))));
    resultData[i + 2] = Math.max(0, Math.min(255, Math.round(b * metallic + data[i + 2] * (1 - metallic))));
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 玻璃效果算法
 * @param {ImageData} imageData 
 * @param {number} distortion 扭曲强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function glassAlgorithm(imageData, distortion = 10, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels;
      
      // 生成随机扭曲
      const offsetX = Math.round((Math.random() - 0.5) * distortion);
      const offsetY = Math.round((Math.random() - 0.5) * distortion);
      
      const newX = Math.max(0, Math.min(width - 1, x + offsetX));
      const newY = Math.max(0, Math.min(height - 1, y + offsetY));
      
      const sourceIndex = (newY * width + newX) * 4;
      const targetIndex = pixelIndex * 4;
      
      // 添加轻微的蓝色调
      resultData[targetIndex] = Math.round(data[sourceIndex] * 0.95);
      resultData[targetIndex + 1] = Math.round(data[sourceIndex + 1] * 0.98);
      resultData[targetIndex + 2] = Math.round(data[sourceIndex + 2] * 1.05);
      resultData[targetIndex + 3] = data[sourceIndex + 3];
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 霓虹发光算法
 * @param {ImageData} imageData 
 * @param {number} glowIntensity 发光强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function neonGlowAlgorithm(imageData, glowIntensity = 1.5, onProgress = () => {}) {
  // 先进行边缘检测
  const edgeData = await sobelEdgeAlgorithm(imageData, 100, (progress) => {
    onProgress(progress * 0.5, 0, null);
  });
  
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const edge = edgeData.data;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.5 + (pixelIndex / totalPixels) * 0.5;
    
    const edgeValue = edge[i];
    
    if (edgeValue > 128) {
      // 边缘像素添加霓虹效果
      const [h, s, v] = rgbToHsv(data[i], data[i + 1], data[i + 2]);
      const newS = Math.min(1, s * 1.5);
      const newV = Math.min(1, v * glowIntensity);
      const [r, g, b] = hsvToRgb(h, newS, newV);
      
      resultData[i] = r;
      resultData[i + 1] = g;
      resultData[i + 2] = b;
    } else {
      // 非边缘像素稍微变暗
      resultData[i] = Math.round(data[i] * 0.7);
      resultData[i + 1] = Math.round(data[i + 1] * 0.7);
      resultData[i + 2] = Math.round(data[i + 2] * 0.7);
    }
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 阴影投射算法
 * @param {ImageData} imageData 
 * @param {number} shadowOffset 阴影偏移
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function dropShadowAlgorithm(imageData, shadowOffset = 5, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  // 先创建阴影层
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = y * width + x;
      const progress = pixelIndex / totalPixels * 0.5;
      
      const shadowX = x - shadowOffset;
      const shadowY = y - shadowOffset;
      
      if (shadowX >= 0 && shadowX < width && shadowY >= 0 && shadowY < height) {
        const shadowIndex = (shadowY * width + shadowX) * 4;
        const targetIndex = pixelIndex * 4;
        
        // 如果原像素不透明，在当前位置创建阴影
        if (data[shadowIndex + 3] > 128) {
          resultData[targetIndex] = Math.round(resultData[targetIndex] * 0.5);
          resultData[targetIndex + 1] = Math.round(resultData[targetIndex + 1] * 0.5);
          resultData[targetIndex + 2] = Math.round(resultData[targetIndex + 2] * 0.5);
        }
      }
      
      if (pixelIndex % 1000 === 0) {
        onProgress(progress, pixelIndex, result);
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  }
  
  // 再叠加原图像
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = 0.5 + (pixelIndex / totalPixels) * 0.5;
    
    if (data[i + 3] > 128) {
      resultData[i] = data[i];
      resultData[i + 1] = data[i + 1];
      resultData[i + 2] = data[i + 2];
      resultData[i + 3] = data[i + 3];
    }
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

/**
 * 纹理叠加算法
 * @param {ImageData} imageData 
 * @param {number} textureIntensity 纹理强度
 * @param {Function} onProgress 
 * @returns {Promise<ImageData>}
 */
export async function textureOverlayAlgorithm(imageData, textureIntensity = 0.5, onProgress = () => {}) {
  const result = cloneImageData(imageData);
  const { width, height, data } = imageData;
  const resultData = result.data;
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const progress = pixelIndex / totalPixels;
    
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    
    // 生成纹理图案
    const texture1 = Math.sin(x * 0.1) * Math.sin(y * 0.1) * 50;
    const texture2 = Math.cos(x * 0.05) * Math.cos(y * 0.05) * 30;
    const texture = (texture1 + texture2) * textureIntensity;
    
    resultData[i] = Math.max(0, Math.min(255, data[i] + texture));
    resultData[i + 1] = Math.max(0, Math.min(255, data[i + 1] + texture));
    resultData[i + 2] = Math.max(0, Math.min(255, data[i + 2] + texture));
    resultData[i + 3] = data[i + 3];
    
    if (pixelIndex % 1000 === 0) {
      onProgress(progress, pixelIndex, result);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }
  
  onProgress(1, totalPixels, result);
  return result;
}

// ==================== 更新算法映射 ====================

/**
 * 获取算法函数（更新版，包含所有50个算法）
 * @param {string} algorithmId 
 * @returns {Function}
 */
export function getAlgorithmFunction(algorithmId) {
  const algorithms = {
    // 原有8个算法
    grayscale: grayscaleAlgorithm,
    invert: invertAlgorithm,
    brightness: brightnessAlgorithm,
    contrast: contrastAlgorithm,
    blur: blurAlgorithm,
    edge: edgeDetectionAlgorithm,
    sharpen: sharpenAlgorithm,
    emboss: embossAlgorithm,
    
    // 基础滤镜类 (8个)
    gaussianBlur: gaussianBlurAlgorithm,
    motionBlur: motionBlurAlgorithm,
    radialBlur: radialBlurAlgorithm,
    medianFilter: medianFilterAlgorithm,
    bilateralFilter: bilateralFilterAlgorithm,
    laplacianSharpen: laplacianSharpenAlgorithm,
    unsharpMask: unsharpMaskAlgorithm,
    sobelEdge: sobelEdgeAlgorithm,
    
    // 艺术效果类 (10个)
    oilPainting: oilPaintingAlgorithm,
    watercolor: watercolorAlgorithm,
    pencilSketch: pencilSketchAlgorithm,
    cartoon: cartoonAlgorithm,
    mosaic: mosaicAlgorithm,
    pointillism: pointillismAlgorithm,
    crayon: crayonAlgorithm,
    charcoal: charcoalAlgorithm,
    woodcut: woodcutAlgorithm,
    abstractArt: abstractArtAlgorithm,
    
    // 颜色处理类 (6个)
    hueShift: hueShiftAlgorithm,
    saturationEnhance: saturationEnhanceAlgorithm,
    colorBalance: colorBalanceAlgorithm,
    selectiveColor: selectiveColorAlgorithm,
    complementaryColor: complementaryColorAlgorithm,
    colorQuantization: colorQuantizationAlgorithm,
    
    // 复古风格化类 (5个)
    vintageFilm: vintageFilmAlgorithm,
    faded: fadedAlgorithm,
    vignette: vignetteAlgorithm,
    filmGrain: filmGrainAlgorithm,
    highContrastBW: highContrastBWAlgorithm,
    
    // 几何变换类 (6个)
    rotation: rotationAlgorithm,
    perspective: perspectiveAlgorithm,
    fisheye: fisheyeAlgorithm,
    barrelDistortion: barrelDistortionAlgorithm,
    waveDistortion: waveDistortionAlgorithm,
    swirl: swirlAlgorithm,
    
    // 纹理特效类 (6个)
    embossEnhanced: embossEnhancedAlgorithm,
    metallic: metallicAlgorithm,
    glass: glassAlgorithm,
    neonGlow: neonGlowAlgorithm,
    dropShadow: dropShadowAlgorithm,
    textureOverlay: textureOverlayAlgorithm
  };
  
  return algorithms[algorithmId];
}

/**
 * 获取所有算法列表
 * @returns {Array}
 */
export function getAllAlgorithms() {
  return [
    // 原有算法
    { id: 'grayscale', name: '灰度化', category: 'basic' },
    { id: 'invert', name: '反色', category: 'basic' },
    { id: 'brightness', name: '亮度调整', category: 'basic' },
    { id: 'contrast', name: '对比度调整', category: 'basic' },
    { id: 'blur', name: '模糊', category: 'basic' },
    { id: 'edge', name: '边缘检测', category: 'basic' },
    { id: 'sharpen', name: '锐化', category: 'basic' },
    { id: 'emboss', name: '浮雕效果', category: 'basic' },
    
    // 基础滤镜类
    { id: 'gaussianBlur', name: '高斯模糊', category: 'filter' },
    { id: 'motionBlur', name: '运动模糊', category: 'filter' },
    { id: 'radialBlur', name: '径向模糊', category: 'filter' },
    { id: 'medianFilter', name: '中值滤波', category: 'filter' },
    { id: 'bilateralFilter', name: '双边滤波', category: 'filter' },
    { id: 'laplacianSharpen', name: '拉普拉斯锐化', category: 'filter' },
    { id: 'unsharpMask', name: '非锐化掩模', category: 'filter' },
    { id: 'sobelEdge', name: 'Sobel边缘检测', category: 'filter' },
    
    // 艺术效果类
    { id: 'oilPainting', name: '油画效果', category: 'artistic' },
    { id: 'watercolor', name: '水彩效果', category: 'artistic' },
    { id: 'pencilSketch', name: '铅笔素描', category: 'artistic' },
    { id: 'cartoon', name: '卡通化', category: 'artistic' },
    { id: 'mosaic', name: '马赛克', category: 'artistic' },
    { id: 'pointillism', name: '点彩画', category: 'artistic' },
    { id: 'crayon', name: '蜡笔效果', category: 'artistic' },
    { id: 'charcoal', name: '炭笔效果', category: 'artistic' },
    { id: 'woodcut', name: '版画效果', category: 'artistic' },
    { id: 'abstractArt', name: '抽象艺术', category: 'artistic' },
    
    // 颜色处理类
    { id: 'hueShift', name: '色相偏移', category: 'color' },
    { id: 'saturationEnhance', name: '饱和度增强', category: 'color' },
    { id: 'colorBalance', name: '色彩平衡', category: 'color' },
    { id: 'selectiveColor', name: '单色保留', category: 'color' },
    { id: 'complementaryColor', name: '互补色', category: 'color' },
    { id: 'colorQuantization', name: '色彩量化', category: 'color' },
    
    // 复古风格化类
    { id: 'vintageFilm', name: '复古胶片', category: 'vintage' },
    { id: 'faded', name: '褪色效果', category: 'vintage' },
    { id: 'vignette', name: '暗角效果', category: 'vintage' },
    { id: 'filmGrain', name: '颗粒噪点', category: 'vintage' },
    { id: 'highContrastBW', name: '高对比度黑白', category: 'vintage' },
    
    // 几何变换类
    { id: 'rotation', name: '旋转变换', category: 'geometric' },
    { id: 'perspective', name: '透视变换', category: 'geometric' },
    { id: 'fisheye', name: '鱼眼效果', category: 'geometric' },
    { id: 'barrelDistortion', name: '桶形畸变', category: 'geometric' },
    { id: 'waveDistortion', name: '波浪变形', category: 'geometric' },
    { id: 'swirl', name: '漩涡效果', category: 'geometric' },
    
    // 纹理特效类
    { id: 'embossEnhanced', name: '浮雕增强', category: 'texture' },
    { id: 'metallic', name: '金属质感', category: 'texture' },
    { id: 'glass', name: '玻璃效果', category: 'texture' },
    { id: 'neonGlow', name: '霓虹发光', category: 'texture' },
    { id: 'dropShadow', name: '阴影投射', category: 'texture' },
    { id: 'textureOverlay', name: '纹理叠加', category: 'texture' }
  ];
}

