import { useEffect } from 'react';

export const usePageTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = `${title} | ศาสตร์ดวงดาว`;

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};

/**
 * Enhanced SEO hook — sets title, meta description, OG tags, and JSON-LD
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description (max ~155 chars recommended)
 * @param {string} [options.keywords] - Comma-separated keywords
 * @param {string} [options.ogImage] - OG image URL (absolute)
 * @param {string} [options.path] - Page path, e.g. "/palmistry-article"
 * @param {string} [options.type] - OG type, default "article"
 */
export const usePageSEO = ({ title, description, keywords, ogImage, path, type = 'article' }) => {
    useEffect(() => {
        const prevTitle = document.title;
        const baseUrl = 'https://satduangdao.com';

        // Title
        document.title = `${title} | ศาสตร์ดวงดาว`;

        // Helper: set or create meta tag
        const setMeta = (attr, key, content) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
            return el;
        };

        const createdElements = [];

        // Meta description
        if (description) {
            createdElements.push(setMeta('name', 'description', description));
        }

        // Keywords
        if (keywords) {
            createdElements.push(setMeta('name', 'keywords', keywords));
        }

        // Open Graph
        createdElements.push(setMeta('property', 'og:title', `${title} | ศาสตร์ดวงดาว`));
        createdElements.push(setMeta('property', 'og:type', type));
        if (description) {
            createdElements.push(setMeta('property', 'og:description', description));
        }
        if (path) {
            createdElements.push(setMeta('property', 'og:url', `${baseUrl}${path}`));
        }
        if (ogImage) {
            createdElements.push(setMeta('property', 'og:image', ogImage));
        }

        // Twitter Card
        createdElements.push(setMeta('property', 'twitter:title', `${title} | ศาสตร์ดวงดาว`));
        if (description) {
            createdElements.push(setMeta('property', 'twitter:description', description));
        }
        if (ogImage) {
            createdElements.push(setMeta('property', 'twitter:image', ogImage));
        }

        // JSON-LD Structured Data
        const jsonLd = document.createElement('script');
        jsonLd.type = 'application/ld+json';
        jsonLd.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: description || '',
            image: ogImage || `${baseUrl}/og-image.png`,
            url: path ? `${baseUrl}${path}` : baseUrl,
            publisher: {
                '@type': 'Organization',
                name: 'ศาสตร์ดวงดาว ออนไลน์',
                logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` },
            },
            inLanguage: 'th',
        });
        document.head.appendChild(jsonLd);

        // Cleanup
        return () => {
            document.title = prevTitle;
            jsonLd.remove();
            // Reset OG/Twitter to defaults (leave meta description & keywords as-is)
        };
    }, [title, description, keywords, ogImage, path, type]);
};
