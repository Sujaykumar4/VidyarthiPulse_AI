import React, { useState, useRef } from 'react';
import { 
  Mic, MicOff, Camera, Upload, TrendingUp, Truck, 
  MessageSquare, Share2, Sparkles, Languages, Volume2, 
  CheckCircle, AlertTriangle, Award, Database, Info, Settings, LogOut, User, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './components/AuthContext.tsx';



export default function App() {
    
  // Multimodal Vision Inspection state
  const [analyzingCrop, setAnalyzingCrop] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inspectionResult, setInspectionResult] = useState<any>(null);
  
  // Voice interaction state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceInputText, setVoiceInputText] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('Idle');

  // Active user tab
    const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Audio simulation player
  const [playingTTS, setPlayingTTS] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, signIn, signOut, token } = useAuth();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setAnalyzingCrop(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => resolve((fileReader.result as string).split(',')[1]);
        fileReader.onerror = (err) => reject(err);
      });

      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (token) {
          headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/analyze-crop", {
        method: "POST",
        headers,
        body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || "image/jpeg"
        })
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || "Failed to analyze image. Check API key settings.");
      }

      setInspectionResult({
        id: 'custom-upload',
        topic: data.topic || 'Analyzed Doubt',
        image: reader.result,
        subject: data.subject || 'Subject',
        gradeLevel: data.gradeLevel || 'Grade Level',
        estimatedTime: data.estimatedTime || 'Time',
        studyDashboard: data.studyDashboard || { concept: '', formula: '', quizQuestion: '', quizAnswer: '' },
        explanationEnglish: data.explanationEnglish || 'नमस्ते! यहाँ आपके सवाल का जवाब है।'
      });

      setSuccessMsg("Success: Gemini Multimodal Vision analysis completed! Fresh live quotes fetched.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Inspection Failed: ${err.message || 'Check your internet connection or custom API key in settings.'}`);
    } finally {
      setAnalyzingCrop(false);
      setImagePreview(null);
    }
  };

  
  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("Speech recognition is not supported in this browser. Please try Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Works well for Hindi and English mix
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsRecording(true);
      setVoiceStatus('Listening');
    };
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceInputText(transcript);
      setVoiceStatus('Processing');
      setAnalyzingCrop(true);
      
      try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("/api/analyze-voice", {
          method: "POST",
          headers,
          body: JSON.stringify({ transcript }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Voice analysis failed');
        }

        const data = await response.json();
        setInspectionResult(data);
        setVoiceStatus('Idle');
        setSuccessMsg("Voice input analyzed successfully by Gemini!");
      } catch (err: any) {
        console.error(err);
        setErrorMsg(`Voice Analysis Failed: ${err.message}`);
        setVoiceStatus('Idle');
      } finally {
        setAnalyzingCrop(false);
      }
    };
    recognition.onerror = (event: any) => {
      setErrorMsg(`Voice error: ${event.error}`);
      setIsRecording(false);
      setVoiceStatus('Idle');
    };
    recognition.onend = () => {
      setIsRecording(false);
      if (voiceStatus === 'Listening') setVoiceStatus('Idle');
    };
    recognition.start();
  };

  
  const triggerTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingTTS(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = () => setPlayingTTS(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setErrorMsg("Text-to-Speech is not fully supported in this browser environment.");
    }
  };

  const handleDownloadPDF = async () => {
    window.print();
    setSuccessMsg("PDF printed successfully!");
  };

  

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1B3022] flex flex-col font-sans antialiased selection:bg-[#3A5A40] selection:text-white">
      
      {/* HEADER SECTION */}
      <header className="print-hidden sticky top-0 z-40 bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[#E8E4D9] px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-[#3A5A40] to-[#2D332A] p-2.5 rounded-2xl text-white shadow-lg shadow-[#588157]/10">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight text-[#1B3022]">
                  VidyarthiPulse <span className="font-light text-[#588157]">AI</span>
                </h1>
                <span className="text-[10px] bg-[#3A5A40]/10 text-[#588157] border border-[#588157]/30 px-2 py-0.5 rounded-full font-bold">PROTOTYPE</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">India's First AI Tutor for Students</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <button 
                onClick={signOut}
                className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-rose-500 transition-colors mr-2"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button 
                onClick={signIn}
                className="hidden sm:flex items-center space-x-1.5 text-xs font-bold text-[#588157] bg-[#3A5A40]/10 hover:bg-[#3A5A40]/20 px-3 py-1.5 rounded-xl border border-[#588157]/20 transition-colors mr-2"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-6 pb-24">
        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl flex items-start space-x-3 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <div className="flex-1">
              <p className="font-bold">Execution Interrupted</p>
              <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-[#3A5A40]/10 border border-[#588157]/20 text-[#588157] rounded-2xl flex items-start space-x-3 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 text-[#588157]" />
            <p className="flex-grow font-semibold">{successMsg}</p>
            <button onClick={() => setSuccessMsg('')} className="text-[#588157] font-bold hover:text-[#3A5A40]">×</button>
          </div>
        )}

        {/* MAIN DASHBOARD */}
        <div className="space-y-6">
          {/* VOICE INTEGRATION BAR */}
          <div className="bg-gradient-to-r from-white via-[#FDFCF8] to-white border border-[#E8E4D9] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3A5A40]/5 blur-2xl rounded-full"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex-1">
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block mb-1">
                  {'Voice-First AI Tutor'}
                </span>
                <h3 className="text-xl font-bold text-[#1B3022] flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-[#588157]" /> 
                  {'Ask Your Doubt'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xl">
                  Zero typing required. Speak using your local dialect. Gemini listens to your doubt & explains step-by-step.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0">
                <button
                  onClick={startVoiceRecording}
                  disabled={isRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isRecording 
                      ? 'bg-amber-500 text-white animate-pulse' 
                      : 'bg-[#3A5A40] text-white hover:scale-105 shadow-lg shadow-[#588157]/20 hover:shadow-[#588157]/30'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <span className="text-[11px] text-gray-500 mt-2 font-bold uppercase tracking-wider font-mono">
                  {voiceStatus === 'Listening' ? 'LISTENING...' : voiceStatus === 'Processing' ? 'GEMINI REASONING...' : 'TAP TO SPEAK'}
                </span>
              </div>
            </div>

            {voiceInputText && (
              <div className="mt-4 p-3 bg-black/80 border border-[#588157]/20 rounded-xl flex items-center justify-between text-xs overflow-hidden">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-[#3A5A40]/20 text-[#588157] font-bold px-2 py-0.5 rounded">SPEECH INFERENCED</span>
                  <p className="text-[#3A5A40] italic font-mono font-light">"{voiceInputText}"</p>
                </div>
                <button 
                  onClick={() => triggerTTS(voiceInputText)}
                  className="p-1.5 hover:bg-[#F0EDE4] rounded-lg text-[#588157]"
                  title="Speak Out Loud"
                >
                  <Volume2 className={`w-4 h-4 ${playingTTS ? 'animate-pulse text-amber-400' : ''}`} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Multimodal Image Inspection Card */}
            <div className="lg:col-span-5 bg-white border border-[#E8E4D9] rounded-3xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#588157] font-extrabold uppercase tracking-widest block mb-1">
                  {'Multimodal Doubt Analysis'}
                </span>
                <h3 className="text-lg font-bold text-[#1B3022] flex items-center mb-1">
                  <Camera className="w-5 h-5 mr-2 text-[#588157]" />
                  {'Snap Your Doubt'}
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  Simply snap or select a book/question photo. Gemini reads the problem and generates a complete study dashboard.
                </p>

                {analyzingCrop ? (
                  <div className="aspect-video w-full rounded-2xl bg-black/80 border border-[#E8E4D9] flex flex-col items-center justify-center space-y-3 text-center p-6">
                    <div className="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
                    <div>
                      <h5 className="font-bold text-[#2D332A]">Gemini Analyzing Doubt...</h5>
                      <p className="text-[10px] text-gray-500 mt-1">Reading the question and preparing explanation...</p>
                    </div>
                  </div>
                ) : imagePreview ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#DAD7CD]">
                    <img src={imagePreview} alt="Uploading..." className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#FDFCF8]/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xs bg-black text-[#2D332A] px-3 py-1.5 rounded-full border border-[#E8E4D9] flex items-center">
                        <Sparkles className="w-3 h-3 mr-1 text-[#588157] animate-pulse" /> Processing with Gemini...
                      </span>
                    </div>
                  </div>
                ) : inspectionResult ? (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E8E4D9] group bg-[#FDFCF8]">
                    <img 
                      src={inspectionResult?.image} 
                      alt={inspectionResult?.topic} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#FDFCF8]/90 via-[#FDFCF8]/60 to-transparent p-4 flex justify-between items-end backdrop-blur-[2px]">
                      <div>
                        <span className="text-[9px] bg-[#3A5A40]/20 text-[#3A5A40] border border-[#3A5A40]/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block mb-1 shadow-sm">
                          {inspectionResult?.gradeLevel}
                        </span>
                        <h4 className="font-black text-sm text-[#1B3022]">{inspectionResult?.topic}</h4>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E8E4D9] bg-[#F0EDE4] flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-[#DAD7CD] mx-auto mb-2" />
                      <p className="text-sm font-bold text-[#588157]">No Doubt Analyzed Yet</p>
                      <p className="text-xs text-gray-500">Upload an image to begin.</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <label className="flex flex-col items-center justify-center p-4 bg-[#FDFCF8] hover:bg-[#F0EDE4] border border-[#E8E4D9] hover:border-[#588157]/40 rounded-2xl cursor-pointer transition-all group text-center">
                    <Camera className="w-5 h-5 text-[#588157] mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-[#2D332A]">{'Snap Photo'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  <label className="flex flex-col items-center justify-center p-4 bg-[#FDFCF8] hover:bg-[#F0EDE4] border border-[#E8E4D9] hover:border-[#588157]/40 rounded-2xl cursor-pointer transition-all group text-center">
                    <Upload className="w-5 h-5 text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-[#2D332A]">{'Upload Image'}</span>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {inspectionResult && (
              
              <div id="study-dashboard" className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-[#E8E4D9] rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-[#3A5A40]/10 text-[#588157] rounded-xl">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#588157] font-extrabold uppercase tracking-widest block">
                        {'Study Dashboard'}
                      </span>
                      <h4 className="text-lg font-black text-[#1B3022]">
                        {'Complete Solution for Your Doubt'}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between p-4 bg-[#FDFCF8] border border-[#E8E4D9] rounded-2xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-[#3A5A40]/10 text-[#588157] rounded-xl flex items-center justify-center font-black mt-1">C</div>
                        <div>
                          <h5 className="text-xs font-bold text-[#2D332A]">Core Concept</h5>
                          <p className="text-sm font-medium text-[#1B3022] mt-1">{inspectionResult?.studyDashboard?.concept || 'Loading concept...'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-between p-4 bg-[#F0EDE4] border border-[#DAD7CD] rounded-2xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-black mt-1">F</div>
                        <div>
                          <h5 className="text-xs font-bold text-[#2D332A]">Key Formula / Fact</h5>
                          <p className="text-sm font-black text-[#1B3022] mt-1">{inspectionResult?.studyDashboard?.formula || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-between p-4 bg-[#FDFCF8] border border-[#E8E4D9] rounded-2xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-black mt-1">Q</div>
                        <div className="flex-1">
                          <h5 className="text-xs font-bold text-[#2D332A]">Live Quiz Question</h5>
                          <p className="text-sm font-medium text-[#1B3022] mt-1">{inspectionResult?.studyDashboard?.quizQuestion || 'Generating question...'}</p>
                          <div className="mt-2 text-right">
                             <span className="text-[10px] text-gray-400 font-mono border border-gray-200 px-2 py-1 rounded bg-gray-50">Ans: {inspectionResult?.studyDashboard?.quizAnswer || 'Wait...'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E8E4D9] rounded-3xl p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full"></div>
                  
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-[#3A5A40]/10 text-[#588157] rounded-xl">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">
                        {'Step-by-Step Explanation'}
                      </span>
                      <h4 className="text-lg font-black text-[#1B3022]">
                        {'Shareable WhatsApp Notes'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Gemini formats a structured, highly educational explanation ready to be shared or saved.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FDFCF8] border border-[#E8E4D9] rounded-2xl relative">
                    <div className="absolute top-2 right-2 bg-black text-[9px] text-gray-400 px-2 py-0.5 rounded uppercase font-mono">
                      English Explanation
                    </div>
                    <div className="text-sm text-[#3A5A40] leading-relaxed pr-12 mt-4 whitespace-pre-wrap">
                      {inspectionResult?.explanationEnglish || ""}
                    </div>
                  </div>

                  <div className="print-hidden grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inspectionResult?.explanationEnglish);
                        setSuccessMsg("Copied: Notes saved to clipboard!");
                      }}
                      className="px-4 py-3 bg-[#F0EDE4] hover:bg-[#DAD7CD] text-[#2D332A] border border-[#DAD7CD] font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-4 h-4 text-gray-500" />
                      <span>{'Copy Notes'}</span>
                    </button>

                    <button
                      onClick={handleDownloadPDF}
                      className="px-4 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(inspectionResult?.explanationEnglish)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-[#3A5A40] hover:bg-[#2D332A] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-[#588157]/10"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{'Share via WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>

            )}
          </div>
        </div>
      </main>
    </div>
  );
}