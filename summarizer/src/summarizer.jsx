import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";

export default function SummarizerApp() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [highlights, setHighlights] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const fileInputRef = useRef(null);
  let mammothRef = useRef(null);

  useEffect(() => {
    import("mammoth").then((mod) => {
      mammothRef.current = mod;
    });
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-theme" : "light-theme";
  }, [isDarkMode]);
  const utteranceRef = useRef(null);
  const pdfjsLib = useRef(null);

  // Load PDF.js library
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          pdfjsLib.current = window.pdfjsLib;
          pdfjsLib.current.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const extractTextFromPDF = async (file) => {
    if (!pdfjsLib.current) {
      throw new Error("PDF.js library not loaded yet. Please try again.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.current.getDocument({ data: arrayBuffer })
      .promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  };

  const extractTextFromDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammothRef.current.extractRawText({ arrayBuffer });
  return result.value;
};

  const handleFileUpload = async (file) => {
    setUploadedFileName(file.name);
    setIsReadingFile(true);
    setSummary("");
    setHighlights([]);

    try {
      let extractedText = "";

      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        // Handle plain text files
        extractedText = await file.text();
      } else if (
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf")
      ) {
        // Handle PDF files
        extractedText = await extractTextFromPDF(file);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        // Handle DOCX files
        extractedText = await extractTextFromDOCX(file);
      } else if (file.name.endsWith(".doc")) {
        // Legacy .doc files
        alert(
          "Legacy .doc files are not supported. Please convert to .docx format.",
        );
        setIsReadingFile(false);
        return;
      } else {
        // Try to read as text for unknown types
        extractedText = await file.text();
      }

      setInputText(extractedText);
      setIsReadingFile(false);

      // Auto-trigger summarization after successful file reading
      if (extractedText.trim().length > 0) {
        // Small delay to allow UI to update
        setTimeout(() => {
          summarizeContent(extractedText);
        }, 300);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      alert(
        `Error reading file: ${error.message}. Please try a different file or paste text manually.`,
      );
      setIsReadingFile(false);
    }
  };

  const summarizeContent = async (textToSummarize) => {
    const content = textToSummarize || inputText;

    if (!content.trim()) {
      alert("Please enter some text or upload a file first!");
      return;
    }

    setIsProcessing(true);
    setSummary("");
    setHighlights([]);

    try {
      // Added a local extractive summarization engine so it works perfectly without an API key!
      // Add artificial delay for loading effect
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
      if (sentences.length <= 2) {
        setSummary(content);
        setHighlights([]);
        setIsProcessing(false);
        return;
      }

      const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
      const wordFreq = {};
      const stopWords = new Set([
        "that",
        "with",
        "this",
        "from",
        "they",
        "have",
        "were",
        "what",
        "there",
        "their",
        "which",
        "will",
        "would",
        "could",
        "should",
        "about",
        "these",
        "those",
        "then",
        "than",
        "because",
        "when",
        "where",
        "how",
        "some",
        "many",
        "most",
        "also",
        "such",
        "like",
        "just",
        "into",
        "over",
        "after",
      ]);

      words.forEach((word) => {
        if (!stopWords.has(word)) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });

      const sentenceScores = sentences.map((sentence, index) => {
        const sentenceWords =
          sentence.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
        let score = 0;
        sentenceWords.forEach((word) => {
          if (wordFreq[word]) {
            score += wordFreq[word];
          }
        });
        return {
          sentence: sentence.trim(),
          score: score / (sentenceWords.length || 1),
          index,
        };
      });

      sentenceScores.sort((a, b) => b.score - a.score);
      const summaryCount = Math.max(
        1,
        Math.min(5, Math.ceil(sentences.length * 0.4)),
      );

      const topSentences = sentenceScores
        .slice(0, summaryCount)
        .sort((a, b) => a.index - b.index);

      setSummary(topSentences.map((ts) => ts.sentence).join(" "));

      const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map((entry) => entry[0]);

      setHighlights(sortedWords);
    } catch (error) {
      console.error("Summarization error:", error);
      setSummary(
        "Sorry, there was an error processing your request. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!summary) {
        alert("Generate a summary first!");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const getHighlightedSummary = () => {
    if (!summary || highlights.length === 0) return summary;

    let highlightedText = summary;
    highlights.forEach((phrase) => {
      const regex = new RegExp(`(${phrase})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="highlight-mark">$1</mark>',
      );
    });

    return highlightedText;
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="app-container">
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
        <h1>
          <Sparkles size={40} className="header-icon" /> Summarify
        </h1>
        <p>Transform lengthy content into crystal-clear insights</p>
      </div>

      <div className="main-content">
        <div className="input-section">
          <h2 className="section-title">
            <FileText size={28} />
            Input Content
          </h2>

          <div
            className={`drag-drop-zone ${isReadingFile ? "reading" : ""} ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isReadingFile && fileInputRef.current?.click()}
          >
            {isReadingFile ? (
              <>
                <Loader2 className="upload-icon loader" size={64} />
                <p className="drag-drop-text">Reading and extracting text...</p>
                <p className="file-types">
                  This may take a moment for large files
                </p>
              </>
            ) : (
              <>
                <Upload className="upload-icon" size={64} />
                <p className="drag-drop-text">
                  {isDragging
                    ? "Drop your file here"
                    : "Drag & drop your file here"}
                </p>
                <p className="file-types">Supports PDF, DOC, DOCX, TXT files</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: "none" }}
              onChange={handleFileSelect}
              disabled={isReadingFile}
            />
            {uploadedFileName && !isReadingFile && (
              <div className="uploaded-file">
                <FileText size={16} />
                {uploadedFileName}
              </div>
            )}
          </div>

          <div className="textarea-container">
            <label className="textarea-label">Or paste your text here</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter or paste long paragraphs, articles, documents, or any text you want to summarize..."
            />
          </div>

          <button
            className="summarize-btn"
            onClick={() => summarizeContent()}
            disabled={isProcessing || isReadingFile}
          >
            <span className="btn-content">
              {isReadingFile ? (
                <>
                  <Loader2 className="loader" size={24} />
                  Reading File...
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="loader" size={24} />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Generate Summary
                </>
              )}
            </span>
          </button>
        </div>

        <div className="output-section">
          <h2 className="section-title">
            <Sparkles size={28} />
            Summary & Insights
          </h2>

          <div className={`summary-display ${!summary ? "empty" : ""}`}>
            {summary ? (
              <div
                dangerouslySetInnerHTML={{ __html: getHighlightedSummary() }}
              />
            ) : (
              <p>
                Your summary will appear here with highlighted key points...
              </p>
            )}
          </div>

          {highlights.length > 0 && (
            <div className="highlights-list">
              <div className="highlights-title">Key Highlights</div>
              <div className="highlight-tags">
                {highlights.map((highlight, index) => (
                  <span key={index} className="highlight-tag">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="controls">
            <button
              className={`control-btn ${isSpeaking ? "active" : ""}`}
              onClick={toggleReadAloud}
              disabled={!summary}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={20} />
                  Stop Reading
                </>
              ) : (
                <>
                  <Volume2 size={20} />
                  Read Aloud
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
