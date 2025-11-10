require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio'); // Added for HTML parsing

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Enable CORS
app.use(cors());

// RSS feeds to aggregate
const feeds = [
    'https://cointelegraph.com/rss',
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'https://crypto.news/feed/'
];

const parser = new Parser();

// Function to extract image from content
function extractImage(content) {
    if (!content) return null;
    
    // Look for image URLs in the content
    const imgRegex = /<img[^>]+src="([^">]+)"/gi;
    const matches = imgRegex.exec(content);
    if (matches && matches[1]) {
        return matches[1];
    }
    
    return null;
}

// Function to check if image URL is valid (not a placeholder)
function isValidImage(imageUrl) {
    if (!imageUrl) return false;
    
    // Check if it's a placeholder image
    if (imageUrl.includes('placeholder.com') || 
        imageUrl.includes('placeholder') || 
        imageUrl.includes('temp') ||
        imageUrl.includes('dummy') ||
        imageUrl.includes('no-image')) {
        return false;
    }
    
    // Check if it's an actual image URL
    return imageUrl.startsWith('http') && 
           (imageUrl.endsWith('.jpg') || 
            imageUrl.endsWith('.jpeg') || 
            imageUrl.endsWith('.png') || 
            imageUrl.endsWith('.gif') || 
            imageUrl.endsWith('.webp') ||
            imageUrl.includes('/images/') ||
            imageUrl.includes('img.'));
}

// API endpoint to fetch news
app.get('/api/news', async (req, res) => {
    try {
        const allItems = [];
        
        // Fetch from all feeds
        for (const feedUrl of feeds) {
            try {
                const feed = await parser.parseURL(feedUrl);
                feed.items.forEach(item => {
                    const extractedImage = extractImage(item.content) || item.enclosure?.url || 
                                          item.itunes?.image;
                    
                    // Only include items with valid images
                    if (extractedImage && isValidImage(extractedImage)) {
                        allItems.push({
                            title: item.title,
                            link: item.link,
                            image: extractedImage
                        });
                    }
                });
            } catch (error) {
                console.error(`Error fetching feed ${feedUrl}:`, error.message);
                // Continue with other feeds even if one fails
            }
        }
        
        // Sort by date (newest first)
        allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // Limit to top 100 items
        const topItems = allItems.slice(0, 100);
        
        res.json(topItems);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// API endpoint to fetch popular news (top 10)
app.get('/api/popular', async (req, res) => {
    try {
        const allItems = [];
        
        // Fetch from all feeds
        for (const feedUrl of feeds) {
            try {
                const feed = await parser.parseURL(feedUrl);
                feed.items.forEach(item => {
                    const extractedImage = extractImage(item.content) || item.enclosure?.url || 
                                          item.itunes?.image;
                    
                    // Only include items with valid images
                    if (extractedImage && isValidImage(extractedImage)) {
                        allItems.push({
                            title: item.title,
                            link: item.link,
                            image: extractedImage
                        });
                    }
                });
            } catch (error) {
                console.error(`Error fetching feed ${feedUrl}:`, error.message);
                // Continue with other feeds even if one fails
            }
        }
        
        // Sort by date (newest first)
        allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        
        // For popular news, we might want to sort differently in the future
        // For now, just return top 10 most recent
        const topItems = allItems.slice(0, 10);
        
        res.json(topItems);
    } catch (error) {
        console.error('Error fetching popular news:', error);
        res.status(500).json({ error: 'Failed to fetch popular news' });
    }
});

// API endpoint to fetch full article content
app.get('/api/article', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // First, try to find the article in our RSS feeds by matching the URL
        let article = null;
        
        for (const feedUrl of feeds) {
            try {
                const feed = await parser.parseURL(feedUrl);
                const item = feed.items.find(feedItem => feedItem.link === url);
                
                if (item) {
                    article = {
                        title: item.title,
                        link: item.link,
                        description: item.contentSnippet || item.description,
                        pubDate: item.pubDate,
                        source: feed.title,
                        image: extractImage(item.content) || item.enclosure?.url || item.itunes?.image
                    };
                    break;
                }
            } catch (error) {
                console.error(`Error searching feed ${feedUrl}:`, error.message);
                continue; // Continue with other feeds
            }
        }

        // If we found the article in our feeds, return it
        if (article) {
            // Attempt to fetch the full article content from the original URL
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; CryptoNewsBot/1.0)'
                    }
                });
                
                const $ = cheerio.load(response.data);
                
                // Try to extract the main content of the article
                // Common selectors for article content
                const selectors = [
                    'article .content',
                    'article div',
                    '.post-content',
                    '.article-content',
                    '.entry-content',
                    '.post-body',
                    '.story-body',
                    'main .content',
                    '.content article',
                    'article'
                ];
                
                let fullContent = '';
                for (const selector of selectors) {
                    const contentElement = $(selector).first();
                    if (contentElement.length && contentElement.text().trim().length > 100) {
                        fullContent = contentElement.html();
                        break;
                    }
                }
                
                // If we couldn't find content with selectors, try to get all paragraphs
                if (!fullContent) {
                    let paragraphs = [];
                    $('p').each(function() {
                        const text = $(this).text().trim();
                        if (text.length > 20) { // Only include paragraphs with meaningful content
                            paragraphs.push(`<p>${text}</p>`);
                        }
                    });
                    
                    // Take the first 10 paragraphs to avoid excessive content
                    fullContent = paragraphs.slice(0, 10).join('');
                }
                
                // Update the article with full content if found
                if (fullContent) {
                    article.content = fullContent;
                }
            } catch (fetchError) {
                console.error('Error fetching full article content:', fetchError.message);
                // If we can't fetch the full content, we'll still return the article details
            }
            
            return res.json(article);
        } else {
            // If the article is not found in our feeds, return an error
            return res.status(404).json({ error: 'Article not found in our feeds' });
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// In-memory storage for view counts (in production, you'd use a database)
const articleViews = new Map();

// Function to generate realistic view counts
function generateViewCount() {
    // Generate a random number between 1K and 50K views, with higher probability for lower numbers
    const baseViews = Math.floor(Math.random() * 49000) + 1000;
    if (baseViews > 10000) {
        return Math.floor(baseViews / 1000) + 'K';
    }
    return baseViews;
}

// API endpoint to get view count for an article
app.get('/api/view-count', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Check if we already have a view count for this URL
        if (articleViews.has(url)) {
            let currentViews = articleViews.get(url);
            // Increment view count by 1-3 for each call to simulate real usage
            currentViews += Math.floor(Math.random() * 3) + 1;
            articleViews.set(url, currentViews);
            res.json({ count: currentViews });
        } else {
            // Generate a new random view count for this article
            const initialViews = Math.floor(Math.random() * 10000) + 100; // Between 100-10100 views
            articleViews.set(url, initialViews);
            res.json({ count: initialViews });
        }
    } catch (error) {
        console.error('Error fetching view count:', error);
        res.status(500).json({ error: 'Failed to fetch view count' });
    }
});

