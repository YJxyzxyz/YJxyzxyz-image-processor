import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Clock, 
  Cpu, 
  Zap,
  BookOpen
} from 'lucide-react';

const AlgorithmInfo = ({ algorithm }) => {
  const algorithmDetails = {
    // 原有8个算法
    grayscale: {
      name: '灰度化',
      description: '将彩色图像转换为灰度图像，使用加权平均法计算每个像素的灰度值',
      complexity: 'O(n)',
      formula: 'Gray = 0.299×R + 0.587×G + 0.114×B',
      applications: ['图像预处理', '边缘检测准备', '降低计算复杂度'],
      difficulty: '简单',
      category: '基础处理'
    },
    invert: {
      name: '反色',
      description: '反转图像的颜色，将每个像素的RGB值替换为其补色',
      complexity: 'O(n)',
      formula: 'New = 255 - Original',
      applications: ['艺术效果', '胶片负片效果', '高对比度显示'],
      difficulty: '简单',
      category: '基础处理'
    },
    brightness: {
      name: '亮度调整',
      description: '通过增加或减少像素值来调整图像的整体亮度',
      complexity: 'O(n)',
      formula: 'New = Original + Brightness',
      applications: ['图像增强', '曝光校正', '视觉优化'],
      difficulty: '简单',
      category: '色彩调整'
    },
    contrast: {
      name: '对比度调整',
      description: '调整图像的对比度，增强明暗差异',
      complexity: 'O(n)',
      formula: 'New = Factor × (Original - 128) + 128',
      applications: ['图像增强', '细节突出', '视觉改善'],
      difficulty: '简单',
      category: '色彩调整'
    },
    blur: {
      name: '模糊',
      description: '使用均值滤波器对图像进行模糊处理，减少噪声和细节',
      complexity: 'O(n×k²)',
      formula: 'New = Average(Neighbors)',
      applications: ['噪声减少', '平滑处理', '艺术效果'],
      difficulty: '中等',
      category: '滤镜效果'
    },
    edge: {
      name: '边缘检测',
      description: '使用Sobel算子检测图像中的边缘和轮廓',
      complexity: 'O(n)',
      formula: 'Gradient = √(Gx² + Gy²)',
      applications: ['特征提取', '物体识别', '图像分析'],
      difficulty: '中等',
      category: '高级处理'
    },
    sharpen: {
      name: '锐化',
      description: '增强图像的边缘和细节，使图像看起来更清晰',
      complexity: 'O(n)',
      formula: '卷积核: [0,-1,0; -1,5,-1; 0,-1,0]',
      applications: ['图像增强', '细节突出', '清晰度提升'],
      difficulty: '中等',
      category: '滤镜效果'
    },
    emboss: {
      name: '浮雕效果',
      description: '创建浮雕风格的图像效果，突出边缘和纹理',
      complexity: 'O(n)',
      formula: '卷积核: [-2,-1,0; -1,1,1; 0,1,2]',
      applications: ['艺术效果', '纹理分析', '装饰处理'],
      difficulty: '中等',
      category: '艺术效果'
    },

    // 基础滤镜类 (8个)
    gaussianBlur: {
      name: '高斯模糊',
      description: '使用高斯函数生成的卷积核进行模糊处理，产生自然的平滑效果',
      complexity: 'O(n×k²)',
      formula: 'G(x,y) = (1/2πσ²)e^(-(x²+y²)/2σ²)',
      applications: ['图像平滑', '噪声减少', '预处理'],
      difficulty: '中等',
      category: '基础滤镜'
    },
    motionBlur: {
      name: '运动模糊',
      description: '模拟相机或物体运动产生的方向性模糊效果',
      complexity: 'O(n×d)',
      formula: 'Blur along direction vector',
      applications: ['动态效果', '运动模拟', '艺术创作'],
      difficulty: '中等',
      category: '基础滤镜'
    },
    radialBlur: {
      name: '径向模糊',
      description: '从图像中心向外产生径向模糊效果，模拟焦点或速度感',
      complexity: 'O(n×r)',
      formula: 'Blur intensity ∝ distance from center',
      applications: ['焦点效果', '速度感', '艺术处理'],
      difficulty: '中等',
      category: '基础滤镜'
    },
    medianFilter: {
      name: '中值滤波',
      description: '使用邻域像素的中值替换当前像素，有效去除椒盐噪声',
      complexity: 'O(n×k²×log k)',
      formula: 'New = median(neighborhood)',
      applications: ['噪声去除', '边缘保持', '图像清理'],
      difficulty: '中等',
      category: '基础滤镜'
    },
    bilateralFilter: {
      name: '双边滤波',
      description: '同时考虑空间距离和像素值差异的滤波，保持边缘的同时去噪',
      complexity: 'O(n×k²)',
      formula: 'Weight = spatial_weight × intensity_weight',
      applications: ['边缘保持去噪', '图像平滑', '预处理'],
      difficulty: '困难',
      category: '基础滤镜'
    },
    laplacianSharpen: {
      name: '拉普拉斯锐化',
      description: '使用拉普拉斯算子检测边缘并增强图像的锐度',
      complexity: 'O(n)',
      formula: '∇²f = ∂²f/∂x² + ∂²f/∂y²',
      applications: ['边缘增强', '细节突出', '图像锐化'],
      difficulty: '中等',
      category: '基础滤镜'
    },
    unsharpMask: {
      name: '非锐化掩模',
      description: '通过从原图中减去模糊版本来增强图像细节',
      complexity: 'O(n×k²)',
      formula: 'Sharp = Original + Amount × (Original - Blurred)',
      applications: ['细节增强', '专业锐化', '印刷准备'],
      difficulty: '中等',
      category: '基础滤镜'
    },
    sobelEdge: {
      name: 'Sobel边缘检测',
      description: '使用Sobel算子计算图像梯度，检测边缘和轮廓',
      complexity: 'O(n)',
      formula: 'G = √(Gx² + Gy²)',
      applications: ['边缘检测', '特征提取', '轮廓分析'],
      difficulty: '中等',
      category: '基础滤镜'
    },

    // 艺术效果类 (10个)
    oilPainting: {
      name: '油画效果',
      description: '模拟油画的笔触和色彩混合效果，创造艺术风格',
      complexity: 'O(n×k²)',
      formula: 'Intensity clustering + color averaging',
      applications: ['艺术创作', '风格化', '装饰效果'],
      difficulty: '困难',
      category: '艺术效果'
    },
    watercolor: {
      name: '水彩效果',
      description: '模拟水彩画的柔和色彩和流动感',
      complexity: 'O(n)',
      formula: 'Blur + saturation enhancement',
      applications: ['艺术风格', '柔和效果', '创意设计'],
      difficulty: '中等',
      category: '艺术效果'
    },
    pencilSketch: {
      name: '铅笔素描',
      description: '将图像转换为铅笔素描风格，突出线条和阴影',
      complexity: 'O(n)',
      formula: 'Grayscale + invert + blur + color dodge',
      applications: ['素描风格', '线条艺术', '黑白效果'],
      difficulty: '中等',
      category: '艺术效果'
    },
    cartoon: {
      name: '卡通化',
      description: '将图像转换为卡通风格，减少颜色层次并平滑边缘',
      complexity: 'O(n)',
      formula: 'Bilateral filter + color quantization',
      applications: ['动漫风格', '简化效果', '插画风格'],
      difficulty: '中等',
      category: '艺术效果'
    },
    mosaic: {
      name: '马赛克',
      description: '将图像分割成块状区域，每个区域使用平均颜色',
      complexity: 'O(n)',
      formula: 'Block averaging',
      applications: ['像素化', '隐私保护', '装饰效果'],
      difficulty: '简单',
      category: '艺术效果'
    },
    pointillism: {
      name: '点彩画',
      description: '模拟点彩派绘画技法，用彩色圆点组成图像',
      complexity: 'O(n)',
      formula: 'Color sampling + dot rendering',
      applications: ['点彩风格', '印象派效果', '艺术创作'],
      difficulty: '中等',
      category: '艺术效果'
    },
    crayon: {
      name: '蜡笔效果',
      description: '模拟蜡笔绘画的纹理和色彩特征',
      complexity: 'O(n)',
      formula: 'Texture overlay + contrast enhancement',
      applications: ['儿童风格', '手绘效果', '温暖色调'],
      difficulty: '中等',
      category: '艺术效果'
    },
    charcoal: {
      name: '炭笔效果',
      description: '创建炭笔素描风格，强调阴影和纹理',
      complexity: 'O(n)',
      formula: 'Edge detection + grayscale + texture',
      applications: ['素描风格', '艺术效果', '黑白创作'],
      difficulty: '中等',
      category: '艺术效果'
    },
    woodcut: {
      name: '版画效果',
      description: '模拟木刻版画的高对比度和线条感',
      complexity: 'O(n)',
      formula: 'Threshold + texture overlay',
      applications: ['版画风格', '高对比度', '传统艺术'],
      difficulty: '中等',
      category: '艺术效果'
    },
    abstractArt: {
      name: '抽象艺术',
      description: '创建抽象艺术风格，使用数学函数生成图案',
      complexity: 'O(n)',
      formula: 'Mathematical pattern generation',
      applications: ['抽象风格', '现代艺术', '创意设计'],
      difficulty: '中等',
      category: '艺术效果'
    },

    // 颜色处理类 (6个)
    hueShift: {
      name: '色相偏移',
      description: '在HSV色彩空间中调整图像的色相值',
      complexity: 'O(n)',
      formula: 'H_new = (H_old + shift) mod 360',
      applications: ['色调调整', '创意配色', '色彩校正'],
      difficulty: '中等',
      category: '颜色处理'
    },
    saturationEnhance: {
      name: '饱和度增强',
      description: '增强图像颜色的鲜艳度和纯度',
      complexity: 'O(n)',
      formula: 'S_new = S_old × factor',
      applications: ['色彩增强', '鲜艳效果', '视觉冲击'],
      difficulty: '简单',
      category: '颜色处理'
    },
    colorBalance: {
      name: '色彩平衡',
      description: '调整图像的冷暖色调平衡',
      complexity: 'O(n)',
      formula: 'RGB channel weighting',
      applications: ['白平衡', '色温调整', '色彩校正'],
      difficulty: '中等',
      category: '颜色处理'
    },
    selectiveColor: {
      name: '单色保留',
      description: '保留特定色相的颜色，其他部分转为灰度',
      complexity: 'O(n)',
      formula: 'Hue range filtering',
      applications: ['重点突出', '艺术效果', '视觉焦点'],
      difficulty: '中等',
      category: '颜色处理'
    },
    complementaryColor: {
      name: '互补色',
      description: '将图像转换为互补色调',
      complexity: 'O(n)',
      formula: 'H_new = (H_old + 180) mod 360',
      applications: ['色彩反转', '艺术效果', '对比增强'],
      difficulty: '简单',
      category: '颜色处理'
    },
    colorQuantization: {
      name: '色彩量化',
      description: '减少图像中的颜色数量，创建海报化效果',
      complexity: 'O(n)',
      formula: 'Color level reduction',
      applications: ['海报效果', '简化色彩', '风格化'],
      difficulty: '简单',
      category: '颜色处理'
    },

    // 复古风格化类 (5个)
    vintageFilm: {
      name: '复古胶片',
      description: '模拟老式胶片的色调和质感',
      complexity: 'O(n)',
      formula: 'Sepia tone + contrast adjustment',
      applications: ['怀旧效果', '复古风格', '情感表达'],
      difficulty: '中等',
      category: '复古风格'
    },
    faded: {
      name: '褪色效果',
      description: '模拟照片随时间褪色的效果',
      complexity: 'O(n)',
      formula: 'Saturation reduction + brightness overlay',
      applications: ['年代感', '怀旧风格', '柔和效果'],
      difficulty: '简单',
      category: '复古风格'
    },
    vignette: {
      name: '暗角效果',
      description: '在图像四周添加渐变暗角',
      complexity: 'O(n)',
      formula: 'Radial gradient masking',
      applications: ['焦点突出', '复古效果', '艺术风格'],
      difficulty: '中等',
      category: '复古风格'
    },
    filmGrain: {
      name: '颗粒噪点',
      description: '添加胶片颗粒感的随机噪点',
      complexity: 'O(n)',
      formula: 'Random noise overlay',
      applications: ['胶片质感', '复古效果', '纹理增强'],
      difficulty: '简单',
      category: '复古风格'
    },
    highContrastBW: {
      name: '高对比度黑白',
      description: '创建戏剧性的高对比度黑白效果',
      complexity: 'O(n)',
      formula: 'Grayscale + contrast enhancement',
      applications: ['戏剧效果', '艺术摄影', '强烈对比'],
      difficulty: '简单',
      category: '复古风格'
    },

    // 几何变换类 (6个)
    rotation: {
      name: '旋转变换',
      description: '围绕图像中心旋转指定角度',
      complexity: 'O(n)',
      formula: 'Rotation matrix transformation',
      applications: ['角度校正', '构图调整', '艺术效果'],
      difficulty: '中等',
      category: '几何变换'
    },
    perspective: {
      name: '透视变换',
      description: '创建3D透视效果，模拟视角变化',
      complexity: 'O(n)',
      formula: 'Perspective projection matrix',
      applications: ['3D效果', '视角校正', '立体感'],
      difficulty: '困难',
      category: '几何变换'
    },
    fisheye: {
      name: '鱼眼效果',
      description: '模拟鱼眼镜头的球面投影效果',
      complexity: 'O(n)',
      formula: 'Spherical coordinate mapping',
      applications: ['广角效果', '创意摄影', '全景视觉'],
      difficulty: '中等',
      category: '几何变换'
    },
    barrelDistortion: {
      name: '桶形畸变',
      description: '模拟镜头的桶形畸变效果',
      complexity: 'O(n)',
      formula: 'Radial distortion function',
      applications: ['镜头效果', '畸变模拟', '创意变形'],
      difficulty: '中等',
      category: '几何变换'
    },
    waveDistortion: {
      name: '波浪变形',
      description: '应用正弦波函数创建波浪形扭曲',
      complexity: 'O(n)',
      formula: 'Sinusoidal displacement',
      applications: ['动态效果', '水波模拟', '创意变形'],
      difficulty: '中等',
      category: '几何变换'
    },
    swirl: {
      name: '漩涡效果',
      description: '创建螺旋漩涡形的图像扭曲',
      complexity: 'O(n)',
      formula: 'Polar coordinate rotation',
      applications: ['漩涡效果', '动态感', '创意变形'],
      difficulty: '中等',
      category: '几何变换'
    },

    // 纹理特效类 (6个)
    embossEnhanced: {
      name: '浮雕增强',
      description: '增强版浮雕效果，更强的立体感',
      complexity: 'O(n)',
      formula: 'Enhanced emboss kernel',
      applications: ['立体效果', '纹理突出', '装饰处理'],
      difficulty: '中等',
      category: '纹理特效'
    },
    metallic: {
      name: '金属质感',
      description: '添加金属光泽和反射效果',
      complexity: 'O(n)',
      formula: 'Reflection simulation + contrast',
      applications: ['金属效果', '光泽处理', '质感增强'],
      difficulty: '中等',
      category: '纹理特效'
    },
    glass: {
      name: '玻璃效果',
      description: '模拟透明玻璃的折射和扭曲效果',
      complexity: 'O(n)',
      formula: 'Random displacement + tint',
      applications: ['透明效果', '折射模拟', '玻璃质感'],
      difficulty: '中等',
      category: '纹理特效'
    },
    neonGlow: {
      name: '霓虹发光',
      description: '在图像边缘添加霓虹灯发光效果',
      complexity: 'O(n)',
      formula: 'Edge detection + glow enhancement',
      applications: ['发光效果', '夜景风格', '科技感'],
      difficulty: '中等',
      category: '纹理特效'
    },
    dropShadow: {
      name: '阴影投射',
      description: '为图像添加立体投影阴影',
      complexity: 'O(n)',
      formula: 'Shadow layer + offset + blur',
      applications: ['立体感', '深度效果', '阴影模拟'],
      difficulty: '中等',
      category: '纹理特效'
    },
    textureOverlay: {
      name: '纹理叠加',
      description: '在图像上叠加数学生成的纹理图案',
      complexity: 'O(n)',
      formula: 'Mathematical texture generation',
      applications: ['纹理增强', '表面效果', '材质模拟'],
      difficulty: '中等',
      category: '纹理特效'
    }
  };

  const info = algorithmDetails[algorithm];
  
  if (!info) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            算法详情
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">暂无该算法的详细信息</p>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '简单': return 'bg-green-100 text-green-800 border-green-200';
      case '中等': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '困难': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          算法详情
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 算法名称和分类 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{info.name}</h3>
          <div className="flex gap-2">
            <Badge variant="outline">{info.category}</Badge>
            <Badge variant="outline" className={getDifficultyColor(info.difficulty)}>
              {info.difficulty}
            </Badge>
          </div>
        </div>

        {/* 描述 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="font-medium">算法描述</span>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {info.description}
          </p>
        </div>

        {/* 时间复杂度 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="font-medium">时间复杂度</span>
          </div>
          <code className="text-sm bg-muted px-2 py-1 rounded ml-6">
            {info.complexity}
          </code>
        </div>

        {/* 数学公式 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-500" />
            <span className="font-medium">核心公式</span>
          </div>
          <code className="text-sm bg-muted px-2 py-1 rounded block ml-6 break-all">
            {info.formula}
          </code>
        </div>

        {/* 应用场景 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-500" />
            <span className="font-medium">应用场景</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-6">
            {info.applications.map((app, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {app}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmInfo;

