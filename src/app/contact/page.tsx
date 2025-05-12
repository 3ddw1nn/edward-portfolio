"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Send, Linkedin, Github, Twitter } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-block rounded-lg bg-slate-100 dark:bg-slate-700/50 px-3 py-1 text-sm mb-3">
          Get In Touch
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Contact Me
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-[600px] md:text-lg">
          I&apos;d love to hear from you! Whether you have a project in mind or
          just want to say hello, feel free to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="order-2 md:order-1">
          <div className="bg-white dark:bg-black rounded-xl p-6 md:p-8 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6">Send Me a Message</h2>

            {isSubmitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p>
                  Thank you for your message! I&apos;ll get back to you soon.
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-black dark:border-slate-700"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-black dark:border-slate-700"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-black dark:border-slate-700"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white dark:bg-black dark:border-slate-700"
                  placeholder="Your message here..."
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="bg-white dark:bg-black rounded-xl p-6 md:p-8 shadow-sm border dark:border-slate-700 mb-8">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    Email
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    ehleedev@gmail.com
                  </p>
                  <a
                    href="mailto:ehleedev@gmail.com"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                  >
                    Send an email
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-black rounded-xl p-6 md:p-8 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6">Connect With Me</h2>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/edventuretech/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors px-4 py-2 rounded-lg"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/3ddw1nn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors px-4 py-2 rounded-lg"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://x.com/edventuretech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors px-4 py-2 rounded-lg"
              >
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
