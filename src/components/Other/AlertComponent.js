import React from 'react';
import { X } from 'lucide-react';
import CustomButton from './CustomButton';
import { motion, AnimatePresence } from 'framer-motion';

const AlertComponent = ({ isVisible, setIsVisible, type, message }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <motion.div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
                        onClick={() => setIsVisible(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.div 
                        className="fixed inset-0 flex items-center justify-center z-[100]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={`flex items-center ${
                                type === 'success' 
                                    ? 'bg-green-100 border-green-400 text-green-700' 
                                    : 'bg-red-100 border-red-400 text-red-700'
                            } border px-8 py-6 rounded-xl max-w-2xl w-full mx-4 shadow-lg`}
                            role="alert"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ 
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            <motion.div 
                                className="mr-4 flex-grow"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <strong className="font-bold text-lg mb-2 block">
                                    {type === 'success' ? 'Thành công: ' : 'Có lỗi xảy ra: '}
                                </strong>
                                <span className="text-base leading-relaxed">{message}</span>
                            </motion.div>
                            <motion.div 
                                className="ml-2"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <CustomButton
                                    htmlType="button"
                                    icon={<X size={20} />}
                                    onClick={() => setIsVisible(false)}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AlertComponent;