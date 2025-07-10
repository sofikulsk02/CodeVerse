import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { Sparkles, Code2, Trophy, Users } from "lucide-react";
import toast from "react-hot-toast";

// Demo Login Button Component
const DemoLoginButton = ({ role, color, email }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setIsLoading(true);
    console.log(`🔍 Attempting demo login for role: ${role}, email: ${email}`);

    try {
      const result = await login(email, "password123");
      console.log("🔍 Login result:", result);

      if (result.success) {
        toast.success(`🎉 Logged in as ${role}!`);

        // Navigate based on role
        setTimeout(() => {
          switch (result.user.role) {
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "mentor":
              navigate("/dashboard");
              break;
            case "student":
              navigate("/dashboard");
              break;
            default:
              navigate("/dashboard");
          }
        }, 500);
      } else {
        console.error("❌ Login failed:", result.message);
        toast.error(result.message || "Demo login failed");
      }
    } catch (error) {
      console.error("❌ Demo login error:", error);
      toast.error(`Failed to login as ${role}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleDemoLogin}
      disabled={isLoading}
      className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${color} ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
      }`}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Logging in...</span>
        </div>
      ) : (
        role
      )}
    </motion.button>
  );
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: Code2,
      title: "Solve Problems",
      description: "Practice with coding challenges",
    },
    {
      icon: Trophy,
      title: "Join Contests",
      description: "Compete with other students",
    },
    {
      icon: Users,
      title: "Learn Together",
      description: "Collaborate and grow",
    },
  ];

  return (
    <div className="min-h-screen  bg-gradient-to-r from-teal-300 to-teal-500 flex items-center justify-center p-4">
      {/* Background Effects - Same as your screenshot */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding (exactly like your screenshot) */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex items-center justify-center lg:justify-start mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-black">codeVerse</h1>
            </motion.div>
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-black mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Master Programming with{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Interactive Challenges
              </span>
            </motion.h2>

            <motion.p
              className="text-black text-lg mb-8 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join thousands of students improving their coding skills through
              hands-on practice and friendly competition.
            </motion.p>

            {/* Features - exactly like your screenshot */}
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-center space-x-4 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-black font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-black text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form (exactly like your screenshot) */}
          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-black mb-2">
                {isLogin ? "Welcome Back!" : "Join CodeVerse"}
              </h3>
              <p className="text-black">
                {isLogin
                  ? "Sign in to continue your journey"
                  : "Start your coding adventure today"}
              </p>
            </div>

            {/* Demo Login Buttons - exactly like your screenshot */}
            <motion.div
              className="mb-6 p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-black text-sm text-center mb-3">
                🚀 Quick Demo Access:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <DemoLoginButton
                  role="Admin"
                  color="bg-red-600 hover:bg-red-700 text-white"
                  email="admin@soma.edu"
                />
                <DemoLoginButton
                  role="Mentor"
                  email="mentor@soma.edu"
                  color="bg-yellow-500 hover:bg-yellow-600 text-white"
                />
                <DemoLoginButton
                  role="Student"
                  email="student@soma.edu"
                  color="bg-green-500 hover:bg-green-600 text-white"
                />
              </div>
              <p className="text-black text-xs text-center mt-2">
                All demo accounts use password:{" "}
                <code className="bg-white/10 px-1 rounded">password123</code>
              </p>
            </motion.div>

            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
