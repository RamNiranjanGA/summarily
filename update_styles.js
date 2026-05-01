const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'PROJECTS', 'summarizer', 'summarizer.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace imports
content = content.replace(
    "import { Upload, FileText, Volume2, VolumeX, Sparkles, Loader2 } from 'lucide-react';",
    "import { Upload, FileText, Volume2, VolumeX, Sparkles, Loader2, Sun, Moon } from 'lucide-react';"
);

// Replace state and add useEffect
content = content.replace(
    "  const [uploadedFileName, setUploadedFileName] = useState('');\n  const fileInputRef = useRef(null);",
    `  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);`
);

// Replace style block and header
const styleAndHeaderPattern = /<style>\{`[\s\S]*?`\}<\/style>\s*<div className="header">[\s\S]*?<\/div>/;

const newStyleAndHeader = `<style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          /* Dark Theme Variables (Default Luxury) */
          --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          --text-primary: #e2e8f0;
          --text-secondary: #cbd5e1;
          --text-muted: #94a3b8;
          --accent-primary: #fbbf24;
          --accent-secondary: #f59e0b;
          --accent-tertiary: #d97706;
          --card-bg: rgba(30, 41, 59, 0.6);
          --input-bg: rgba(15, 23, 42, 0.6);
          --card-border: rgba(251, 191, 36, 0.2);
          --card-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          --drop-zone-bg: rgba(15, 23, 42, 0.4);
          --drop-zone-hover: rgba(251, 191, 36, 0.05);
          --btn-hover-shadow: 0 6px 30px rgba(251, 191, 36, 0.4);
          --highlight-bg: linear-gradient(120deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.5) 100%);
          --circle-1: rgba(251, 191, 36, 0.15);
          --circle-2: rgba(147, 51, 234, 0.1);
        }

        body.light-theme {
          /* Light Theme Variables (Bright Luxury) */
          --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
          --text-primary: #0f172a;
          --text-secondary: #334155;
          --text-muted: #64748b;
          --accent-primary: #d97706;
          --accent-secondary: #b45309;
          --accent-tertiary: #92400e;
          --card-bg: rgba(255, 255, 255, 0.7);
          --input-bg: rgba(255, 255, 255, 0.8);
          --card-border: rgba(217, 119, 6, 0.3);
          --card-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          --drop-zone-bg: rgba(255, 255, 255, 0.5);
          --drop-zone-hover: rgba(217, 119, 6, 0.05);
          --btn-hover-shadow: 0 6px 30px rgba(217, 119, 6, 0.3);
          --highlight-bg: linear-gradient(120deg, rgba(217, 119, 6, 0.2) 0%, rgba(217, 119, 6, 0.4) 100%);
          --circle-1: rgba(217, 119, 6, 0.15);
          --circle-2: rgba(79, 70, 229, 0.1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: var(--bg-gradient);
          color: var(--text-primary);
          min-height: 100vh;
          overflow-x: hidden;
          transition: background 0.5s ease, color 0.5s ease;
        }

        .app-container {
          min-height: 100vh;
          padding: 2rem;
          position: relative;
        }

        /* Decorative background elements */
        .app-container::before {
          content: '';
          position: fixed;
          top: -50%;
          right: -20%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, var(--circle-1) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: float 20s ease-in-out infinite;
          transition: background 0.5s ease;
        }

        .app-container::after {
          content: '';
          position: fixed;
          bottom: -30%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--circle-2) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: float 15s ease-in-out infinite reverse;
          transition: background 0.5s ease;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
          animation: slideDown 0.8s ease-out;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .header-top {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          max-width: 1400px;
          margin-bottom: -2rem;
          z-index: 10;
          position: relative;
        }

        .theme-toggle {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          color: var(--accent-primary);
          padding: 0.75rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
        }

        .theme-toggle:hover {
          transform: translateY(-2px) rotate(15deg);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          background: var(--drop-zone-hover);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 50%, var(--accent-tertiary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header p {
          font-size: 1.125rem;
          color: var(--text-secondary);
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        .input-section, .output-section {
          background: var(--card-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid var(--card-border);
          box-shadow: var(--card-shadow);
          transition: all 0.5s ease;
        }

        .input-section {
          animation: slideInLeft 0.8s ease-out 0.2s both;
        }

        .output-section {
          animation: slideInRight 0.8s ease-out 0.4s both;
        }

        .input-section:hover, .output-section:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.4);
          border-color: var(--accent-primary);
        }
        
        body.light-theme .input-section:hover, body.light-theme .output-section:hover {
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent-primary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: color 0.5s ease;
        }

        .drag-drop-zone {
          border: 2px dashed \${isDragging ? 'var(--accent-primary)' : 'var(--card-border)'};
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: \${isDragging ? 'var(--drop-zone-hover)' : 'var(--drop-zone-bg)'};
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .drag-drop-zone:disabled,
        .drag-drop-zone.reading {
          cursor: wait;
          opacity: 0.7;
        }

        .drag-drop-zone:hover {
          border-color: var(--accent-primary);
          background: var(--drop-zone-hover);
          transform: translateY(-2px);
        }

        .drag-drop-zone::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, var(--drop-zone-hover), transparent);
          transition: left 0.5s ease;
        }

        .drag-drop-zone:hover::before {
          left: 100%;
        }

        .upload-icon {
          margin: 0 auto 1rem;
          width: 64px;
          height: 64px;
          color: var(--accent-primary);
          transition: color 0.5s ease, transform 0.3s ease;
        }
        
        .drag-drop-zone:hover .upload-icon {
          transform: scale(1.1);
        }

        .drag-drop-text {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .file-types {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .uploaded-file {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--drop-zone-hover);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          color: var(--accent-primary);
          font-size: 0.875rem;
          margin-top: 0.5rem;
          border: 1px solid var(--card-border);
        }

        .textarea-container {
          margin-bottom: 1.5rem;
        }

        .textarea-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        textarea {
          width: 100%;
          min-height: 300px;
          background: var(--input-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 1.5rem;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          resize: vertical;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
        }

        textarea:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1), inset 0 2px 4px rgba(0,0,0,0.05);
        }

        body.light-theme textarea:focus {
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1), inset 0 2px 4px rgba(0,0,0,0.05);
        }

        textarea::placeholder {
          color: var(--text-muted);
        }

        .summarize-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          color: #0f172a;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        body.light-theme .summarize-btn {
          color: #ffffff;
          box-shadow: 0 4px 20px rgba(217, 119, 6, 0.3);
        }

        .summarize-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        .summarize-btn:hover::before {
          width: 400px;
          height: 400px;
        }

        .summarize-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--btn-hover-shadow);
        }

        .summarize-btn:active {
          transform: translateY(0);
        }

        .summarize-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .summary-display {
          background: var(--input-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 1.5rem;
          min-height: 300px;
          line-height: 1.8;
          color: var(--text-primary);
          font-size: 1.05rem;
          margin-bottom: 1.5rem;
          position: relative;
          transition: all 0.5s ease;
        }

        .summary-display.empty {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-style: italic;
        }

        .highlight-mark {
          background: var(--highlight-bg);
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          font-weight: 600;
          color: var(--accent-primary);
          border-bottom: 2px solid var(--accent-primary);
          transition: all 0.3s ease;
        }

        .highlight-mark:hover {
          background: var(--accent-primary);
          color: #0f172a;
        }

        .controls {
          display: flex;
          gap: 1rem;
        }

        .control-btn {
          flex: 1;
          background: var(--input-bg);
          color: var(--text-secondary);
          border: 1px solid var(--card-border);
          padding: 0.875rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .control-btn:hover {
          background: var(--drop-zone-hover);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .control-btn:active {
          transform: translateY(0);
        }

        .control-btn.active {
          background: var(--drop-zone-hover);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }

        .loader {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .highlights-list {
          margin-top: 1rem;
          padding: 1.5rem;
          background: var(--drop-zone-bg);
          border-radius: 12px;
          border-left: 4px solid var(--accent-primary);
          margin-bottom: 1.5rem;
        }

        .highlights-title {
          font-size: 0.875rem;
          color: var(--accent-primary);
          font-weight: 600;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .highlight-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .highlight-tag {
          background: var(--drop-zone-hover);
          color: var(--accent-primary);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
          cursor: default;
        }
        
        .highlight-tag:hover {
          background: var(--accent-primary);
          color: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        body.light-theme .highlight-tag:hover {
          color: #ffffff;
        }

        /* Responsive Design Improvements */
        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .header h1 {
            font-size: 3.5rem;
          }
        }

        @media (max-width: 768px) {
          .app-container {
            padding: 1.5rem;
          }

          .header h1 {
            font-size: 3rem;
          }
          
          .header p {
            font-size: 1rem;
          }

          .input-section,
          .output-section {
            padding: 2rem;
          }
          
          .header-top {
            margin-bottom: 1rem;
            justify-content: flex-end;
          }
        }

        @media (max-width: 480px) {
          .app-container {
            padding: 1rem;
          }

          .header h1 {
            font-size: 2.25rem;
          }

          .input-section,
          .output-section {
            padding: 1.25rem;
            border-radius: 16px;
          }

          .controls {
            flex-direction: column;
          }
          
          .drag-drop-zone {
            padding: 2rem 1rem;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
        }
      \`}</style>

      <div className="header-top">
        <button 
          className="theme-toggle" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
      <div className="header">
        <h1><Sparkles size={40} className="header-icon" /> Summarify</h1>
        <p>Transform lengthy content into crystal-clear insights</p>
      </div>`;

content = content.replace(styleAndHeaderPattern, newStyleAndHeader);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated successfully');
