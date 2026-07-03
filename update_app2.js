const fs = require('fs');

const replacement = `          <div className="flex items-center space-x-4">
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
            <button 
              onClick={() => setLanguage(lang => lang === 'HI' ? 'EN' : 'HI')}
              className="flex items-center space-x-2 bg-[#F0EDE4] hover:bg-[#DAD7CD]/80 text-xs font-bold py-2 px-3 rounded-xl border border-[#DAD7CD] transition-all"
              title="Change Language"
            >
              <Languages className="w-4 h-4 text-[#588157]" />
              <span>{language === 'HI' ? 'English (EN)' : 'हिन्दी (HI)'}</span>
            </button>
            <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 animate-pulse">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Google AI Startup Submission</span>
            </div>
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
                  {language === 'HI' ? 'आवाज़-फर्स्ट तकनीक' : 'Voice-First AI Input'}
                </span>
                <h3 className="text-xl font-bold text-[#1B3022] flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-[#588157]" /> 
                  {language === 'HI' ? 'अपनी भाषा में बोलें' : 'Speak in Your Native Language'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xl">
                  {language === 'HI' 
                    ? 'बिना टाइप किए सिर्फ माइक बटन दबाकर बोलें। जेमिनी एआई आपकी आवाज़ और बोली पहचानकर सीधे लाइव भाव खोजेगा।' 
                    : 'Zero typing required. Speak using your local dialect. Gemini reads your unstructured speech & queries live buyers instantly.'}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center shrink-0">
                <button
                  onClick={simulateVoiceRecording}
                  disabled={isRecording}
                  className={\`w-20 h-20 rounded-full flex items-center justify-center transition-all \${
                    isRecording 
                      ? 'bg-amber-500 text-white animate-pulse' 
                      : 'bg-[#3A5A40] text-white hover:scale-105 shadow-lg shadow-[#588157]/20 hover:shadow-[#588157]/30'
                  }\`}
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
                  <Volume2 className={\`w-4 h-4 \${playingTTS ? 'animate-pulse text-amber-400' : ''}\`} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Multimodal Image Inspection Card */}
            <div className="lg:col-span-5 bg-white border border-[#E8E4D9] rounded-3xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#588157] font-extrabold uppercase tracking-widest block mb-1">
                  {language === 'HI' ? 'मल्टीमोडल इमेज विश्लेषण' : 'Multimodal Image Analysis'}
                </span>
                <h3 className="text-lg font-bold text-[#1B3022] flex items-center mb-1">
                  <Camera className="w-5 h-5 mr-2 text-[#588157]" />
                  {language === 'HI' ? 'खेत से डायरेक्ट स्कैन' : 'Direct Harvest Inspection'}
                </h3>
                <p className="text-xs text-gray-500 mb-5">
                  {language === 'HI' 
                    ? 'अपनी फसल या अनाज की फोटो अपलोड करें। जेमिनी एआई उसकी क्वालिटी ग्रेड और शेल्फ लाइफ का विश्लेषण करेगा।' 
                    : 'Simply snap or select a harvest photo. Gemini evaluates raw quality parameters, damage estimates, and shelf-life.'}
                </p>

                {analyzingCrop ? (
                  <div className="aspect-video w-full rounded-2xl bg-black/80 border border-[#E8E4D9] flex flex-col items-center justify-center space-y-3 text-center p-6">
                    <div className="w-12 h-12 border-4 border-[#588157]/20 border-t-[#588157] rounded-full animate-spin"></div>
                    <div>
                      <h5 className="font-bold text-[#2D332A]">Gemini Analyzing Quality...</h5>
                      <p className="text-[10px] text-gray-500 mt-1">Inspecting pigmentation, spot damages, and volume yields.</p>
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

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <label className="flex flex-col items-center justify-center p-4 bg-[#FDFCF8] hover:bg-[#F0EDE4] border border-[#E8E4D9] hover:border-[#588157]/40 rounded-2xl cursor-pointer transition-all group text-center">
                    <Camera className="w-5 h-5 text-[#588157] mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-[#2D332A]">{language === 'HI' ? 'कैमरा फोटो' : 'Camera Snap'}</span>
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
                    <span className="text-[11px] font-bold text-[#2D332A]">{language === 'HI' ? 'गैलरी से चुनें' : 'Upload Image'}</span>
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
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-[#E8E4D9] rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-[#3A5A40]/10 text-[#588157] rounded-xl">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#588157] font-extrabold uppercase tracking-widest block">
                        {language === 'HI' ? 'लोकल और डिजिटल मंडी भाव' : 'Live Digital Market Bids'}
                      </span>
                      <h4 className="text-lg font-black text-[#1B3022]">
                        {language === 'HI' ? 'आपके माल की सबसे अच्छी कीमत' : 'Highest Buyer Matches'}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-[#FDFCF8] border border-[#E8E4D9] rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#3A5A40]/10 text-[#588157] rounded-xl flex items-center justify-center font-black">M</div>
                        <div>
                          <h5 className="text-xs font-bold text-[#2D332A]">Local APMC Mandi</h5>
                          <p className="text-[10px] text-gray-500">Avg. clearing price today</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <p className="text-sm font-black text-[#1B3022]">₹{inspectionResult?.marketComparison?.mandi}/Kg</p>
                        <p className="text-[9px] text-gray-400">Requires local transport</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#FDFCF8] border border-[#E8E4D9] rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-black">B</div>
                        <div>
                          <h5 className="text-xs font-bold text-[#2D332A]">Blinkit 10-Min Supply</h5>
                          <p className="text-[10px] text-gray-500">Fast clearance pricing</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <p className="text-sm font-black text-[#1B3022]">₹{inspectionResult?.marketComparison?.blinkit}/Kg</p>
                        {bestOffer?.name?.includes('Blinkit') ? (
                          <span className="text-[8px] bg-[#3A5A40]/10 text-[#588157] px-1.5 py-0.5 rounded font-bold">BEST DEAL</span>
                        ) : (
                          <p className="text-[9px] text-gray-400">High rejection risk</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F0EDE4] border border-[#DAD7CD] rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-500/20 text-[#3A5A40] rounded-xl flex items-center justify-center font-black">BB</div>
                        <div>
                          <h5 className="text-xs font-bold text-[#2D332A]">BigBasket Fresh</h5>
                          <p className="text-[10px] text-[#588157]">Premium graded pricing</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <p className="text-sm font-black text-[#3A5A40]">₹{inspectionResult?.marketComparison?.bigbasket}/Kg</p>
                        {bestOffer?.name?.includes('BigBasket') ? (
                          <span className="text-[8px] bg-[#3A5A40] text-white px-1.5 py-0.5 rounded font-bold">HIGHEST BID</span>
                        ) : (
                          <p className="text-[9px] text-gray-400">Verified buyers</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#FDFCF8] border border-[#E8E4D9] rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-black">RR</div>
                        <div>
                          <h5 className="text-xs font-bold text-[#2D332A]">Reliance Fresh Direct</h5>
                          <p className="text-[10px] text-gray-500">Bulk retail procurement pricing</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <p className="text-sm font-black text-[#588157]">₹{inspectionResult?.marketComparison?.reliance}/Kg</p>
                        {bestOffer?.name?.includes('Reliance') ? (
                          <span className="text-[8px] bg-[#3A5A40]/10 text-[#588157] px-1.5 py-0.5 rounded font-bold">BEST DEAL</span>
                        ) : (
                          <p className="text-[9px] text-gray-400">Direct warehouse collect</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E8E4D9] rounded-3xl p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
                  
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-[#3A5A40]/10 text-[#588157] rounded-xl">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">
                        {language === 'HI' ? 'ऑटोमैटिक नेगोशिएशन और लॉजिस्टिक्स' : 'Transaction & Logistics Automation'}
                      </span>
                      <h4 className="text-lg font-black text-[#1B3022]">
                        {language === 'HI' ? 'व्हाट्सएप (WhatsApp) ऑटो-मेसेज' : 'Auto-Formatted WhatsApp Dispatch'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'HI' 
                          ? 'जेमिनी एआई ने आपके लिए सबसे अच्छे खरीदार और ट्रांसपोर्टर के लिए डायरेक्ट बातचीत का मेसेज तैयार किया है।' 
                          : 'Gemini formats an structured, highly persuasive Hindi offer to negotiate instantly with local truck drivers or nearby digital warehouses.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FDFCF8] border border-[#E8E4D9] rounded-2xl relative">
                    <div className="absolute top-2 right-2 bg-black text-[9px] text-gray-400 px-2 py-0.5 rounded uppercase font-mono">
                      Hindi (Local Format)
                    </div>
                    <p className="text-xs text-[#3A5A40] leading-relaxed italic pr-12">
                      "{inspectionResult?.negotiationHindi}"
                    </p>
                    <div className="mt-4 pt-3 border-t border-[#E8E4D9]/80 flex justify-between items-center text-[11px] text-gray-500">
                      <div className="flex items-center space-x-1.5 text-[#588157] font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Best Offer Matched: {bestOffer?.name} (₹{bestOffer?.value}/Kg)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inspectionResult?.negotiationHindi);
                        setSuccessMsg("Copied: WhatsApp message template saved to clipboard!");
                      }}
                      className="px-4 py-3 bg-[#F0EDE4] hover:bg-[#DAD7CD] text-[#2D332A] border border-[#DAD7CD] font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-4 h-4 text-gray-500" />
                      <span>{language === 'HI' ? 'मेसेज कॉपी करें (WhatsApp)' : 'Copy Message for WhatsApp'}</span>
                    </button>

                    <a
                      href={\`https://api.whatsapp.com/send?text=\${encodeURIComponent(inspectionResult?.negotiationHindi)}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-[#3A5A40] hover:bg-[#2D332A] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-[#588157]/10"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{language === 'HI' ? 'गाड़ी बुक करें (व्हाट्सएप)' : 'Send Direct to Transporters'}</span>
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
`

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const marker = '          <div className="flex items-center space-x-4">';
const index = code.indexOf(marker);

if (index !== -1) {
    fs.writeFileSync('src/App.tsx', code.slice(0, index) + replacement);
} else {
    console.log("MARKER NOT FOUND");
}
