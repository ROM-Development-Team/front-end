import { motion } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  Download,
  Users,
  Shield,
  Heart,
  Sparkles,
  Mic,
  Brain,
  Trash2,
  Clock,
  MoonStar,
  HandHeart,
} from "lucide-react";

export default function LandingPage() {
  const handleDownload = () => {
    window.open("https://rantonme.netlify.app", "_blank");
  };

  return (
    <div className="min-h-screen bg-peach-50 text-gray-800">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-6 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center space-x-3">
          <img
            src="https://i.ibb.co/TM7Hcx2C/Black-and-Yellow-Modern-Initial-R-Logo-Photoroom.png"
            alt="Rant on Me Logo"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-orange-400">RantOnMe</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="bg-orange-400 text-white px-5 py-2 rounded-full font-medium hover:bg-orange-500 transition"
        >
          Get App
        </motion.button>
      </motion.header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              Speak Freely. <span className="text-orange-400">Be Heard.</span>
            </h2>
            <p className="text-lg mb-8 text-gray-700 leading-relaxed">
              RantOnMe is a safe space to share emotions anonymously, powered by AI for healing, support, and real connection. Let your voice be your release.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="bg-orange-400 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 hover:bg-orange-500 transition"
            >
              <Smartphone className="w-5 h-5" />
              <span>Download App</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10 bg-orange-50 border border-orange-100 rounded-3xl p-8 shadow-xl">
              <div className="space-y-6">
                {[{
                  icon: Heart,
                  title: "Anonymous Support",
                  desc: "Post rants and receive support without revealing your identity."
                }, {
                  icon: Users,
                  title: "Community Healing",
                  desc: "Connect with others facing the same emotional waves."
                }, {
                  icon: Shield,
                  title: "Privacy First",
                  desc: "Everything is encrypted. You are in control of your data."
                }].map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{title}</h3>
                      <p className="text-gray-600 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Highlights */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="container mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">Unique Features to Love</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            RantOnMe isn’t just another app. It’s your emotional companion — powered by AI, built for support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[{
            icon: Mic,
            title: "Voice Rants",
            description: "Express with emotion through anonymous voice recordings."
          }, {
            icon: Brain,
            title: "AI Comfort Bot",
            description: "Get a response from a therapist, motivator, or honest friend."
          }, {
            icon: Trash2,
            title: "Let Go Button",
            description: "Delete a rant with a therapeutic animation — goodbye stress."
          }, {
            icon: Clock,
            title: "Time Capsule",
            description: "Write rants to unlock in the future. Messages to your future self."
          }, {
            icon: MoonStar,
            title: "Night Journal Mode",
            description: "Calming, late-night interface for overthinkers and insomniacs."
          }, {
            icon: HandHeart,
            title: "Digital Hug",
            description: "Send warmth with a hug — more than a like, less than a comment."
          }].map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
              className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center hover:shadow-md transition"
            >
              <Icon className="w-10 h-10 mx-auto mb-3 text-orange-500" />
              <h4 className="text-xl font-semibold text-gray-800 mb-1">{title}</h4>
              <p className="text-gray-600 text-sm">{description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="container mx-auto px-6 py-20 text-center"
      >
        <h3 className="text-3xl font-bold text-gray-800 mb-4">Start Healing, One Rant at a Time</h3>
        <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
          It’s more than just an app — it’s a movement of emotional honesty, empathy, and growth.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="bg-orange-400 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 transition"
        >
          Join RantOnMe
        </motion.button>
      </motion.section>

      <footer className="container mx-auto px-6 py-8 text-center border-t border-gray-200 text-sm text-gray-500">
        <p>&copy; 2025 RantOnMe. Feel deeply. Rant safely.</p>
      </footer>
    </div>
  );
}