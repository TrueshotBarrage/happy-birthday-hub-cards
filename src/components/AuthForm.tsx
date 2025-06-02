import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";

interface AuthFormProps {
  onLogin: (name: string, email?: string) => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name, email.trim() || undefined);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md shadow-xl border border-slate-700 bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            💝 Farewell Messages for Josh Kim 🌟
          </CardTitle>
          <CardDescription className="text-slate-300">
            Join us in sending heartfelt farewell messages for our favorite
            resident doctor!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Your Name *
              </label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-slate-600 focus:border-blue-400 rounded-lg bg-slate-700 text-slate-100 placeholder:text-slate-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <Input
                type="email"
                placeholder="Enter your email to edit/delete later"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-slate-600 focus:border-blue-400 rounded-lg bg-slate-700 text-slate-100 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-400 mt-1">
                Providing your email allows you to edit or delete your message
                later
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Writing Messages 💌
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
