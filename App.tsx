import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- ICONS ---
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-4 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const AlbumArtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
    </svg>
);


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    // Cleanup function to revoke the object URL when the component unmounts or the src changes
    return () => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Revoke the old object URL before creating a new one
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
      const newAudioSrc = URL.createObjectURL(file);
      setAudioSrc(newAudioSrc);
      setFileName(file.name);
    }
  }, [audioSrc]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = useCallback(() => {
    if (!audioSrc) return;
    const link = document.createElement('a');
    link.href = audioSrc;
    link.download = fileName || 'audio-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [audioSrc, fileName]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-800/50 backdrop-blur-xl">
        <div className="p-8">
          <header className="text-center mb-8">
             <div className="flex items-center justify-center">
                 <MicrophoneIcon />
                <h1 className="text-3xl font-bold text-slate-100">
                  오후 1시 창업이야기 뉴스 브리핑
                </h1>
             </div>
            <p className="text-md text-slate-400 mt-2">
              {currentDate}
            </p>
          </header>
          
          <main>
            {audioSrc ? (
              <div className="space-y-6 transition-all duration-500 ease-in-out">
                <div className="bg-slate-900/70 p-4 rounded-xl flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                      <AlbumArtIcon />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Now Playing</p>
                    <p className="text-lg font-semibold text-slate-100 truncate" title={fileName}>
                        {fileName}
                    </p>
                  </div>
                </div>
                <audio controls autoPlay src={audioSrc} className="w-full h-14 rounded-lg">
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <div 
                className="text-center p-8 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-xl hover:border-cyan-400 hover:bg-slate-900/70 cursor-pointer transition-all duration-300"
                onClick={handleUploadClick}
                role="button"
                tabIndex={0}
                aria-label="Upload audio file"
                onKeyPress={(e) => e.key === 'Enter' && handleUploadClick()}
              >
                <UploadIcon />
                <p className="mt-4 text-lg font-medium text-slate-300">
                  음성 파일을 업로드해주세요
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  MP3, WAV, OGG 등 지원
                </p>
              </div>
            )}
            
            <div className="mt-8">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                id="audio-upload"
              />
              <button
                onClick={audioSrc ? handleDownload : handleUploadClick}
                className={`w-full text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-4 ${
                  audioSrc
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 focus:ring-green-300/50'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:ring-cyan-300/50'
                }`}
              >
                {audioSrc ? '파일 다운로드' : '오디오 파일 업로드'}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;