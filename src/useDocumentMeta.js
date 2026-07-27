import { useEffect } from 'react';

const setMetaByName = (name, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
};

const setMetaByProperty = (property, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
};

const setCanonical = (url) => {
    if (!url) return;
    let tag = document.querySelector('link[rel="canonical"]');
    if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', 'canonical');
        document.head.appendChild(tag);
    }
    tag.setAttribute('href', url);
};

// Updates document.title, meta description, canonical link, and Open Graph /
// Twitter tags for the current route. index.html ships sensible defaults for
// the homepage and first paint (before this runs); this hook overrides them
// per-page once the route's data is available, e.g. a specific property's
// title/photo for social shares of that listing.
export const useDocumentMeta = ({ title, description, image, path }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
            setMetaByProperty('og:title', title);
            setMetaByName('twitter:title', title);
        }
        if (description) {
            setMetaByName('description', description);
            setMetaByProperty('og:description', description);
            setMetaByName('twitter:description', description);
        }
        if (image) {
            setMetaByProperty('og:image', image);
            setMetaByName('twitter:image', image);
        }
        if (path) {
            const url = `https://splityourtrip.com${path}`;
            setCanonical(url);
            setMetaByProperty('og:url', url);
        }
    }, [title, description, image, path]);
};