// Cache for storing feed data to improve performance
const feedCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// API endpoint to get related posts
app.get('/api/related-posts', async (req, res) => {
    const { url, category } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Check if we have cached feed data
        const cacheKey = 'all-feeds-data';
        let allItems = [];

        if (feedCache.has(cacheKey)) {
            const cacheEntry = feedCache.get(cacheKey);
            if (Date.now() - cacheEntry.timestamp < CACHE_DURATION) {
                // Use cached data
                allItems = [...cacheEntry.data];
            } else {
                // Cache expired, remove it
                feedCache.delete(cacheKey);
            }
        }

        // If cache is empty or expired, fetch fresh data
        if (allItems.length === 0) {
            for (const feedUrl of feeds) {
                try {
                    const feed = await parser.parseURL(feedUrl);
                    feed.items.forEach(item => {
                        // Exclude the current article
                        if (item.link !== url) {
                            const extractedImage = extractImage(item.content) || item.enclosure?.url ||
                                                  item.itunes?.image;

                            // Only include items with valid images
                            if (extractedImage && isValidImage(extractedImage)) {
                                allItems.push({
                                    title: item.title,
                                    link: item.link,
                                    image: extractedImage,
                                    pubDate: item.pubDate,
                                    source: feed.title
                                });
                            }
                        }
                    });
                } catch (error) {
                    console.error(`Error fetching feed ${feedUrl}:`, error.message);
                    // Continue with other feeds even if one fails
                }
            }

            // Cache the data
            feedCache.set(cacheKey, {
                data: allItems,
                timestamp: Date.now()
            });
        }

        // Sort by date (newest first)
        allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        // If category is provided, prioritize articles in the same category
        let filteredItems = allItems;
        if (category) {
            const categoryLower = category.toLowerCase();
            filteredItems = allItems.filter(item => 
                (item.title + ' ' + (item.description || '')).toLowerCase().includes(categoryLower)
            );
            
            // If we don't have enough category-matching items, include others too
            if (filteredItems.length < 3) {
                const otherItems = allItems.filter(item => 
                    !(item.title + ' ' + (item.description || '')).toLowerCase().includes(categoryLower)
                );
                filteredItems = [...filteredItems, ...otherItems];
            }
        }

        // Return top 5 related posts
        const relatedPosts = filteredItems.slice(0, 5);

        res.json(relatedPosts);
    } catch (error) {
        console.error('Error fetching related posts:', error);
        res.status(500).json({ error: 'Failed to fetch related posts' });
    }
});

