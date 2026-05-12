import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  User,
  Image as ImageIcon,
  Layout as LayoutIcon,
  Send,
  Upload,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { AVATARS, BACKGROUNDS } from '../constants';
import { useVideoStore } from '../store/useVideoStore';
import axios from 'axios';
import { GoogleGenAI } from '@google/genai';

const AI_MODEL = "gemini-3-flash-preview";

enum WizardStep {
  CONTENT = 1,
  AVATAR = 2,
  BACKGROUND = 3,
  LAYOUT = 4,
  REVIEW = 5
}

export function CreateVideo() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { title, content, avatarId, backgroundId, layout, setTitle, setContent, setAvatarId, setBackgroundId, reset } = useVideoStore();
  
  const [step, setStep] = useState<WizardStep>(WizardStep.CONTENT);
  const [isParsing, setIsParsing] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/parse-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-institution-id': 'oxford-1' }
      });
      
      const rawText = res.data.text;
      if (rawText) {
        await generateScriptFromText(rawText);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to parse document. Please ensure it is a valid PDF or DOCX.');
    } finally {
      setIsParsing(false);
    }
  };

  const generateScriptFromText = async (text: string) => {
    setIsGeneratingScript(true);
    console.log('Starting script generation with Gemini...', { textLength: text.length });
    
    try {
      // Check for API key availability
      const apiKey = (window as any).process?.env?.GEMINI_API_KEY || (process?.env?.GEMINI_API_KEY);
      
      if (!apiKey) {
        console.warn('Gemini API key not found in process.env, falling back to raw text');
        setContent(text.substring(0, 3000));
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: `I have extracted the following text from an educational document. 
        Please transform it into a concise, engaging, and professional script for an AI video presenter. 
        The script should be ready for a 1-2 minute video. Provide ONLY the script text.
        
        TEXT:
        ${text.substring(0, 5000)}`,
        config: {
          systemInstruction: "You are an expert instructional designer. Your goal is to rewrite academic text into speaking scripts that are clear, engaging, and easy for an AI avatar to present."
        }
      });

      if (response.text) {
        console.log('Script generated successfully');
        setContent(response.text);
      } else {
        console.warn('Gemini returned empty response');
        setContent(text.substring(0, 3000));
      }
    } catch (err) {
      console.error('Gemini generation failed:', err);
      // Fallback to raw text if AI fails
      setContent(text.substring(0, 3000));
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await axios.post('/api/videos/generate', {
        title,
        content,
        avatarId,
        backgroundId,
        layout,
        institutionId: 'oxford-1'
      }, {
        headers: { 'x-institution-id': 'oxford-1' }
      });
      reset();
      navigate('/');
    } catch (err) {
      console.error('Generation failed', err);
      alert('Failed to start generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Step Indicator */}
      <div className="flex items-center justify-between px-2">
        {[
          { id: WizardStep.CONTENT, label: 'Content', icon: FileText },
          { id: WizardStep.AVATAR, label: 'Avatar', icon: User },
          { id: WizardStep.BACKGROUND, label: 'Scene', icon: ImageIcon },
          { id: WizardStep.LAYOUT, label: 'Layout', icon: LayoutIcon },
          { id: WizardStep.REVIEW, label: 'Review', icon: Send },
        ].map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= s.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-card-bg text-[var(--text-secondary)] border border-border-subtle'
              }`}
            >
              <s.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                step === s.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-card-bg rounded-2xl border border-border-subtle min-h-[500px] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex-1 p-8 text-[var(--text-primary)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              {renderStep(step, { title, content, avatarId, backgroundId, isParsing, isGeneratingScript }, { setTitle, setContent, setAvatarId, setBackgroundId, fileInputRef, handleFileUpload })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-border-subtle flex justify-between bg-black/5 rounded-b-2xl">
          <button
            onClick={prevStep}
            disabled={step === 1 || isGenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              step === 1 ? 'opacity-0 cursor-default' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < 5 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isGenerating ? 'Starting AI Engine...' : 'Generate Video'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function renderStep(step: WizardStep, data: any, actions: any) {
  switch (step) {
    case WizardStep.CONTENT:
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Training Content</h2>
            <p className="text-sm">Enter your slide content manually or upload a PDF/DOCX.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">Video Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => actions.setTitle(e.target.value)}
                placeholder="e.g. Introduction to Psychology"
                className="w-full px-4 py-3 bg-black/5 border border-border-subtle rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-[var(--text-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => actions.fileInputRef.current?.click()}
                className="border-2 border-dashed border-border-subtle rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-gray-500 hover:bg-black/5 transition-all cursor-pointer group relative"
              >
                <input 
                  type="file" 
                  ref={actions.fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.docx"
                  onChange={actions.handleFileUpload}
                />
                {data.isParsing ? (
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : (
                  <div className="bg-blue-500/10 p-3 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                )}
                <div className="text-center">
                  <p className="font-bold text-white leading-tight">{data.isParsing ? 'Parsing Document...' : 'Upload Document'}</p>
                  <p className="text-[11px] opacity-60 mt-1">PDF, DOCX up to 10MB</p>
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center justify-between">
                  <span>Manual Input & AI Script</span>
                  {data.isGeneratingScript && (
                    <span className="text-blue-500 flex items-center gap-1 normal-case font-medium text-[11px]">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Gemini is generating script...
                    </span>
                  )}
                </label>
                <textarea
                  value={data.content}
                  onChange={(e) => actions.setContent(e.target.value)}
                  placeholder="Paste your slide notes here..."
                  className={`w-full h-[150px] px-4 py-3 bg-black/5 border border-border-subtle rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-gray-600 ${data.isGeneratingScript ? 'opacity-50' : ''}`}
                />
              </div>
            </div>
          </div>
        </div>
      );

    case WizardStep.AVATAR:
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Select AI Character</h2>
            <p className="text-sm opacity-60">This avatar will present your educational content.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {AVATARS.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => actions.setAvatarId(avatar.id)}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group ${
                  data.avatarId === avatar.id
                    ? 'border-blue-500 shadow-xl scale-[1.02] shadow-blue-500/10'
                    : 'border-transparent bg-black/5 hover:border-gray-300'
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <img src={avatar.previewImageUrl} alt={avatar.name} className="w-full h-full object-cover transition-all" />
                  {data.avatarId === avatar.id && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold">{avatar.name}</p>
                  <p className="text-[10px] opacity-60 uppercase font-black tracking-widest leading-none mt-1">{avatar.gender === 'FEMALE' ? 'Professional Female' : 'Expert Male'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case WizardStep.BACKGROUND:
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Choose Environment</h2>
            <p className="text-sm opacity-60">Pick a background for your virtual classroom.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {BACKGROUNDS.map((bg) => (
              <div
                key={bg.id}
                onClick={() => actions.setBackgroundId(bg.id)}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all relative aspect-video ${
                  data.backgroundId === bg.id
                    ? 'border-blue-500 shadow-xl shadow-blue-500/10 scale-[1.02]'
                    : 'border-transparent bg-black/5 hover:border-gray-300'
                }`}
              >
                <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-sm tracking-tight">{bg.name}</p>
                </div>
                {data.backgroundId === bg.id && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case WizardStep.LAYOUT:
      return (
        <div className="space-y-6">
           <div className="space-y-1">
            <h2 className="text-2xl font-bold">Visual Composition</h2>
            <p className="text-sm opacity-60">Default: 28% Avatar, 72% Slide Content.</p>
          </div>
          <div className="bg-black aspect-video rounded-2xl relative overflow-hidden flex shadow-2xl border-4 border-border-subtle">
            <img
              src={BACKGROUNDS.find(b => b.id === data.backgroundId)?.url}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative w-[28%] bg-black/40 border-r border-white/5 flex items-center justify-center">
              <img
                src={AVATARS.find(a => a.id === data.avatarId)?.previewImageUrl}
                className="w-full h-full object-cover grayscale opacity-80"
              />
            </div>
            <div className="relative w-[72%] p-12 flex flex-col justify-center">
              <div className="bg-card-bg/90 backdrop-blur-md p-8 rounded-xl shadow-2xl space-y-4 border border-white/5">
                <h3 className="text-2xl font-black tracking-tight">{data.title || 'Slide Title Here'}</h3>
                <div className="h-1 w-12 bg-blue-500 rounded-full" />
                <p className="text-sm leading-relaxed overflow-hidden text-ellipsis line-clamp-4 opacity-80">
                  {data.content || 'Your educational content will be synthesized into these slides...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case WizardStep.REVIEW:
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Final Review</h2>
            <p className="text-sm opacity-60">Once confirmed, the rendering process will begin.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-5 bg-black/5 rounded-2xl border border-border-subtle flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Video Title</span>
                <span className="font-bold text-lg">{data.title || 'Untitled Video'}</span>
              </div>
              <div className="p-5 bg-black/5 rounded-2xl border border-border-subtle flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Selected Presenter</span>
                <span className="font-bold text-lg">{AVATARS.find(a => a.id === data.avatarId)?.name}</span>
              </div>
            </div>
            <div className="bg-blue-600 p-10 rounded-2xl text-white text-center space-y-4 flex flex-col justify-center shadow-xl shadow-blue-500/10">
              <h3 className="text-2xl font-bold">Ready to Start?</h3>
              <p className="text-xs text-blue-100 italic opacity-80 font-medium">Production process estimate: 8 mins</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
