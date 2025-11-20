// RSS Feed Integration Script

// Function to fetch news from backend API
async function fetchNewsFromAPI() {
    try {
        const response = await fetch('/api/news');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newsItems = await response.json();
        return newsItems;
    } catch (error) {
        console.error('Error fetching news from API:', error);
        // Return sample data in case of error
        return [
            {
                title: "Bitcoin Reaches New All-Time High as Institutional Adoption Grows",
                description: "Major corporations and investment firms are increasingly adding Bitcoin to their treasury reserves, driving unprecedented demand and pushing prices to new records.",
                link: "#",
                pubDate: new Date().toLocaleDateString(),
                source: "CryptoNews",
                image: "https://via.placeholder.com/300x169?text=Bitcoin+News"
            },
            {
                title: "Ethereum 2.0 Upgrade Progress Continues as Staking Rewards Increase",
                description: "The latest Ethereum 2.0 implementation has seen a significant increase in staking participation, with rewards reaching new levels as the network prepares for full transition.",
                link: "#",
                pubDate: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
                source: "CryptoNews",
                image: "https://via.placeholder.com/300x169?text=Ethereum+News"
            },
            {
                title: "New DeFi Protocol Revolutionizes Yield Farming with Innovative Algorithm",
                description: "A breakthrough in decentralized finance has emerged with a new protocol that promises higher yields with lower risk than traditional farming methods.",
                link: "#",
                pubDate: new Date(Date.now() - 172800000).toLocaleDateString(), // 2 days ago
                source: "CryptoNews",
                image: "https://via.placeholder.com/300x169?text=DeFi+News"
            },
            {
                title: "Central Banks Explore Digital Currencies Amid Growing Crypto Adoption",
                description: "Multiple central banks worldwide are advancing their own digital currency projects as cryptocurrency adoption continues to grow in the private sector.",
                link: "#",
                pubDate: new Date(Date.now() - 259200000).toLocaleDateString(), // 3 days ago
                source: "CryptoNews",
                image: "https://via.placeholder.com/300x169?text=Digital+Currencies"
            },
            {
                title: "Regulatory Clarity Expected Soon as Government Working Groups Convene",
                description: "Government agencies are working together to establish clearer regulations for the cryptocurrency industry, with several new frameworks expected to be announced in the coming weeks.",
                link: "#",
                pubDate: new Date(Date.now() - 345600000).toLocaleDateString(), // 4 days ago
                source: "CryptoNews",
                image: "https://via.placeholder.com/300x169?text=Regulatory+News"
            }
        ];
    }
}

// Function to generate realistic view counts
function generateViewCount() {
    const viewCount = Math.floor(Math.random() * 49000) + 1000;
    return viewCount > 1000 ? `${Math.floor(viewCount/1000)}K` : viewCount;
}

// Variables to track pagination and data
let allNewsItems = [];
let popularNewsItems = [];
let displayedItems = 9; // Show 9 items initially as requested
let currentItems = 0;

// Function to fetch popular news
async function fetchPopularNews() {
    try {
        const response = await fetch('/api/popular');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newsItems = await response.json();
        return newsItems;
    } catch (error) {
        console.error('Error fetching popular news from API:', error);
        // Return sample data in case of error
        return [
            {
                title: "Most Popular: Bitcoin Reaches New All-Time High",
                link: "#",
                image: "https://via.placeholder.com/300x169?text=Popular+News"
            },
            {
                title: "Ethereum 2.0 Upgrade Creates Buzz",
                link: "#",
                image: "https://via.placeholder.com/300x169?text=Popular+News"
            }
        ];
    }
}

// Function to display popular news with scrolling
function displayPopularNews(newsItems) {
    // Wait for the DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                const container = document.getElementById('popular-news-container');
                if (container) {
                    renderPopularNews(container, newsItems);
                }
            }, 100);
        });
    } else {
        // DOM is already loaded
        setTimeout(() => {
            const container = document.getElementById('popular-news-container');
            if (container) {
                renderPopularNews(container, newsItems);
            }
        }, 100);
    }
}

