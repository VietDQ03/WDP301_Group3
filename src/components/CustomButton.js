import React from 'react';
import { Button as AntButton } from 'antd';

const CustomButton = ({ 
  children, 
  icon, 
  type = 'primary',
  htmlType,
  size = 'large',
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
    <AntButton
      type={type}
      htmlType={htmlType}
      size={size}
      icon={icon}
      onClick={onClick}
      style={baseStyle}
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
      {children}
    </AntButton>
  );
};

export default CustomButton;