import React, {useRef} from 'react';

const FileInput: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = (target: HTMLInputElement): void => {
    const files = target.files;

    if (!files) {
      return;
    }

    const file = files[0];

    if (file) {
      console.log('loading');
    }
  };

  return (
    <input
      ref={fileInputRef}
      className="file-input"
      id="file-input"
      type="file"
      accept=".dcb"
      style={{display: 'none'}}
      onChange={e => handleChange(e.target)}
    />
  );
};

export default FileInput;
