// ErrorBoundary.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

type ErrorBoundaryState = {
  hasError: boolean;
  errorMessage: string;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorContextType = (error: Error) => void;

export const ErrorContext = React.createContext<ErrorContextType | null>(null);

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, info);
  }

  throwError = (error: Error) => {
    this.setState({ hasError: true, errorMessage: error.message });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex flex-col items-center justify-center my-6 mx-4">
          <Text className="font-primary text-red-500 text-8 my-4 font-600">
            Oops! Something went wrong, please try again later.  
            If the problem persists, please contact an administrator.</Text>    
          <Text className="font-primary text-gray-500 text-6 my-3">Error: {this.state.errorMessage}</Text>
          <PrimaryButton text="Try Again" onPress={() => this.setState({ hasError: false })} /> 
        </View>
      );
    }

    return (
      <ErrorContext.Provider value={this.throwError}>
        {this.props.children}
      </ErrorContext.Provider>
    );
  }
}

export default ErrorBoundary;
