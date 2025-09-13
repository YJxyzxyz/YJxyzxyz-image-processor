import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Palette, 
  RotateCcw, 
  Sun, 
  Contrast, 
  Focus, 
  Zap,
  Eye,
  Sparkles,
  Filter,
  Brush,
  Droplets,
  Scissors,
  Camera,
  Layers,
  RotateCw,
  Move3D,
  Waves,
  Gem,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getAllAlgorithms } from '@/utils/imageProcessing';

// 图标映射
const iconMap = {
  // 基础处理
  grayscale: Palette,
  invert: RotateCcw,
  brightness: Sun,
  contrast: Contrast,
  blur: Focus,
  edge: Zap,
  sharpen: Eye,
  emboss: Sparkles,
  
  // 基础滤镜类
  gaussianBlur: Focus,
  motionBlur: Move3D,
  radialBlur: RotateCw,
  medianFilter: Filter,
  bilateralFilter: Layers,
  laplacianSharpen: Eye,
  unsharpMask: Focus,
  sobelEdge: Zap,
  
  // 艺术效果类
  oilPainting: Brush,
  watercolor: Droplets,
  pencilSketch: Scissors,
  cartoon: Sparkles,
  mosaic: Layers,
  pointillism: Brush,
  crayon: Brush,
  charcoal: Scissors,
  woodcut: Layers,
  abstractArt: Sparkles,
  
  // 颜色处理类
  hueShift: Palette,
  saturationEnhance: Sun,
  colorBalance: Contrast,
  selectiveColor: Filter,
  complementaryColor: RotateCcw,
  colorQuantization: Layers,
  
  // 复古风格化类
  vintageFilm: Camera,
  faded: Sun,
  vignette: Focus,
  filmGrain: Filter,
  highContrastBW: Contrast,
  
  // 几何变换类
  rotation: RotateCw,
  perspective: Move3D,
  fisheye: Focus,
  barrelDistortion: Waves,
  waveDistortion: Waves,
  swirl: RotateCw,
  
  // 纹理特效类
  embossEnhanced: Gem,
  metallic: Gem,
  glass: Layers,
  neonGlow: Zap,
  dropShadow: Layers,
  textureOverlay: Filter
};

// 分类映射
const categoryMap = {
  basic: '基础处理',
  filter: '基础滤镜',
  artistic: '艺术效果',
  color: '颜色处理',
  vintage: '复古风格',
  geometric: '几何变换',
  texture: '纹理特效'
};

// 算法描述
const algorithmDescriptions = {
  // 原有算法
  grayscale: '将彩色图像转换为灰度图像',
  invert: '反转图像的颜色',
  brightness: '调整图像的亮度',
  contrast: '调整图像的对比度',
  blur: '对图像应用模糊效果',
  edge: '检测图像中的边缘',
  sharpen: '增强图像的清晰度',
  emboss: '创建浮雕风格的图像',
  
  // 基础滤镜类
  gaussianBlur: '使用高斯函数的平滑模糊效果',
  motionBlur: '模拟运动产生的方向性模糊',
  radialBlur: '从中心向外的径向模糊效果',
  medianFilter: '去除椒盐噪声的中值滤波',
  bilateralFilter: '保持边缘的双边滤波去噪',
  laplacianSharpen: '使用拉普拉斯算子的边缘增强',
  unsharpMask: '通过非锐化掩模增强细节',
  sobelEdge: '使用Sobel算子的梯度边缘检测',
  
  // 艺术效果类
  oilPainting: '模拟油画笔触的艺术效果',
  watercolor: '创建水彩画风格的柔和效果',
  pencilSketch: '生成铅笔素描线条效果',
  cartoon: '将图像转换为动漫风格',
  mosaic: '创建像素化的马赛克效果',
  pointillism: '模拟点彩画的绘画风格',
  crayon: '创建蜡笔绘画的纹理效果',
  charcoal: '生成炭笔素描的艺术风格',
  woodcut: '模拟木刻版画的效果',
  abstractArt: '创建抽象艺术风格的图像',
  
  // 颜色处理类
  hueShift: '调整图像的整体色调',
  saturationEnhance: '增强颜色的鲜艳度',
  colorBalance: '调整冷暖色调平衡',
  selectiveColor: '保留特定颜色，其他转为灰度',
  complementaryColor: '转换为互补色调',
  colorQuantization: '减少图像的颜色数量',
  
  // 复古风格化类
  vintageFilm: '模拟老胶片的复古效果',
  faded: '创建年代感的褪色处理',
  vignette: '添加四周变暗的暗角效果',
  filmGrain: '增加胶片颗粒感',
  highContrastBW: '高对比度的戏剧性黑白效果',
  
  // 几何变换类
  rotation: '旋转图像到指定角度',
  perspective: '创建3D透视变换效果',
  fisheye: '模拟鱼眼镜头的球面投影',
  barrelDistortion: '创建镜头桶形畸变效果',
  waveDistortion: '应用波浪形的图像扭曲',
  swirl: '创建螺旋漩涡扭曲效果',
  
  // 纹理特效类
  embossEnhanced: '增强版的立体浮雕效果',
  metallic: '添加金属光泽质感',
  glass: '创建透明玻璃质感效果',
  neonGlow: '生成霓虹灯发光边缘',
  dropShadow: '为图像添加立体阴影',
  textureOverlay: '叠加纹理图案效果'
};

const AlgorithmSelector = ({ selectedAlgorithm, onAlgorithmSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());
  
  const allAlgorithms = getAllAlgorithms();
  
  // 过滤算法
  const filteredAlgorithms = allAlgorithms.filter(alg => 
    alg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    algorithmDescriptions[alg.id]?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 按分类分组
  const groupedAlgorithms = filteredAlgorithms.reduce((groups, alg) => {
    const category = categoryMap[alg.category] || alg.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(alg);
    return groups;
  }, {});
  
  const toggleCategory = (category) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          选择图像处理算法
          <Badge variant="secondary" className="ml-auto">
            {allAlgorithms.length} 个算法
          </Badge>
        </CardTitle>
        
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索算法..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(groupedAlgorithms).map(([category, algorithms]) => {
          const isCollapsed = collapsedCategories.has(category);
          
          return (
            <div key={category} className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between p-2 h-auto"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {category}
                  </h3>
                  <Badge variant="outline" size="sm">
                    {algorithms.length}
                  </Badge>
                </div>
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
              
              {!isCollapsed && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                  {algorithms.map(algorithm => {
                    const Icon = iconMap[algorithm.id] || Sparkles;
                    const isSelected = selectedAlgorithm === algorithm.id;
                    
                    return (
                      <Button
                        key={algorithm.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className={`h-auto p-3 justify-start text-left ${
                          isSelected ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => onAlgorithmSelect(algorithm.id)}
                      >
                        <div className="flex items-start gap-2 w-full">
                          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{algorithm.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {algorithmDescriptions[algorithm.id]}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        
        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>未找到匹配的算法</p>
            <p className="text-xs mt-1">尝试使用不同的关键词搜索</p>
          </div>
        )}
        
        {selectedAlgorithm && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">已选择</Badge>
              <span className="text-sm font-medium">
                {allAlgorithms.find(alg => alg.id === selectedAlgorithm)?.name}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlgorithmSelector;

