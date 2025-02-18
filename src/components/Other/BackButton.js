import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button as AntButton } from 'antd';

const BackButton = ({ 
  children, 
  onClick,
  className,
  ...props 
}) => {
  const baseStyle = {
    backgroundColor: '#2b65a5',
    borderColor: '#2b65a5',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    height: '2.75rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    transition: 'all 0.3s ease'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <AntButton
        onClick={onClick}
        className={`mb-8 ${className}`}
        style={baseStyle}
        icon={
          <div className="rounded-lg shadow-sm ">
            <ArrowLeft className="h-5 w-5 text-white-600" />
          </div>
        }
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#009345';
          e.currentTarget.style.borderColor = '#009345';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#2b65a5';
          e.currentTarget.style.borderColor = '#2b65a5';
        }}
        {...props}
      >
        <span className="font-medium">{children}</span>
      </AntButton>
    </motion.div>
  );
};

export default BackButton;