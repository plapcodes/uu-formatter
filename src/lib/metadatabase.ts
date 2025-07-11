export interface ParameterMetadata {
  key: string;
  name: string;
  description?: string;
  controlType: 'checkbox' | 'textInput' | 'textArea' | 'select' | 'doubleText'; // Helps the UI decide which component to render
  // For 'textInput' or 'textArea'
  placeholder?: string;
  // For 'select'
  options?: { value: string; label: string }[];
  // For 'doubleText'
  texts?: {
    first: string;
    second: string;
  }[];
}
