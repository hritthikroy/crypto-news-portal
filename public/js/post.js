// post.js - Handles loading and displaying individual blog posts using iframe

// Function to get URL parameter
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to load the article content
function loadArticle() {
    const articleUrl = getUrlParameter('url');

    if (!articleUrl) {
        document.querySelector('#article-title').textContent = 'Error: No article URL provided.';
        document.querySelector('#article-iframe').style.display = 'none';
        return;
    }

    try {
        // Show loading animation and set the iframe source
        const iframe = document.querySelector('#article-iframe');
        const loadingDiv = document.querySelector('#iframe-loading');
        iframe.style.display = 'none';
        loadingDiv.style.display = 'flex';

        // Set the iframe source to the proxy endpoint to bypass X-Frame-Options
        iframe.src = `/api/proxy-content?url=${encodeURIComponent(articleUrl)}`;

        // Show the iframe when it loads
        iframe.onload = function() {
            loadingDiv.style.display = 'none';
            iframe.style.display = 'block';
        };

        // Update page title
        document.title = 'CryptoDaily - Article';

        // Fetch article details to show the actual blog title
        fetch(`/api/article?url=${encodeURIComponent(articleUrl)}`)
            .then(response => response.json())
            .then(article => {
                document.querySelector('#article-title').textContent = article.title || 'Article';
                document.querySelector('#article-date').textContent = article.pubDate || new Date().toLocaleDateString();
                document.querySelector('#article-source').textContent = `Source: ${article.source || articleUrl.replace(/^https?:\/\//, '').split('/')[0]}`;

                // Fetch and display related posts based on the current article
                fetchRelatedPosts(articleUrl, article.title);

                // Fetch and display view count
                fetchViewCount(articleUrl);
            })
            .catch(error => {
                console.error('Error fetching article details:', error);
                // Fallback to showing a generic title
                document.querySelector('#article-title').textContent = 'Article';
                document.querySelector('#article-date').textContent = new Date().toLocaleDateString();
                document.querySelector('#article-source').textContent = '';

                // Still try to fetch related posts based on URL
                fetchRelatedPosts(articleUrl);

                // Still try to fetch view count
                fetchViewCount(articleUrl);
            });

        // Initialize AdSense for the article page after content loads
        setTimeout(() => {
            initializeAdSense();
        }, 1000);

    } catch (error) {
        console.error('Error loading article:', error);
        document.querySelector('#article-title').textContent = 'Error loading article.';
        document.querySelector('#article-iframe').style.display = 'none';
    }
}

