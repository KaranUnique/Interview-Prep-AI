import React from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

const LoadingModal = ({
    isOpen,
    message = "AI is working...",
    estimatedTime = null,
    type = "default"
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch(type) {
            case 'question-generation':
                return '🤖';
            case 'explanation':
                return '🧠';
            case 'more-questions':
                return '📚';
            case 'aptitude':
                return '🎯';
            default:
                return '✨';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl max-w-sm w-full mx-4"
            >
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <span className="text-4xl">{getIcon()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {message}
                    </h3>
                    {estimatedTime && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            ⏱️ {estimatedTime}
                        </p>
                    )}
                    <Loader />
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingModal;