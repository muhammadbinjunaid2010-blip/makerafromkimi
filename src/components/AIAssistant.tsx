import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, X, Send, Sparkles, Cpu, Zap, BookOpen, Code2, Cpu as CpuIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  { icon: Cpu, text: "What's the best Arduino for beginners?" },
  { icon: Zap, text: "Suggest a robotics project idea" },
  { icon: BookOpen, text: "How do I calculate resistor values?" },
  { icon: Code2, text: "Debug my ESP32 WiFi code" },
  { icon: CpuIcon, text: "Generate a BOM for a robot car" },
];

// This is the interface for future AI integration.
// To connect OpenAI: replace mockResponse() with a call to:
//   POST https://api.openai.com/v1/chat/completions
// To connect Ollama: replace with a call to:
//   POST http://localhost:11434/api/chat
async function getAIResponse(messages: Message[]): Promise<string> {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || "";

  // Future: Replace this mock with actual AI API call
  // For OpenAI:
  // const res = await fetch("https://api.openai.com/v1/chat/completions", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ model: "gpt-4", messages })
  // });
  // const data = await res.json();
  // return data.choices[0].message.content;

  // For Ollama (local):
  // const res = await fetch("http://localhost:11434/api/chat", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ model: "llama3", messages })
  // });
  // const data = await res.json();
  // return data.message.content;

  // Mock responses for demo
  if (lastMessage.includes("arduino") || lastMessage.includes("beginner")) {
    return "For beginners, I recommend the **Arduino Uno R3** — it's the most documented board with tons of tutorials. If you want something smaller, the **Arduino Nano** is breadboard-friendly. Key specs: ATmega328P, 14 digital I/O pins, 6 analog inputs, 16MHz clock. Start with the Blink tutorial!";
  }
  if (lastMessage.includes("project") || lastMessage.includes("idea")) {
    return "Here's a great robotics project for you: **Line Following Robot**\n\n**Components needed:**\n- Arduino Uno/Nano\n- 2x DC motors + wheels\n- L298N motor driver\n- 5x IR sensors (TCRT5000)\n- Battery pack (6-12V)\n- Chassis\n\n**Difficulty:** Beginner-Intermediate\n**Estimated time:** 3-4 hours\n**Skills you'll learn:** PID control, sensor calibration, motor control";
  }
  if (lastMessage.includes("resistor") || lastMessage.includes("calculate")) {
    return "To calculate resistor values:\n\n**Ohm's Law:** V = I × R\nSo R = V / I\n\n**LED Resistor Example:**\n- LED forward voltage: 2V\n- Supply voltage: 5V\n- Desired current: 20mA\n- R = (5V - 2V) / 0.02A = **150Ω**\n\n**Color Code:** Use the mnemonic 'Bad Boys Race Our Young Girls But Violet Generally Wins' for Black(0) through Violet(7).";
  }
  if (lastMessage.includes("debug") || lastMessage.includes("wifi") || lastMessage.includes("esp32") || lastMessage.includes("code")) {
    return "Common ESP32 WiFi issues and fixes:\n\n1. **Connection timeout** — Check your SSID/password. Try `WiFi.mode(WIFI_STA)` before connecting.\n2. **Weak signal** — Add an external antenna if using ESP32-WROOM.\n3. **Power issues** — ESP32 needs up to 500mA peak. Use a stable power source.\n4. **Code example:**\n```cpp\n#include <WiFi.h>\nWiFi.begin(\"ssid\", \"password\");\nwhile (WiFi.status() != WL_CONNECTED) {\n  delay(500); Serial.print(\".\");\n}\nSerial.println(\"Connected!\");\n```";
  }
  if (lastMessage.includes("bom") || lastMessage.includes("bill of material") || lastMessage.includes("robot car")) {
    return "**Bill of Materials — Robot Car Kit**\n\n| Component | Quantity | Estimated Cost |\n|-----------|----------|---------------|\n| Arduino Uno/Nano | 1 | $8-12 |\n| L298N Motor Driver | 1 | $3-5 |\n| DC Motors (with wheels) | 2 | $5-8 |\n| HC-SR04 Ultrasonic | 1 | $2-3 |\n| Servo Motor SG90 | 1 | $2-4 |\n| Battery Holder (4xAA) | 1 | $1-2 |\n| Jumper Wires | 20pcs | $2-3 |\n| Chassis/Acrylic base | 1 | $3-5 |\n| **Total** | | **$26-42** |";
  }

  return "I'm your Makera AI Assistant! I can help you with:\n\n• **Component recommendations** — Find the right parts for your project\n• **Project ideas** — Get inspired for your next build\n• **Code debugging** — Fix Arduino/ESP32/Raspberry Pi code\n• **BOM generation** — Create bills of materials\n• **Learning guides** — Understand electronics concepts\n\nWhat would you like help with today? 🚀";
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your Makera AI Assistant. How can I help with your electronics project today? 🔧" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const response = await getAIResponse(newMessages);
    setMessages([...newMessages, { role: "assistant", content: response }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center"
      >
        <Bot className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]"
          >
            <Card className="border-2 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      Makera AI
                      <Sparkles className="h-3 w-3 text-amber-500" />
                    </p>
                    <p className="text-[10px] text-muted-foreground">Electronics Assistant</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea ref={scrollRef} className="h-[400px] p-4">
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-slate-100 text-slate-900 rounded-bl-sm"
                        }`}
                      >
                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br/>")
                            .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre class='bg-slate-800 text-green-400 p-2 rounded text-xs mt-1 overflow-x-auto'><code>$2</code></pre>")
                            .replace(/`([^`]+)`/g, "<code class='bg-blue-100 text-blue-800 px-1 rounded text-xs'>$1</code>")
                            .replace(/\|(.+)\|/g, "<span class='text-xs'>$1</span>")
                        }} />
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 rounded-xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2">
                  <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-medium">Suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setInput(s.text); }}
                        className="text-xs px-2.5 py-1.5 rounded-full border bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1"
                      >
                        <s.icon className="h-3 w-3" />
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything..."
                    className="h-9 text-sm"
                  />
                  <Button size="sm" onClick={handleSend} disabled={!input.trim() || isLoading} className="h-9 w-9 p-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
