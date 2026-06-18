import React, { useState } from 'react';
import ChartCard from '../components/ChartCard';
import { MessageSquare, Send, Database, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your EIMS AI Assistant powered by Gemini. Ask me anything about the database, like "How many laptops do we have?" or "Show me all pending leave requests."' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { role: 'user', text: query };
    setMessages([...messages, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'dummy-token'}`
        },
        body: JSON.stringify({ query: userMessage.text })
      });

      const data = await response.json();
      
      let aiResponseText = '';
      if (!response.ok) {
        aiResponseText = `Error: ${data.message || 'Failed to fetch'}`;
      } else {
        // Format the table result
        if (data.result && data.result.length > 0) {
          aiResponseText = `I generated this SQL query:\n\`\`\`sql\n${data.sql}\n\`\`\`\n\n**Results:**\n`;
          aiResponseText += JSON.stringify(data.result, null, 2);
        } else if (data.result && data.result.length === 0) {
           aiResponseText = `I generated this SQL query:\n\`\`\`sql\n${data.sql}\n\`\`\`\n\nNo records found for your query.`;
        } else {
          aiResponseText = data.sql || 'Processed successfully.';
        }
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponseText, isData: !!data.result }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: `Error connecting to AI engine: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 100px)' }}>
      <div className="page-header" style={{ marginBottom: '0' }}>
        <h1 className="page-title">AI Assistant</h1>
        <p style={{ color: 'var(--text-muted)' }}>Natural language queries, insights generation, and auto-reporting.</p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                display: 'flex', 
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: '12px',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--chart-orange)', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.role === 'user' ? 'U' : <Database size={20} />}
              </div>
              
              <div style={{ 
                background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-main)',
                color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                padding: '16px', borderRadius: '16px', maxWidth: '80%',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderTopLeftRadius: msg.role === 'user' ? '16px' : '4px',
              }}>
                {msg.isData ? (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {msg.text}
                  </pre>
                ) : (
                  <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--chart-orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader size={20} className="spinner" />
              </div>
              <span style={{ color: 'var(--text-muted)' }}>AI Engine is processing...</span>
            </div>
          )}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="E.g., Show me all active laptops assigned to the IT department..."
              style={{ flex: 1, padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '1rem' }}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 32px' }}
              disabled={loading}
            >
              <Send size={20} />
              <span>Send</span>
            </motion.button>
          </div>
        </div>
      </div>
      <style>{`
        .spinner { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AIAssistant;
