import { useEffect } from 'react';

const BASE_URL = 'https://satduangdao.com';
const SITE_SUFFIX = 'ศาสตร์ดวงดาว - ดูดวงออนไลน์';
const DEFAULT_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

const upsertMeta = (attr, key, content) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
    return el;
};

const upsertLink = (rel, href) => {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
    return el;
};

export const usePageTitle = (title) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = `${title} | ศาสตร์ดวงดาว - ดูดวงออนไลน์`;

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
 * @param {string} [options.robots] - Robots meta content
 */
export const usePageSEO = ({ title, description, keywords, ogImage, path, type = 'article', robots = DEFAULT_ROBOTS }) => {
    useEffect(() => {
        const prevTitle = document.title;
        const canonicalUrl = path
            ? `${BASE_URL}${path}`
            : `${BASE_URL}${window.location.pathname}`;

        // Title
        document.title = `${title} | ${SITE_SUFFIX}`;

        const createdElements = [];

        createdElements.push(upsertMeta('name', 'title', `${title} | ${SITE_SUFFIX}`));

        // Meta description
        if (description) {
            createdElements.push(upsertMeta('name', 'description', description));
        }

        // Keywords
        if (keywords) {
            createdElements.push(upsertMeta('name', 'keywords', keywords));
        }

        createdElements.push(upsertMeta('name', 'robots', robots));
        createdElements.push(upsertLink('canonical', canonicalUrl));

        // Open Graph
        createdElements.push(upsertMeta('property', 'og:title', `${title} | ${SITE_SUFFIX}`));
        createdElements.push(upsertMeta('property', 'og:type', type));
        if (description) {
            createdElements.push(upsertMeta('property', 'og:description', description));
        }
        createdElements.push(upsertMeta('property', 'og:url', canonicalUrl));
        if (ogImage) {
            createdElements.push(upsertMeta('property', 'og:image', ogImage));
        }

        // Twitter Card
        createdElements.push(upsertMeta('property', 'twitter:title', `${title} | ${SITE_SUFFIX}`));
        createdElements.push(upsertMeta('property', 'twitter:url', canonicalUrl));
        if (description) {
            createdElements.push(upsertMeta('property', 'twitter:description', description));
        }
        if (ogImage) {
            createdElements.push(upsertMeta('property', 'twitter:image', ogImage));
        }

        // JSON-LD Structured Data
        const jsonLd = document.createElement('script');
        jsonLd.type = 'application/ld+json';
        jsonLd.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: description || '',
            image: ogImage || `${BASE_URL}/og-image.png`,
            url: canonicalUrl,
            publisher: {
                '@type': 'Organization',
                name: 'ศาสตร์ดวงดาว ออนไลน์',
                logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
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
    }, [title, description, keywords, ogImage, path, robots, type]);
};
