export default function LoadingIcon({ size = 300, className = "", animate = true }: { size?: number; className?: string; animate?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="flameGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#00FFFF", stopOpacity: 0.9 }} />
          <stop offset="30%" style={{ stopColor: "#40E0D0", stopOpacity: 0.8 }} />
          <stop offset="70%" style={{ stopColor: "#00CED1", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#008B8B", stopOpacity: 0.9 }} />
        </linearGradient>
        <linearGradient id="flameGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#008B8B", stopOpacity: 0.9 }} />
          <stop offset="30%" style={{ stopColor: "#00CED1", stopOpacity: 0.8 }} />
          <stop offset="70%" style={{ stopColor: "#40E0D0", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#00FFFF", stopOpacity: 0.9 }} />
        </linearGradient>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5"/>
        </filter>
      </defs>
      
      <g transform="translate(200,200)">
        <g className={animate ? "rotating-flames" : "static-flames"}>
          {/* 16 flames at 22.5-degree intervals for better overlap */}
          
          <g transform="rotate(0)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient1)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(22.5)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient2)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(45)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient1)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(67.5)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient2)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(90)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient1)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(112.5)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient2)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(135)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient1)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(157.5)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient2)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(180)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient1)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(202.5)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient2)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(225)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient1)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(247.5)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient2)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(270)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient1)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(292.5)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient2)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(315)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient1)" filter="url(#blur)" opacity="0.85"/>
          </g>
          
          <g transform="rotate(337.5)">
            <path d="M0,-75 C-10,-65 -12,-50 -8,-35 C-5,-20 0,-12 2,-8 C4,-6 8,-4 12,-7 C16,-11 18,-22 15,-35 C12,-50 8,-65 2,-75 C0,-78 -2,-78 0,-75 Z" 
                  fill="url(#flameGradient2)" filter="url(#blur)" opacity="0.85"/>
          </g>
        </g>
      </g>

      <style jsx>{`
        .rotating-flames {
          animation: rotate 8s linear infinite;
          transform-origin: 0 0;
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </svg>
  );
} 