import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const DraggableContactButton = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 100, y: 100 });

    const controls = useDragControls();
    const buttonRef = useRef(null);
    const pressTimer = useRef(null);

    // Start long press timer
    const startPressTimer = (event) => {
        pressTimer.current = setTimeout(() => {
            setIsDragging(true);
            controls.start(event); // Start drag manually
        }, 500);
    };

    const clearPressTimer = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };

    const handleDragEnd = (event, info) => {
        setIsDragging(false);
        setPosition({
            x: info.point.x - buttonRef.current.offsetWidth / 2,
            y: info.point.y - buttonRef.current.offsetHeight / 2
        });
    };

    useEffect(() => {
        return () => clearPressTimer();
    }, []);

    if (!isVisible) return null;

    return (
        <motion.div
            ref={buttonRef}
            className="fixed z-50 cursor-pointer"
            style={{
                left: position.x,
                top: position.y,
                touchAction: 'none'
            }}
            drag
            dragControls={controls}
            dragListener={false}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            onPointerDown={startPressTimer}
            onPointerUp={clearPressTimer}
            onPointerLeave={clearPressTimer}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <Link to="/contact" className="block">
                <motion.div
                    className="relative"
                    animate={{
                        rotate: isHovered ? [0, 15, -15, 0] : 0,
                        transition: {
                            duration: 1.5,
                            repeat: isHovered ? Infinity : 0,
                            ease: "easeInOut"
                        }
                    }}
                >
                    {/* Main orb */}
                    <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl flex items-center justify-center relative overflow-hidden"
                        animate={{
                            boxShadow: isHovered 
                                ? "0 0 20px 5px rgba(56, 182, 255, 0.6)"
                                : "0 0 10px 2px rgba(56, 182, 255, 0.4)"
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Inner glow */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-cyan-300 opacity-20"
                            animate={{
                                scale: isHovered ? [1, 1.2, 1] : 1,
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Pulsing rings */}
                        <AnimatePresence>
                            {isHovered && (
                                <>
                                    <motion.div
                                        className="absolute border-2 border-cyan-300 rounded-full"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeOut"
                                        }}
                                    />
                                    <motion.div
                                        className="absolute border-2 border-cyan-300 rounded-full"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.8, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeOut",
                                            delay: 0.5
                                        }}
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        {/* Message icon */}
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-8 h-8 relative z-10"
                        >
                            <motion.path
                                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: isHovered ? 1 : 0.8 }}
                                transition={{ duration: 0.5 }}
                            />
                            <motion.path
                                d="M8 10h.01M12 10h.01M16 10h.01"
                                animate={{
                                    opacity: isHovered ? [0, 1, 0] : 1,
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                }}
                            />
                        </motion.svg>
                    </motion.div>

                    {/* Floating particles */}
                    <AnimatePresence>
                        {isHovered && (
                            <>
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-white rounded-full"
                                        initial={{ x: 0, y: 0, opacity: 0 }}
                                        animate={{
                                            x: [0, Math.random() * 30 - 15],
                                            y: [0, Math.random() * 30 - 15],
                                            opacity: [0, 0.8, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default DraggableContactButton;
