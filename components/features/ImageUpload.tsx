import React from 'react';

const ImageUpload: React.FC = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle the selected file (e.g., read it, display a preview)
      console.log('Selected file:', file);
    }
  };

  const handleCameraClick = () => {
    // Placeholder for accessing the mobile camera
    console.log('Use Camera button clicked');
    // This will require platform-specific implementation (e.g., using the MediaDevices API)
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
      <label className="cursor-pointer flex flex-col items-center justify-center p-4 w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 mb-4 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <p className="text-sm">Drag 'n' drop an image or click to select</p>
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>

      <button
        onClick={handleCameraClick}
        className="w-full px-4 py-3 bg-blue-500 text-white text-center font-semibold rounded-xl shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-200 backdrop-blur-sm"
        style={{ minHeight: '44px', minWidth: '44px' }} // Ensure minimum touch target size
      >
        Use Camera
      </button>
    </div>
  );
};

export default ImageUpload;