// Helper function to render popular news
function renderPopularNews(container, newsItems) {
    if (!newsItems || newsItems.length === 0) {
        container.innerHTML = '<div class="no-popular-news">No popular news available at this time.</div>';
        return;
    }

    // Clear any loading text
    container.innerHTML = '';

    const topPopularItems = newsItems.slice(0, 10);
    const validItems = topPopularItems.filter(item => item.image && item.image !== '' && item.image.trim() !== '');
    
    // Create a scrolling container for popular news immediately
    let scrollingContainer = document.createElement('div');
    scrollingContainer.className = 'popular-news-scrolling';

    // Function to create a popular news item element with short heading
    const createPopularItem = (item) => {
        // Create a short title by truncating if too long
        let shortTitle = item.title || 'Untitled Article';
        if (shortTitle.length > 50) {
            shortTitle = shortTitle.substring(0, 47) + '...';
        }

        const popularItem = document.createElement('div');
        popularItem.className = 'popular-news-item';

        // Show only short headline without reference and time
        popularItem.innerHTML = `<div class="popular-news-content">
            <h4 data-link="${item.link || '#'}">${shortTitle}</h4>
        </div>`;

        // Add click event to the entire item to open the article in the new post page
        popularItem.addEventListener('click', function() {
            if(item.link) {
                window.location.href = `post.html?url=${encodeURIComponent(item.link)}`;
            }
        });

        // Add click event to the title to open the article in the new post page
        const titleElement = popularItem.querySelector('h4');
        if (titleElement) {
            titleElement.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering the parent click event
                const link = this.getAttribute('data-link');
                if(link && link !== '#') {
                    window.location.href = `post.html?url=${encodeURIComponent(link)}`;
                }
            });
        }

        return popularItem;
    };

    // Add original items to the scrolling container
    validItems.forEach(item => {
        scrollingContainer.appendChild(createPopularItem(item));
    });

    // Add duplicate items to create seamless loop effect
    validItems.forEach(item => {
        scrollingContainer.appendChild(createPopularItem(item));
    });

    container.appendChild(scrollingContainer);
    
    // Force a reflow and then add the scrolling class to start animation properly
    scrollingContainer.style.animation = 'none';
    scrollingContainer.offsetHeight; // Trigger reflow
    scrollingContainer.style.animation = '';
    
    // Add the scrolling class to start animation
    scrollingContainer.classList.add('scrolling');
}

// Global variables for category filtering
let currentCategory = 'all';

// Function to display news items
function displayNewsItems(newsItems) {
    // Filter out items without images first, with safety checks
    allNewsItems = newsItems.filter(item => item && item.image && item.image !== '' && item.image.trim() !== '');
    currentItems = 0;

    const container = document.getElementById('rss-feed-content');

    // Clear loading message
    let title = 'Latest Crypto News';
    if (currentCategory !== 'all') {
        title = `Latest ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} News`;
    }
    
    container.innerHTML = `<h2>${title}</h2>`;

    if (allNewsItems.length === 0) {
        container.innerHTML += `<p>No ${currentCategory !== 'all' ? currentCategory : 'crypto'} news with images available at this time.</p>`;
        return;
    }

    // Show initial 9 news items as requested
    showNextItems();
}

// Function to get news for category
function getNewsForCategory(newsItems, category) {
    if (category === 'all' || category === null) {
        return newsItems;
    }
    
    // Classify news based on keyword matching in title or description
    return newsItems.filter(item => {
        if (!item.title && !item.description) return false;
        
        const text = (item.title + ' ' + item.description).toLowerCase();
        
        switch(category.toLowerCase()) {
            case 'bitcoin':
                return text.includes('bitcoin') || text.includes('btc');
            case 'ethereum':
                return text.includes('ethereum') || text.includes('eth');
            case 'altcoins':
                return text.includes('altcoin') || text.includes('alt coins') || 
                       text.includes('dogecoin') || text.includes('solana') || 
                       text.includes('cardano') || text.includes('litecoin');
            case 'defi':
                return text.includes('defi') || text.includes('decentralized finance') || 
                       text.includes('yield farming') || text.includes('staking') || 
                       text.includes('dex') || text.includes('uniswap') || 
                       text.includes('compound') || text.includes('aave');
            case 'nfts':
                return text.includes('nft') || text.includes('non-fungible token') || 
                       text.includes('opensea') || text.includes('foundation') || 
                       text.includes('cryptopunk') || text.includes('bored ape');
            case 'regulation':
                return text.includes('regulation') || text.includes('regulatory') || 
                       text.includes('sec') || text.includes('policy') || 
                       text.includes('compliance') || text.includes('legal');
            case 'web3':
                return text.includes('web3') || text.includes('metaverse') || 
                       text.includes('decentralized web') || text.includes('dapps');
            default:
                return true;
        }
    });
}

