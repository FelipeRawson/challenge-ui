import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  type = 'error',
}) => {
  const bgColor = type === 'error' ? 'bg-red-50' : 'bg-yellow-50';
  const textColor = type === 'error' ? 'text-red-800' : 'text-yellow-800';
  const iconColor = type === 'error' ? 'text-red-500' : 'text-yellow-500';
  const buttonColor = type === 'error' 
    ? 'bg-red-100 hover:bg-red-200 text-red-700' 
    : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700';

  return (
    <div className={`${bgColor} border border-opacity-20 rounded-lg p-4`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${textColor} mb-1`}>
            {type === 'error' ? 'Error' : 'Warning'}
          </h3>
          <p className={`text-sm ${textColor.replace('800', '700')}`}>
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${buttonColor}`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};