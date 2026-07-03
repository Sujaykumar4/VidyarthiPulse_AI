const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Header Text Replacements
code = code.replace(/KrishiPulse/g, 'VidyarthiPulse');
code = code.replace(/India's First Supply Chain Agent for Farmers/g, "India's First AI Tutor for Students");

// Voice Section
code = code.replace(/आवाज़-फर्स्ट तकनीक/g, 'वॉयस-फर्स्ट लर्निंग');
code = code.replace(/Voice-First AI Input/g, 'Voice-First AI Tutor');
code = code.replace(/अपनी भाषा में बोलें/g, 'बोलकर डाउट पूछें');
code = code.replace(/Speak in Your Native Language/g, 'Ask Your Doubt');
code = code.replace(/बिना टाइप किए सिर्फ माइक बटन दबाकर बोलें। जेमिनी एआई आपकी आवाज़ और बोली पहचानकर सीधे लाइव भाव खोजेगा।/g, 'बिना टाइप किए सिर्फ माइक बटन दबाकर बोलें। जेमिनी एआई आपकी आवाज़ पहचानकर तुरंत डाउट सॉल्व करेगा।');
code = code.replace(/Zero typing required. Speak using your local dialect. Gemini reads your unstructured speech & queries live buyers instantly./g, 'Zero typing required. Speak using your local dialect. Gemini listens to your doubt & explains step-by-step.');

// Camera Section
code = code.replace(/मल्टीमोडल इमेज विश्लेषण/g, 'मल्टीमोडल डाउट विश्लेषण');
code = code.replace(/Multimodal Image Analysis/g, 'Multimodal Doubt Analysis');
code = code.replace(/खेत से डायरेक्ट स्कैन/g, 'डाउट\/किताब की फोटो लें');
code = code.replace(/Direct Harvest Inspection/g, 'Snap Your Doubt');
code = code.replace(/अपनी फसल या अनाज की फोटो अपलोड करें। जेमिनी एआई उसकी क्वालिटी ग्रेड और शेल्फ लाइफ का विश्लेषण करेगा।/g, 'अपनी किताब या सवाल की फोटो अपलोड करें। जेमिनी एआई उसे पढ़कर पूरा स्टडी डैशबोर्ड तैयार करेगा।');
code = code.replace(/Simply snap or select a harvest photo. Gemini evaluates raw quality parameters, damage estimates, and shelf-life./g, 'Simply snap or select a book/question photo. Gemini reads the problem and generates a complete study dashboard.');

code = code.replace(/Gemini Analyzing Quality.../g, 'Gemini Analyzing Doubt...');
code = code.replace(/Inspecting pigmentation, spot damages, and volume yields./g, 'Reading the question and preparing explanation...');
code = code.replace(/No Crop Analyzed Yet/g, 'No Doubt Analyzed Yet');

code = code.replace(/कैमरा फोटो/g, 'फोटो खींचें');
code = code.replace(/Camera Snap/g, 'Snap Photo');

// Update getBestOffer function which we won't really need but let's replace it so we don't have errors
code = code.replace(/const getBestOffer = \([\s\S]*?const bestOffer = getBestOffer\(inspectionResult\?\.marketComparison\);/, '');

// Now the Dashboard Rendering section. We'll replace the whole lg:col-span-7 div content.
const oldDashStart = '<div className="lg:col-span-7 space-y-6">';
const oldDashEnd = '</div>\n            )}';

const dashIndexStart = code.indexOf(oldDashStart);
const dashIndexEnd = code.lastIndexOf(oldDashEnd);

if (dashIndexStart !== -1 && dashIndexEnd !== -1) {
    const newDash = `
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-[#E8E4D9] rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-[#3A5A40]/10 text-[#588157] rounded-xl">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#588157] font-extrabold uppercase tracking-widest block">
                        {language === 'HI' ? 'स्टडी डैशबोर्ड' : 'Study Dashboard'}
                      </span>
                      <h4 className="text-lg font-black text-[#1B3022]">
                        {language === 'HI' ? 'आपके सवाल का पूरा हल' : 'Complete Solution for Your Doubt'}
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
                  <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
                  
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-[#3A5A40]/10 text-[#588157] rounded-xl">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">
                        {language === 'HI' ? 'आसान भाषा में समझें' : 'Step-by-Step Explanation'}
                      </span>
                      <h4 className="text-lg font-black text-[#1B3022]">
                        {language === 'HI' ? 'व्हाट्सएप (WhatsApp) नोट्स' : 'Shareable WhatsApp Notes'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'HI' 
                          ? 'जेमिनी एआई ने आपके लिए इस सवाल का आसान हिंदी हल तैयार किया है जिसे आप दोस्तों को भी भेज सकते हैं।' 
                          : 'Gemini formats a structured, highly educational explanation ready to be shared or saved.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FDFCF8] border border-[#E8E4D9] rounded-2xl relative">
                    <div className="absolute top-2 right-2 bg-black text-[9px] text-gray-400 px-2 py-0.5 rounded uppercase font-mono">
                      Hindi Explanation
                    </div>
                    <p className="text-sm text-[#3A5A40] leading-relaxed pr-12 mt-4">
                      "{inspectionResult?.explanationHindi || inspectionResult?.negotiationHindi}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inspectionResult?.explanationHindi || inspectionResult?.negotiationHindi);
                        setSuccessMsg("Copied: Notes saved to clipboard!");
                      }}
                      className="px-4 py-3 bg-[#F0EDE4] hover:bg-[#DAD7CD] text-[#2D332A] border border-[#DAD7CD] font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-4 h-4 text-gray-500" />
                      <span>{language === 'HI' ? 'नोट्स कॉपी करें' : 'Copy Notes'}</span>
                    </button>

                    <a
                      href={\`https://api.whatsapp.com/send?text=\${encodeURIComponent(inspectionResult?.explanationHindi || inspectionResult?.negotiationHindi)}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-[#3A5A40] hover:bg-[#2D332A] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-[#588157]/10"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{language === 'HI' ? 'दोस्तों को भेजें (WhatsApp)' : 'Share via WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>
`;

    code = code.slice(0, dashIndexStart) + newDash + '\n            )}';
}

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx updated for EdTech");
