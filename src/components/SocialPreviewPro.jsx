import React, { useState, useRef, useEffect } from 'react';
import { Upload, Instagram, Linkedin, Twitter, Facebook, Download, Copy, Plus, X, Save, FileText, Hash, Link as LinkIcon, Eye, Smile, Package, TrendingUp, Grid, AlertTriangle } from 'lucide-react';

// Brand configuration
const BRAND_NAME = 'Fountain Vitality';
const BRAND_HANDLE = 'fountainvitality';
const BRAND_LOGO = '/logo.svg';

export default function SocialPreviewPro() {
  // Core state
  const [content, setContent] = useState('');
  const [firstComment, setFirstComment] = useState('');
  const [media, setMedia] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [viewMode, setViewMode] = useState('single');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram', 'linkedin']);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const previewRef = useRef(null);
  
  // Feature 1: Drafts & Templates
  const [drafts, setDrafts] = useState(() => JSON.parse(localStorage.getItem('socialDrafts') || '[]'));
  const [templates, setTemplates] = useState(() => JSON.parse(localStorage.getItem('socialTemplates') || '[]'));
  const [showDrafts, setShowDrafts] = useState(false);
  const [draftName, setDraftName] = useState('');
  
  // Feature 2: Hashtags
  const [showHashtagPanel, setShowHashtagPanel] = useState(false);
  const [hashtagSearch, setHashtagSearch] = useState('');
  const trendingHashtags = ['#Menopause', '#WomensHealth', '#HormoneHealth', '#Perimenopause', '#WellnessJourney', '#HealthyAging', '#SelfCare', '#MenopauseSupport', '#HotFlashes', '#WomenOver40', '#HormoneTherapy', '#MenopauseRelief'];
  
  // Feature 3: Aspect Ratio Warnings
  const [aspectWarnings, setAspectWarnings] = useState([]);
  
  // Feature 4: Accessibility
  const [altText, setAltText] = useState({});
  const [showAccessibility, setShowAccessibility] = useState(false);
  
  // Feature 5: Emoji Picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState(() => JSON.parse(localStorage.getItem('recentEmojis') || '["🔥", "💪", "🌸", "✨", "❤️", "🌟", "💜", "🦋"]'));
  const emojiCategories = {
    'Wellness': ['🔥', '💪', '🌸', '✨', '❤️', '🌟', '💜', '🦋', '🌺', '🧘‍♀️'],
    'Emotions': ['😊', '😍', '🥰', '😌', '😎', '🤗', '😅', '🙌', '👏', '💯'],
    'Symbols': ['✓', '→', '•', '✦', '⭐', '💫', '🎯', '📍', '🔔', '💡']
  };
  
  // Feature 6: Performance Predictor
  const [showPerformance, setShowPerformance] = useState(false);
  
  // Feature 7: Batch Mode
  const [batchMode, setBatchMode] = useState(false);
  const [batchPosts, setBatchPosts] = useState([{ id: 1, content: '', media: [] }]);
  
  // Feature 8: Brand Assets
  const [showBrandLibrary, setShowBrandLibrary] = useState(false);
  const [brandAssets] = useState({
    colors: ['#0f2a3d', '#2DD4BF', '#14B8A6', '#0d9488', '#134e4a'],
    logos: ['fountain-logo.png', 'fountain-icon.png'],
    fonts: ['Inter', 'Helvetica Neue', 'Arial']
  });

  // Feature 9: Upload Templates
  const [showTemplates, setShowTemplates] = useState(false);
  const uploadTemplates = {
    instagram: [
      { name: 'Feed Post', width: 1080, height: 1080, ratio: '1:1', desc: 'Square post' },
      { name: 'Portrait', width: 1080, height: 1350, ratio: '4:5', desc: 'Best engagement' },
      { name: 'Story/Reel', width: 1080, height: 1920, ratio: '9:16', desc: 'Full screen vertical' },
      { name: 'Landscape', width: 1080, height: 608, ratio: '16:9', desc: 'Wide format' },
    ],
    linkedin: [
      { name: 'Link Preview', width: 1200, height: 627, ratio: '1.91:1', desc: 'Article shares' },
      { name: 'Square Post', width: 1080, height: 1080, ratio: '1:1', desc: 'Standard post' },
      { name: 'Portrait', width: 1080, height: 1350, ratio: '4:5', desc: 'Document style' },
    ],
    twitter: [
      { name: 'Single Image', width: 1200, height: 675, ratio: '16:9', desc: 'Timeline preview' },
      { name: 'Two Images', width: 700, height: 800, ratio: '7:8', desc: 'Side by side' },
      { name: 'Header', width: 1500, height: 500, ratio: '3:1', desc: 'Profile banner' },
    ],
    tiktok: [
      { name: 'Video', width: 1080, height: 1920, ratio: '9:16', desc: 'Full screen' },
      { name: 'Photo', width: 1080, height: 1920, ratio: '9:16', desc: 'Photo mode' },
    ],
    facebook: [
      { name: 'Feed Post', width: 1200, height: 630, ratio: '1.91:1', desc: 'News feed' },
      { name: 'Square', width: 1080, height: 1080, ratio: '1:1', desc: 'Carousel' },
      { name: 'Story', width: 1080, height: 1920, ratio: '9:16', desc: 'Full screen' },
      { name: 'Cover Photo', width: 820, height: 312, ratio: '2.63:1', desc: 'Page cover' },
      { name: 'Event Cover', width: 1920, height: 1005, ratio: '1.91:1', desc: 'Event header' },
    ]
  };

  const platforms = {
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      limit: 2200,
      aspectRatios: ['1:1', '4:5', '16:9', '9:16'],
      defaultRatio: '1:1',
      videoLength: '90s',
      videoFormats: 'MP4, MOV',
      videoNote: 'Reels: 90s max, Feed: 60s max'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: Linkedin,
      limit: 3000,
      aspectRatios: ['1.91:1', '1:1', '16:9'],
      defaultRatio: '1.91:1',
      videoLength: '10min',
      videoFormats: 'MP4, MOV, AVI',
      videoNote: 'Native videos perform better'
    },
    twitter: {
      name: 'Twitter',
      icon: Twitter,
      limit: 280,
      aspectRatios: ['16:9', '1:1'],
      defaultRatio: '16:9',
      videoLength: '2m20s',
      videoFormats: 'MP4, MOV',
      videoNote: 'Max 512MB file size'
    },
    tiktok: {
      name: 'TikTok',
      icon: null,
      limit: 2200,
      aspectRatios: ['9:16'],
      defaultRatio: '9:16',
      videoLength: '10min',
      videoFormats: 'MP4, MOV, WebM',
      videoNote: 'Vertical video performs best'
    },
    facebook: {
      name: 'Facebook',
      icon: Facebook,
      limit: 63206,
      aspectRatios: ['1.91:1', '1:1', '4:5', '16:9'],
      defaultRatio: '1.91:1',
      videoLength: '240min',
      videoFormats: 'MP4, MOV',
      videoNote: 'First 3 seconds are crucial'
    }
  };

  // Auto-save drafts
  useEffect(() => {
    const interval = setInterval(() => {
      if (content || media.length > 0) {
        const autoSave = {
          id: 'autosave',
          name: 'Auto-save',
          content,
          firstComment,
          media: media.map(m => ({ type: m.type, url: m.url.substring(0, 100) })), // Truncate for storage
          timestamp: new Date().toISOString()
        };
        const updatedDrafts = [autoSave, ...drafts.filter(d => d.id !== 'autosave')].slice(0, 20);
        setDrafts(updatedDrafts);
        localStorage.setItem('socialDrafts', JSON.stringify(updatedDrafts));
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [content, firstComment, media]);

  // Update recent emojis in localStorage
  useEffect(() => {
    localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis));
  }, [recentEmojis]);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newMedia = [];
      let loadedCount = 0;
      
      files.forEach((file) => {
        const isVideo = file.type.startsWith('video/');
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const mediaItem = { 
            url: e.target.result, 
            file, 
            type: isVideo ? 'video' : 'image',
            duration: null 
          };
          
          // Check aspect ratio for warnings
          if (!isVideo) {
            const img = new Image();
            img.onload = () => {
              const aspectRatio = img.width / img.height;
              checkAspectRatioWarnings(aspectRatio, platforms[selectedPlatform].defaultRatio);
            };
            img.src = e.target.result;
          }
          
          newMedia.push(mediaItem);
          loadedCount++;
          
          if (loadedCount === files.length) {
            setMedia([...media, ...newMedia].slice(0, 10));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const checkAspectRatioWarnings = (imageRatio, targetRatio) => {
    const warnings = [];
    const ratioMap = { '1:1': 1, '4:5': 0.8, '16:9': 1.78, '9:16': 0.56, '1.91:1': 1.91 };
    const target = ratioMap[targetRatio] || 1;
    
    if (Math.abs(imageRatio - target) > 0.3) {
      warnings.push(`Image will be cropped significantly on ${platforms[selectedPlatform].name}`);
    }
    setAspectWarnings(warnings);
  };

  const removeMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
    if (currentMediaIndex >= media.length - 1) {
      setCurrentMediaIndex(Math.max(0, media.length - 2));
    }
  };

  const copyToClipboard = async (platform) => {
    let textToCopy = content;
    
    if (platform === 'instagram' && firstComment) {
      textToCopy = `${content}\n\n---\nFirst Comment:\n${firstComment}`;
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(platform);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const saveDraft = () => {
    const draft = {
      id: Date.now(),
      name: draftName || `Draft ${new Date().toLocaleDateString()}`,
      content,
      firstComment,
      media: media.map(m => ({ type: m.type, url: m.url.substring(0, 100) })),
      timestamp: new Date().toISOString()
    };
    const updated = [draft, ...drafts.filter(d => d.id !== 'autosave')];
    setDrafts(updated);
    localStorage.setItem('socialDrafts', JSON.stringify(updated));
    setDraftName('');
    alert('Draft saved!');
  };

  const loadDraft = (draft) => {
    setContent(draft.content);
    setFirstComment(draft.firstComment || '');
    setShowDrafts(false);
  };

  const saveTemplate = () => {
    const template = {
      id: Date.now(),
      name: prompt('Template name:'),
      content,
      firstComment
    };
    if (template.name) {
      const updated = [template, ...templates];
      setTemplates(updated);
      localStorage.setItem('socialTemplates', JSON.stringify(updated));
      alert('Template saved!');
    }
  };

  const insertHashtag = (tag) => {
    const textarea = document.querySelector('textarea[placeholder*="caption"]');
    const cursorPos = textarea.selectionStart;
    const newContent = content.slice(0, cursorPos) + tag + ' ' + content.slice(cursorPos);
    setContent(newContent);
  };

  const addEmoji = (emoji) => {
    const textarea = document.querySelector('textarea[placeholder*="caption"]');
    const cursorPos = textarea?.selectionStart || content.length;
    const newContent = content.slice(0, cursorPos) + emoji + content.slice(cursorPos);
    setContent(newContent);
    
    // Update recent emojis
    const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 8);
    setRecentEmojis(updated);
  };

  const predictPerformance = () => {
    // Simulated prediction
    const hasVideo = media.some(m => m.type === 'video');
    const hasHashtags = (content + firstComment).match(/#\w+/g)?.length || 0;
    const wordCount = content.split(' ').length;
    
    const score = (hasVideo ? 30 : 20) + (hasHashtags * 5) + (wordCount > 50 ? 20 : 10);
    
    setShowPerformance(true);
    return {
      score: Math.min(score, 100),
      estimatedReach: `${Math.floor(Math.random() * 5000 + 1000).toLocaleString()} - ${Math.floor(Math.random() * 10000 + 5000).toLocaleString()}`,
      bestTime: '10:00 AM or 2:00 PM EST',
      tips: [
        hasVideo ? '✅ Video content performs 2x better' : '💡 Consider adding a video',
        hasHashtags > 5 ? '✅ Good hashtag usage' : '💡 Add more relevant hashtags',
        wordCount > 50 ? '✅ Good caption length' : '💡 Longer captions get more engagement'
      ]
    };
  };

  const getCharacterStatus = (platform) => {
    const limit = platforms[platform].limit;
    const remaining = limit - content.length;
    const percentage = (content.length / limit) * 100;
    
    if (percentage >= 90) return { color: '#e74c3c', status: 'critical' };
    if (percentage >= 75) return { color: '#f39c12', status: 'warning' };
    return { color: '#2ecc71', status: 'good' };
  };

  const togglePlatformInComparison = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      }
    } else {
      if (selectedPlatforms.length < 3) {
        setSelectedPlatforms([...selectedPlatforms, platform]);
      }
    }
  };

  const exportScreenshot = async () => {
    alert('Screenshot export would use html2canvas library. In production, this would capture the preview and download as PNG.');
  };

  const downloadTemplate = (template, platformName) => {
    // Create a canvas with the template dimensions
    const canvas = document.createElement('canvas');
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');
    
    // Fill with brand color background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
    
    // Draw guide lines (rule of thirds)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([10, 10]);
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(canvas.width / 3, 0);
    ctx.lineTo(canvas.width / 3, canvas.height);
    ctx.moveTo((canvas.width / 3) * 2, 0);
    ctx.lineTo((canvas.width / 3) * 2, canvas.height);
    // Horizontal lines
    ctx.moveTo(0, canvas.height / 3);
    ctx.lineTo(canvas.width, canvas.height / 3);
    ctx.moveTo(0, (canvas.height / 3) * 2);
    ctx.lineTo(canvas.width, (canvas.height / 3) * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw center crosshair
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 30, centerY);
    ctx.lineTo(centerX + 30, centerY);
    ctx.moveTo(centerX, centerY - 30);
    ctx.lineTo(centerX, centerY + 30);
    ctx.stroke();
    
    // Draw text info
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${platformName} - ${template.name}`, canvas.width / 2, 50);
    ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${template.width} × ${template.height}px (${template.ratio})`, canvas.width / 2, 80);
    
    // Draw safe zone indicator at bottom
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Safe zone: keep important content within guide lines', canvas.width / 2, canvas.height - 30);
    
    // Download the canvas as PNG
    const link = document.createElement('a');
    link.download = `${platformName.toLowerCase()}-${template.name.toLowerCase().replace(/\s+/g, '-')}-${template.width}x${template.height}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Preview Components
  const InstagramPreview = () => {
    const currentMedia = media[currentMediaIndex];
    const hashtags = (content + ' ' + firstComment).match(/#\w+/g) || [];
    
    return (
      <div className="preview-card" style={{ background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)' }}>
        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #efefef', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={BRAND_LOGO} alt={BRAND_NAME} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{BRAND_HANDLE}</div>
              <div style={{ fontSize: '11px', color: '#8e8e8e' }}>Sponsored</div>
            </div>
          </div>
          {currentMedia && (
            <div style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '1/1', background: '#f0f0f0', overflow: 'hidden' }}>
                {currentMedia.type === 'image' ? (
                  <img src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                ) : (
                  <video src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls muted={isMuted} loop />
                )}
              </div>
              {media.length > 1 && (
                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                  {media.map((_, idx) => (
                    <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: idx === currentMediaIndex ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} onClick={() => setCurrentMediaIndex(idx)} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: '14px', lineHeight: '1.4', color: '#262626', marginBottom: firstComment ? '12px' : '0' }}>
              <span style={{ fontWeight: '600', marginRight: '6px' }}>{BRAND_HANDLE}</span>
              {content || 'Your caption will appear here...'}
            </div>
            {firstComment && (
              <div style={{ fontSize: '14px', lineHeight: '1.4', color: '#262626', paddingTop: '12px', borderTop: '1px solid #efefef' }}>
                <span style={{ fontWeight: '600', marginRight: '6px' }}>{BRAND_HANDLE}</span>
                <span style={{ color: '#8e8e8e' }}>{firstComment}</span>
              </div>
            )}
            {hashtags.length > 0 && (
              <div style={{ fontSize: '12px', color: '#8e8e8e', marginTop: '8px' }}>
                {hashtags.length} hashtag{hashtags.length !== 1 ? 's' : ''} {hashtags.length > 30 && <span style={{ color: '#ed4956' }}>⚠️ Limit: 30</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LinkedInPreview = () => {
    const currentMedia = media[currentMediaIndex];
    return (
      <div className="preview-card" style={{ background: 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)' }}>
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={BRAND_LOGO} alt={BRAND_NAME} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#000' }}>{BRAND_NAME}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>4,521 followers • 1h</div>
            </div>
          </div>
          <div style={{ padding: '12px 16px', fontSize: '14px', lineHeight: '1.5', color: '#000', whiteSpace: 'pre-wrap' }}>
            {content || 'Your post content will appear here...'}
          </div>
          {currentMedia && (
            <div style={{ aspectRatio: '1.91/1', background: '#f0f0f0', overflow: 'hidden' }}>
              {currentMedia.type === 'image' ? (
                <img src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
              ) : (
                <video src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls muted={isMuted} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const TwitterPreview = () => {
    const status = getCharacterStatus('twitter');
    const currentMedia = media[currentMediaIndex];
    return (
      <div className="preview-card" style={{ background: 'linear-gradient(135deg, #1da1f2 0%, #0c85d0 100%)' }}>
        <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '12px 16px', display: 'flex', gap: '12px' }}>
            <img src={BRAND_LOGO} alt={BRAND_NAME} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f1419', marginBottom: '4px' }}>{BRAND_NAME} @{BRAND_HANDLE} · 2m</div>
              <div style={{ fontSize: '15px', lineHeight: '1.4', color: '#0f1419', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                {content || 'Your tweet will appear here...'}
              </div>
              {currentMedia && (
                <div style={{ aspectRatio: '16/9', background: '#f0f0f0', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px' }}>
                  {currentMedia.type === 'image' ? (
                    <img src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                  ) : (
                    <video src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls muted={isMuted} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {content.length > 0 && (
          <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '13px', color: status.color, fontWeight: '600' }}>
            {platforms.twitter.limit - content.length} characters remaining
          </div>
        )}
      </div>
    );
  };

  const TikTokPreview = () => {
    const currentMedia = media[currentMediaIndex];
    return (
      <div className="preview-card" style={{ background: 'linear-gradient(135deg, #000 0%, #ee1d52 50%, #69c9d0 100%)' }}>
        <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', aspectRatio: '9/16' }}>
          {currentMedia ? (
            <div style={{ position: 'relative', height: '100%' }}>
              {currentMedia.type === 'image' ? (
                <img src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
              ) : (
                <video src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls muted={isMuted} loop />
              )}
              <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: '#fff' }}>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  <strong>@{BRAND_HANDLE}</strong> {content || 'Your TikTok caption...'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Upload media to preview</div>
          )}
        </div>
      </div>
    );
  };

  const FacebookPreview = () => {
    const currentMedia = media[currentMediaIndex];
    return (
      <div className="preview-card" style={{ background: 'linear-gradient(135deg, #1877f2 0%, #0c63d4 100%)' }}>
        <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e4e6eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={BRAND_LOGO} alt={BRAND_NAME} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <strong style={{ fontSize: '15px' }}>{BRAND_NAME}</strong>
              <div style={{ fontSize: '13px', color: '#65676b' }}>2h · 🌐</div>
            </div>
          </div>
          <div style={{ padding: '12px 16px', fontSize: '15px', lineHeight: '1.3333', color: '#050505', whiteSpace: 'pre-wrap' }}>
            {content || 'Your Facebook post will appear here...'}
          </div>
          {currentMedia && (
            <div style={{ aspectRatio: '1.91/1', background: '#f0f0f0', overflow: 'hidden' }}>
              {currentMedia.type === 'image' ? (
                <img src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
              ) : (
                <video src={currentMedia.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls muted={isMuted} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPreview = (platform) => {
    const platformToUse = platform || selectedPlatform;
    switch(platformToUse) {
      case 'instagram': return <InstagramPreview />;
      case 'linkedin': return <LinkedInPreview />;
      case 'twitter': return <TwitterPreview />;
      case 'tiktok': return <TikTokPreview />;
      case 'facebook': return <FacebookPreview />;
      default: return null;
    }
  };

  const status = getCharacterStatus(viewMode === 'single' ? selectedPlatform : selectedPlatforms[0]);
  const performancePrediction = showPerformance ? predictPerformance() : null;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '20px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        .platform-btn { background: transparent; border: none; color: #64748b; padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: all 0.15s; font-family: inherit; font-weight: 500; font-size: 13px; display: flex; align-items: center; gap: 6px; }
        .platform-btn:hover { background: #f1f5f9; color: #0f172a; }
        .platform-btn.active { background: #0f172a; color: #fff; }
        .preview-card { padding: 20px; border-radius: 12px; }
        textarea:focus, input:focus { outline: none; box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1); }
        .char-counter { position: absolute; bottom: 8px; right: 12px; font-size: 11px; font-weight: 500; }
        .copy-btn { background: #0f172a; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-family: inherit; font-weight: 500; font-size: 12px; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .copy-btn:hover { background: #1e293b; }
        .copy-btn.success { background: #059669; }
        .media-thumb { position: relative; width: 64px; height: 64px; border-radius: 8px; overflow: hidden; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.15s; }
        .media-thumb:hover { border-color: #94a3b8; }
        .media-thumb.active { border-color: #0f172a; }
        .remove-btn { position: absolute; top: 2px; right: 2px; background: #0f172a; color: #fff; border: none; border-radius: 50%; width: 18px; height: 18px; cursor: pointer; font-size: 11px; opacity: 0; transition: opacity 0.15s; z-index: 10; }
        .media-thumb:hover .remove-btn { opacity: 1; }
        .panel { background: #fff; padding: 20px; border-radius: 12px; margin-bottom: 12px; border: 1px solid #e2e8f0; }
        .panel h3 { margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
        .tag { display: inline-block; padding: 5px 10px; background: #f8fafc; border-radius: 4px; margin: 3px; cursor: pointer; font-size: 12px; font-family: inherit; transition: all 0.15s; color: #475569; border: 1px solid #e2e8f0; }
        .tag:hover { background: #0f172a; color: #fff; border-color: #0f172a; }
        .emoji-btn { background: none; border: none; font-size: 20px; cursor: pointer; padding: 4px; transition: transform 0.1s; }
        .emoji-btn:hover { transform: scale(1.1); }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Minimal Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={BRAND_LOGO} alt={BRAND_NAME} style={{ width: '32px', height: '32px' }} />
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f2a3d' }}>Social Preview</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>by {BRAND_NAME}</div>
        </header>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '6px', background: '#f8fafc', borderRadius: '8px', width: 'fit-content' }}>
          <button onClick={() => setViewMode(viewMode === 'single' ? 'compare' : 'single')} className={`platform-btn ${viewMode === 'compare' ? 'active' : ''}`}>
            <Grid size={14} /> Compare
          </button>
          <button onClick={() => setShowTemplates(!showTemplates)} className={`platform-btn ${showTemplates ? 'active' : ''}`}>
            <Download size={14} /> Templates
          </button>
          <button onClick={() => setShowDrafts(!showDrafts)} className={`platform-btn ${showDrafts ? 'active' : ''}`}>
            <FileText size={14} /> Drafts
          </button>
          <button onClick={() => setShowHashtagPanel(!showHashtagPanel)} className={`platform-btn ${showHashtagPanel ? 'active' : ''}`}>
            <Hash size={14} /> Tags
          </button>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`platform-btn ${showEmojiPicker ? 'active' : ''}`}>
            <Smile size={14} />
          </button>
          <button onClick={() => setShowAccessibility(!showAccessibility)} className={`platform-btn ${showAccessibility ? 'active' : ''}`}>
            <Eye size={14} /> Alt
          </button>
          <button onClick={() => setShowBrandLibrary(!showBrandLibrary)} className={`platform-btn ${showBrandLibrary ? 'active' : ''}`}>
            <Package size={14} /> Brand
          </button>
          <button onClick={() => setShowPerformance(!showPerformance)} className={`platform-btn ${showPerformance ? 'active' : ''}`}>
            <TrendingUp size={14} />
          </button>
        </div>

        {/* Side Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: showTemplates || showDrafts || showHashtagPanel || showEmojiPicker || showAccessibility || showBrandLibrary || showPerformance ? '300px 1fr' : '1fr', gap: '24px' }}>
          {/* Left Sidebar */}
          {(showTemplates || showDrafts || showHashtagPanel || showEmojiPicker || showAccessibility || showBrandLibrary || showPerformance) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Templates Panel */}
              {showTemplates && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Upload Templates</h3>
                    <button onClick={() => setShowTemplates(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#64748b' }}>×</button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
                    Download templates with correct dimensions for each platform
                  </p>
                  
                  {Object.entries(uploadTemplates).map(([platformKey, templates]) => {
                    const platform = platforms[platformKey];
                    const Icon = platform?.icon;
                    return (
                      <div key={platformKey} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                          {Icon && <Icon size={14} />}
                          {platform?.name || platformKey}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {templates.map((template, idx) => (
                            <button
                              key={idx}
                              onClick={() => downloadTemplate(template, platform?.name || platformKey)}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 12px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                textAlign: 'left'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{template.name}</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>{template.width}×{template.height} · {template.ratio}</div>
                              </div>
                              <Download size={14} color="#64748b" />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Drafts Panel */}
              {showDrafts && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Drafts & Templates</h3>
                    <button onClick={() => setShowDrafts(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Draft name..." 
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}
                  />
                  <button onClick={saveDraft} className="copy-btn" style={{ width: '100%', marginBottom: '12px' }}>
                    <Save size={14} /> Save Current Draft
                  </button>
                  <button onClick={saveTemplate} className="copy-btn" style={{ width: '100%', marginBottom: '16px', background: '#475569' }}>
                    <Save size={14} /> Save as Template
                  </button>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {drafts.map(draft => (
                      <div key={draft.id} onClick={() => loadDraft(draft)} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                        <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>{draft.name}</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>{new Date(draft.timestamp).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtag Panel */}
              {showHashtagPanel && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Trending Hashtags</h3>
                    <button onClick={() => setShowHashtagPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search hashtags..." 
                    value={hashtagSearch}
                    onChange={(e) => setHashtagSearch(e.target.value)}
                    style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}
                  />
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {trendingHashtags.filter(tag => tag.toLowerCase().includes(hashtagSearch.toLowerCase())).map(tag => (
                      <span key={tag} className="tag" onClick={() => insertHashtag(tag)}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Emoji Picker</h3>
                    <button onClick={() => setShowEmojiPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ fontSize: '12px', color: '#666' }}>Recent</strong>
                    <div>{recentEmojis.map(emoji => <button key={emoji} className="emoji-btn" onClick={() => addEmoji(emoji)}>{emoji}</button>)}</div>
                  </div>
                  {Object.entries(emojiCategories).map(([category, emojis]) => (
                    <div key={category} style={{ marginBottom: '12px' }}>
                      <strong style={{ fontSize: '12px', color: '#666' }}>{category}</strong>
                      <div>{emojis.map(emoji => <button key={emoji} className="emoji-btn" onClick={() => addEmoji(emoji)}>{emoji}</button>)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Accessibility Panel */}
              {showAccessibility && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Accessibility</h3>
                    <button onClick={() => setShowAccessibility(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
                  </div>
                  {media.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '12px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Alt Text (Image {idx + 1})</label>
                      <textarea 
                        value={altText[idx] || ''}
                        onChange={(e) => setAltText({ ...altText, [idx]: e.target.value })}
                        placeholder="Describe this image for screen readers and SEO..."
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', minHeight: '60px', fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Brand Library */}
              {showBrandLibrary && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Brand Assets</h3>
                    <button onClick={() => setShowBrandLibrary(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Brand Colors</strong>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {brandAssets.colors.map(color => (
                        <div key={color} style={{ width: '40px', height: '40px', borderRadius: '8px', background: color, cursor: 'pointer', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} onClick={() => navigator.clipboard.writeText(color)} title={color} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Brand Fonts</strong>
                    <div>{brandAssets.fonts.map(font => <div key={font} style={{ padding: '8px', background: '#f8f9fa', borderRadius: '6px', marginBottom: '4px', fontSize: '13px', fontFamily: font }}>{font}</div>)}</div>
                  </div>
                </div>
              )}

              {/* Performance Predictor */}
              {showPerformance && performancePrediction && (
                <div className="panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3>Performance Prediction</h3>
                    <button onClick={() => setShowPerformance(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '48px', fontWeight: '900', color: '#764ba2' }}>{performancePrediction.score}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Engagement Score</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Estimated Reach</strong>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#2ecc71' }}>{performancePrediction.estimatedReach}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>Best Time to Post</strong>
                    <div style={{ fontSize: '14px' }}>{performancePrediction.bestTime}</div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Optimization Tips</strong>
                    {performancePrediction.tips.map((tip, idx) => (
                      <div key={idx} style={{ fontSize: '12px', padding: '8px', background: '#f8f9fa', borderRadius: '6px', marginBottom: '4px' }}>{tip}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Content Area */}
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'single' ? '1fr 1fr' : '1fr', gap: '20px' }}>
            {/* Editor */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              
              {/* Aspect Ratio Warnings */}
              {aspectWarnings.length > 0 && (
                <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', padding: '10px 12px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
                  <AlertTriangle size={16} color="#d97706" />
                  {aspectWarnings.map((warning, idx) => <span key={idx}>{warning}</span>)}
                </div>
              )}
              
              {/* Media Upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Media
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px', border: '1px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.15s' }}>
                  <Upload size={18} color="#64748b" />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    {media.length > 0 ? `${media.length} file${media.length > 1 ? 's' : ''}` : 'Drop files or click'}
                  </span>
                  <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} style={{ display: 'none' }} />
                </label>

                {media.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {media.map((item, idx) => (
                      <div key={idx} className={`media-thumb ${idx === currentMediaIndex ? 'active' : ''}`} onClick={() => setCurrentMediaIndex(idx)}>
                        {item.type === 'image' ? (
                          <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Upload ${idx + 1}`} />
                        ) : (
                          <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                        <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeMedia(idx); }}>×</button>
                      </div>
                    ))}
                    {media.length < 10 && (
                      <label className="media-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                        <Plus size={20} color="#94a3b8" />
                        <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                )}
              </div>

              {/* Caption */}
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Caption</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your caption..."
                  style={{ width: '100%', minHeight: '120px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.5', resize: 'vertical' }}
                />
                <div className="char-counter" style={{ color: status.color }}>
                  {content.length}/{platforms[viewMode === 'single' ? selectedPlatform : selectedPlatforms[0]].limit}
                </div>
              </div>

              {/* First Comment */}
              {((viewMode === 'single' && selectedPlatform === 'instagram') || (viewMode === 'compare' && selectedPlatforms.includes('instagram'))) && (
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>First Comment</label>
                  <textarea
                    value={firstComment}
                    onChange={(e) => setFirstComment(e.target.value)}
                    placeholder="Hashtags for first comment..."
                    style={{ width: '100%', minHeight: '60px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.5', resize: 'vertical' }}
                  />
                  <div className="char-counter" style={{ color: firstComment.length > 2200 ? '#dc2626' : '#64748b' }}>
                    {firstComment.length}/2200
                  </div>
                </div>
              )}

              {/* Copy Buttons */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {(viewMode === 'single' ? [selectedPlatform] : selectedPlatforms).map(platform => (
                  <button key={platform} onClick={() => copyToClipboard(platform)} className={`copy-btn ${copySuccess === platform ? 'success' : ''}`}>
                    {copySuccess === platform ? '✓' : <><Copy size={12} /> {platforms[platform].name}</>}
                  </button>
                ))}
              </div>

              {/* Platform Info - Collapsed */}
              <details style={{ fontSize: '12px', color: '#64748b' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '500', marginBottom: '8px' }}>Platform specs</summary>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', marginTop: '8px' }}>
                  {(viewMode === 'single' ? [selectedPlatform] : selectedPlatforms).map(platform => (
                    <div key={platform} style={{ marginBottom: '8px', lineHeight: '1.6' }}>
                      <strong>{platforms[platform].name}:</strong> {platforms[platform].limit.toLocaleString()} chars · {platforms[platform].aspectRatios[0]} · {platforms[platform].videoLength}
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Preview */}
            {viewMode === 'single' ? (
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', padding: '4px', background: '#fff', borderRadius: '8px', width: 'fit-content', border: '1px solid #e2e8f0' }}>
                  {Object.entries(platforms).map(([key, platform]) => {
                    const Icon = platform.icon;
                    return (
                      <button key={key} className={`platform-btn ${selectedPlatform === key ? 'active' : ''}`} onClick={() => setSelectedPlatform(key)} style={{ padding: '6px 10px', fontSize: '12px' }}>
                        {Icon ? <Icon size={14} /> : null} {platform.name}
                      </button>
                    );
                  })}
                </div>
                <div ref={previewRef}>{renderPreview()}</div>
              </div>
            ) : (
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', padding: '4px', background: '#fff', borderRadius: '8px', width: 'fit-content', border: '1px solid #e2e8f0' }}>
                  {Object.entries(platforms).map(([key, platform]) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(key);
                    return (
                      <button key={key} className={`platform-btn ${isSelected ? 'active' : ''}`} onClick={() => togglePlatformInComparison(key)} disabled={!isSelected && selectedPlatforms.length >= 3} style={{ opacity: !isSelected && selectedPlatforms.length >= 3 ? 0.4 : 1, padding: '6px 10px', fontSize: '12px' }}>
                        {Icon ? <Icon size={14} /> : null} {platform.name}
                      </button>
                    );
                  })}
                </div>
                <div ref={previewRef} style={{ display: 'grid', gridTemplateColumns: selectedPlatforms.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr', gap: '16px' }}>
                  {selectedPlatforms.map(platform => <div key={platform}>{renderPreview(platform)}</div>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mute Button */}
        {media.some(item => item.type === 'video') && (
          <button onClick={() => setIsMuted(!isMuted)} style={{ position: 'fixed', bottom: '20px', right: '20px', background: '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 100 }}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        )}
      </div>
    </div>
  );
}


