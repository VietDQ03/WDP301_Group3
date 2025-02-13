import React from 'react';
import { Button as AntButton } from 'antd';
import styled from 'styled-components';

const StyledButton = styled(AntButton)`
  &.ant-btn {
    background-color: #2b65a5;
    border-color: #2b65a5;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    transition: all 0.3s ease;
    gap: 0.5rem;

    &:hover, &:focus {
      background-color: #009345 !important;
      border-color: #009345 !important;
      color: white !important;
    }

    &:active {
      background-color: #007a3a !important;
      border-color: #007a3a !important;
    }

    &[disabled] {
      background-color: #d9d9d9 !important;
      border-color: #d9d9d9 !important;
      color: rgba(0, 0, 0, 0.25) !important;
    }

    .anticon {
      display: flex;
      align-items: center;
    }

    &.ant-btn-lg {
      font-size: 1rem;
    }

    &.ant-btn-sm {
      height: 2rem;
      padding-left: 1rem;
      padding-right: 1rem;
      font-size: 0.875rem;
    }
  }
`;

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
  return (
    <StyledButton
      type={type}
      htmlType={htmlType}
      size={size}
      icon={icon}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default CustomButton;