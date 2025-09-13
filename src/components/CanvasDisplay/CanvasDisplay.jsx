import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor } from 'lucide-react';
import { getAlgorithmFunction } from '../../utils/imageProcessing';
import { animatePixelProcessing, drawProgressIndicator, createCompletionEffect, drawParticles, updateParticles } from '../../utils/animationHelpers';

const CanvasDisplay = ({ imageData, algorithm, isProcessing, onProcessingComplete, processingParams, onProgressUpdate }) => {
  const canvasRef = useRef(null);
  const originalImageDataRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [completionParticles, setCompletionParticles] = useState([]);

  useEffect(() => {
    if (imageData && canvasRef.current) {
      loadImageToCanvas();
    }
  }, [imageData]);

  useEffect(() => {
    if (algorithm && imageData && isProcessing && processingParams) {
      startProcessing();
    }
  }, [algorithm, isProcessing, processingParams]);

  useEffect(() => {
    if (completionParticles.length > 0) {
      animateCompletionEffect();
    }
  }, [completionParticles]);

  const loadImageToCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 计算适合容器的尺寸
      const maxWidth = 600;
      const maxHeight = 400;
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      setCanvasSize({ width, height });
      
      // 清除画布并绘制图像
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // 保存原始图像数据
      originalImageDataRef.current = ctx.getImageData(0, 0, width, height);
    };
    
    img.src = imageData;
  };

  const startProcessing = async () => {
    if (!originalImageDataRef.current || !algorithm) return;

    const canvas = canvasRef.current;
    const algorithmFunction = getAlgorithmFunction(algorithm);
    
    if (!algorithmFunction) {
      console.error('Unknown algorithm:', algorithm);
      onProcessingComplete();
      return;
    }

    setProcessingProgress(0);
    
    try {
      // 根据算法类型准备参数
      let algorithmParams = [];
      
      // 原有算法参数
      if (algorithm === 'brightness') {
        algorithmParams = [processingParams.brightness || 0];
      } else if (algorithm === 'contrast') {
        algorithmParams = [processingParams.contrast || 0];
      } else if (algorithm === 'blur') {
        algorithmParams = [processingParams.blurRadius || 1];
      } else if (algorithm === 'edge') {
        algorithmParams = [processingParams.threshold || 128];
      }
      
      // 基础滤镜类参数
      else if (algorithm === 'gaussianBlur') {
        algorithmParams = [processingParams.radius || 2];
      } else if (algorithm === 'motionBlur') {
        algorithmParams = [processingParams.distance || 10, processingParams.angle || 0];
      } else if (algorithm === 'radialBlur') {
        algorithmParams = [processingParams.strength || 10];
      } else if (algorithm === 'medianFilter') {
        algorithmParams = [processingParams.radius || 1];
      } else if (algorithm === 'bilateralFilter') {
        algorithmParams = [processingParams.spatialSigma || 10, processingParams.intensitySigma || 20];
      } else if (algorithm === 'laplacianSharpen') {
        algorithmParams = [processingParams.strength || 1];
      } else if (algorithm === 'unsharpMask') {
        algorithmParams = [processingParams.amount || 1.5, processingParams.radius || 1];
      } else if (algorithm === 'sobelEdge') {
        algorithmParams = [processingParams.threshold || 128];
      }
      
      // 艺术效果类参数
      else if (algorithm === 'oilPainting') {
        algorithmParams = [processingParams.brushSize || 4];
      } else if (algorithm === 'watercolor') {
        algorithmParams = [processingParams.intensity || 0.8];
      } else if (algorithm === 'pencilSketch') {
        algorithmParams = [processingParams.intensity || 0.8];
      } else if (algorithm === 'cartoon') {
        algorithmParams = [processingParams.levels || 8];
      } else if (algorithm === 'mosaic') {
        algorithmParams = [processingParams.blockSize || 10];
      } else if (algorithm === 'pointillism') {
        algorithmParams = [processingParams.dotSize || 6];
      } else if (algorithm === 'crayon') {
        algorithmParams = [processingParams.intensity || 0.7];
      } else if (algorithm === 'charcoal') {
        algorithmParams = [processingParams.intensity || 0.8];
      } else if (algorithm === 'woodcut') {
        algorithmParams = [processingParams.threshold || 128];
      } else if (algorithm === 'abstractArt') {
        algorithmParams = [processingParams.complexity || 5];
      }
      
      // 颜色处理类参数
      else if (algorithm === 'hueShift') {
        algorithmParams = [processingParams.hueShift || 30];
      } else if (algorithm === 'saturationEnhance') {
        algorithmParams = [processingParams.saturation || 1.5];
      } else if (algorithm === 'colorBalance') {
        algorithmParams = [processingParams.temperature || 0];
      } else if (algorithm === 'selectiveColor') {
        algorithmParams = [processingParams.targetHue || 120, processingParams.tolerance || 30];
      }
      
      // 复古风格化类参数
      else if (algorithm === 'vintageFilm') {
        algorithmParams = [processingParams.intensity || 0.8];
      } else if (algorithm === 'faded') {
        algorithmParams = [processingParams.fadeAmount || 0.6];
      } else if (algorithm === 'vignette') {
        algorithmParams = [processingParams.intensity || 0.8];
      } else if (algorithm === 'filmGrain') {
        algorithmParams = [processingParams.amount || 0.3];
      } else if (algorithm === 'highContrastBW') {
        algorithmParams = [processingParams.contrast || 2];
      }
      
      // 几何变换类参数
      else if (algorithm === 'rotation') {
        algorithmParams = [processingParams.angle || 45];
      } else if (algorithm === 'perspective') {
        algorithmParams = [processingParams.perspective || 0.5];
      } else if (algorithm === 'fisheye') {
        algorithmParams = [processingParams.strength || 0.5];
      } else if (algorithm === 'barrelDistortion') {
        algorithmParams = [processingParams.distortion || 0.3];
      } else if (algorithm === 'waveDistortion') {
        algorithmParams = [processingParams.amplitude || 20, processingParams.frequency || 0.02];
      } else if (algorithm === 'swirl') {
        algorithmParams = [processingParams.strength || 1];
      }
      
      // 纹理特效类参数
      else if (algorithm === 'embossEnhanced') {
        algorithmParams = [processingParams.depth || 2];
      } else if (algorithm === 'metallic') {
        algorithmParams = [processingParams.metallic || 0.8];
      } else if (algorithm === 'glass') {
        algorithmParams = [processingParams.distortion || 10];
      } else if (algorithm === 'neonGlow') {
        algorithmParams = [processingParams.glowIntensity || 1.5];
      } else if (algorithm === 'dropShadow') {
        algorithmParams = [processingParams.shadowOffset || 5];
      } else if (algorithm === 'textureOverlay') {
        algorithmParams = [processingParams.textureIntensity || 0.5];
      }

      // 执行算法并显示动画
      const result = await algorithmFunction(
        originalImageDataRef.current,
        ...algorithmParams,
        (progress, pixelIndex, currentImageData) => {
          setProcessingProgress(progress);
          if (onProgressUpdate) {
            onProgressUpdate(progress);
          }
          
          // 根据动画速度调整更新频率
          const speedFactor = (processingParams.speed || 50) / 50;
          if (pixelIndex % Math.max(1, Math.floor(2000 / speedFactor)) === 0) {
            animatePixelProcessing(canvas, pixelIndex, originalImageDataRef.current.width * originalImageDataRef.current.height, currentImageData);
          }
        }
      );

      // 显示最终结果
      const ctx = canvas.getContext('2d');
      ctx.putImageData(result, 0, 0);
      
      // 创建完成效果
      const particles = createCompletionEffect(canvas);
      setCompletionParticles(particles);
      
      setProcessingProgress(1);
      onProcessingComplete();
      
    } catch (error) {
      console.error('Processing error:', error);
      onProcessingComplete();
    }
  };

  const animateCompletionEffect = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = () => {
      setCompletionParticles(prevParticles => {
        const updatedParticles = updateParticles(prevParticles);
        
        if (updatedParticles.length > 0) {
          // 重绘画布内容
          const ctx = canvas.getContext('2d');
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);
          
          // 绘制粒子效果
          drawParticles(canvas, updatedParticles);
          
          animationFrameRef.current = requestAnimationFrame(animate);
        }
        
        return updatedParticles;
      });
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const resetToOriginal = () => {
    if (originalImageDataRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.putImageData(originalImageDataRef.current, 0, 0);
      setProcessingProgress(0);
      setCompletionParticles([]);
    }
  };

  // 当算法改变时重置到原始图像
  useEffect(() => {
    if (!isProcessing) {
      resetToOriginal();
    }
  }, [algorithm]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          图像预览
          {isProcessing && (
            <span className="text-sm font-normal text-muted-foreground">
              - 处理中... {Math.round(processingProgress * 100)}%
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center min-h-[300px] bg-muted/20 rounded-lg p-4 relative">
          {imageData ? (
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full border border-border rounded shadow-sm"
              style={{
                width: canvasSize.width,
                height: canvasSize.height
              }}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>请先上传图片</p>
            </div>
          )}
          
          {/* 处理进度指示器 */}
          {isProcessing && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 text-white px-3 py-2 rounded text-sm">
                正在执行 {algorithm} 算法... {Math.round(processingProgress * 100)}%
              </div>
            </div>
          )}
        </div>
        
        {imageData && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            画布尺寸: {canvasSize.width} × {canvasSize.height} 像素
            {processingProgress > 0 && processingProgress < 1 && (
              <span className="ml-4">处理进度: {Math.round(processingProgress * 100)}%</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CanvasDisplay;

