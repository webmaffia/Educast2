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
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: `I have extracted the following text from a educational document. 
        Please transform it into a concise, engaging, and professional script for an AI video presenter. 
        The script should be ready for a 1-2 minute video. Provide ONLY the script text.
        
        TEXT:
        ${text.substring(0, 5000)}`,
        config: {
          systemInstruction: "You are an expert instructional designer. Your goal is to rewrite academic text into speaking scripts that are clear, engaging, and easy for an AI avatar to present."
        }
      });

      if (response.text) {
        setContent(response.text);
      }
    } catch (err) {
      console.error('Gemini failed', err);
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
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <s.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                step === s.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
        <div className="flex-1 p-8">
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
        <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50 rounded-b-2xl">
          <button
            onClick={prevStep}
            disabled={step === 1 || isGenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              step === 1 ? 'opacity-0 cursor-default' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < 5 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
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
            <h2 className="text-xl font-bold text-slate-900">Training Content</h2>
            <p className="text-sm text-slate-500">Enter your slide content manually or upload a PDF/DOCX.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Video Title</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => actions.setTitle(e.target.value)}
                placeholder="e.g. Introduction to Psychology"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => actions.fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group relative"
              >
                <input 
                  type="file" 
                  ref={actions.fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.docx"
                  onChange={actions.handleFileUpload}
                />
                {data.isParsing ? (
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                ) : (
                  <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                )}
                <div className="text-center">
                  <p className="font-bold text-slate-900">{data.isParsing ? 'Parsing Document...' : 'Upload Document'}</p>
                  <p className="text-xs text-slate-500">PDF, DOCX up to 10MB</p>
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Manual Input & AI Script</span>
                  {data.isGeneratingScript && (
                    <span className="text-indigo-600 flex items-center gap-1 normal-case font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Gemini is generating script...
                    </span>
                  )}
                </label>
                <textarea
                  value={data.content}
                  onChange={(e) => actions.setContent(e.target.value)}
                  placeholder="Paste your slide notes here..."
                  className={`w-full h-[150px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed ${data.isGeneratingScript ? 'opacity-50' : ''}`}
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
            <h2 className="text-xl font-bold text-slate-900">Select AI Character</h2>
            <p className="text-sm text-slate-500">This avatar will present your educational content.</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {AVATARS.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => actions.setAvatarId(avatar.id)}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group ${
                  data.avatarId === avatar.id
                    ? 'border-indigo-600 shadow-xl scale-102 shadow-indigo-100'
                    : 'border-transparent hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <img src={avatar.previewImageUrl} alt={avatar.name} className="w-full h-full object-cover transition-all" />
                  {data.avatarId === avatar.id && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white p-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <p className="font-bold text-slate-900">{avatar.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{avatar.gender === 'FEMALE' ? 'Professional Female' : 'Expert Male'}</p>
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
            <h2 className="text-xl font-bold text-slate-900">Choose Environment</h2>
            <p className="text-sm text-slate-500">Pick a background for your virtual classroom.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {BACKGROUNDS.map((bg) => (
              <div
                key={bg.id}
                onClick={() => actions.setBackgroundId(bg.id)}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all relative aspect-video ${
                  data.backgroundId === bg.id
                    ? 'border-indigo-600 shadow-xl shadow-indigo-100'
                    : 'border-transparent hover:border-white shadow-sm'
                }`}
              >
                <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold">{bg.name}</p>
                </div>
                {data.backgroundId === bg.id && (
                  <div className="absolute top-3 right-3 bg-indigo-600 text-white p-1 rounded-full">
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
            <h2 className="text-xl font-bold text-slate-900">Visual Composition</h2>
            <p className="text-sm text-slate-500">Default: 28% Avatar, 72% Slide Content.</p>
          </div>
          <div className="bg-slate-950 aspect-video rounded-2xl relative overflow-hidden flex shadow-2xl border-4 border-slate-800">
            <img
              src={BACKGROUNDS.find(b => b.id === data.backgroundId)?.url}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative w-[28%] bg-black/40 border-r border-white/10 flex items-center justify-center">
              <img
                src={AVATARS.find(a => a.id === data.avatarId)?.previewImageUrl}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative w-[72%] p-12 flex flex-col justify-center">
              <div className="bg-white/95 p-8 rounded-xl shadow-2xl space-y-4">
                <h3 className="text-2xl font-black text-slate-900">{data.title || 'Slide Title Here'}</h3>
                <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                <p className="text-slate-600 text-sm leading-relaxed overflow-hidden text-ellipsis line-clamp-4">
                  {data.content || 'Your content will appear here...'}
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
            <h2 className="text-xl font-bold text-slate-900">Final Review</h2>
            <p className="text-sm text-slate-500">Once confirmed, the rendering process will begin.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</span>
                <span className="font-bold text-slate-900">{data.title || 'Untitled Video'}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Presenter</span>
                <span className="font-bold text-slate-900">{AVATARS.find(a => a.id === data.avatarId)?.name}</span>
              </div>
            </div>
            <div className="bg-indigo-600 p-8 rounded-2xl text-white text-center space-y-4 flex flex-col justify-center">
              <h3 className="text-xl font-bold">Ready to Start?</h3>
              <p className="text-xs text-indigo-100 italic">Production process estimate: 8 mins</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
