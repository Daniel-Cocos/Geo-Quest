import React, { useState, useEffect, useRef } from 'react';
import './Sliders.css';

const DualSlider = ({ left, right, min, max, onChange }) => {
    const ref = useRef(null);
    const [dragging, setDragging] = useState(null);

    const calcValue = x => {
        const { left: cx, width } = ref.current.getBoundingClientRect();
        let pct = (x - cx) / width;
        pct = Math.max(0, Math.min(1, pct));
        return Math.round(min + pct * (max - min));
    };

    useEffect(() => {
        const onMove = e => {
            if (!dragging) return;
            const val = calcValue(e.clientX);
            if (dragging === 'left') {
                onChange(Math.min(val, right - 1), right);
            } else {
                onChange(left, Math.max(val, left + 1));
            }
        };
        const onUp = () => setDragging(null);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, [dragging, left, right, min, max, onChange]);

    const leftPct = ((left - min) / (max - min)) * 100;
    const rightPct = ((right - min) / (max - min)) * 100;

    return (
        <div ref={ref} className="slider-container">
            <div className="track" />
            <div className="range" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
            <div
                className="thumb left"
                style={{ left: `${leftPct}%` }}
                onMouseDown={() => setDragging('left')}
            >
                {left}
            </div>
            <div
                className="thumb right"
                style={{ left: `${rightPct}%` }}
                onMouseDown={() => setDragging('right')}
            >
                {right}
            </div>
        </div>
    );
};

function Sliders() {
    const [left, setLeft] = useState(2);
    const [right, setRight] = useState(5);

    return (
        <div>
            <DualSlider
                min={1}
                max={10}
                left={left}
                right={right}
                onChange={(newLeft, newRight) => {
                    setLeft(newLeft);
                    setRight(newRight);
                }}
            />
            <button type="submit" className="header-button save-btn">Save</button>
        </div>
    );
}

export default Sliders
