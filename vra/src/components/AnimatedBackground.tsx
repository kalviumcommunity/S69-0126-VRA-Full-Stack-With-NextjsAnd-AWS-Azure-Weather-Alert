'use client';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50">
            {/* 
        Light & Airy Background Theme (Matching Location Page)
        Uses soft blue/cyan gradients to create a fresh, clean atmosphere.
      */}

            {/* Base Light Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50" />

            {/* Soft Moving Blobs for subtle dynamics */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200 mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-200 mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-200 mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />

            {/* Subtle grid pattern opacity adjusted for light theme */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.4]" />
        </div>
    );
}
