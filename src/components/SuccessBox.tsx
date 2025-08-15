import './SuccessBox.css';

interface SuccessBoxProps {
  message: string;
  className?: string;
}

function SuccessBox({ message, className = '' }: SuccessBoxProps) {
  return <div className={`success-box ${className}`}>{message}</div>;
}

export default SuccessBox;