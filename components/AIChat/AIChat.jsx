import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faPaperPlane,
  faTimes,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! I am your Radhuni AI assistant. Ask me anything about recipes or cooking!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Gemini API
  // NOTE: You need to add VITE_GEMINI_API_KEY to your .env file
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const isDemoMode = !API_KEY || API_KEY.includes("YOUR_GEMINI_API_KEY");

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (isDemoMode) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "🔍 **DEMO MODE ACTIVE**\n\nThe AI Chat interface is working! To get real cooking advice, please add your actual Google Gemini API Key to the `.env` file.\n\nEdit `e:\\projects\\E-radhuni\\.env` and set `VITE_GEMINI_API_KEY` to your key.",
          },
        ]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);

      const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

      const runChat = async (modelName) => {
        console.log(`Attempting to use model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const history = messages
          .filter(
            (m) =>
              m.text &&
              !m.text.startsWith("Error:") &&
              !m.text.startsWith("Sorry,")
          )
          .slice(1)
          .map((m) => ({
            role: m.role === "admin" ? "user" : m.role,
            parts: [{ text: m.text }],
          }));

        const chat = model.startChat({
          history: history,
          generationConfig: {
            maxOutputTokens: 500,
          },
        });

        const result = await chat.sendMessage(input);
        const response = await result.response;
        return response.text();
      };

      // Try models sequentially
      let text = null;
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          text = await runChat(modelName);
          break; // Success!
        } catch (e) {
          console.warn(`Model ${modelName} failed:`, e.message);
          lastError = e;
          // Continue to next model if it's a 404 (Not Found)
          if (!e.message.includes("404") && !e.message.includes("not found")) {
            // If it's NOT a 404 (e.g. quota limit, network), stop trying and throw
            throw e;
          }
        }
      }

      if (text) {
        setMessages((prev) => [...prev, { role: "model", text: text }]);
      } else {
        throw lastError;
      }
    } catch (error) {
      console.error("Error fetching from Gemini:", error);

      let errorMessage =
        "Sorry, I encountered an error. Please try again later.";

      if (
        error.message?.includes("404") &&
        error.message?.includes("not found")
      ) {
        errorMessage =
          "Error: The AI model is not accessible. \n\nPossible reasons:\n1. The Google Generative AI API is not enabled in your Google Cloud Console.\n2. Your API key might be invalid or from a region where this model is unavailable.\n3. Verify your API Key in .env file.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 pointer-events-auto flex flex-col"
            style={{ maxHeight: "500px", height: "70vh" }}
          >
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faRobot} className="text-xl" />
                <h3 className="font-semibold">Radhuni Chef AI</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-light p-1 rounded transition-colors"
                aria-label="Close chat"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    {/* Simple markdown support could be added here, for now just text */}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask for a recipe..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Send message"
                >
                  <FontAwesomeIcon icon={faPaperPlane} size="xs" />
                </button>
              </div>
              <div className="text-[10px] text-center text-gray-400 mt-2">
                Powered by Google Gemini
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 ${
          isOpen ? "bg-gray-200 text-gray-600" : "bg-primary text-white"
        }`}
        aria-label="Toggle chat"
      >
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faCommentDots}
          className="text-2xl"
        />
      </button>
    </div>
  );
};

export default AIChat;
