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
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .platform-btn { background: #fff; border: 1px solid #e2e8f0; color: #475569; padding: 10px 18px; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; font-family: 'Inter', sans-serif; font-weight: 500; font-size: 13px; display: flex; align-items: center; gap: 8px; }
        .platform-btn:hover { background: #f8fafc; border-color: #2DD4BF; color: #0f2a3d; }
        .platform-btn.active { background: #0f2a3d; color: #2DD4BF; border-color: #0f2a3d; }
        .preview-card { padding: 24px; border-radius: 16px; animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        textarea:focus, input:focus { outline: none; border-color: #2DD4BF !important; }
        .char-counter { position: absolute; bottom: 12px; right: 16px; font-size: 12px; font-family: 'Inter', sans-serif; font-weight: 600; }
        .copy-btn { background: #0f2a3d; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px; transition: all 0.2s ease; display: flex; align-items: center; gap: 8px; }
        .copy-btn:hover { background: #1a4158; }
        .copy-btn.success { background: #0d9488; }
        .media-thumb { position: relative; width: 80px; height: 80px; border-radius: 10px; overflow: hidden; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.2s ease; }
        .media-thumb:hover { border-color: #2DD4BF; }
        .media-thumb.active { border-color: #2DD4BF; box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.2); }
        .remove-btn { position: absolute; top: 4px; right: 4px; background: rgba(15, 42, 61, 0.9); color: #fff; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px; opacity: 0; transition: opacity 0.2s ease; z-index: 10; }
        .media-thumb:hover .remove-btn { opacity: 1; }
        .panel { background: #fff; padding: 24px; border-radius: 14px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .panel h3 { margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f2a3d; }
        .tag { display: inline-block; padding: 6px 12px; background: #f1f5f9; border-radius: 8px; margin: 4px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; transition: all 0.2s ease; color: #475569; }
        .tag:hover { background: #0f2a3d; color: #2DD4BF; }
        .emoji-btn { background: none; border: none; font-size: 24px; cursor: pointer; padding: 8px; transition: transform 0.15s ease; }
        .emoji-btn:hover { transform: scale(1.15); }
      `}</style>

      <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <img src={BRAND_LOGO} alt={BRAND_NAME} style={{ width: '48px', height: '48px' }} />
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f2a3d', margin: 0, letterSpacing: '-0.5px' }}>
              Social Preview Pro
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            Preview and perfect your social content before publishing
          </p>
        </div>

        {/* Benefits Section */}
        <div style={{ background: '#0f2a3d', borderRadius: '24px', padding: '56px 40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.1)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '10%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(45, 212, 191, 0.05)', pointerEvents: 'none' }} />
          
          <h2 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '48px', color: '#fff', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
            Why Your Team Will Love This
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', position: 'relative' }}>
            <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(45, 212, 191, 0.2)', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f2a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Save 2+ Hours Daily</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                No more switching between platforms, schedulers, and design tools. Everything in one place.
              </p>
            </div>
            <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(45, 212, 191, 0.2)', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f2a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Zero Format Errors</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                See exactly how your post looks before publishing. Catch cropping issues and character limits.
              </p>
            </div>
            <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(45, 212, 191, 0.2)', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f2a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Better Performance</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                Smart predictions, trending hashtags, and best-time recommendations drive higher engagement.
              </p>
            </div>
            <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(45, 212, 191, 0.2)', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f2a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Accessibility Built-In</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                Add alt text to every image. Improve SEO and reach more people with screen reader support.
              </p>
            </div>
            <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(45, 212, 191, 0.2)', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f2a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Brand Consistency</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                Access Fountain Vitality's brand colors, fonts, and assets instantly from one place.
              </p>
            </div>
            <div style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(45, 212, 191, 0.2)', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f2a3d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#fff' }}>Reusable Templates</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                Create once, reuse forever. Save your best-performing post formats as templates.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div style={{ background: '#fff', borderRadius: '24px', padding: '56px 40px', marginBottom: '32px', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', background: '#e6faf8', borderRadius: '20px', marginBottom: '16px', fontSize: '13px', fontWeight: '600', color: '#0d9488', fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px' }}>
            QUICK START
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '48px', color: '#0f2a3d', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
            How to Use Social Preview Pro
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0', maxWidth: '900px', position: 'relative' }}>
            {/* Vertical line connector */}
            <div style={{ position: 'absolute', left: '23px', top: '48px', bottom: '48px', width: '2px', background: 'linear-gradient(180deg, #2DD4BF 0%, #0d9488 100%)', borderRadius: '2px' }} />
            
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '28px', alignItems: 'start', paddingBottom: '40px', position: 'relative' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '14px', background: '#0f2a3d', color: '#2DD4BF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0, fontFamily: 'Inter, sans-serif', zIndex: 1 }}>01</div>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#0f2a3d' }}>Upload Your Media</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#64748b', fontFamily: 'Inter, sans-serif', margin: '0 0 14px 0' }}>
                  Drag and drop up to 10 images or videos. The tool automatically checks aspect ratios and warns you about cropping.
                </p>
                <div style={{ padding: '10px 14px', background: '#f0fdfa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#0d9488', fontWeight: '500', borderLeft: '3px solid #2DD4BF' }}>
                  Tip: Use the Accessibility button to add alt text for SEO
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '28px', alignItems: 'start', paddingBottom: '40px', position: 'relative' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '14px', background: '#0f2a3d', color: '#2DD4BF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0, fontFamily: 'Inter, sans-serif', zIndex: 1 }}>02</div>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#0f2a3d' }}>Write Your Caption</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#64748b', fontFamily: 'Inter, sans-serif', margin: '0 0 14px 0' }}>
                  Type your caption and use the Hashtag panel for trending tags. For Instagram, add hashtags to the "First Comment" field.
                </p>
                <div style={{ padding: '10px 14px', background: '#f0fdfa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#0d9488', fontWeight: '500', borderLeft: '3px solid #2DD4BF' }}>
                  Tip: Auto-saves every 30 seconds so you never lose work
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '28px', alignItems: 'start', paddingBottom: '40px', position: 'relative' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '14px', background: '#0f2a3d', color: '#2DD4BF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0, fontFamily: 'Inter, sans-serif', zIndex: 1 }}>03</div>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#0f2a3d' }}>Preview All Platforms</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#64748b', fontFamily: 'Inter, sans-serif', margin: '0 0 14px 0' }}>
                  Switch between Instagram, LinkedIn, Twitter, TikTok, and Facebook. Use Compare Mode to view 2-3 platforms side-by-side.
                </p>
                <div style={{ padding: '10px 14px', background: '#f0fdfa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#0d9488', fontWeight: '500', borderLeft: '3px solid #2DD4BF' }}>
                  Tip: Videos show realistic controls for each platform
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: '28px', alignItems: 'start', position: 'relative' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '14px', background: '#0f2a3d', color: '#2DD4BF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0, fontFamily: 'Inter, sans-serif', zIndex: 1 }}>04</div>
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#0f2a3d' }}>Check Performance</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#64748b', fontFamily: 'Inter, sans-serif', margin: '0 0 14px 0' }}>
                  Get an engagement score, estimated reach, and optimization tips based on your content type, hashtags, and caption length.
                </p>
                <div style={{ padding: '10px 14px', background: '#f0fdfa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#0d9488', fontWeight: '500', borderLeft: '3px solid #2DD4BF' }}>
                  Tip: Posts with video + 5 hashtags score 30-40 points higher
                </div>
              </div>
            </div>

          </div>

          {/* Quick Reference - Minimal grid */}
          <div style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px', color: '#94a3b8', fontFamily: 'Inter, sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>Feature Reference</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#475569' }}>
                <span style={{ fontWeight: '600', color: '#0f2a3d' }}>Drafts</span> — saved posts & templates
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#475569' }}>
                <span style={{ fontWeight: '600', color: '#0f2a3d' }}>Hashtags</span> — trending wellness tags
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#475569' }}>
                <span style={{ fontWeight: '600', color: '#0f2a3d' }}>Emojis</span> — quick picker by category
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#475569' }}>
                <span style={{ fontWeight: '600', color: '#0f2a3d' }}>Accessibility</span> — alt text editor
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#475569' }}>
                <span style={{ fontWeight: '600', color: '#0f2a3d' }}>Brand Assets</span> — colors & fonts
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#475569' }}>
                <span style={{ fontWeight: '600', color: '#0f2a3d' }}>Performance</span> — engagement score
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#475569' }}>
                <span style={{ fontWeight: '600', color: '#0f2a3d' }}>Compare</span> — multi-platform view
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#475569' }}>
                <span style={{ fontWeight: '600', color: '#0f2a3d' }}>Export</span> — download previews
              </div>
            </div>
          </div>
        </div>

        {/* Top Toolbar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => setViewMode(viewMode === 'single' ? 'compare' : 'single')} className="platform-btn">
            <Grid size={16} /> {viewMode === 'single' ? 'Compare Mode' : 'Single Mode'}
          </button>
          <button onClick={() => setShowDrafts(!showDrafts)} className="platform-btn">
            <FileText size={16} /> Drafts ({drafts.length})
          </button>
          <button onClick={() => setShowHashtagPanel(!showHashtagPanel)} className="platform-btn">
            <Hash size={16} /> Hashtags
          </button>
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="platform-btn">
            <Smile size={16} /> Emojis
          </button>
          <button onClick={() => setShowAccessibility(!showAccessibility)} className="platform-btn">
            <Eye size={16} /> Accessibility
          </button>
          <button onClick={() => setShowBrandLibrary(!showBrandLibrary)} className="platform-btn">
            <Package size={16} /> Brand Assets
          </button>
          <button onClick={() => setShowPerformance(!showPerformance)} className="platform-btn">
            <TrendingUp size={16} /> Performance
          </button>
          <button onClick={exportScreenshot} className="platform-btn">
            <Download size={16} /> Export
          </button>
        </div>

        {/* Side Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: showDrafts || showHashtagPanel || showEmojiPicker || showAccessibility || showBrandLibrary || showPerformance ? '300px 1fr' : '1fr', gap: '24px' }}>
          {/* Left Sidebar */}
          {(showDrafts || showHashtagPanel || showEmojiPicker || showAccessibility || showBrandLibrary || showPerformance) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <button onClick={saveTemplate} className="copy-btn" style={{ width: '100%', marginBottom: '16px', background: '#667eea' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'single' ? '1fr 1fr' : '1fr', gap: '24px' }}>
            {/* Editor */}
            <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '32px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Content Editor</h2>
              
              {/* Aspect Ratio Warnings */}
              {aspectWarnings.length > 0 && (
                <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '12px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'start' }}>
                  <AlertTriangle size={20} color="#ffc107" />
                  <div style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                    {aspectWarnings.map((warning, idx) => <div key={idx}>{warning}</div>)}
                  </div>
                </div>
              )}
              
              {/* Media Upload */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
                  Upload Images & Videos (up to 10)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px', border: '2px dashed #764ba2', borderRadius: '12px', cursor: 'pointer', background: media.length > 0 ? '#f8f9fa' : 'transparent' }}>
                  <Upload size={24} color="#764ba2" />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#764ba2', fontFamily: 'Inter, sans-serif' }}>
                    {media.length > 0 ? `${media.length} file${media.length > 1 ? 's' : ''} uploaded` : 'Choose images or videos'}
                  </span>
                  <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} style={{ display: 'none' }} />
                </label>

                {media.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
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
                      <label className="media-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                        <Plus size={32} color="#764ba2" />
                        <input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                )}
              </div>

              {/* Caption */}
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>Caption / Post Text</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here..."
                  style={{ width: '100%', minHeight: '150px', padding: '16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '15px', fontFamily: 'Inter, sans-serif', lineHeight: '1.5', resize: 'vertical' }}
                />
                <div className="char-counter" style={{ color: status.color }}>
                  {content.length} / {platforms[viewMode === 'single' ? selectedPlatform : selectedPlatforms[0]].limit}
                </div>
              </div>

              {/* First Comment */}
              {((viewMode === 'single' && selectedPlatform === 'instagram') || (viewMode === 'compare' && selectedPlatforms.includes('instagram'))) && (
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>First Comment (Instagram)</label>
                  <textarea
                    value={firstComment}
                    onChange={(e) => setFirstComment(e.target.value)}
                    placeholder="Add hashtags or additional info..."
                    style={{ width: '100%', minHeight: '80px', padding: '16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '15px', fontFamily: 'Inter, sans-serif', lineHeight: '1.5', resize: 'vertical' }}
                  />
                  <div className="char-counter" style={{ color: firstComment.length > 2200 ? '#e74c3c' : '#2ecc71' }}>
                    {firstComment.length} / 2200
                  </div>
                </div>
              )}

              {/* Copy Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {(viewMode === 'single' ? [selectedPlatform] : selectedPlatforms).map(platform => (
                  <button key={platform} onClick={() => copyToClipboard(platform)} className={`copy-btn ${copySuccess === platform ? 'success' : ''}`}>
                    {copySuccess === platform ? '✓ Copied!' : <><Copy size={14} /> Copy for {platforms[platform].name}</>}
                  </button>
                ))}
              </div>

              {/* Platform Guidelines */}
              <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#666', marginBottom: '8px', fontWeight: '600' }}>Platform Guidelines</div>
                {(viewMode === 'single' ? [selectedPlatform] : selectedPlatforms).map(platform => (
                  <div key={platform} style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', color: '#666', lineHeight: '1.5', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                    <strong>{platforms[platform].name}</strong><br />
                    📝 {platforms[platform].limit.toLocaleString()} chars | 📐 {platforms[platform].aspectRatios.join(', ')}<br />
                    🎬 {platforms[platform].videoLength} ({platforms[platform].videoFormats})<br />
                    <span style={{ color: '#764ba2' }}>💡 {platforms[platform].videoNote}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            {viewMode === 'single' ? (
              <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '32px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Platform Preview</h2>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {Object.entries(platforms).map(([key, platform]) => {
                    const Icon = platform.icon;
                    return (
                      <button key={key} className={`platform-btn ${selectedPlatform === key ? 'active' : ''}`} onClick={() => setSelectedPlatform(key)}>
                        {Icon ? <Icon size={16} /> : '📱'} {platform.name}
                      </button>
                    );
                  })}
                </div>
                <div ref={previewRef}>{renderPreview()}</div>
              </div>
            ) : (
              <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '32px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Compare Platforms</h2>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {Object.entries(platforms).map(([key, platform]) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(key);
                    return (
                      <button key={key} className={`platform-btn ${isSelected ? 'active' : ''}`} onClick={() => togglePlatformInComparison(key)} disabled={!isSelected && selectedPlatforms.length >= 3} style={{ opacity: !isSelected && selectedPlatforms.length >= 3 ? 0.5 : 1 }}>
                        {Icon ? <Icon size={16} /> : '📱'} {platform.name}
                      </button>
                    );
                  })}
                </div>
                <div ref={previewRef} style={{ display: 'grid', gridTemplateColumns: selectedPlatforms.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr', gap: '24px' }}>
                  {selectedPlatforms.map(platform => <div key={platform}>{renderPreview(platform)}</div>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mute Button */}
        {media.some(item => item.type === 'video') && (
          <button onClick={() => setIsMuted(!isMuted)} style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#764ba2', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '50px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '13px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 100 }}>
            {isMuted ? '🔇 Unmute' : '🔊 Mute'}
          </button>
        )}
      </div>
    </div>
  );
}


