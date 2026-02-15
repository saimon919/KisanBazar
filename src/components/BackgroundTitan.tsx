import { motion, useScroll, useTransform, useTime, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const BackgroundTitan = () => {
    const time = useTime();
    const { pathname } = useLocation();
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const { scrollYProgress } = useScroll();

    // Generative Heartbeat: A subtle pulse based on time and scroll
    const heartbeatScale = useTransform(time, [0, 10000], [1, 1.15], { clamp: false });
    const heartbeatOpacity = useTransform(time, [0, 5000, 10000], [0.03, 0.08, 0.03], { clamp: false });

    // Natural mouse tracking with smoothing
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const springConfig = { damping: 30, stiffness: 200 };
    const mouseX = useSpring(mousePos.x, springConfig);
    const mouseY = useSpring(mousePos.y, springConfig);

    // Context-aware color palettes
    const palettes = {
        home: ['#ffffff', '#f0fdf4', '#ecfdf5'],
        marketplace: ['#ffffff', '#f0f9ff', '#e0f2fe'],
        hub: ['#ffffff', '#fffbeb', '#fef3c7'],
        default: ['#ffffff', '#f8fafc', '#f1f5f9']
    };

    const getPalette = () => {
        if (pathname === '/') return palettes.home;
        if (pathname === '/marketplace') return palettes.marketplace;
        if (pathname === '/learning-hub') return palettes.hub;
        return palettes.default;
    };

    const currentPalette = getPalette();

    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 0.7]);
    const scrollColor = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        currentPalette
    );

    const isLiteMode = localStorage.getItem('liteMode') === 'true';

    if (isLiteMode) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                backgroundColor: '#f8fafc',
                backgroundImage: 'linear-gradient(to bottom, #f0fdf4, #ffffff)'
            }} />
        );
    }

    return (
        <motion.div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                overflow: 'hidden',
                backgroundColor: scrollColor,
                opacity: bgOpacity,
            }}
        >
            {/* Generative Heartbeat */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: 0,
                    scale: heartbeatScale,
                    opacity: heartbeatOpacity,
                    background: 'radial-gradient(circle at 50% 50%, #10b981 0%, transparent 70%)'
                }}
            />

            {/* Mesh Gradient Layer 1: Emerald Pulse */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '-10%',
                    width: '60%',
                    height: '60%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                    x: useTransform(mouseX, [0, 1], [-50, 50]),
                    y: useTransform(mouseY, [0, 1], [-50, 50]),
                }}
            />

            {/* Mesh Gradient Layer 2: Sky Depth */}
            <motion.div
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    right: '-10%',
                    width: '70%',
                    height: '70%',
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                    x: useTransform(mouseX, [0, 1], [50, -50]),
                    y: useTransform(mouseY, [0, 1], [50, -50]),
                }}
            />

            {/* Mesh Gradient Layer 3: Organic Flow */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '20%',
                    width: '50%',
                    height: '50%',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 80%)',
                    filter: 'blur(120px)',
                    x: useTransform(mouseX, [0, 1], [-20, 20]),
                    y: useTransform(mouseY, [0, 1], [-20, 20]),
                }}
            />

            {/* Grain Overlay for high-end cinematic texture */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    opacity: 0.02,
                    pointerEvents: 'none',
                }}
            />
        </motion.div>
    );
};

export default BackgroundTitan;
