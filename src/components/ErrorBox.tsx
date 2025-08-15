import './ErrorBox.css';

interface ErrorBoxProps {
  message: string;
  className?: string;
}

function ErrorBox({ message, className = '' }: ErrorBoxProps) {
  return <div className={`error-box ${className}`}>{message}</div>;
}

export default ErrorBox;