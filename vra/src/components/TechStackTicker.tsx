import React from 'react';

const TECH_STACK = [
    // Languages
    "Python", "Java", "C++",
    // Frontend
    "React.js", "HTML5", "CSS", "Vite", "TailwindCSS", "Next.js",
    // Backend
    "Node.js", "Express.js", "Mongoose",
    // Databases
    "MongoDB", "PostgreSQL",
    // Tools & Infrastructure
    "Git", "GitHub", "GitHub Actions", "Netlify", "Vercel",
    "JSON Web Tokens", "Bcrypt", "Figma", "Bruno", "REST API",
    "Dotenv", "MongoDB Atlas", "Render", "Docker", "AWS", "Prisma"
];

export default function TechStackTicker() {
    return (
        <div className="w-full bg-slate-900 border-y border-slate-800 overflow-hidden py-3">
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll">
                    {TECH_STACK.map((tech, index) => (
                        <li key={`tech-1-${index}`} className="text-slate-300 font-medium whitespace-nowrap text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {tech}
                        </li>
                    ))}
                </ul>
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll" aria-hidden="true">
                    {TECH_STACK.map((tech, index) => (
                        <li key={`tech-2-${index}`} className="text-slate-300 font-medium whitespace-nowrap text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {tech}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
