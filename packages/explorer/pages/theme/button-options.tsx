import React from "react";


export interface ButtonOptions extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  // typeStyle?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning';
  typeStyle?: 'primary';
  // size?: 'small' | 'medium' | 'large';
  size?: 'small' | 'medium';
  onChangeLoading?: (loading: boolean) => void;
}
