// src/components/GlassButton/GlassButton.tsx
'use client';

import { useState, useRef } from 'react';
import styles from './GlassButton.module.css';

export default function GlassButton() {
    const [isPressed, setIsPressed] = useState(false);
    
    // Запоминаем время, когда начали жать
    const pressStartTime = useRef<number>(0);
    const releaseTimeout = useRef<NodeJS.Timeout | null>(null);
    
    // Время анимации вдавливания из CSS (0.1s = 100ms)
    const ANIMATION_DURATION = 100; 

    const handlePointerDown = () => {
        if (releaseTimeout.current) clearTimeout(releaseTimeout.current);
        
        pressStartTime.current = Date.now();
        setIsPressed(true);
    };

    const handlePointerUp = () => {
        // Сколько миллисекунд мы держали кнопку нажатой?
        const timeHeld = Date.now() - pressStartTime.current;
        
        // Сколько миллисекунд осталось до конца анимации вдавливания?
        const timeLeft = ANIMATION_DURATION - timeHeld;

        if (timeLeft > 0) {
            // Если кликнули ОЧЕНЬ быстро (например за 20мс), 
            // ждем оставшиеся 80мс, чтобы кнопка успела дойти до конца, и СРАЗУ отпускаем
            releaseTimeout.current = setTimeout(() => {
                setIsPressed(false);
            }, timeLeft);
        } else {
            // Если держали долго (больше 100мс) — отпускаем МОМЕНТАЛЬНО, без пауз
            setIsPressed(false);
        }
    };

    return (
        <button 
            type="submit" 
            className={`${styles.submitBtn} ${isPressed ? styles.pressed : ''}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp} // Если курсор ушел с кнопки
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }} 
        >
            .
        </button>
    );
}