// Proxy endpoint to allow iframe to load external content (to bypass X-Frame-Options)
app.get('/api/proxy-content', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        // Verify that the URL is from one of our trusted sources
        const isFromTrustedSource = feeds.some(feedUrl => 
            url.includes(new URL(feedUrl).hostname)
        );

        if (!isFromTrustedSource) {
            return res.status(403).send('URL is not from a trusted source');
        }

        // Fetch the content from the external URL with a more browser-like user agent
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'no-cache'
            },
            timeout: 15000, // 15 second timeout
            maxRedirects: 5
        });

        // Send the content as a response
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        
        // Modify the content to remove scripts for security and adjust styles
        let content = response.data;
        
        // Remove all script tags for security
        content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        // Remove meta tags that might cause issues
        content = content.replace(/<meta[^>]*name=["']viewport["'][^>]*>/gi, '');
        
        // Send modified content
        res.send(content);
    } catch (error) {
        console.error('Error proxying content:', error.message);
        
        // Try to get article details via our other API instead
        try {
            // Try to fetch basic article info from existing endpoint
            let article = null;
            
            // First, try to find the article in our RSS feeds by matching the URL
            for (const feedUrl of feeds) {
                try {
                    const feed = await parser.parseURL(feedUrl);
                    const item = feed.items.find(feedItem => feedItem.link === url);
                    
                    if (item) {
                        article = {
                            title: item.title,
                            link: item.link,
                            description: item.contentSnippet || item.description,
                            pubDate: item.pubDate,
                            source: feed.title,
                            image: extractImage(item.content) || item.enclosure?.url || item.itunes?.image
                        };
                        break;
                    }
                } catch (feedError) {
                    console.error(`Error searching feed ${feedUrl}:`, feedError.message);
                    continue; // Continue with other feeds
                }
            }
            
            // Create a simple page with the article content we have
            let htmlContent = `
                <html>
                    <head>
                        <title>${article?.title || 'Article'}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            .header { border-bottom: 2px solid #3a86ff; padding-bottom: 10px; margin-bottom: 20px; }
                            .title { color: #222; margin-bottom: 10px; }
                            .meta { color: #666; font-size: 0.9em; margin-bottom: 15px; }
                            .content { color: #333; }
                            .original-link { margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1 class="title">${article?.title || 'Article Title'}</h1>
                            <div class="meta">
                                <span>Date: ${article?.pubDate || new Date().toDateString()}</span> |
                                <span>Source: ${article?.source || url}</span>
                            </div>
                        </div>
                        <div class="content">
                            ${article?.description ? `<p>${article.description}</p>` : '<p>Content could not be loaded. Please view the original article.</p>'}
                        </div>
                        <div class="original-link">
                            <a href="${url}" target="_blank">View Original Article</a>
                        </div>
                    </body>
                </html>
            `;
            
            res.send(htmlContent);
        } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError.message);
            res.status(500).send(`
                <html>
                    <head><title>Unable to load article</title></head>
                    <body>
                        <h2>Unable to load article</h2>
                        <p>There was an error loading the requested article content.</p>
                        <p><a href="${url}" target="_blank">View Original Article</a></p>
                        <p>Error: ${error.message}</p>
                    </body>
                </html>
            `);
        }
    }
});

