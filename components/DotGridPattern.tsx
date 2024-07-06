import React from 'react';

const DotGridPattern = ({ width = '100%', height = '100%', dotSize = 1, spacing = 20, className }: { width?: string, height?: string, dotSize?: number, spacing?: number, className?: string }) => {
    const patternId = "dot-grid-pattern";

    return (
        <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} className={className}>
            <defs>
                <pattern id={patternId} patternUnits="userSpaceOnUse" width={spacing} height={spacing}>
                    <circle cx={spacing / 2} cy={spacing / 2} r={dotSize} fill="gray" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
    );
};

export default DotGridPattern;