// Function to show next set of news items
function showNextItems() {
    const container = document.getElementById('rss-feed-content');

    // Create news grid if it doesn't exist
    let newsGrid = container.querySelector('.news-grid-container');
    if (!newsGrid) {
        newsGrid = document.createElement('div');
        newsGrid.className = 'news-grid-container';
        container.appendChild(newsGrid);
    }

    // Add next set of news items with thumbnails
    let itemsAdded = 0;
    let index = currentItems;
    let adsAdded = 0; // Track how many ads have been added
    
    while (itemsAdded < displayedItems && index < allNewsItems.length) {
        const item = allNewsItems[index];
        
        // Only add items that have valid images/thumbnails (not empty) with safety checks
        if (item && item.image && item.image !== '' && item.image.trim() !== '') {
            // Generate a random category for this news item
            const categories = ['Bitcoin', 'Ethereum', 'Altcoins', 'DeFi', 'NFTs', 'Market', 'Regulation', 'Web3'];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            const newsElement = document.createElement('div');
            newsElement.className = 'news-item';
            newsElement.innerHTML = `
                <h3 class="news-title" data-link="${item.link || '#'}">${item.title || 'Untitled Article'}</h3>
                <div class="meta">
                    <span>${item.pubDate || ''}</span>
                </div>
                ${item.image ? `<img src="${item.image}" alt="${item.title || 'News Image'}" class="news-image" onclick="window.location.href='post.html?url=${encodeURIComponent(item.link)}'">` : ''}
                <p>${item.description || ''}</p>
                <div class="news-footer">
                    <div class="category-tag">${randomCategory}</div>
                    <a href="#" class="read-article-link">Read Full Article</a>
                </div>
            `;

            // Add click event to the entire news block to open the article in the new post page
            newsElement.addEventListener('click', function(event) {
                // Prevent opening if the link element was clicked directly (to avoid double opening)
                if (event.target.tagName !== 'A' && event.target.tagName !== 'IMG') {
                    window.location.href = `post.html?url=${encodeURIComponent(item.link)}`;
                }
            });

            // Add click event to the "Read Full Article" link to open the article in the new post page
            const readLink = newsElement.querySelector('.read-article-link');
            if (readLink) {
                readLink.href = `post.html?url=${encodeURIComponent(item.link)}`;
                readLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    window.location.href = `post.html?url=${encodeURIComponent(item.link)}`;
                });
            }

            // Add click event to the title to open the article in the new post page (for accessibility)
            const titleElement = newsElement.querySelector('.news-title');
            if (titleElement) {
                titleElement.addEventListener('click', function(event) {
                    event.stopPropagation();
                    const link = this.getAttribute('data-link');
                    if(link && link !== '#') {
                        window.location.href = `post.html?url=${encodeURIComponent(link)}`;
                    }
                });
            }

            newsGrid.appendChild(newsElement);
            itemsAdded++;
            
            // Add an ad after every 6 posts
            if (itemsAdded > 0 && itemsAdded % 6 === 0) {
                adsAdded++;
                const adElement = document.createElement('div');
                adElement.className = 'news-ad';
                const adPlaceholder = document.createElement('div');
                adPlaceholder.className = 'ad-placeholder';

                const adIns = document.createElement('ins');
                adIns.className = 'adsbygoogle';
                adIns.style.display = 'block';
                adIns.setAttribute('data-ad-client', 'ca-pub-XXXXXXXXXXXXXXXX');
                adIns.setAttribute('data-ad-slot', '1234567893');
                adIns.setAttribute('data-ad-format', 'auto');
                adIns.setAttribute('data-full-width-responsive', 'true');

                adPlaceholder.appendChild(adIns);
                adElement.appendChild(adPlaceholder);

                // Add the ad element to the grid first
                newsGrid.appendChild(adElement);

                // After adding the new ad element to DOM, initialize all ads again
                // to include the newly added ad. This ensures dynamic ads get loaded too.
                setTimeout(() => {
                    try {
                        // Initialize all ads including recently added dynamic ads
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (e) {
                        console.error("Dynamic ad initialization error:", e);
                    }
                }, 400); // Slightly longer delay to ensure DOM is ready
            }
        }
        
        index++;
    }

    currentItems = index;

    // Show or hide the "Load More" button based on remaining items
    const loadMoreButton = container.querySelector('#load-more-btn');
    if (!loadMoreButton && currentItems < allNewsItems.length) {
        createLoadMoreButton(container);
    } else if (loadMoreButton) {
        if (currentItems >= allNewsItems.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    }
}

// Function to create the "Load More" button
function createLoadMoreButton(container) {
    const loadMoreButton = document.createElement('button');
    loadMoreButton.id = 'load-more-btn';
    loadMoreButton.className = 'load-more-btn';
    loadMoreButton.textContent = 'Load More News';
    loadMoreButton.addEventListener('click', showNextItems);
    container.appendChild(loadMoreButton);
}

// Function to add sidebar after loading more items - now empty to remove the sidebar
function addSidebarAfterLoadMore(container) {
    // No sidebar functionality - this function is now empty to remove the sidebar
    // The news will now just continue in the main grid without a sidebar
}

