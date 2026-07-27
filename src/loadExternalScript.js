// Injects a third-party <script> tag on demand instead of loading it globally
// in index.html on every page. Caches the load promise per src so repeated
// mounts of the same payment component don't re-fetch/re-inject the script.
const loadedScripts = {};

export const loadExternalScript = (src) => {
    if (loadedScripts[src]) return loadedScripts[src];

    loadedScripts[src] = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });

    return loadedScripts[src];
};
