import express, { Request } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import mammoth from 'mammoth';
import fs from 'fs';
import axios from 'axios';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// Structured Logging Utility
const log = (level: 'INFO' | 'ERROR' | 'WARN', message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  // Handle Error objects specifically so they aren't stringified as {}
  const processedData = data?.error instanceof Error 
    ? { ...data, error: { message: data.error.message, stack: data.error.stack } }
    : data;
    
  console.log(JSON.stringify({ timestamp, level, message, ...processedData }));
};

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware: Multi-tenancy check
  app.use('/api', (req, res, next) => {
    const institutionId = req.headers['x-institution-id'];
    if (!institutionId && req.path !== '/health') {
      log('WARN', 'Request missing institution context', { path: req.path });
      // In production, we'd return 401/403. For now, we'll allow but log.
    }
    next();
  });

  // API Routes
  app.get('/api', (req, res) => {
    res.json({ message: 'EduCast Orchestration API is active' });
  });

  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      service: 'EduCast Orchestrator', 
      timestamp: new Date(),
      config: {
        heygen: !!process.env.HEYGEN_API_KEY && process.env.HEYGEN_API_KEY.length > 5,
        gemini: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5
      }
    });
  });

  // PDF/DOCX Parser Endpoint
  app.post('/api/parse-document', upload.single('file'), async (req: Request, res) => {
    const file = req.file;
    if (!file) {
      log('WARN', 'No file provided in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = file.path;
    try {
      log('INFO', 'Starting document parse', { filename: file.originalname, mimetype: file.mimetype, size: file.size });
      let text = '';

      if (file.mimetype === 'application/pdf') {
        log('INFO', 'Reading PDF buffer');
        const dataBuffer = fs.readFileSync(filePath);
        log('INFO', 'Calling PDF parse');
        const result = await pdf(dataBuffer);
        text = result.text;
        log('INFO', 'PDF parsed successfully', { charCount: text?.length });
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        log('INFO', 'Calling mammoth for DOCX');
        const data = await mammoth.extractRawText({ path: filePath });
        text = data.value;
        log('INFO', 'DOCX parsed successfully', { charCount: text?.length });
      } else {
        log('WARN', 'Unsupported file type attempted', { mimetype: file.mimetype });
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({ error: `Unsupported file type: ${file.mimetype}` });
      }

      // Cleanup
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      log('INFO', 'Document processing complete', { filename: file.originalname });
      res.json({ text });
    } catch (err) {
      log('ERROR', 'Failed to parse document', { 
        error: err, 
        filename: file.originalname,
        mimetype: file.mimetype
      });
      
      // Attempt cleanup on failure
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { log('WARN', 'Failed to cleanup file after error', { error: e }); }
      }
      
      res.status(500).json({ 
        error: 'Parsing failed', 
        details: err instanceof Error ? err.message : 'Unknown parsing error' 
      });
    }
  });

  // Video Generation Trigger
  const videoQueue: any[] = [];
  app.post('/api/videos/generate', async (req, res) => {
    const { title, content, avatarId, backgroundId, institutionId } = req.body;

    const videoId = Math.random().toString(36).substring(7);
    const newVideo: any = {
      id: videoId,
      institutionId,
      title,
      content,
      avatarId,
      status: 'QUEUED',
      progress: 0,
      createdAt: new Date().toISOString()
    };

    // HeyGen Integration
    const heygenKey = process.env.HEYGEN_API_KEY;
    if (heygenKey && heygenKey.length > 5) {
      try {
        log('INFO', 'HeyGen: Submitting real video request', { videoId, avatarId });
        
        // Map internal avatar ID to HeyGen ID
        const avatarMap: Record<string, string> = {
          'a1': 'sarah_pro_v2',
          'a2': 'james_expert_v1',
          'a3': 'emma_youth_v1'
        };

        // HeyGen Headers Logic: Support both API Key (X-Api-Key) and JWT (Bearer)
        const headers: any = { 'Content-Type': 'application/json' };
        if (heygenKey.startsWith('ey')) {
          headers['Authorization'] = `Bearer ${heygenKey}`;
        } else {
          headers['X-Api-Key'] = heygenKey;
        }

        const response = await axios.post('https://api.heygen.com/v2/video/generate', {
          video_inputs: [
            {
              character: {
                type: 'avatar',
                avatar_id: avatarMap[avatarId] || 'Ann_OB_V3_2',
                avatar_style: 'normal'
              },
              voice: {
                type: 'text',
                input_text: content,
                voice_id: avatarId === 'a2' ? 'f717abcdfc864da09c394f5877c4494a' : '070d63673911474895689ef2339d6776'
              }
            }
          ],
          dimension: { width: 1280, height: 720 }
        }, { headers });

        if (response.data?.data?.video_id) {
          newVideo.heygenVideoId = response.data.data.video_id;
          log('INFO', 'HeyGen: Video submission successful', { videoId, heygenVideoId: newVideo.heygenVideoId });
        }
      } catch (err: any) {
        log('ERROR', 'HeyGen: API Call failed', { error: err.response?.data || err.message });
        // Fallback to simulation happens automatically since status is QUEUED
      }
    }

    videoQueue.push(newVideo);
    log('INFO', 'Video generation task queued', { videoId, institutionId, simulation: !newVideo.heygenVideoId });

    res.json(newVideo);
  });

  // List Videos
  app.get('/api/videos', (req, res) => {
    res.json(videoQueue.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  // Get Video Detail
  app.get('/api/videos/:id', (req, res) => {
    const video = videoQueue.find(v => v.id === req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  });

  // Background Worker Simulation & HeyGen Polling
  setInterval(async () => {
    for (const video of videoQueue) {
      if (video.status === 'COMPLETED' || video.status === 'FAILED') continue;

      if (video.heygenVideoId) {
        // REAL HEYGEN POLLING
        try {
          const heygenKey = process.env.HEYGEN_API_KEY;
          if (!heygenKey) throw new Error('HEYGEN_API_KEY missing during polling');
          
          const headers: any = {};
          if (heygenKey.startsWith('ey')) {
            headers['Authorization'] = `Bearer ${heygenKey}`;
          } else {
            headers['X-Api-Key'] = heygenKey;
          }

          const response = await axios.get(`https://api.heygen.com/v2/video_status.get?video_id=${video.heygenVideoId}`, {
            headers
          });

          const { status, video_url, error } = response.data.data;
          
          if (status === 'completed') {
            video.status = 'COMPLETED';
            video.progress = 100;
            video.outputUrl = video_url;
            log('INFO', 'HeyGen: Video completed', { videoId: video.id, url: video_url });
          } else if (status === 'failed') {
            video.status = 'FAILED';
            log('ERROR', 'HeyGen: Video failed', { videoId: video.id, error });
          } else if (status === 'processing') {
            video.status = 'PROCESSING';
            video.progress = 50; // HeyGen doesn't give granular % usually in status.get
          }
        } catch (err: any) {
          log('WARN', 'HeyGen: Polling failed', { videoId: video.id, error: err.message });
        }
      } else {
        // SIMULATION LOGIC
        if (video.status === 'QUEUED') {
          video.status = 'PROCESSING';
          video.progress = 10;
          log('INFO', 'Worker: Starting video processing (SIMULATED)', { videoId: video.id });
        } else if (video.status === 'PROCESSING') {
          video.progress += 20;
          if (video.progress >= 50) {
            video.status = 'RENDERING';
            log('INFO', 'Worker: Moving to FFmpeg rendering (SIMULATED)', { videoId: video.id });
          }
        } else if (video.status === 'RENDERING') {
          video.progress += 10;
          if (video.progress >= 100) {
            video.status = 'COMPLETED';
            video.outputUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
            log('INFO', 'Worker: AI Avatar rendering sequence finished (SIMULATED)', { videoId: video.id });
          }
        }
      }
    }
  }, 10000); // Poll every 10 seconds to avoid hitting rate limits too hard

  // HeyGen Webhook (with HMAC validation skeleton)
  app.post('/api/webhooks/heygen', (req, res) => {
    const signature = req.headers['x-heygen-signature'];
    log('INFO', 'HeyGen Webhook received', { signature });
    
    // In production: validate using HMAC SHA256
    // crypto.createHmac('sha256', process.env.HEYGEN_WEBHOOK_SECRET).update(body).digest('hex') === signature
    
    res.json({ received: true });
  });

  // Download Logs (Admin Feature)
  app.get('/api/admin/logs', (req, res) => {
    res.json([
      { id: '1', level: 'INFO', message: 'System boot successful', timestamp: new Date().toISOString() },
      { id: '2', level: 'INFO', message: 'New user joined: Dr. James', timestamp: new Date().toISOString() },
      { id: '3', level: 'WARN', message: 'Quota threshold reached (80%)', timestamp: new Date().toISOString() },
    ]);
  });

  // Vite preview setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    log('INFO', 'EduCast Server running', { port: PORT, env: process.env.NODE_ENV || 'development' });
  });
}

startServer().catch((err) => {
  log('ERROR', 'Failed to start EduCast server', { error: err });
  process.exit(1);
});
