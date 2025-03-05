import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Card } from "@/components/ui";
import { motion } from "framer-motion";
import { Lock, Send } from "lucide-react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const sendMessage = async () => {
    if (!isVerified) return alert("Please verify OTP first");
    if (!message.trim()) return;
    
    setChat([...chat, { type: "user", text: message }]);
    setMessage("");
    
    try {
      const res = await axios.post("http://localhost:5000/chat", { message });
      setChat([...chat, { type: "bot", text: res.data.reply }]);
    } catch (error) {
      console.error("Error fetching response", error);
    }
  };

  const requestOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/request-otp");
      alert(`Your OTP: ${res.data.otp}`);
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", { otp });
      if (res.data.verified) setIsVerified(true);
      else alert("Invalid OTP");
    } catch (error) {
      console.error("OTP verification failed", error);
    }
  };

  return (
    <motion.div className="flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-blue-400">BlackBox AI Chatbot</h1>
      {!isVerified ? (
        <Card className="p-6 bg-gray-800 rounded-xl shadow-lg w-96 text-center">
          <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <Button onClick={requestOtp} className="w-full bg-blue-500 hover:bg-blue-600">Request OTP</Button>
          <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="mt-3 p-3 rounded-lg text-black" />
          <Button onClick={verifyOtp} className="mt-3 w-full bg-green-500 hover:bg-green-600">Verify OTP</Button>
        </Card>
      ) : (
        <Card className="p-6 bg-gray-800 rounded-xl shadow-lg w-full max-w-lg">
          <div className="chat-window space-y-2 max-h-96 overflow-auto p-4 bg-gray-700 rounded-lg">
            {chat.map((msg, i) => (
              <motion.div 
                key={i} 
                className={`p-3 rounded-lg max-w-xs ${msg.type === "user" ? "bg-blue-500 self-end" : "bg-gray-600 self-start"}`}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask me anything..." className="flex-1 p-3 rounded-lg text-black" />
            <Button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Send</span>
            </Button>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default Chatbot;