// Update the loadNews function to fetch both popular and regular news
async function loadNews() {
    try {
        // Fetch both popular and regular news
        const [popularNews, regularNews] = await Promise.all([
            fetchPopularNews(),
            fetchNewsFromAPI()
        ]);

        popularNewsItems = popularNews;
        displayPopularNews(popularNews);
        displayNewsItems(regularNews);
    } catch (error) {
        console.error('Error in loadNews:', error);
        // Fallback: still load regular news even if popular news fails
        const regularNews = await fetchNewsFromAPI();
        displayNewsItems(regularNews);
        // Still try to display popular news with a fallback
        displayPopularNews([]);
    }
}

// Add category functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to category items
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remove active class from all category items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Get the category name
            const category = this.getAttribute('data-category');
            
            // Filter news by category - in a real implementation this would filter results
            // For now, we'll reload news when a category is selected
            console.log(`Selected category: ${category}`);
            
            // Load news for selected category
            loadNewsForCategory(category);
        });
    });
    
    // Load default news on page load
    loadNews();
});

// Function to load news for a specific category
function loadNewsForCategory(category) {
    currentCategory = category;
    
    // Fetch news and then filter by category
    fetchNewsFromAPI().then(newsItems => {
        // Filter news by category
        const filteredNews = getNewsForCategory(newsItems, category);
        
        // Display the filtered news
        displayNewsItems(filteredNews);
    }).catch(error => {
        console.error('Error loading news for category:', error);
        // Fallback to general news
        loadNews();
    });
}

// Countdown timer variables
let countdownInterval;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
let nextDailyRefreshTime;

// Initialize countdown and start it
function initCountdown() {
    // Calculate the next daily refresh time (next midnight)
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0); // Set to next midnight
    
    nextDailyRefreshTime = nextMidnight.getTime();
    updateCountdown();
    
    // Update the countdown every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Update the countdown display
function updateCountdown() {
    const currentTime = Date.now();
    const timeLeft = nextDailyRefreshTime - currentTime;
    
    if (timeLeft <= 0) {
        // Time to refresh news (midnight reached)
        loadNews();
        
        // Calculate the next day's midnight
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(24, 0, 0, 0); // Set to midnight of next day
        nextDailyRefreshTime = tomorrow.getTime();
        return;
    }
    
    // Calculate time components
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Update the display elements
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
}

// Function to load news with category filtering
async function loadNews() {
    try {
        // Fetch both popular and regular news
        const [popularNews, regularNews] = await Promise.all([
            fetchPopularNews(),
            fetchNewsFromAPI()
        ]);

        popularNewsItems = popularNews;
        displayPopularNews(popularNews);
        
        // Filter news by current category if not 'all'
        let filteredNews = regularNews;
        if (currentCategory !== 'all' && currentCategory) {
            filteredNews = getNewsForCategory(filteredNews, currentCategory);
        }
        
        displayNewsItems(filteredNews);
    } catch (error) {
        console.error('Error in loadNews:', error);
        // Fallback: still load regular news even if popular news fails
        const regularNews = await fetchNewsFromAPI();
        let filteredNews = regularNews;
        if (currentCategory !== 'all' && currentCategory) {
            filteredNews = getNewsForCategory(filteredNews, currentCategory);
        }
        displayNewsItems(filteredNews);
        // Still try to display popular news with a fallback
        displayPopularNews([]);
    }
}

// Load news when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to category items
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Remove active class from all category items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Get the category name
            const category = this.getAttribute('data-category');
            
            // Set the current category
            currentCategory = category;
            
            // Filter news by category
            console.log(`Selected category: ${category}`);
            
            // Load news for selected category
            loadNewsForCategory(category);
        });
    });
    
    // Initialize and start the countdown timer
    initCountdown();
    
    // Load initial news
    loadNews();
});

// Initialize AdSense ads only once
function initializeAdSense() {
    // Use a flag to ensure ads are only initialized once
    if (window.adsenseInitialized) {
        return; // Already initialized
    }

    // Mark as initialized to prevent duplicate calls
    window.adsenseInitialized = true;

    // Just mark as initialized, main initialization handled separately to avoid duplicates
    // since HTML already initializes static ads
}

// Initialize all ads on the index page since inline pushes have been removed
// Run this after DOM is fully loaded and elements are ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all DOM elements are fully rendered
    setTimeout(() => {
        if (typeof window.adsbygoogle !== 'undefined' && !window.adsenseInitialized) {
            try {
                // Initialize all ads on the page
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                window.adsenseInitialized = true;
            } catch (e) {
                console.error("Index page AdSense error:", e);
            }
        }
    }, 600); // Delay to ensure all DOM elements are properly rendered
});

// Daily news update is handled by the countdown timer
// The countdown handles automatic refresh at the specified interval