import React from "react";
import {
  Sparkles,
  Twitter,
  Github,
  MessageCircle,
} from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: ["Explore", "Pricing", "API", "Leaderboard"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Blog", "Tutorials", "Community"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Press"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Licenses"],
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-[1.2fr_2fr] xl:gap-20">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c3aed]/15 text-[#8b5cf6]">
                <Sparkles className="h-5 w-5" />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight">
                Prompt<span className="text-[#8b5cf6]">Hub</span>
              </h2>
            </div>

            <p className="mt-6 text-base leading-8 text-[#94a3b8]">
              The community platform for prompt engineers to share, discover,
              and monetize their AI creations.
            </p>

            <div className="mt-8 flex items-center gap-5 text-[#94a3b8]">
              <a
                href="#"
                aria-label="Twitter"
                className="transition-colors hover:text-white"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="transition-colors hover:text-white"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="Community"
                className="transition-colors hover:text-white"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold text-white">
                  {section.title}
                </h3>

                <ul className="mt-6 space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-base text-[#94a3b8] transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 text-sm text-[#94a3b8] md:flex-row md:items-center md:justify-between">
            <p>© 2024 PromptHub. All rights reserved.</p>
            <p className="text-left md:text-right">
              Made with ✨ by Niruth Ananth
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;