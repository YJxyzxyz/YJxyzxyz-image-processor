import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Zap,
  Clock
} from 'lucide-react';

const ControlPanel = ({ 
  selectedAlgorithm, 
  onStartProcessing, 
  isProcessing,
  onResetImage,
  hasImage 
}) => {
  const [animationSpeed, setAnimationSpeed] = useState([50]);
  const [algorithmParams, setAlgorithmParams] = useState({
    // 原有算法参数
    brightness: [0],
    contrast: [0],
    blurRadius: [1],
    threshold: [128],
    
    // 基础滤镜类参数
    radius: [2],
    distance: [10],
    angle: [0],
    strength: [10],
    spatialSigma: [10],
    intensitySigma: [20],
    amount: [1.5],
    
    // 艺术效果类参数
    brushSize: [4],
    intensity: [0.8],
    levels: [8],
    blockSize: [10],
    dotSize: [6],
    complexity: [5],
    
    // 颜色处理类参数
    hueShift: [30],
    saturation: [1.5],
    temperature: [0],
    targetHue: [120],
    tolerance: [30],
    
    // 复古风格化类参数
    fadeAmount: [0.6],
    
    // 几何变换类参数
    perspective: [0.5],
    distortion: [0.3],
    amplitude: [20],
    frequency: [0.02],
    
    // 纹理特效类参数
    depth: [2],
    metallic: [0.8],
    glowIntensity: [1.5],
    shadowOffset: [5],
    textureIntensity: [0.5]
  });

  const handleParamChange = (paramName, value) => {
    setAlgorithmParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const getAlgorithmParams = () => {
    switch (selectedAlgorithm) {
      // 原有算法参数
      case 'brightness':
        return (
          <div className="space-y-3">
            <Label>亮度调整 ({algorithmParams.brightness[0]})</Label>
            <Slider
              value={algorithmParams.brightness}
              onValueChange={(value) => handleParamChange('brightness', value)}
              min={-100}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'contrast':
        return (
          <div className="space-y-3">
            <Label>对比度调整 ({algorithmParams.contrast[0]})</Label>
            <Slider
              value={algorithmParams.contrast}
              onValueChange={(value) => handleParamChange('contrast', value)}
              min={-100}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'blur':
        return (
          <div className="space-y-3">
            <Label>模糊半径 ({algorithmParams.blurRadius[0]})</Label>
            <Slider
              value={algorithmParams.blurRadius}
              onValueChange={(value) => handleParamChange('blurRadius', value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'edge':
        return (
          <div className="space-y-3">
            <Label>边缘阈值 ({algorithmParams.threshold[0]})</Label>
            <Slider
              value={algorithmParams.threshold}
              onValueChange={(value) => handleParamChange('threshold', value)}
              min={0}
              max={255}
              step={1}
              className="w-full"
            />
          </div>
        );

      // 基础滤镜类参数
      case 'gaussianBlur':
        return (
          <div className="space-y-3">
            <Label>模糊半径 ({algorithmParams.radius[0]})</Label>
            <Slider
              value={algorithmParams.radius}
              onValueChange={(value) => handleParamChange('radius', value)}
              min={1}
              max={10}
              step={0.5}
              className="w-full"
            />
          </div>
        );
      case 'motionBlur':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>模糊距离 ({algorithmParams.distance[0]})</Label>
              <Slider
                value={algorithmParams.distance}
                onValueChange={(value) => handleParamChange('distance', value)}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label>模糊角度 ({algorithmParams.angle[0]}°)</Label>
              <Slider
                value={algorithmParams.angle}
                onValueChange={(value) => handleParamChange('angle', value)}
                min={0}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'radialBlur':
        return (
          <div className="space-y-3">
            <Label>模糊强度 ({algorithmParams.strength[0]})</Label>
            <Slider
              value={algorithmParams.strength}
              onValueChange={(value) => handleParamChange('strength', value)}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'medianFilter':
        return (
          <div className="space-y-3">
            <Label>滤波半径 ({algorithmParams.radius[0]})</Label>
            <Slider
              value={algorithmParams.radius}
              onValueChange={(value) => handleParamChange('radius', value)}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'bilateralFilter':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>空间标准差 ({algorithmParams.spatialSigma[0]})</Label>
              <Slider
                value={algorithmParams.spatialSigma}
                onValueChange={(value) => handleParamChange('spatialSigma', value)}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label>强度标准差 ({algorithmParams.intensitySigma[0]})</Label>
              <Slider
                value={algorithmParams.intensitySigma}
                onValueChange={(value) => handleParamChange('intensitySigma', value)}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'laplacianSharpen':
        return (
          <div className="space-y-3">
            <Label>锐化强度 ({algorithmParams.strength[0]})</Label>
            <Slider
              value={algorithmParams.strength}
              onValueChange={(value) => handleParamChange('strength', value)}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'unsharpMask':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>锐化量 ({algorithmParams.amount[0]})</Label>
              <Slider
                value={algorithmParams.amount}
                onValueChange={(value) => handleParamChange('amount', value)}
                min={0.1}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label>模糊半径 ({algorithmParams.radius[0]})</Label>
              <Slider
                value={algorithmParams.radius}
                onValueChange={(value) => handleParamChange('radius', value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'sobelEdge':
        return (
          <div className="space-y-3">
            <Label>边缘阈值 ({algorithmParams.threshold[0]})</Label>
            <Slider
              value={algorithmParams.threshold}
              onValueChange={(value) => handleParamChange('threshold', value)}
              min={0}
              max={255}
              step={1}
              className="w-full"
            />
          </div>
        );

      // 艺术效果类参数
      case 'oilPainting':
        return (
          <div className="space-y-3">
            <Label>笔刷大小 ({algorithmParams.brushSize[0]})</Label>
            <Slider
              value={algorithmParams.brushSize}
              onValueChange={(value) => handleParamChange('brushSize', value)}
              min={1}
              max={15}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'watercolor':
      case 'pencilSketch':
      case 'crayon':
      case 'charcoal':
      case 'vintageFilm':
      case 'vignette':
        return (
          <div className="space-y-3">
            <Label>效果强度 ({algorithmParams.intensity[0]})</Label>
            <Slider
              value={algorithmParams.intensity}
              onValueChange={(value) => handleParamChange('intensity', value)}
              min={0.1}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'cartoon':
        return (
          <div className="space-y-3">
            <Label>颜色级别 ({algorithmParams.levels[0]})</Label>
            <Slider
              value={algorithmParams.levels}
              onValueChange={(value) => handleParamChange('levels', value)}
              min={2}
              max={32}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'mosaic':
        return (
          <div className="space-y-3">
            <Label>块大小 ({algorithmParams.blockSize[0]})</Label>
            <Slider
              value={algorithmParams.blockSize}
              onValueChange={(value) => handleParamChange('blockSize', value)}
              min={2}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'pointillism':
        return (
          <div className="space-y-3">
            <Label>点大小 ({algorithmParams.dotSize[0]})</Label>
            <Slider
              value={algorithmParams.dotSize}
              onValueChange={(value) => handleParamChange('dotSize', value)}
              min={2}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'woodcut':
        return (
          <div className="space-y-3">
            <Label>二值化阈值 ({algorithmParams.threshold[0]})</Label>
            <Slider
              value={algorithmParams.threshold}
              onValueChange={(value) => handleParamChange('threshold', value)}
              min={0}
              max={255}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'abstractArt':
        return (
          <div className="space-y-3">
            <Label>复杂度 ({algorithmParams.complexity[0]})</Label>
            <Slider
              value={algorithmParams.complexity}
              onValueChange={(value) => handleParamChange('complexity', value)}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        );

      // 颜色处理类参数
      case 'hueShift':
        return (
          <div className="space-y-3">
            <Label>色相偏移 ({algorithmParams.hueShift[0]}°)</Label>
            <Slider
              value={algorithmParams.hueShift}
              onValueChange={(value) => handleParamChange('hueShift', value)}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'saturationEnhance':
        return (
          <div className="space-y-3">
            <Label>饱和度倍数 ({algorithmParams.saturation[0]})</Label>
            <Slider
              value={algorithmParams.saturation}
              onValueChange={(value) => handleParamChange('saturation', value)}
              min={0}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'colorBalance':
        return (
          <div className="space-y-3">
            <Label>色温调整 ({algorithmParams.temperature[0]})</Label>
            <Slider
              value={algorithmParams.temperature}
              onValueChange={(value) => handleParamChange('temperature', value)}
              min={-100}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'selectiveColor':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>目标色相 ({algorithmParams.targetHue[0]}°)</Label>
              <Slider
                value={algorithmParams.targetHue}
                onValueChange={(value) => handleParamChange('targetHue', value)}
                min={0}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label>容差范围 ({algorithmParams.tolerance[0]}°)</Label>
              <Slider
                value={algorithmParams.tolerance}
                onValueChange={(value) => handleParamChange('tolerance', value)}
                min={1}
                max={180}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        );

      // 复古风格化类参数
      case 'faded':
        return (
          <div className="space-y-3">
            <Label>褪色程度 ({algorithmParams.fadeAmount[0]})</Label>
            <Slider
              value={algorithmParams.fadeAmount}
              onValueChange={(value) => handleParamChange('fadeAmount', value)}
              min={0.1}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'filmGrain':
        return (
          <div className="space-y-3">
            <Label>噪点数量 ({algorithmParams.amount[0]})</Label>
            <Slider
              value={algorithmParams.amount}
              onValueChange={(value) => handleParamChange('amount', value)}
              min={0.1}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'highContrastBW':
        return (
          <div className="space-y-3">
            <Label>对比度 ({algorithmParams.contrast[0]})</Label>
            <Slider
              value={algorithmParams.contrast}
              onValueChange={(value) => handleParamChange('contrast', value)}
              min={1}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>
        );

      // 几何变换类参数
      case 'rotation':
        return (
          <div className="space-y-3">
            <Label>旋转角度 ({algorithmParams.angle[0]}°)</Label>
            <Slider
              value={algorithmParams.angle}
              onValueChange={(value) => handleParamChange('angle', value)}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'perspective':
        return (
          <div className="space-y-3">
            <Label>透视强度 ({algorithmParams.perspective[0]})</Label>
            <Slider
              value={algorithmParams.perspective}
              onValueChange={(value) => handleParamChange('perspective', value)}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'fisheye':
        return (
          <div className="space-y-3">
            <Label>鱼眼强度 ({algorithmParams.strength[0]})</Label>
            <Slider
              value={algorithmParams.strength}
              onValueChange={(value) => handleParamChange('strength', value)}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'barrelDistortion':
        return (
          <div className="space-y-3">
            <Label>畸变强度 ({algorithmParams.distortion[0]})</Label>
            <Slider
              value={algorithmParams.distortion}
              onValueChange={(value) => handleParamChange('distortion', value)}
              min={-1}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'waveDistortion':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>波浪振幅 ({algorithmParams.amplitude[0]})</Label>
              <Slider
                value={algorithmParams.amplitude}
                onValueChange={(value) => handleParamChange('amplitude', value)}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label>波浪频率 ({algorithmParams.frequency[0]})</Label>
              <Slider
                value={algorithmParams.frequency}
                onValueChange={(value) => handleParamChange('frequency', value)}
                min={0.001}
                max={0.1}
                step={0.001}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'swirl':
        return (
          <div className="space-y-3">
            <Label>漩涡强度 ({algorithmParams.strength[0]})</Label>
            <Slider
              value={algorithmParams.strength}
              onValueChange={(value) => handleParamChange('strength', value)}
              min={0}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>
        );

      // 纹理特效类参数
      case 'embossEnhanced':
        return (
          <div className="space-y-3">
            <Label>浮雕深度 ({algorithmParams.depth[0]})</Label>
            <Slider
              value={algorithmParams.depth}
              onValueChange={(value) => handleParamChange('depth', value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'metallic':
        return (
          <div className="space-y-3">
            <Label>金属感强度 ({algorithmParams.metallic[0]})</Label>
            <Slider
              value={algorithmParams.metallic}
              onValueChange={(value) => handleParamChange('metallic', value)}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'glass':
        return (
          <div className="space-y-3">
            <Label>扭曲强度 ({algorithmParams.distortion[0]})</Label>
            <Slider
              value={algorithmParams.distortion}
              onValueChange={(value) => handleParamChange('distortion', value)}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'neonGlow':
        return (
          <div className="space-y-3">
            <Label>发光强度 ({algorithmParams.glowIntensity[0]})</Label>
            <Slider
              value={algorithmParams.glowIntensity}
              onValueChange={(value) => handleParamChange('glowIntensity', value)}
              min={0.5}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>
        );
      case 'dropShadow':
        return (
          <div className="space-y-3">
            <Label>阴影偏移 ({algorithmParams.shadowOffset[0]})</Label>
            <Slider
              value={algorithmParams.shadowOffset}
              onValueChange={(value) => handleParamChange('shadowOffset', value)}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
          </div>
        );
      case 'textureOverlay':
        return (
          <div className="space-y-3">
            <Label>纹理强度 ({algorithmParams.textureIntensity[0]})</Label>
            <Slider
              value={algorithmParams.textureIntensity}
              onValueChange={(value) => handleParamChange('textureIntensity', value)}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const handleStartProcessing = () => {
    const params = {
      speed: animationSpeed[0],
      // 原有算法参数
      brightness: algorithmParams.brightness[0],
      contrast: algorithmParams.contrast[0],
      blurRadius: algorithmParams.blurRadius[0],
      threshold: algorithmParams.threshold[0],
      
      // 基础滤镜类参数
      radius: algorithmParams.radius[0],
      distance: algorithmParams.distance[0],
      angle: algorithmParams.angle[0],
      strength: algorithmParams.strength[0],
      spatialSigma: algorithmParams.spatialSigma[0],
      intensitySigma: algorithmParams.intensitySigma[0],
      amount: algorithmParams.amount[0],
      
      // 艺术效果类参数
      brushSize: algorithmParams.brushSize[0],
      intensity: algorithmParams.intensity[0],
      levels: algorithmParams.levels[0],
      blockSize: algorithmParams.blockSize[0],
      dotSize: algorithmParams.dotSize[0],
      complexity: algorithmParams.complexity[0],
      
      // 颜色处理类参数
      hueShift: algorithmParams.hueShift[0],
      saturation: algorithmParams.saturation[0],
      temperature: algorithmParams.temperature[0],
      targetHue: algorithmParams.targetHue[0],
      tolerance: algorithmParams.tolerance[0],
      
      // 复古风格化类参数
      fadeAmount: algorithmParams.fadeAmount[0],
      
      // 几何变换类参数
      perspective: algorithmParams.perspective[0],
      distortion: algorithmParams.distortion[0],
      amplitude: algorithmParams.amplitude[0],
      frequency: algorithmParams.frequency[0],
      
      // 纹理特效类参数
      depth: algorithmParams.depth[0],
      metallic: algorithmParams.metallic[0],
      glowIntensity: algorithmParams.glowIntensity[0],
      shadowOffset: algorithmParams.shadowOffset[0],
      textureIntensity: algorithmParams.textureIntensity[0]
    };
    
    onStartProcessing(params);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          处理控制
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 动画速度控制 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <Label>动画速度 ({animationSpeed[0]}%)</Label>
          </div>
          <Slider
            value={animationSpeed}
            onValueChange={setAnimationSpeed}
            min={10}
            max={200}
            step={10}
            className="w-full"
          />
        </div>

        {/* 算法参数 */}
        {selectedAlgorithm && getAlgorithmParams() && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <Label>算法参数</Label>
            </div>
            {getAlgorithmParams()}
          </div>
        )}

        {/* 控制按钮 */}
        <div className="flex gap-3">
          <Button
            onClick={handleStartProcessing}
            disabled={!selectedAlgorithm || !hasImage || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                处理中...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                开始处理
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onResetImage}
            disabled={!hasImage || isProcessing}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

