import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  Sparkles,
  Activity
} from 'lucide-react';

const ProcessingStatus = ({ 
  isProcessing, 
  progress, 
  algorithm, 
  currentStep,
  totalSteps,
  processingSpeed 
}) => {
  const getAlgorithmDisplayName = (alg) => {
    const names = {
      grayscale: '灰度化',
      invert: '反色',
      brightness: '亮度调整',
      contrast: '对比度调整',
      blur: '模糊',
      edge: '边缘检测',
      sharpen: '锐化',
      emboss: '浮雕效果'
    };
    return names[alg] || alg;
  };

  const getStatusIcon = () => {
    if (!isProcessing && progress === 1) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (isProcessing) {
      return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
    }
    return <Clock className="w-5 h-5 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (!isProcessing && progress === 1) {
      return '处理完成';
    }
    if (isProcessing) {
      return '正在处理';
    }
    return '等待处理';
  };

  const getStatusColor = () => {
    if (!isProcessing && progress === 1) {
      return 'bg-green-500/10 text-green-700 border-green-200';
    }
    if (isProcessing) {
      return 'bg-blue-500/10 text-blue-700 border-blue-200';
    }
    return 'bg-muted text-muted-foreground border-border';
  };

  if (!algorithm) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* 状态头部 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-medium">{getAlgorithmDisplayName(algorithm)}</h3>
                <p className="text-sm text-muted-foreground">{getStatusText()}</p>
              </div>
            </div>
            
            <Badge variant="outline" className={getStatusColor()}>
              {Math.round(progress * 100)}%
            </Badge>
          </div>

          {/* 进度条 */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress * 100} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>进度: {Math.round(progress * 100)}%</span>
                {processingSpeed && (
                  <span>速度: {processingSpeed}%</span>
                )}
              </div>
            </div>
          )}

          {/* 处理步骤 */}
          {isProcessing && currentStep && totalSteps && (
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>步骤 {currentStep} / {totalSteps}</span>
            </div>
          )}

          {/* 完成状态 */}
          {!isProcessing && progress === 1 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Sparkles className="w-4 h-4" />
              <span>算法执行完成！</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;

