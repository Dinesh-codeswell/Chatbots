
import { useState, useRef, useEffect } from 'react';
import { Send, Smartphone, Bot, User, MessageSquare, Info, HelpCircle, ArrowLeft, Star, Clock, TrendingUp, Zap, Shield, Camera, Battery, Wifi, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your iPhone Expert. I can help you with troubleshooting, iOS features, device comparisons, optimization tips, and much more. What would you like to know about your iPhone today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callPerplexityAPI = async (message: string): Promise<string> => {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an iPhone expert assistant. Provide helpful, accurate, and detailed information about iPhones, iOS, Apple products, troubleshooting, features, and related topics. Be concise but thorough in your responses.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Perplexity API Error:', error);
      throw new Error('Failed to get response from AI service');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await callPerplexityAPI(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const iPhoneTips = [
    { 
      title: "Battery Health Optimization", 
      content: "Enable Optimized Battery Charging in Settings > Battery > Battery Health & Charging. Use Low Power Mode when battery is below 20% and avoid extreme temperatures.",
      icon: Battery,
      category: "Battery"
    },
    { 
      title: "Camera Pro Tips", 
      content: "Use Portrait mode for professional-looking photos. Try different lighting effects like Stage Light or Studio Light. Use the timer for group photos.",
      icon: Camera,
      category: "Photography"
    },
    { 
      title: "Wi-Fi Performance", 
      content: "Reset network settings if experiencing connectivity issues. Go to Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings.",
      icon: Wifi,
      category: "Connectivity"
    },
    { 
      title: "Privacy & Security", 
      content: "Enable two-factor authentication, use Screen Time controls, and regularly review app permissions in Settings > Privacy & Security.",
      icon: Shield,
      category: "Security"
    },
    { 
      title: "iOS Shortcuts", 
      content: "Create custom shortcuts in the Shortcuts app to automate daily tasks. Try 'Hey Siri' commands for hands-free operation.",
      icon: Zap,
      category: "Productivity"
    },
    { 
      title: "Storage Management", 
      content: "Use 'Offload Unused Apps' and 'Optimize iPhone Storage' for photos. Check storage usage in Settings > General > iPhone Storage.",
      icon: Settings,
      category: "Storage"
    }
  ];

  const quickActions = [
    { title: "Battery Issues", query: "My iPhone battery drains quickly. How can I fix this?", icon: Battery },
    { title: "Camera Problems", query: "My iPhone camera is not working properly. What should I do?", icon: Camera },
    { title: "iOS Update", query: "Should I update to the latest iOS version? What are the benefits?", icon: TrendingUp },
    { title: "Storage Full", query: "My iPhone storage is full. How can I free up space?", icon: Settings },
    { title: "Wi-Fi Issues", query: "My iPhone won't connect to Wi-Fi. How do I troubleshoot this?", icon: Wifi },
    { title: "Security Setup", query: "How can I make my iPhone more secure and private?", icon: Shield }
  ];

  const featuredFeatures = [
    {
      title: "Smart Diagnostics",
      description: "AI-powered analysis of your iPhone issues with step-by-step solutions",
      icon: Zap,
      color: "bg-blue-500"
    },
    {
      title: "Performance Optimization",
      description: "Get personalized tips to boost your iPhone's speed and battery life",
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      title: "Latest iOS Features",
      description: "Stay updated with the newest iPhone features and how to use them",
      icon: Star,
      color: "bg-purple-500"
    },
    {
      title: "24/7 Expert Support",
      description: "Round-the-clock assistance from our AI iPhone specialist",
      icon: Clock,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="relative min-h-screen w-full">
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 transition-colors duration-700"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-300/20 dark:from-blue-800/10 dark:to-indigo-900/10 blur-3xl -top-[500px] -left-[500px] animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-br from-purple-200/15 to-pink-200/15 dark:from-purple-800/8 dark:to-pink-800/8 blur-3xl -bottom-[400px] -right-[400px] animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+PC9zdmc+')]"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 relative">
        {/* Enhanced Header */}
        <header className="text-center mb-10 animate-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 flex justify-start">
              <Badge variant="secondary" className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                AI Powered Expert
              </Badge>
            </div>
            
            <div className="flex items-center justify-center gap-4 flex-1">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25 dark:shadow-blue-500/15">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-500 bg-clip-text text-transparent">
                  iPhone Expert
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your AI-Powered iPhone Assistant
                </p>
              </div>
            </div>
            
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
            Get instant expert help with your iPhone. From troubleshooting to optimization tips, 
            I'm here to make your iPhone experience seamless and enjoyable.
          </p>
        </header>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="chat" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 max-w-2xl mx-auto mb-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-2">
            <TabsTrigger 
              value="chat" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all"
            >
              <MessageSquare className="h-4 w-4" /> Chat
            </TabsTrigger>
            <TabsTrigger 
              value="tips" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all"
            >
              <Info className="h-4 w-4" /> Tips
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all"
            >
              <Star className="h-4 w-4" /> Features
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all"
            >
              <Settings className="h-4 w-4" /> Tools
            </TabsTrigger>
          </TabsList>
          
          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-0 space-y-6 animate-in">
            <Card className="h-[600px] flex flex-col bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border-0 shadow-2xl shadow-blue-500/10">
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-8">
                <div className="space-y-8">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <Avatar className={`w-12 h-12 shadow-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25' 
                          : 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-gray-500/25'
                      }`}>
                        <AvatarFallback className="text-white">
                          {message.role === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[75%] rounded-3xl px-6 py-4 shadow-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-gray-200/50 dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-3 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg shadow-gray-500/25">
                        <AvatarFallback className="text-white">
                          <Bot className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white dark:bg-gray-800 rounded-3xl px-6 py-4 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-b-3xl">
                <div className="flex gap-3 mb-4">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your iPhone..."
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl px-6 py-4 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-blue-500/25"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(action.query)}
                      className="flex items-center gap-2 text-sm py-2 px-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <action.icon className="h-3 w-3" />
                      {action.title}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Enhanced Tips Tab */}
          <TabsContent value="tips" className="mt-0 animate-in">
            <Card className="min-h-[600px] bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border-0 shadow-2xl shadow-blue-500/10 overflow-hidden">
              <div className="p-8">
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  iPhone Pro Tips & Tricks
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {iPhoneTips.map((tip, index) => (
                    <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:scale-105">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <tip.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{tip.title}</h3>
                          <Badge variant="secondary" className="text-xs mt-1">{tip.category}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{tip.content}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => setActiveTab('chat')}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl px-8 py-3 text-white shadow-lg shadow-blue-500/25 transition-all duration-200"
                  >
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Get Personalized Tips
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* New Features Tab */}
          <TabsContent value="features" className="mt-0 animate-in">
            <div className="grid md:grid-cols-2 gap-6">
              {featuredFeatures.map((feature, index) => (
                <Card key={index} className="p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* New Tools Tab */}
          <TabsContent value="tools" className="mt-0 animate-in">
            <Card className="p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border-0 shadow-2xl shadow-blue-500/10">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                iPhone Diagnostic Tools
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Battery className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Battery Health Check</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Get detailed analysis of your iPhone's battery performance and optimization recommendations.
                  </p>
                  <Button 
                    onClick={() => {
                      setActiveTab('chat');
                      setInput('Analyze my iPhone battery health and give me optimization tips');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
                  >
                    Check Battery Health
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/30">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Performance Optimizer</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Boost your iPhone's speed and responsiveness with personalized optimization tips.
                  </p>
                  <Button 
                    onClick={() => {
                      setActiveTab('chat');
                      setInput('How can I optimize my iPhone for better performance and speed?');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 rounded-xl"
                  >
                    Optimize Performance
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Security Audit</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Review your iPhone's security settings and get recommendations for maximum protection.
                  </p>
                  <Button 
                    onClick={() => {
                      setActiveTab('chat');
                      setInput('Audit my iPhone security settings and suggest improvements');
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl"
                  >
                    Security Audit
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Storage Cleanup</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Free up space on your iPhone with smart storage management recommendations.
                  </p>
                  <Button 
                    onClick={() => {
                      setActiveTab('chat');
                      setInput('Help me clean up my iPhone storage and free up space');
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl"
                  >
                    Clean Storage
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Enhanced Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 animate-in" style={{ animationDelay: '0.2s' }}>
          <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all group hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 text-lg">Expert iPhone Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Comprehensive help with setup, features, troubleshooting, and optimization for all iPhone models</p>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all group hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 text-lg">AI-Powered Assistance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Advanced artificial intelligence providing instant, accurate, and personalized iPhone solutions</p>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all group hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 text-lg">Premium Experience</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Professional-grade support with cutting-edge features and continuous updates</p>
            </div>
          </Card>
        </div>
        
        {/* Enhanced Footer */}
        <footer className="mt-16 text-center pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">iPhone Expert</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Your trusted AI companion for all iPhone needs
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} iPhone Expert • Powered by Advanced AI Technology
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
