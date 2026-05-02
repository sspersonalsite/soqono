/* ADD THIS TO THE END OF YOUR STYLE.CSS */

/* Match the Tick board to your branding */
.tick {
    font-size: clamp(2rem, 7.5vw, 8.5rem);
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
}

.tick-flip-panel {
    background-color: #1a1b2b !important; /* Matches your nav */
    color: #EDF2F4 !important;
    border-radius: 4px !important;
}

.tick-flip-spacer {
    background-color: rgba(0,0,0,0.3) !important;
}

/* Ensure the window doesn't cut off the flip shadow */
.window {
    overflow: visible;
    height: auto;
    margin: -10px 0;
}