// In-memory cache for the sitemap
let cachedSitemapXml = '';
let sitemapLastGenerated = 0;
const SITEMAP_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Function to generate sitemap XML
async function generateSitemap() {
    try {
        // Start building the sitemap XML
        let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Add static pages
        const currentDate = new Date().toISOString().split('T')[0];
        
        sitemapXml += '    <url>\n';
        sitemapXml += '        <loc>http://localhost:3000/</loc>\n';
        sitemapXml += '        <lastmod>' + currentDate + '</lastmod>\n';
        sitemapXml += '        <changefreq>daily</changefreq>\n';
        sitemapXml += '        <priority>1.0</priority>\n';
        sitemapXml += '    </url>\n';
        
        sitemapXml += '    <url>\n';
        sitemapXml += '        <loc>http://localhost:3000/index.html</loc>\n';
        sitemapXml += '        <lastmod>' + currentDate + '</lastmod>\n';
        sitemapXml += '        <changefreq>daily</changefreq>\n';
        sitemapXml += '        <priority>1.0</priority>\n';
        sitemapXml += '    </url>\n';
        
        sitemapXml += '    <url>\n';
        sitemapXml += '        <loc>http://localhost:3000/about.html</loc>\n';
        sitemapXml += '        <lastmod>' + currentDate + '</lastmod>\n';
        sitemapXml += '        <changefreq>weekly</changefreq>\n';
        sitemapXml += '        <priority>0.8</priority>\n';
        sitemapXml += '    </url>\n';
        
        sitemapXml += '    <url>\n';
        sitemapXml += '        <loc>http://localhost:3000/terms.html</loc>\n';
        sitemapXml += '        <lastmod>' + currentDate + '</lastmod>\n';
        sitemapXml += '        <changefreq>monthly</changefreq>\n';
        sitemapXml += '        <priority>0.6</priority>\n';
        sitemapXml += '    </url>\n';
        
        sitemapXml += '    <url>\n';
        sitemapXml += '        <loc>http://localhost:3000/privacy.html</loc>\n';
        sitemapXml += '        <lastmod>' + currentDate + '</lastmod>\n';
        sitemapXml += '        <changefreq>monthly</changefreq>\n';
        sitemapXml += '        <priority>0.6</priority>\n';
        sitemapXml += '    </url>\n';
        
        // Fetch all articles from RSS feeds to create dynamic entries
        const allItems = [];
        for (const feedUrl of feeds) {
            try {
                const feed = await parser.parseURL(feedUrl);
                feed.items.forEach(item => {
                    const extractedImage = extractImage(item.content) || item.enclosure?.url ||
                                          item.itunes?.image;

                    // Only include items with valid images
                    if (extractedImage && isValidImage(extractedImage)) {
                        allItems.push({
                            title: item.title,
                            link: item.link,
                            pubDate: item.pubDate
                        });
                    }
                });
            } catch (error) {
                console.error(`Error fetching feed ${feedUrl}:`, error.message);
                // Continue with other feeds even if one fails
            }
        }

        // Sort by date (newest first) and limit to most recent articles
        allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        const recentItems = allItems.slice(0, 100); // Limit to 100 most recent articles for performance
        
        // Add blog posts to sitemap
        for (const item of recentItems) {
            const pubDateStr = new Date(item.pubDate).toISOString().split('T')[0];
            
            sitemapXml += '    <url>\n';
            sitemapXml += `        <loc>http://localhost:3000/post.html?url=${encodeURIComponent(item.link)}</loc>\n`;
            sitemapXml += `        <lastmod>${pubDateStr}</lastmod>\n`;
            sitemapXml += '        <changefreq>weekly</changefreq>\n'; // Changed to weekly for blog posts
            sitemapXml += '        <priority>0.7</priority>\n';
            sitemapXml += '    </url>\n';
        }
        
        // Close the sitemap
        sitemapXml += '</urlset>';
        
        return sitemapXml;
    } catch (error) {
        console.error('Error generating sitemap:', error);
        throw error;
    }
}

// Endpoint to get the sitemap with caching
app.get('/sitemap.xml', async (req, res) => {
    try {
        // Check if we have a cached version and it's still fresh
        const now = Date.now();
        if (cachedSitemapXml && (now - sitemapLastGenerated < SITEMAP_CACHE_DURATION)) {
            res.setHeader('Content-Type', 'application/xml');
            res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
            res.send(cachedSitemapXml);
            return;
        }
        
        // Generate a fresh sitemap
        const sitemapXml = await generateSitemap();
        
        // Cache the generated sitemap
        cachedSitemapXml = sitemapXml;
        sitemapLastGenerated = now;
        
        // Set headers and send response
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
        res.send(sitemapXml);
        
    } catch (error) {
        console.error('Error serving sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

app.listen(PORT, () => {
    console.log(`Crypto news server running at http://localhost:${PORT}`);
});