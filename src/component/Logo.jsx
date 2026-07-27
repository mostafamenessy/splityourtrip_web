/* jshint esversion: 6 */
// Text wordmark used in place of the old raster "GoProperti" logo image.
// variant="light" -> white text, for the transparent/dark hero header.
// variant="dark"  -> dark text, for the white nav bar / footer / mobile menu.
const Logo = ({ variant = 'dark', className = '', onClick, id }) => {
    const textColor = variant === 'light' ? '#ffffff' : '#1a1a1a';
    return (
        <span
            id={id}
            onClick={onClick}
            className={`pointer ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                fontFamily: "'Jost', sans-serif",
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
            }}
        >
            <span style={{ color: textColor }}>Split</span>
            <span style={{ color: 'var(--Primary)' }}>Your</span>
            <span style={{ color: textColor }}>Trip</span>
        </span>
    );
};

export default Logo;
