import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader/ImageUploader';
import AlgorithmSelector from './components/AlgorithmSelector/AlgorithmSelector';
import CanvasDisplay from './components/CanvasDisplay/CanvasDisplay';
import ControlPanel from './components/ControlPanel/ControlPanel';
import ProcessingStatus from './components/ProcessingStatus/ProcessingStatus';
import AlgorithmInfo from './components/AlgorithmInfo/AlgorithmInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

function App() {
  const [imageData, setImageData] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingParams, setProcessingParams] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const handleImageUpload = (data) => {
    setImageData(data);
    setIsProcessing(false);
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsProcessing(false);
  };

  const handleStartProcessing = (params) => {
    setIsProcessing(true);
    setProcessingParams(params);
  };

  const handleResetImage = () => {
    setIsProcessing(false);
    // 重置到原始图像状态
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setProcessingProgress(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 头部 */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">交互式图像处理器</h1>
              <p className="text-muted-foreground">
                上传图片，选择算法，观看处理过程的动画演示
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：上传和算法选择 */}
          <div className="space-y-6">
            <ImageUploader 
              onImageUpload={handleImageUpload}
              imageData={imageData}
            />
            
            <AlgorithmSelector 
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmSelect={handleAlgorithmSelect}
              disabled={!imageData || isProcessing}
            />
            
            {/* 算法信息 */}
            {selectedAlgorithm && (
              <AlgorithmInfo algorithm={selectedAlgorithm} />
            )}
          </div>

          {/* 中间：画布显示 */}
          <div className="space-y-6">
            <CanvasDisplay 
              imageData={imageData}
              algorithm={selectedAlgorithm}
              isProcessing={isProcessing}
              onProcessingComplete={handleProcessingComplete}
              processingParams={processingParams}
              onProgressUpdate={setProcessingProgress}
            />
            
            {/* 处理状态 */}
            {selectedAlgorithm && (
              <ProcessingStatus 
                isProcessing={isProcessing}
                progress={processingProgress}
                algorithm={selectedAlgorithm}
                processingSpeed={processingParams?.speed}
              />
            )}
          </div>

          {/* 右侧：控制面板 */}
          <div>
            <ControlPanel 
              selectedAlgorithm={selectedAlgorithm}
              onStartProcessing={handleStartProcessing}
              onReset={handleResetImage}

isProcessing={isProcessing}
hasImage={!!imageData}
disabled={!imageData || !selectedAlgorithm}
            />
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">使用说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">1. 上传图片</h4>
                  <p className="text-muted-foreground">
                    点击上传按钮或拖拽图片文件到上传区域
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. 选择算法</h4>
                  <p className="text-muted-foreground">
                    从算法列表中选择想要应用的图像处理算法
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. 观看动画</h4>
                  <p className="text-muted-foreground">
                    点击开始处理，观看算法执行过程的动画演示
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;

