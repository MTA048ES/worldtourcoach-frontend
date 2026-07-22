import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TrendIndicator = ({ value, threshold = 0, className = '' }) => {
  if (value > threshold) {
    return <TrendingUp className={`w-3.5 h-3.5 text-[#34d399] ${className}`} />;
  }
  if (value < -threshold) {
    return <TrendingDown className={`w-3.5 h-3.5 text-[#ef4444] ${className}`} />;
  }
  return <Minus className={`w-3.5 h-3.5 text-[#6b7a9f] ${className}`} />;
};

export default TrendIndicator;