// Function to fetch and display related posts
function fetchRelatedPosts(currentUrl, articleTitle = null) {
    // Show loading indicator with animation
    document.querySelector('#related-posts').innerHTML = `
        <div class="related-post-loading">
            <div class="related-post-spinner"></div>
            <div class="loading-text">Loading related posts...</div>
        </div>
    `;
    
    // Try to determine a category from the article title if available
    let category = null;
    if (articleTitle) {
        const lowerTitle = articleTitle.toLowerCase();
        if (lowerTitle.includes('bitcoin') || lowerTitle.includes('btc')) {
            category = 'bitcoin';
        } else if (lowerTitle.includes('ethereum') || lowerTitle.includes('eth')) {
            category = 'ethereum';
        } else if (lowerTitle.includes('defi')) {
            category = 'defi';
        } else if (lowerTitle.includes('nft') || lowerTitle.includes('nfts')) {
            category = 'nfts';
        } else if (lowerTitle.includes('altcoin') || lowerTitle.includes('altcoins')) {
            category = 'altcoins';
        } else if (lowerTitle.includes('regulation') || lowerTitle.includes('regulatory')) {
            category = 'regulation';
        }
    }
    
    const categoryParam = category ? `&category=${encodeURIComponent(category)}` : '';
    const apiUrl = `/api/related-posts?url=${encodeURIComponent(currentUrl)}${categoryParam}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(posts => {
            displayRelatedPosts(posts);
        })
        .catch(error => {
            console.error('Error fetching related posts:', error);
            document.querySelector('#related-posts').innerHTML = '<p>Could not load related posts.</p>';
        });
}

// Function to fetch and display view count
function fetchViewCount(articleUrl) {
    fetch(`/api/view-count?url=${encodeURIComponent(articleUrl)}`)
        .then(response => response.json())
        .then(data => {
            const viewCountElement = document.querySelector('#view-count-value');
            if (data.count) {
                // Format the number with K if it's over 1000
                let formattedCount;
                if (data.count >= 1000) {
                    formattedCount = (data.count / 1000).toFixed(1) + 'K';
                } else {
                    formattedCount = data.count;
                }
                viewCountElement.textContent = `${formattedCount} views`;
            } else {
                viewCountElement.textContent = 'View count unavailable';
            }
        })
        .catch(error => {
            console.error('Error fetching view count:', error);
            document.querySelector('#view-count-value').textContent = 'View count unavailable';
        });
}

// Initialize comment functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the comment button
    const commentBtn = document.getElementById('add-comment-btn');
    const commentInput = document.getElementById('comment-input');
    
    if (commentBtn && commentInput) {
        commentBtn.addEventListener('click', addComment);
        
        // Also allow adding comment with Enter key (while holding Shift)
        commentInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault(); // Prevent new line
                addComment();
            } else if (e.key === 'Enter' && !e.shiftKey) {
                // Allow new line if Shift is not pressed
                return true;
            }
        });
    }
    
    // Load existing comments
    loadComments();
});

// Function to add a new comment
function addComment() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    
    if (commentText === '') {
        alert('Please enter a comment');
        return;
    }
    
    // Create a new comment object
    const newComment = {
        id: Date.now(), // Simple ID based on timestamp
        text: commentText,
        author: 'Anonymous',
        date: new Date().toLocaleString(),
        avatar: 'https://ui-avatars.com/api/?name=Anonymous&background=3a86ff&color=fff'
    };
    
    // Add to local storage
    saveComment(newComment);
    
    // Add to the page
    displayComment(newComment);
    
    // Clear the input
    commentInput.value = '';
}

// Function to save comment to localStorage
function saveComment(comment) {
    const comments = getComments();
    comments.unshift(comment); // Add to beginning of array
    localStorage.setItem('post-comments', JSON.stringify(comments));
}

// Function to retrieve comments from localStorage
function getComments() {
    const commentsStr = localStorage.getItem('post-comments');
    if (commentsStr) {
        return JSON.parse(commentsStr);
    }
    return [];
}

// Function to load and display comments
function loadComments() {
    const comments = getComments();
    const commentList = document.getElementById('comment-list');
    
    if (comments.length === 0) {
        commentList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }
    
    commentList.innerHTML = '';
    comments.forEach(comment => {
        displayComment(comment);
    });
}

// Function to display a single comment
function displayComment(comment) {
    const commentList = document.getElementById('comment-list');
    
    // If showing "No comments" message, clear it
    if (commentList.innerHTML.includes('No comments yet')) {
        commentList.innerHTML = '';
    }
    
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-item';
    commentElement.innerHTML = `
        <div class="comment-author">${comment.author}</div>
        <div class="comment-date">${comment.date}</div>
        <div class="comment-text">${comment.text}</div>
    `;
    
    // Add to the top of the list
    if (commentList.firstChild) {
        commentList.insertBefore(commentElement, commentList.firstChild);
    } else {
        commentList.appendChild(commentElement);
    }
}

// Function to display related posts in the sidebar
function displayRelatedPosts(posts) {
    const container = document.querySelector('#related-posts');
    
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p>No related posts found.</p>';
        return;
    }
    
    let html = '';
    posts.forEach(post => {
        const pubDate = new Date(post.pubDate).toLocaleDateString();
        // Generate a random view count for demo purposes
        const viewCount = Math.floor(Math.random() * 49000) + 1000; // Random between 1000-50000
        const formattedViews = viewCount > 1000 ? `${(viewCount / 1000).toFixed(1)}K` : viewCount;
        
        html += `
            <div class="related-post-item">
                <h4 onclick="window.location.href='post.html?url=${encodeURIComponent(post.link)}'">${post.title}</h4>
                <img src="${post.image}" alt="${post.title}" class="related-post-thumbnail" onclick="window.location.href='post.html?url=${encodeURIComponent(post.link)}'">
                <div class="meta">
                    <span>${pubDate}</span>
                </div>
                <div class="post-views">
                    <span><i>👁️</i>${formattedViews} views</span>
                </div>
                <a href="post.html?url=${encodeURIComponent(post.link)}">Read More</a>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Ad overlay functionality for iframe area
let countdownInterval;
let countdownSeconds = 5;

function showAdOverlay() {
    const adOverlay = document.getElementById('ad-overlay');
    const skipButton = document.getElementById('skip-button');
    const skipTimer = document.getElementById('skip-timer');
    const iframeContainer = document.querySelector('.article-iframe-container');
    
    // Ensure the iframe container has relative positioning for the overlay to work correctly
    iframeContainer.style.position = 'relative';
    
    // Reset the countdown counter for fresh countdown each time
    countdownSeconds = 5;
    
    // Clear any existing interval to prevent conflicts
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Initially hide the ad and fade in after 3 seconds
    adOverlay.style.display = 'flex';
    adOverlay.classList.remove('show');
    
    // Show the ad overlay immediately (no additional wait here since we're using setInterval for loops)
    adOverlay.classList.add('show');
    
    // Start countdown after the ad appears
    countdownInterval = setInterval(() => {
        skipTimer.textContent = `Skip in ${countdownSeconds}s`;
        
        if (countdownSeconds <= 0) {
            clearInterval(countdownInterval);
            skipButton.disabled = false;
            skipButton.textContent = 'Skip Ad';
            skipTimer.textContent = 'Ad can be skipped';
        }
        
        countdownSeconds--;
    }, 1000);
    
    // Add skip button event listener
    skipButton.addEventListener('click', () => {
        adOverlay.classList.remove('show');
        setTimeout(() => {
            adOverlay.style.display = 'none';
        }, 500); // Allow time for fade-out transition
        clearInterval(countdownInterval);
    });
    
    // Initialize AdSense for the overlay ad specifically
    // Make sure the ad container has proper dimensions when initializing
    setTimeout(() => {
        // Force layout calculation by accessing offsetWidth to ensure the element has dimensions
        const overlayInsContainer = document.querySelector('.ad-overlay-ins');
        if (overlayInsContainer) {
            // Force the browser to calculate layout/dimensions by accessing offsetWidth
            const forceLayout = overlayInsContainer.offsetWidth;

            const overlayAd = overlayInsContainer.querySelector('.adsbygoogle');

            // Ensure the ad container has proper display properties for dimension calculation
            if (overlayAd) {
                // Ensure the ad element has proper styles for AdSense
                overlayAd.style.display = 'block';
                overlayAd.style.width = '100%';

                // Force calculation of the ad element's dimensions as well
                const forceAdLayout = overlayAd.offsetWidth;

                // Then initialize the ad
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        }
    }, 300); // Slightly longer delay to ensure container is properly set up
}

// Function to hide ad overlay and show content
function hideAdOverlay() {
    const adOverlay = document.getElementById('ad-overlay');
    adOverlay.classList.remove('show');
    setTimeout(() => {
        adOverlay.style.display = 'none';
    }, 500); // Allow time for fade-out transition
    clearInterval(countdownInterval);
}

// Function to initialize AdSense ads only once
function initializeAdSense() {
    // Use a flag to ensure ads are only initialized once
    if (window.adsenseInitialized) {
        return; // Already initialized
    }

    // Mark as initialized to prevent duplicate calls
    window.adsenseInitialized = true;

    try {
        // Force layout calculation for all ad elements before initializing
        const adElements = document.querySelectorAll('.adsbygoogle');
        adElements.forEach(ad => {
            // Ensure the ad element has display:block and proper dimensions
            if (ad.style.display === '' || ad.style.display === 'inline') {
                ad.style.display = 'block';
            }
            // Force the browser to calculate layout/dimensions
            const forceLayout = ad.offsetWidth;
        });

        // Initialize all ads at once
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error("AdSense error:", e);
        // Reset the flag if there was an error
        window.adsenseInitialized = false;
    }
}

// Fullscreen functionality
function toggleFullscreen() {
    const iframeContainer = document.querySelector('.article-iframe-container');
    
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (iframeContainer.requestFullscreen) {
            iframeContainer.requestFullscreen();
        } else if (iframeContainer.mozRequestFullScreen) { // Firefox
            iframeContainer.mozRequestFullScreen();
        } else if (iframeContainer.webkitRequestFullscreen) { // Chrome, Safari and Opera
            iframeContainer.webkitRequestFullscreen();
        } else if (iframeContainer.msRequestFullscreen) { // IE/Edge
            iframeContainer.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
}

// Add fullscreen button event listener
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Load the article first
    loadArticle();

    // Initialize ads after loading article
    setTimeout(() => {
        if (!window.adsenseInitialized) {
            // Force layout calculation before initializing ads
            const adElements = document.querySelectorAll('.adsbygoogle');
            adElements.forEach(ad => {
                // Force browser to calculate layout/dimensions
                const forceLayout = ad.offsetWidth;
            });

            initializeAdSense();
        }
    }, 1000); // Delay slightly to ensure content is loaded

    // Show the ad overlay after a 5 second initial delay
    setTimeout(() => {
        showAdOverlay();

        // After the initial ad, start the 40-second loop
        setInterval(() => {
            // Show ad after 5 seconds each loop
            setTimeout(() => {
                showAdOverlay();
            }, 5000); // Show after 5 seconds each loop
        }, 40000); // 40 seconds interval between showing ads
    }, 5000); // 5 seconds initial delay
});