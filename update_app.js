import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Remove PRESET_CROPS and VOICE_PRESETS
code = code.replace(/\/\/ Preset high-fidelity crop templates[\s\S]*?VOICE_PRESETS = \[[\s\S]*?\];/g, '');

// 2. Change initial state of inspectionResult
code = code.replace(/const \[inspectionResult, setInspectionResult\] = useState<any>\(PRESET_CROPS\[0\]\);/g, 'const [inspectionResult, setInspectionResult] = useState<any>(null);');

// 3. Remove customApiKey state and localStorage
code = code.replace(/const \[customApiKey, setCustomApiKey\] = useState\(\(\) => \{[\s\S]*?\}\);\n/g, '');

// 4. Remove activeTab state
code = code.replace(/const \[activeTab, setActiveTab\] = useState<'supply-chain' \| 'judge-console' \| 'settings'>\('supply-chain'\);\n/g, '');

// 5. Replace simulateVoiceRecording with actual Web Speech API
const webSpeech = `
  const simulateVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setErrorMsg("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'HI' ? 'hi-IN' : 'en-US';
    recognition.onstart = () => {
      setIsRecording(true);
      setVoiceStatus('Listening');
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceInputText(transcript);
      setVoiceStatus('Processing');
      // Could send to Gemini here, but for now just display
      setTimeout(() => {
        setVoiceStatus('Idle');
        setSuccessMsg("Voice input captured! (Backend processing not yet connected)");
      }, 1500);
    };
    recognition.onerror = (event: any) => {
      setErrorMsg(\`Voice error: \${event.error}\`);
      setIsRecording(false);
      setVoiceStatus('Idle');
    };
    recognition.onend = () => {
      setIsRecording(false);
      if (voiceStatus === 'Listening') setVoiceStatus('Idle');
    };
    recognition.start();
  };
`;
code = code.replace(/const simulateVoiceRecording = \(presetText: string\) => \{[\s\S]*?\}, 2000\);\n  \};\n/g, webSpeech);

// 6. Remove customApiKey from API call
code = code.replace(/if \(customApiKey\) \{\n\s*headers\["x-custom-api-key"\] = customApiKey;\n\s*\}/g, '');

// 7. Remove handleCustomKeySave
code = code.replace(/const handleCustomKeySave = \(e: React.FormEvent\) => \{[\s\S]*?\n  \};\n/g, '');

// 8. Remove navigation tabs
code = code.replace(/\{\/\* NAVIGATION TABS \*\/\}[\s\S]*?<\/div>/, '');

// 9. Remove AnimatePresence mode="wait" and activeTab conditionals
code = code.replace(/<AnimatePresence mode="wait">/g, '');
code = code.replace(/\{\/\* SUPPLY CHAIN AGENT TAB \*\/\}[\s\S]*?\{activeTab === 'supply-chain' && \(/, '{/* MAIN DASHBOARD */}');
code = code.replace(/<motion\.div key="supply" initial=\{\{ opacity: 0, x: -10 \}\} animate=\{\{ opacity: 1, x: 0 \}\} exit=\{\{ opacity: 0, x: 10 \}\} className="space-y-6">/, '<div className="space-y-6">');

// 10. Remove voice presets rendering
code = code.replace(/<div className="mt-4 flex flex-wrap gap-2">[\s\S]*?<\/div>/, '');

// 11. Fix Mic button onClick
code = code.replace(/onClick=\{() => simulateVoiceRecording\(language === 'HI' \? VOICE_PRESETS\[0\]\.hindi : VOICE_PRESETS\[0\]\.english\)\}/g, 'onClick={simulateVoiceRecording}');

// 12. Handle null inspectionResult in image container
const imageContainerReplacement = `
                  ) : inspectionResult ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E8E4D9] group bg-[#FDFCF8]">
                      <img 
                        src={inspectionResult?.image} 
                        alt={inspectionResult?.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex justify-between items-end">
                        <div>
                          <span className="text-[9px] bg-[#3A5A40]/20 text-[#588157] border border-[#588157]/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block mb-1">
                            {inspectionResult?.grade}
                          </span>
                          <h4 className="font-black text-sm text-[#1B3022]">{inspectionResult?.name}</h4>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E8E4D9] bg-[#F0EDE4] flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-[#DAD7CD] mx-auto mb-2" />
                        <p className="text-sm font-bold text-[#588157]">No Crop Analyzed Yet</p>
                        <p className="text-xs text-gray-500">Upload an image to begin.</p>
                      </div>
                    </div>
                  )}
`;
code = code.replace(/\) : \([\s\S]*?<div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-\[\#E8E4D9\] group bg-\[\#FDFCF8\]">[\s\S]*?<\/div>\n                  \)\}/, imageContainerReplacement);

// 13. Remove "Sample crops" presets rendering
code = code.replace(/<div className="mt-6 pt-5 border-t border-\[\#E8E4D9\]\/80">[\s\S]*?<\/div>\n                  <\/div>/, '');

// 14. Fix the bottom part of the file (remove other tabs and AnimatePresence)
code = code.replace(/<\/motion\.div>\n\s*?\)\}\n\n\s*?\{\/\* JUDGE CONSOLE TAB \*\/\}[\s\S]*?<\/AnimatePresence>/, '</div>');

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx updated");
