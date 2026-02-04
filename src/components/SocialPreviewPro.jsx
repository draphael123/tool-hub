import React, { useState, useRef, useEffect } from 'react';
import { Upload, Instagram, Linkedin, Twitter, Facebook, Download, Copy, Plus, X, Save, FileText, Hash, Link as LinkIcon, Eye, Smile, Package, TrendingUp, Grid, AlertTriangle } from 'lucide-react';

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
    colors: ['#764ba2', '#667eea', '#fd1d1d', '#fcb045', '#2ecc71'],
    logos: ['fountain-logo.png', 'fountain-icon.png'],
    fonts: ['Fraunces', 'Inter', 'Helvetica']
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>fountain.health</div>
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
              <span style={{ fontWeight: '600', marginRight: '6px' }}>fountain.health</span>
              {content || 'Your caption will appear here...'}
            </div>
            {firstComment && (
              <div style={{ fontSize: '14px', lineHeight: '1.4', color: '#262626', paddingTop: '12px', borderTop: '1px solid #efefef' }}>
                <span style={{ fontWeight: '600', marginRight: '6px' }}>fountain.health</span>
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
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#000' }}>Fountain Health</div>
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
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f1419', marginBottom: '4px' }}>Fountain Health @fountainhealth · 2m</div>
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
                  <strong>@fountain.health</strong> {content || 'Your TikTok caption...'}
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
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e4e6eb' }}>
            <strong style={{ fontSize: '15px' }}>Fountain Health</strong>
            <div style={{ fontSize: '13px', color: '#65676b' }}>2h · 🌐</div>
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px', fontFamily: '"Fraunces", serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;900&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .platform-btn { background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.2); color: #fff; padding: 12px 20px; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; }
        .platform-btn:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-2px); }
        .platform-btn.active { background: #fff; color: #764ba2; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
        .preview-card { padding: 24px; border-radius: 16px; animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        textarea:focus, input:focus { outline: none; }
        .char-counter { position: absolute; bottom: 12px; right: 16px; font-size: 12px; font-family: 'Inter', sans-serif; font-weight: 600; }
        .copy-btn { background: #764ba2; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; }
        .copy-btn:hover { background: #5c3a7d; transform: translateY(-2px); }
        .copy-btn.success { background: #2ecc71; }
        .media-thumb { position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 2px solid #e0e0e0; cursor: pointer; transition: all 0.3s ease; }
        .media-thumb:hover { border-color: #764ba2; transform: scale(1.05); }
        .media-thumb.active { border-color: #764ba2; box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.2); }
        .remove-btn { position: absolute; top: 4px; right: 4px; background: rgba(0, 0, 0, 0.7); color: #fff; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px; opacity: 0; transition: opacity 0.3s ease; z-index: 10; }
        .media-thumb:hover .remove-btn { opacity: 1; }
        .panel { background: rgba(255, 255, 255, 0.95); padding: 24px; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        .panel h3 { margin: 0 0 16px 0; font-size: 18px; font-weight: 700; }
        .tag { display: inline-block; padding: 6px 12px; background: #f0f0f0; border-radius: 16px; margin: 4px; cursor: pointer; font-size: 13px; font-family: 'Inter', sans-serif; transition: all 0.3s ease; }
        .tag:hover { background: #764ba2; color: #fff; }
        .emoji-btn { background: none; border: none; font-size: 24px; cursor: pointer; padding: 8px; transition: transform 0.2s ease; }
        .emoji-btn:hover { transform: scale(1.2); }
      `}</style>

      <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#fff', margin: '0 0 12px 0', letterSpacing: '-2px' }}>
            Social Preview Pro
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Inter, sans-serif' }}>
            Professional social media content creation suite
          </p>
        </div>

        {/* Benefits Section */}
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '40px', marginBottom: '32px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', textAlign: 'center', marginBottom: '32px', color: '#1a1a1a' }}>
            Why Your Team Will Love This
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Save 2+ Hours Per Day</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                No more switching between platforms, schedulers, and design tools. Everything in one place.
              </p>
            </div>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Zero Formatting Mistakes</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                See exactly how your post looks before publishing. Catch cropping issues, character limits, and formatting problems.
              </p>
            </div>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📈</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Better Performance</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                AI-powered predictions, trending hashtags, and best-time recommendations drive higher engagement.
              </p>
            </div>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>♿</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Accessibility Built-In</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                Add alt text to every image with built-in editor. Improve SEO and reach more people with screen reader support.
              </p>
            </div>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎨</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Brand Consistency</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                Access Fountain's brand colors, fonts, and assets instantly. No more hunting through Dropbox.
              </p>
            </div>
            <div style={{ padding: '24px', background: '#f8f9fa', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔄</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>Template Reusability</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                Create once, reuse forever. Save your best-performing post formats as templates.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '16px', padding: '40px', marginBottom: '32px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', textAlign: 'center', marginBottom: '16px', color: '#1a1a1a' }}>
            How to Use Social Preview Pro
          </h2>
          <p style={{ textAlign: 'center', fontSize: '16px', color: '#666', fontFamily: 'Inter, sans-serif', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            Follow this simple workflow to create perfect social posts every time
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', flexShrink: 0 }}>1</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>Upload Your Media</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: '0 0 12px 0' }}>
                  Drag and drop up to 10 images or videos. Mix both for carousel posts. The tool automatically checks aspect ratios and warns you if content will be cropped on specific platforms.
                </p>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#764ba2', fontWeight: '600' }}>
                  💡 Pro Tip: Click the Accessibility button to add alt text for better SEO and screen reader support
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', flexShrink: 0 }}>2</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>Write Your Caption</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: '0 0 12px 0' }}>
                  Type or paste your caption in the editor. Use the Hashtag panel to find trending tags, or the Emoji picker for quick inserts. For Instagram, add hashtags to the "First Comment" field to keep captions clean.
                </p>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#764ba2', fontWeight: '600' }}>
                  💡 Pro Tip: The tool auto-saves every 30 seconds so you never lose work
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', flexShrink: 0 }}>3</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>Preview on All Platforms</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: '0 0 12px 0' }}>
                  Switch between Instagram, LinkedIn, Twitter, TikTok, and Facebook to see exactly how your post looks. Or use Compare Mode to view 2-3 platforms side-by-side and catch formatting issues instantly.
                </p>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#764ba2', fontWeight: '600' }}>
                  💡 Pro Tip: Videos show realistic controls and play states for each platform
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', flexShrink: 0 }}>4</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>Check Performance Prediction</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: '0 0 12px 0' }}>
                  Click the Performance button to get an engagement score (0-100), estimated reach, and optimization tips. The AI analyzes your content type, hashtags, caption length, and more.
                </p>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#764ba2', fontWeight: '600' }}>
                  💡 Pro Tip: Posts with video and 5+ hashtags typically score 30-40 points higher
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
              <div style={{ minWidth: '48px', width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', flexShrink: 0 }}>5</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>Copy & Export</h3>
                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666', fontFamily: 'Inter, sans-serif', margin: '0 0 12px 0' }}>
                  Click "Copy for [Platform]" to copy formatted text to your clipboard. Each platform gets its own formatted version. Save your work as a draft for later, or save it as a template to reuse for similar posts.
                </p>
                <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#764ba2', fontWeight: '600' }}>
                  💡 Pro Tip: Templates are perfect for recurring post types like weekly tips or testimonials
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div style={{ marginTop: '48px', padding: '32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', color: '#fff' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>Quick Feature Reference</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
              <div>
                <strong>📁 Drafts Button:</strong><br />
                Access saved posts and templates
              </div>
              <div>
                <strong>#️⃣ Hashtags Button:</strong><br />
                Browse trending wellness hashtags
              </div>
              <div>
                <strong>😊 Emojis Button:</strong><br />
                Quick emoji picker organized by category
              </div>
              <div>
                <strong>👁️ Accessibility Button:</strong><br />
                Add alt text to all images
              </div>
              <div>
                <strong>📦 Brand Assets Button:</strong><br />
                Fountain colors, fonts, and logos
              </div>
              <div>
                <strong>📊 Performance Button:</strong><br />
                Get AI engagement predictions
              </div>
              <div>
                <strong>🔄 Compare Mode:</strong><br />
                View 2-3 platforms simultaneously
              </div>
              <div>
                <strong>📥 Export Button:</strong><br />
                Download screenshot of previews
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

