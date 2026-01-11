/**
 * FKTI Learning Hub JavaScript
 * Handles navigation, interactions, and course routing
 */

// Global variables
let mobileMenuOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHub();
    setupEventListeners();
    setupScrollEffects();
});

/**
 * Initialize the hub
 */
function initializeHub() {
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Initialize intersection observer for animations
    setupIntersectionObserver();
    
    // Setup course cards hover effects
    setupCourseCardEffects();
    
    // Initialize DataBot interactions
    initializeDataBot();
    
    // Initialize theme system
    initializeThemes();
    
    console.log('FKTI Learning Hub initialized');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Window resize handler
    window.addEventListener('resize', handleResize);
    
    // Scroll handler for navbar
    window.addEventListener('scroll', handleScroll);
    
    // Course card click handlers
    setupCourseClickHandlers();
}

/**
 * Handle navigation link clicks
 */
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenuOpen) {
            toggleMobileMenu();
        }
    }
}

/**
 * Handle scroll effects
 */
function handleScroll() {
    const nav = document.querySelector('.main-nav');
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
}

/**
 * Setup intersection observer for animations
 */
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.course-card, .feature-item, .path-step');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Setup course card effects
 */
function setupCourseCardEffects() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Setup course click handlers
 */
function setupCourseClickHandlers() {
    // Course buttons
    const courseBtns = document.querySelectorAll('[onclick*="enterCourse"]');
    courseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const course = this.onclick.toString().match(/'(\w+)'/)[1];
            enterCourse(course);
        });
    });
}

/**
 * Enter a specific course
 */
function enterCourse(courseType) {
    // Show loading animation
    showLoadingAnimation();
    
    // Course routing
    const courseUrls = {
        'python': 'python_course/index.html',
        'datascience': 'data-science.html',
        'airflow': 'airflow_course/index.html',
        'terraform': 'terraform_course/index.html',
        'redshift': 'redshift_course/index.html',
        'mssql': 'mssql_course/index.html',
        'dbt': 'dbt_course/index.html',
        'metabase': 'metabase_course/index.html',
        'postgres': 'postgres_course/index.html',
        'dms': 'dms_course/index.html'
    };
    
    const url = courseUrls[courseType];
    if (url) {
        // Add a slight delay for better UX
        setTimeout(() => {
            window.location.href = url;
        }, 800);
    } else {
        console.error('Course type not found:', courseType);
        hideLoadingAnimation();
    }
}

/**
 * Scroll to specific course card in courses section
 */
function scrollToCourseCard(courseType) {
    // First scroll to courses section
    const coursesSection = document.getElementById('courses');
    if (!coursesSection) return;
    
    // Map course types to CSS class names
    const courseClassMap = {
        'python': 'python-card',
        'datascience': 'datascience-card', // Data Science card
        'airflow': 'airflow-card',
        'terraform': 'terraform-card',
        'redshift': 'redshift-card',
        'mssql': 'mssql-card',
        'dbt': 'dbt-card',
        'metabase': 'metabase-card',
        'postgres': 'postgres-card',
        'dms': 'dms-card'
    };
    
    const courseClass = courseClassMap[courseType];
    if (!courseClass) {
        // Fallback: just scroll to courses section
        coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }
    
    // Scroll to courses section first
    coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Then find and scroll to the specific course card
    setTimeout(() => {
        let courseCard;
        
        if (courseType === 'datascience') {
            // Try to find by class first, then by data attribute or content
            courseCard = document.querySelector('.datascience-card') || 
                        document.querySelector('.course-card[data-course="datascience"]') ||
                        Array.from(document.querySelectorAll('.course-card')).find(card => 
                            card.querySelector('.course-title') && 
                            card.querySelector('.course-title').textContent.includes('Data Science')
                        );
        } else {
            courseCard = document.querySelector(`.${courseClass}`);
        }
        
        if (courseCard) {
            courseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add a highlight effect
            courseCard.style.transition = 'all 0.3s ease';
            courseCard.style.transform = 'scale(1.02)';
            courseCard.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            
            setTimeout(() => {
                courseCard.style.transform = 'scale(1)';
                courseCard.style.boxShadow = '';
            }, 1000);
        }
    }, 500); // Wait for initial scroll to complete
}

/**
 * Scroll to courses section
 */
function scrollToCourses() {
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = coursesSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    
    mobileMenuOpen = !mobileMenuOpen;
    
    if (mobileMenuOpen) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '70px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        navLinks.style.padding = '20px';
        navLinks.style.borderTop = '1px solid #e2e8f0';
        toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        navLinks.style.display = 'none';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

/**
 * Handle window resize
 */
function handleResize() {
    if (window.innerWidth > 768 && mobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Reset nav links display on desktop
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'row';
        navLinks.style.position = 'relative';
        navLinks.style.top = 'auto';
        navLinks.style.left = 'auto';
        navLinks.style.right = 'auto';
        navLinks.style.background = 'none';
        navLinks.style.boxShadow = 'none';
        navLinks.style.padding = '0';
        navLinks.style.borderTop = 'none';
    }
}

/**
 * Show loading animation
 */
function showLoadingAnimation() {
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading Course...</div>
        </div>
    `;
    
    // Add loading styles
    const loadingStyles = `
        <style>
            #loadingOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(5px);
            }
            
            .loading-container {
                text-align: center;
                padding: 40px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid #e2e8f0;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #e2e8f0;
                border-top: 4px solid #0077be;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            .loading-text {
                color: #4a4a4a;
                font-weight: 600;
                font-size: 1.125rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', loadingStyles);
    document.body.appendChild(overlay);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Hide loading animation
 */
function hideLoadingAnimation() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
    document.body.style.overflow = 'auto';
}

/**
 * Open demo modal (placeholder function)
 */
function openDemo() {
    alert('Demo video coming soon! For now, explore our interactive courses by clicking on the course buttons below.');
}

/**
 * Setup scroll effects for floating animations
 */
function setupScrollEffects() {
    const floatingElements = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    // Only trigger if not in input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Press 'P' to go to Python course
    if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.altKey) {
        enterCourse('python');
    }
    
    // Press 'A' to go to Airflow course
    if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.altKey) {
        enterCourse('airflow');
    }
    
    // Press 'T' to go to Terraform course
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.altKey) {
        enterCourse('terraform');
    }
    
    // Press 'R' to go to Redshift course
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.altKey) {
        enterCourse('redshift');
    }
    
    // Press 'M' to go to MSSQL course
    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey) {
        enterCourse('mssql');
    }
    
    // Press 'D' to go to DBT course
    if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.altKey) {
        enterCourse('dbt');
    }
    
    // Press 'B' to go to Metabase course
    if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.altKey) {
        enterCourse('metabase');
    }
    
    // Press 'Escape' to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

/**
 * Add course progress tracking (if returning from a course)
 */
function checkCourseProgress() {
    const pythonProgress = localStorage.getItem('fkti-python-progress');
    const airflowProgress = localStorage.getItem('fkti-airflow-progress');
    
    if (pythonProgress) {
        const progress = JSON.parse(pythonProgress);
        updateCourseCardProgress('python', progress.completedSections || 0);
    }
    
    if (airflowProgress) {
        const progress = JSON.parse(airflowProgress);
        updateCourseCardProgress('airflow', progress.completedSections || 0);
    }
}

/**
 * Update course card with progress indicator
 */
function updateCourseCardProgress(courseType, completedSections) {
    const courseCard = document.querySelector(`.${courseType}-card`);
    if (courseCard && completedSections > 0) {
        const progressBadge = document.createElement('div');
        progressBadge.className = 'progress-badge';
        progressBadge.innerHTML = `<i class="fas fa-check-circle"></i> ${completedSections} sections completed`;
        progressBadge.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.1);
            color: #4caf50;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
        `;
        courseCard.style.position = 'relative';
        courseCard.appendChild(progressBadge);
    }
}

// Initialize progress checking when page loads
document.addEventListener('DOMContentLoaded', checkCourseProgress);

/**
 * Scroll to top of page (for logo click)
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Initialize DataBot interactions
 */
function initializeDataBot() {
    const databotSpeech = document.getElementById('databot-speech');
    const journeySteps = document.querySelectorAll('.journey-step');
    
    if (!databotSpeech || journeySteps.length === 0) return;
    
    // DataBot speech messages for each step
    const speechMessages = {
        default: "Let me show you how we turn chaos into insights! 🤖",
        1: "Look at this mess! MSSQL has data everywhere! 😵",
        2: "Python to the rescue! Let me investigate this data! 🔍",
        3: "Time to build our cloud empire with Terraform! 🏗️",
        4: "Redshift will organize everything perfectly! ✨",
        5: "Airflow will automate everything! No more manual work! 🤖",
        6: "DBT time! Let's cook up some insights! 👨‍🍳",
        7: "Metabase will make beautiful dashboards! 📊",
        result: "Mission accomplished! From chaos to clarity! 🎉"
    };
    
    // Intersection Observer for DataBot speech
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = entry.target.getAttribute('data-step');
                if (step && speechMessages[step]) {
                    updateDatabotSpeech(speechMessages[step]);
                }
            }
        });
    }, {
        threshold: 0.6,
        rootMargin: '-50px 0px'
    });
    
    // Observe all journey steps
    journeySteps.forEach(step => {
        observer.observe(step);
    });
    
    // Also observe the result card
    const resultCard = document.querySelector('.journey-result');
    if (resultCard) {
        const resultObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateDatabotSpeech(speechMessages.result);
                }
            });
        }, {
            threshold: 0.5
        });
        resultObserver.observe(resultCard);
    }
    
    // Add click interaction to DataBot
    const databot = document.querySelector('.databot');
    if (databot) {
        databot.addEventListener('click', () => {
            const funnyMessages = [
                "Beep boop! Want to learn data engineering? 🤖",
                "I love organizing messy data! It's like LEGO for adults! 🧱",
                "Fun fact: I run on coffee and SQL queries! ☕",
                "My favorite hobby? Making data pipelines go BRRRR! 🚀",
                "I dream in JSON and wake up in SQL! 💭",
                "Click a course below to start your data journey! 👇"
            ];
            const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
            updateDatabotSpeech(randomMessage);
            
            // Add bounce animation
            databot.style.animation = 'bounce 0.6s ease-in-out';
            setTimeout(() => {
                databot.style.animation = 'bounce 2s ease-in-out infinite';
            }, 600);
        });
    }
}

/**
 * Update DataBot speech bubble
 */
function updateDatabotSpeech(message) {
    const speechElement = document.getElementById('databot-speech');
    if (speechElement) {
        // Add typing animation
        speechElement.style.opacity = '0.5';
        setTimeout(() => {
            speechElement.textContent = message;
            speechElement.style.opacity = '1';
            
            // Add pulse animation to speech bubble
            const speechBubble = speechElement.parentElement;
            speechBubble.style.animation = 'pulse 0.8s ease-in-out';
            setTimeout(() => {
                speechBubble.style.animation = 'pulse 2s ease-in-out infinite';
            }, 800);
        }, 300);
    }
}

/**
 * Theme Management Functions
 */

// Initialize theme system
function initializeThemes() {
    // Load saved theme or default to blue
    const savedTheme = localStorage.getItem('fkti-theme') || 'blue';
    setTheme(savedTheme);
    
    // Close theme dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-selector')) {
            const dropdown = document.getElementById('themeDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });
}

// Toggle theme selector dropdown
function toggleThemeSelector() {
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Set theme
function setTheme(themeName) {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Save to localStorage
    localStorage.setItem('fkti-theme', themeName);
    
    // Close dropdown
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
    
    console.log(`Theme changed to: ${themeName}`);
}

// ═══════════════════════════════════════════════════════════════
// STORY THEME SYSTEM - Interactive Industry Scenarios
// ═══════════════════════════════════════════════════════════════

const storyThemes = {
    walmart: {
        name: "Retail Giant",
        icon: "🛒",
        badge: "RETAIL",
        title: "Meet DataBot 🤖 - Your Retail Data Guide!",
        subtitle: "Follow DataBot as he transforms messy store data into sales insights using our 10 essential tools!",
        speech: "Welcome to the world of Retail! Let me show you how we turn messy store data into golden sales insights!",
        steps: {
            step1: {
                title: "PostgreSQL - The Busy Store Register",
                desc: "Imagine thousands of cash registers across 5,000 stores! 🏪 Every beep, every scan, every 'Have a nice day!' creates data. But it's all scattered - frozen pizza in one table, customer info in another, inventory somewhere else!",
                example: "Customer Sarah bought diapers, beer, and chips at Store #4521 at 8:47 PM. But this data is split across 12 different tables! 😱"
            },
            step2: {
                title: "DBeaver - The X-Ray Vision Glasses",
                desc: "DBeaver is like putting on magical X-ray glasses! 👓 You can SEE inside any database. 'Oh look, there's the customers table! And there's the products!'",
                example: "Connected to 15 different stores! I can see 2.3 million transactions from last week. Let me show you which products are selling like hotcakes! 🥞"
            },
            step3: {
                title: "Python - The Smart Shopping Assistant",
                desc: "Python is that super-smart employee who memorizes EVERYTHING! 🧠 It reads millions of receipts, spots patterns humans would miss!",
                example: "Analyzed 50 million transactions! Found that putting bananas near cereal increases banana sales by 23%! 🍌"
            },
            step4: {
                title: "AWS DMS - The Data Moving Truck",
                desc: "DMS is like having a magical moving truck! 🚚 It takes data from your old store system and moves it to the fancy new cloud warehouse - WITHOUT closing the store!",
                example: "Moving 500GB of sales data from Store Server to AWS... Customers still shopping... Done! Not a single receipt lost! 🎉"
            },
            step5: {
                title: "Terraform - The Store Builder Robot",
                desc: "Need a new data center? Terraform builds it in 10 minutes! 🏗️ Like LEGO for the cloud - 'I need 1 data warehouse, 5 servers, 3 storage buckets!'",
                example: "Creating analytics infrastructure for Black Friday... Scaling to handle 10x normal traffic... Ready! 💪"
            },
            step6: {
                title: "Redshift - The Super Organized Warehouse",
                desc: "Redshift is like having a warehouse where EVERYTHING is perfectly organized! 📦 5 billion rows of data, but finding specific customers takes 2 seconds!",
                example: "'Which stores sold out of toilet paper last March?' Searching 10 years of data... Found 847 stores in 0.8 seconds! 🚀"
            },
            step7: {
                title: "Airflow - The Never-Sleeping Store Manager",
                desc: "Airflow is that manager who NEVER sleeps! ⏰ Every night: 'Collect all store sales! Update inventory! Send restock alerts!' 365 days a year!",
                example: "12:00 AM - Extract sales ✓, 12:30 AM - Clean data ✓, 1:00 AM - Load to warehouse ✓, 1:30 AM - Update dashboards ✓ ☕"
            },
            step8: {
                title: "DBT - The Business Translator",
                desc: "DBT translates 'txn_id: 847291' into 'Sarah bought groceries worth $47.52 and is a loyal customer for 3 years!' Business-friendly data! 🎭",
                example: "Customer Lifetime Value ready! Sarah = $12,847 over 3 years. Top 5% customer! Time for VIP coupon! 👑"
            },
            step9: {
                title: "Metabase - The Beautiful Storyteller",
                desc: "Metabase turns numbers into stories! 📊 No more spreadsheets with 10,000 rows. Beautiful charts and dashboards that make the CEO say 'WOW!'",
                example: "Live dashboard: Sales up 12% today! Store #4521 is the MVP! Hot product: Organic produce! Alert: Store #2847 low on essentials! 📊"
            },
            step10: {
                title: "Data Science - The Pattern Detective",
                desc: "Data Science finds hidden patterns in millions of shopping transactions! 🔍 Predicts what customers will buy before THEY even know!",
                example: "Predicted: Customers who buy baby products on Mondays buy snacks on Fridays (87% accuracy)! Stock up snacks on Thursdays! 🎯"
            }
        },
        result: {
            title: "The Retail Magic! ✨",
            desc: "From 5,000 chaotic stores to one beautiful command center! Store managers now see real-time sales, inventory alerts, and customer trends!",
            before: "How did we do on Black Friday?",
            beforeResult: "*2 weeks of number crunching* 😵",
            after: "How did we do?",
            afterResult: "*Real-time dashboard* → '$2.3B in sales, up 15%!' 🎉"
        }
    },
    cinema: {
        name: "Movie Theatre",
        icon: "🎬",
        badge: "CINEMA",
        title: "Meet DataBot 🤖 - Your Box Office Analyst!",
        subtitle: "Watch DataBot turn ticket stubs into blockbuster predictions using all 10 data tools!",
        speech: "Lights, Camera, DATA! Let me show you how we predict the next blockbuster hit!",
        steps: {
            step1: {
                title: "PostgreSQL - The Ticket Counter Chaos",
                desc: "Picture 500 movie theatres with popcorn-sticky keyboards! 🎟️ Every ticket sale, every large popcorn upgrade gets logged. But data is everywhere!",
                example: "John bought 2 tickets for 'Avatar 5' at 7:30 PM, large popcorn combo, and snuck in his own candy (we know, John!) 🍿"
            },
            step2: {
                title: "DBeaver - The Film Critic's Notebook",
                desc: "DBeaver lets you explore movie data like a detective! 🔍 'Show me all Friday 7 PM screenings... which snacks sold most during Marvel movies!'",
                example: "Discovered that 'horror movie + nachos' is the most popular combo! Romantic comedies sell 40% more chocolate! 🍫"
            },
            step3: {
                title: "Python - The Prediction Machine",
                desc: "Python analyzes years of movie data and predicts hits! 🎯 Based on director, cast, genre - it predicts opening weekend revenue!",
                example: "Predicted 'Superhero Movie X' would flop based on runtime + similar films. Saved $2M in marketing! 💰"
            },
            step4: {
                title: "AWS DMS - The Reel-to-Digital Converter",
                desc: "DMS migrates all historical ticket data to the cloud! 📼 10 years of box office history, now searchable in seconds!",
                example: "Migrated 15 years of ticket sales while theatres stayed open. 500 million tickets worth of data! 🎬"
            },
            step5: {
                title: "Terraform - The Cinema Infrastructure Builder",
                desc: "Need servers for streaming analytics? Terraform builds infrastructure in minutes! 🏗️ Auto-scaling for opening weekends!",
                example: "Building infrastructure for 'Avengers 10' opening weekend... Ready for 10 million ticket sales! 🎬"
            },
            step6: {
                title: "Redshift - The Box Office Archive",
                desc: "Redshift stores decades of movie data perfectly organized! 📦 Finding 'all horror movies that sold out on Fridays' takes 1 second!",
                example: "'Which movies had the best popcorn sales?' Found top 10 in 0.5 seconds! Horror + nachos = gold! 🍿"
            },
            step7: {
                title: "Airflow - The Showtime Scheduler",
                desc: "Airflow runs nightly! ⏰ 'Update box office totals! Calculate seat fill rates! Refresh concession inventory! Send restock alerts!'",
                example: "2:00 AM - Collect ticket sales ✓, 2:30 AM - Update revenue ✓, 3:00 AM - Refresh dashboards ✓, Alert: Screen 5 projector maintenance due! 🎥"
            },
            step8: {
                title: "DBT - The Cinema Translator",
                desc: "DBT transforms 'txn: 847291, seat: G7' into 'John watched Avatar 5 in premium seats, spent $47 on concessions, 3rd visit this month!' 🎭",
                example: "Movie Performance Model ready! Avatar 5 = $2.1M this week, 94% capacity, top concession: large popcorn combo! 🍿"
            },
            step9: {
                title: "Metabase - The Box Office Dashboard",
                desc: "Metabase shows real-time cinema performance! 📊 Which screens are full? Which movies are trending? What's selling at concessions?",
                example: "Live dashboard: Avatar 5 at 98% capacity! Screen 3 undersold - push promotions! Popcorn sales up 23%! Nacho cheese running low! 🎬"
            },
            step10: {
                title: "Data Science - The Hit Predictor",
                desc: "Data Science predicts which movies will be hits! 🔍 Analyzes trailers, social buzz, cast popularity, and historical patterns!",
                example: "Predicted: New thriller will have 89% opening weekend fill rate. Book extra late-night shows! Order 40% more nachos! 🎯"
            }
        },
        result: {
            title: "The Box Office Magic! ✨",
            desc: "From scattered ticket stubs to predicting the next billion-dollar franchise! Theatre managers know exactly which movies to book!",
            before: "Should we book this indie film?",
            beforeResult: "*Gut feeling and crossed fingers* 🤞",
            after: "Should we book this indie film?",
            afterResult: "*AI prediction* → 'Yes! 87% fill rate predicted for date-night slots!' 💑"
        }
    },
    airline: {
        name: "Airlines",
        icon: "✈️",
        badge: "AVIATION",
        title: "Meet DataBot 🤖 - Your Flight Operations Expert!",
        subtitle: "Soar with DataBot as he optimizes flight routes and passenger experiences using all 10 tools!",
        speech: "Welcome aboard Flight DATA-101! Let me show you how we keep millions of passengers happy!",
        steps: {
            step1: {
                title: "PostgreSQL - The Busy Airport Terminal",
                desc: "Imagine managing 1,000 flights daily! ✈️ Passengers checking in, bags being loaded, pilots filing reports. Data flying everywhere faster than the planes!",
                example: "Flight 747 to Paris: 234 passengers, 847 bags, 3 vegetarian meals, 1 emotional support peacock. All in different systems! 🦚"
            },
            step2: {
                title: "DBeaver - The Control Tower View",
                desc: "DBeaver gives you the control tower perspective! 📡 See every flight, every delay, every connection at risk. Crisis averted!",
                example: "Found 47 passengers who'll miss connections due to weather delay. Automatically rebooked before they even knew! 🌧️"
            },
            step3: {
                title: "Python - The Route Optimizer",
                desc: "Python calculates the most efficient flight paths! 🗺️ Fuel prices, weather patterns, air traffic - finds the perfect route!",
                example: "Optimized Pacific routes based on jet streams. Saved 15 minutes per flight = $50M in fuel annually! ⛽"
            },
            step4: {
                title: "AWS DMS - The Airline Merger Expert",
                desc: "When two airlines merge, DMS combines their systems! 🤝 Millions of loyalty members unified without a single flight cancellation!",
                example: "Merged two airlines' databases overnight. 50 million frequent flyer accounts combined flawlessly! ✨"
            },
            step5: {
                title: "Terraform - The Airport Infrastructure Manager",
                desc: "Need cloud infrastructure for flight operations? Terraform builds it instantly! 🏗️ Auto-scaling for holiday rush!",
                example: "Building infrastructure for holiday season... Scaling to handle 2 million passengers/day... Ready in 12 minutes! ✈️"
            },
            step6: {
                title: "Redshift - The Flight Data Warehouse",
                desc: "Redshift stores billions of flight records! 📦 30 years of data, finding 'all delayed flights due to weather' takes 2 seconds!",
                example: "'Which routes have the most delays?' Found top 50 routes in 1.2 seconds! Chicago O'Hare + winter = delays! ❄️"
            },
            step7: {
                title: "Airflow - The Never-Sleeping Flight Controller",
                desc: "Airflow monitors flights 24/7! ⏰ 'Update flight status! Check weather! Recalculate ETAs! Alert for delays!' Every minute, every flight!",
                example: "1:00 AM - Update all flight statuses ✓, 1:15 AM - Weather check ✓, 1:30 AM - Crew scheduling ✓, Alert: Flight 234 needs gate change! ✈️"
            },
            step8: {
                title: "DBT - The Aviation Translator",
                desc: "DBT transforms 'flt: 747, pax: 234, eta: 1430' into 'Flight 747 to Paris arrives 2:30 PM with 234 happy passengers!' Business-ready! 🎭",
                example: "On-Time Performance Model ready! Route JFK-LAX = 94% on-time. Best crew: Captain Smith's team! ✈️"
            },
            step9: {
                title: "Metabase - The Operations Dashboard",
                desc: "Metabase shows real-time flight operations! 📊 Which flights are delayed? Gate availability? Crew status? All on one screen!",
                example: "Live dashboard: 847 flights on-time! Flight 234 delayed 20 min - passengers notified! Gate B7 available! Crew rest compliant! 🛫"
            },
            step10: {
                title: "Data Science - The Delay Predictor",
                desc: "Data Science predicts delays 6 hours ahead! 🔍 Analyzes weather, air traffic, historical patterns, and aircraft maintenance!",
                example: "Predicted: Flight 892 will be delayed 45 min due to Chicago weather. Auto-rebook connecting passengers NOW! 🌧️"
            }
        },
        result: {
            title: "The Aviation Magic! ✨",
            desc: "From flight delays to on-time arrivals! Operations center predicts delays 6 hours ahead, automatically rebooks passengers!",
            before: "Why is my flight delayed?",
            beforeResult: "*Shrug* 'Weather somewhere maybe?' ☁️",
            after: "Will my flight be delayed?",
            afterResult: "*Proactive alert* → 'Yes, but we've already rebooked you!' 🎉"
        }
    },
    oilrig: {
        name: "Oil & Gas",
        icon: "🛢️",
        badge: "ENERGY",
        title: "Meet DataBot 🤖 - Your Energy Sector Analyst!",
        subtitle: "Drill into data with DataBot as he monitors oil rigs using all 10 essential tools!",
        speech: "Welcome to the oil fields! Let me show you how we turn sensor data into energy efficiency!",
        steps: {
            step1: {
                title: "PostgreSQL - The Sensor Ocean",
                desc: "Picture an oil rig with 10,000 sensors! 🌡️ Temperature, pressure, flow rates - data streaming every millisecond! One rig generates more data than a small country!",
                example: "Sensor #4521 shows pressure at 4,521 PSI. Sensor #4522 shows temperature at 347°F. That's 864 million readings per day! 📊"
            },
            step2: {
                title: "DBeaver - The Engineer's Dashboard",
                desc: "DBeaver helps engineers query sensor data safely! 🔧 'Show me all pressure anomalies in the last hour.' Spot problems before disasters!",
                example: "Query revealed Pump #7 running 12% hotter than normal. Scheduled maintenance. Saved $2M! 💵"
            },
            step3: {
                title: "Python - The Predictive Maintenance Brain",
                desc: "Python predicts equipment failures BEFORE they happen! 🔮 Analyzing vibration patterns: 'This pump will fail in 72 hours!'",
                example: "Predicted turbine bearing failure 5 days early. Scheduled repair during planned downtime. Zero production loss! 🎯"
            },
            step4: {
                title: "AWS DMS - The Legacy System Bridge",
                desc: "Oil rigs run systems from the 1990s! 📟 DMS connects ancient systems to modern cloud analytics!",
                example: "Connected 30-year-old SCADA system to AWS. Engineers can monitor rigs from their phones! 📱"
            },
            step5: {
                title: "Terraform - The Rig Infrastructure Builder",
                desc: "Need cloud infrastructure for sensor analytics? Terraform builds it in minutes! 🏗️ No rig downtime!",
                example: "Building infrastructure for 50 oil rigs... Scaling for 1 billion sensor readings/day... Ready in 10 minutes! 🛢️"
            },
            step6: {
                title: "Redshift - The Sensor Data Archive",
                desc: "Redshift stores decades of sensor data! 📦 20 years of pressure and temperature data, finding anomalies takes 1 second!",
                example: "'Which pumps had the most failures?' Found top 20 pumps in 0.8 seconds! Maintenance scheduled! 🔧"
            },
            step7: {
                title: "Airflow - The Never-Sleeping Rig Monitor",
                desc: "Airflow monitors every rig 24/7! ⏰ 'Check all sensors! Update safety metrics! Alert if pressure exceeds threshold!' Never sleeps!",
                example: "Every 5 min - Sensor check ✓, Every hour - Safety report ✓, Alert: Rig #7 pressure spike detected! Investigate NOW! 🚨"
            },
            step8: {
                title: "DBT - The Energy Translator",
                desc: "DBT transforms 'sensor: 4521, val: 847.2' into 'Well #12 producing 847 barrels/day, 15% above target!' Business-ready metrics! 🎭",
                example: "Production Efficiency Model ready! Rig #23 = 94% efficiency, Best performer this quarter! Bonus for crew! 🏆"
            },
            step9: {
                title: "Metabase - The Rig Operations Dashboard",
                desc: "Metabase shows real-time rig performance! 📊 Production rates, safety metrics, equipment health - all visible to engineers worldwide!",
                example: "Live dashboard: Rig #7 at 98% efficiency! Well #12 ahead of target! Alert: Pump #3 vibration increasing - schedule check! 🛢️"
            },
            step10: {
                title: "Data Science - The Equipment Failure Predictor",
                desc: "Data Science predicts failures weeks ahead! 🔍 Analyzes vibration, temperature, pressure patterns across all equipment!",
                example: "Predicted: Compressor #4 will need maintenance in 14 days based on vibration trend. Schedule during planned shutdown! ⚠️"
            }
        },
        result: {
            title: "The Energy Magic! ✨",
            desc: "From reactive repairs to predictive maintenance! Engineers see problems coming weeks ahead. Production up 15%, accidents down 40%!",
            before: "Why did that pump explode?",
            beforeResult: "*Investigation* 'It was old, I guess?' 🤷",
            after: "Is anything about to fail?",
            afterResult: "*AI Alert* → 'Yes, replace Pump #7 bearing in 3 days!' 🔧"
        }
    },
    procurement: {
        name: "Procurement",
        icon: "📦",
        badge: "SUPPLY",
        title: "Meet DataBot 🤖 - Your Supply Chain Guru!",
        subtitle: "Watch DataBot optimize procurement and save millions using all 10 tools!",
        speech: "Welcome to the supply chain! Let me show you how we turn purchase orders into profit!",
        steps: {
            step1: {
                title: "PostgreSQL - The Vendor Jungle",
                desc: "Managing 5,000 vendors is like herding cats! 🐱 Purchase orders, invoices, delivery schedules - all in different formats! Some email Excel, others fax!",
                example: "Order #78451: 10,000 widgets from Vendor A. But Vendor B is 15% cheaper... and Vendor C has better quality! 😵"
            },
            step2: {
                title: "DBeaver - The Vendor Analyzer",
                desc: "DBeaver helps you compare vendors instantly! 📋 'Show me all vendors who delivered late last quarter.' Negotiations become easier!",
                example: "Found Vendor X has 98% on-time delivery vs Vendor Y's 67%. Switched and saved 3 weeks in delays! ⏰"
            },
            step3: {
                title: "Python - The Price Predictor",
                desc: "Python analyzes market trends and predicts prices! 📈 'Steel prices will rise 20% next month.' Buy now, save millions!",
                example: "Predicted copper shortage 2 months early. Pre-ordered at current prices. Saved $4.2M when prices spiked! 💰"
            },
            step4: {
                title: "AWS DMS - The ERP Unifier",
                desc: "Every acquisition means another ERP system! 🏢 DMS merges Oracle, SAP, custom systems into one platform!",
                example: "Unified 7 ERP systems after acquisitions. Found 3 contracts with same vendor at different prices! 🤯"
            },
            step5: {
                title: "Terraform - The Procurement Infrastructure Builder",
                desc: "Need cloud infrastructure for vendor analytics? Terraform builds it instantly! 🏗️ No procurement delays!",
                example: "Building infrastructure for global procurement... Scaling for 100,000 POs/day... Ready in 7 minutes! 📦"
            },
            step6: {
                title: "Redshift - The Vendor Data Warehouse",
                desc: "Redshift stores years of vendor data! 📦 10 years of procurement data, finding late deliveries takes 1 second!",
                example: "'Which vendors have best on-time delivery?' Found top 100 vendors in 0.6 seconds! 💰"
            },
            step7: {
                title: "Airflow - The Never-Sleeping Buyer",
                desc: "Airflow monitors inventory 24/7! ⏰ 'Check stock levels! Update vendor scores! Send reorder alerts!' Never misses a reorder point!",
                example: "Every hour - Stock check ✓, Daily - Vendor scorecard update ✓, Alert: Widget inventory below threshold - reorder from Vendor A! 📦"
            },
            step8: {
                title: "DBT - The Procurement Translator",
                desc: "DBT transforms 'po: 78451, qty: 10000' into 'Widget order from Vendor A, $45,000, arriving in 5 days, 98% quality score!' 🎭",
                example: "Vendor Scorecard ready! Vendor A = 98% on-time, 99% quality. Vendor B = 67% on-time - renegotiate or replace! 📋"
            },
            step9: {
                title: "Metabase - The Supply Chain Dashboard",
                desc: "Metabase shows real-time procurement status! 📊 Open POs, inventory levels, vendor performance - all on one screen!",
                example: "Live dashboard: 847 open POs! Vendor A shipment arriving tomorrow! Alert: Steel inventory critical - expedite order! 📦"
            },
            step10: {
                title: "Data Science - The Demand Forecaster",
                desc: "Data Science predicts what you'll need and when! 🔍 Analyzes seasonal trends, market conditions, historical usage!",
                example: "Predicted: Widget demand will spike 40% in Q4. Pre-order now at locked prices! Saved $2.1M vs spot buying! 📈"
            }
        },
        result: {
            title: "The Procurement Magic! ✨",
            desc: "From chaotic purchasing to strategic sourcing! Vendor scorecards, price predictions, automatic reordering. Costs down 18%!",
            before: "Why do we keep running out of parts?",
            beforeResult: "*Spreadsheet chaos* 'Reorder point was wrong?' 📊",
            after: "When should we reorder?",
            afterResult: "*Smart Alert* → 'Order now! Lead time increased + demand spike coming!' 🚀"
        }
    },
    hospital: {
        name: "Healthcare",
        icon: "🏥",
        badge: "HEALTH",
        title: "Meet DataBot 🤖 - Your Healthcare Analytics Partner!",
        subtitle: "Heal with DataBot as he improves patient outcomes using all 10 tools!",
        speech: "Welcome to healthcare data! Let me show you how we save lives with analytics!",
        steps: {
            step1: {
                title: "PostgreSQL - The Medical Records Maze",
                desc: "Hospitals generate MASSIVE data! 🩺 Lab results, vital signs, prescriptions, imaging - scattered across dozens of systems!",
                example: "Patient John: Blood test in Lab System A, X-ray in Imaging B, prescription in Pharmacy C. Time to solve the puzzle! 🧩"
            },
            step2: {
                title: "DBeaver - The Medical Detective",
                desc: "DBeaver helps doctors query patient history safely! 🔍 'Show me all diabetic patients on Medication X who had reactions.'",
                example: "Found pattern: 5% of patients on Drug X + Drug Y have interactions. Updated protocols. Lives saved! 💊"
            },
            step3: {
                title: "Python - The Diagnostic Assistant",
                desc: "Python analyzes symptoms and suggests diagnoses! 🤖 Catches things humans might miss. 'Based on these symptoms, consider...'",
                example: "Flagged rare condition that matches patient symptoms. Doctor confirmed. Early detection = full recovery! ❤️"
            },
            step4: {
                title: "AWS DMS - The HIPAA-Compliant Migrator",
                desc: "Moving healthcare data requires EXTREME security! 🔒 DMS migrates patient records with full compliance!",
                example: "Migrated 10 million patient records to cloud. Zero breaches. Full HIPAA compliance. Auditors impressed! ✅"
            },
            step5: {
                title: "Terraform - The Hospital Infrastructure Builder",
                desc: "Need secure cloud infrastructure? Terraform builds it with HIPAA compliance! 🏗️ Fully encrypted and compliant!",
                example: "Building HIPAA-compliant infrastructure... Scaling for 5 million patient records... Ready in 15 minutes! 🏥"
            },
            step6: {
                title: "Redshift - The Medical Records Warehouse",
                desc: "Redshift stores decades of patient data securely! 📦 25 years of records, finding specific patients takes 2 seconds!",
                example: "'Which patients had adverse reactions to Drug Y?' Found 847 cases in 1.1 seconds! Protocol updated! 💊"
            },
            step7: {
                title: "Airflow - The Never-Sleeping Nurse Station",
                desc: "Airflow monitors patient data 24/7! ⏰ 'Check vital signs! Update medication schedules! Alert for anomalies!' Never misses a beat!",
                example: "Every 15 min - Vital signs check ✓, Hourly - Medication reminder ✓, Alert: Patient 4521 heart rate elevated! Notify doctor! ❤️"
            },
            step8: {
                title: "DBT - The Medical Translator",
                desc: "DBT transforms 'lab: 847, val: 6.2' into 'Patient John's A1C is 6.2% - diabetes well controlled, continue current treatment!' 🎭",
                example: "Patient Health Score ready! John = 94/100, diabetes controlled, due for annual eye exam, flu shot recommended! 📋"
            },
            step9: {
                title: "Metabase - The Clinical Dashboard",
                desc: "Metabase shows real-time patient status! 📊 Ward occupancy, critical patients, medication schedules - all visible to staff!",
                example: "Live dashboard: Ward A at 85% capacity! Patient 4521 vitals stable! 3 discharges today! Alert: Medication refill needed! 🏥"
            },
            step10: {
                title: "Data Science - The Risk Predictor",
                desc: "Data Science predicts patient risks! 🔍 Analyzes symptoms, history, vitals to flag potential complications before they happen!",
                example: "Predicted: Patient 4521 has 78% risk of readmission within 30 days. Schedule follow-up appointment NOW! ⚠️"
            }
        },
        result: {
            title: "The Healthcare Magic! ✨",
            desc: "From fragmented records to unified patient care! Doctors see complete history instantly, AI flags potential issues!",
            before: "What medications is this patient on?",
            beforeResult: "*Calling 5 pharmacies* 'Let me check...' 📞",
            after: "What medications is this patient on?",
            afterResult: "*Instant view* → 'Complete medication history + interaction warnings!' 💊"
        }
    },
    automotive: {
        name: "Automotive",
        icon: "🚗",
        badge: "AUTO",
        title: "Meet DataBot 🤖 - Your Manufacturing Intelligence!",
        subtitle: "Rev up with DataBot as he optimizes car production lines using all 10 essential tools!",
        speech: "Welcome to the factory floor! Let me show you how we build perfect cars with data!",
        steps: {
            step1: {
                title: "PostgreSQL - The Assembly Line Symphony",
                desc: "A car has 30,000 parts! 🔩 Each part has origin, quality checks, and installation time. Multiply by 1,000 cars per day. That's 30 MILLION data points daily!",
                example: "Bolt #47829-C installed in Car #78451 at Station 23 by Robot Arm #7 at 14:23:47. Now imagine tracking ALL bolts! 🤯"
            },
            step2: {
                title: "DBeaver - The Quality Inspector",
                desc: "DBeaver helps find defect patterns! 🔍 'Show me all paint defects from the last week, grouped by shift and spray booth.' Root cause becomes obvious!",
                example: "Discovered all orange-peel defects came from Booth #3 during humid weather. Fixed ventilation. Defects: ZERO! ✨"
            },
            step3: {
                title: "Python - The Production Optimizer",
                desc: "Python balances the entire production line! ⚖️ If one station is slow, it ripples through everything. Python simulates changes and finds the perfect flow!",
                example: "Optimized station sequence. Reduced bottleneck at door assembly. Production up 8%! That's 80 extra cars per day! 🚗"
            },
            step4: {
                title: "AWS DMS - The Plant Integrator",
                desc: "Car companies have factories worldwide! 🌍 DMS syncs data from Germany, Mexico, Japan, USA into one global view. Same quality standards everywhere!",
                example: "Unified quality data from 12 plants. Found best practices in Japan. Applied globally. Defect rate dropped 23%! 🎌"
            },
            step5: {
                title: "Terraform - The Factory Infrastructure Builder",
                desc: "Need cloud infrastructure for production analytics? Terraform builds it instantly! 🏗️ No factory downtime, no IT tickets!",
                example: "Building infrastructure for 15 production lines... Scaling to handle 1 million parts/day... Ready in 9 minutes! 🚗"
            },
            step6: {
                title: "Redshift - The Manufacturing Data Warehouse",
                desc: "Redshift stores years of production data perfectly organized! 📦 10 years of quality data, finding specific defects takes 1 second!",
                example: "'Which stations have the most defects?' Searching 5 years of data... Found top 20 stations in 0.7 seconds! 🔧"
            },
            step7: {
                title: "Airflow - The Never-Sleeping Factory Supervisor",
                desc: "Airflow monitors production 24/7! ⏰ Every hour: 'Check robot calibration! Update quality metrics! Alert if defect rate spikes!' Never misses a shift!",
                example: "3:00 AM - Collect station data ✓, 3:15 AM - Run quality checks ✓, 3:30 AM - Update dashboards ✓, Alert: Station 7 needs calibration! 🔧"
            },
            step8: {
                title: "DBT - The Manufacturing Translator",
                desc: "DBT transforms 'sensor_id: 8472, val: 847.2' into 'Engine Block #4521 torque within spec, installed by Robot Arm #3' - Business-ready! 🎭",
                example: "Quality Score Model ready! Car #78451 = 98.7% quality score. Passed all 847 checkpoints! Ready for shipping! ✅"
            },
            step9: {
                title: "Metabase - The Factory Dashboard",
                desc: "Metabase turns production data into visual insights! 📊 Real-time displays showing line efficiency, defect rates, and throughput on the factory floor!",
                example: "Live dashboard: Line A at 97% efficiency! Station 12 ahead of schedule! Quality: 99.2%! Alert: Paint booth humidity rising! 🏭"
            },
            step10: {
                title: "Data Science - The Defect Predictor",
                desc: "Data Science predicts quality issues BEFORE they happen! 🔍 Analyzes vibration patterns, temperature trends, and historical defects!",
                example: "Predicted: Robot Arm #7 will need recalibration in 48 hours based on torque variance pattern. Schedule maintenance NOW! ⚠️"
            }
        },
        result: {
            title: "The Manufacturing Magic! ✨",
            desc: "From reactive quality control to predictive perfection! Factory managers now see defects forming before they happen, optimize production in real-time!",
            before: "Why did we have recalls last quarter?",
            beforeResult: "*Root cause analysis for months* 🔍",
            after: "Will we have quality issues?",
            afterResult: "*Predictive Alert* → 'Station 7 showing anomaly. Inspect before next shift!' ⚠️"
        }
    },
    banking: {
        name: "Banking",
        icon: "🏦",
        badge: "FINANCE",
        title: "Meet DataBot 🤖 - Your Financial Data Guardian!",
        subtitle: "Watch DataBot secure billions in transactions using all 10 essential tools!",
        speech: "Welcome to the world of Finance! Let me show you how we protect money and catch bad actors!",
        steps: {
            step1: {
                title: "PostgreSQL - The Vault of Transactions",
                desc: "Banks process MILLIONS of transactions every second! 💰 ATM withdrawals, wire transfers, card swipes - all happening globally!",
                example: "Customer John swipes card in New York at 2:15 PM, then London at 2:17 PM. 3,500 miles in 2 minutes! 🚨 FRAUD ALERT!"
            },
            step2: {
                title: "DBeaver - The Financial Detective",
                desc: "DBeaver lets analysts investigate suspicious patterns! 🔎 'Show me all transactions over $10K in the last hour.'",
                example: "Found 47 new accounts receiving exactly $9,999 transfers (under reporting limit). Structuring scheme exposed! 👮"
            },
            step3: {
                title: "Python - The Fraud Hunter",
                desc: "Python builds AI models that learn 'normal' behavior! 🧠 Scores every transaction in real-time. Catches fraud instantly!",
                example: "ML model flagged card #4521 - spending changed 847% from baseline. Card was cloned at gas station! 🎯"
            },
            step4: {
                title: "AWS DMS - The Global Compliance Engine",
                desc: "Banks operate in 100+ countries! 🌍 DMS syncs customer data while maintaining GDPR, SOX, PCI compliance!",
                example: "Merged customer data from 23 countries. Detected duplicate accounts used for round-tripping. Saved $12M! 📋"
            },
            step5: {
                title: "Terraform - The Banking Infrastructure Builder",
                desc: "Need secure cloud infrastructure? Terraform builds it with full compliance! 🏗️ PCI-DSS compliant instantly!",
                example: "Building PCI-compliant infrastructure... Scaling for 10 million transactions/day... Ready in 20 minutes! 🏦"
            },
            step6: {
                title: "Redshift - The Financial Data Warehouse",
                desc: "Redshift stores decades of transactions securely! 📦 20 years of data, finding suspicious accounts takes 1 second!",
                example: "'Which accounts show suspicious patterns?' Found 47 flagged accounts in 0.9 seconds! Fraud prevented! 🚨"
            },
            step7: {
                title: "Airflow - The Never-Sleeping Fraud Watch",
                desc: "Airflow monitors transactions 24/7! ⏰ 'Score every transaction! Update risk models! Alert for anomalies!' Never sleeps!",
                example: "Every second - Transaction scoring ✓, Hourly - Risk model update ✓, Alert: Account #4521 unusual activity! Block card NOW! 🚨"
            },
            step8: {
                title: "DBT - The Banking Translator",
                desc: "DBT transforms 'txn: 847291, amt: 9999' into 'John transferred $9,999 to new account, 3rd similar transaction this week - flag!' 🎭",
                example: "Customer Risk Score ready! Account #4521 = High Risk, 3 suspicious transfers, recommend account review! 📋"
            },
            step9: {
                title: "Metabase - The Fraud Operations Dashboard",
                desc: "Metabase shows real-time fraud detection! 📊 Flagged transactions, blocked cards, investigation queue - all on one screen!",
                example: "Live dashboard: 47 transactions flagged today! 12 cards blocked! $2.3M fraud prevented! Alert: New pattern detected! 🏦"
            },
            step10: {
                title: "Data Science - The Fraud Predictor",
                desc: "Data Science predicts fraud before it happens! 🔍 Analyzes behavior patterns, location, spending to catch criminals!",
                example: "Predicted: Account #4521 is 94% likely to be used for money laundering based on transaction pattern. Freeze account! 🚨"
            }
        },
        result: {
            title: "The Financial Fortress! 🏰",
            desc: "From reactive fraud detection to real-time protection! Banks stop fraudsters mid-transaction, prevent money laundering!",
            before: "Why did we lose $2M to fraud last month?",
            beforeResult: "*Reviewing paper reports* → 'Investigating...' 📄",
            after: "Is this transaction safe?",
            afterResult: "*Real-time AI* → 'BLOCKED! Card cloned. Customer notified. New card shipped!' ⚡"
        }
    },
    ecommerce: {
        name: "E-Commerce",
        icon: "🛍️",
        badge: "SHOP",
        title: "Meet DataBot 🤖 - Your E-Commerce Growth Engine!",
        subtitle: "Watch DataBot turn clicks into customers using all 10 essential tools!",
        speech: "Welcome to Online Shopping paradise! Let me show you how we turn browsers into buyers!",
        steps: {
            step1: {
                title: "PostgreSQL - The Digital Shopping Mall",
                desc: "Every click, scroll, hover creates data! 🖱️ A busy site tracks 50 MILLION events per day. Product views, cart abandonment, search queries!",
                example: "User #78234 viewed blue sneakers 7 times, added to cart twice, removed once, checked competitor prices. Buy or bounce? 🤔"
            },
            step2: {
                title: "DBeaver - The Customer Journey Mapper",
                desc: "DBeaver reveals the shopping journey! 🗺️ 'Show me all users who viewed Product X but bought Product Y instead.'",
                example: "Found 2,341 users abandoned cart at shipping page. Competitor offers free shipping. Solution: Free shipping over $50! 📦"
            },
            step3: {
                title: "Python - The Recommendation Wizard",
                desc: "Python builds the 'Customers also bought' magic! 🪄 Real-time personalization. Every user sees a store built just for them!",
                example: "'Based on your browsing: Here are 5 items you'll LOVE!' Click-through rate jumped 340%. Order value up $23! 🎯"
            },
            step4: {
                title: "AWS DMS - The Inventory Synchronizer",
                desc: "Products on Amazon, eBay, Shopify, your website! 📱 DMS keeps inventory synced in real-time. No overselling!",
                example: "Last 50 units of viral TikTok product! Sold across 4 platforms in 3 minutes. Zero oversells. Happy customers! 🎉"
            },
            step5: {
                title: "Terraform - The E-Commerce Infrastructure Builder",
                desc: "Need cloud infrastructure for shopping? Terraform builds it! 🏗️ Auto-scaling for Black Friday. No crashes!",
                example: "Building infrastructure for holiday shopping... Scaling for 50 million page views/day... Ready in 11 minutes! 🛍️"
            },
            step6: {
                title: "Redshift - The Shopping Data Warehouse",
                desc: "Redshift stores years of e-commerce data! 📦 5 years of behavior, finding cart abandonment takes 1 second!",
                example: "'Which products have highest conversion?' Found top 100 products in 0.8 seconds! Marketing optimized! 📈"
            },
            step7: {
                title: "Airflow - The Never-Sleeping Sales Assistant",
                desc: "Airflow monitors shopping behavior 24/7! ⏰ 'Update inventory! Send cart reminders! Refresh recommendations!' Never sleeps!",
                example: "Every hour - Inventory sync ✓, Daily - Recommendation refresh ✓, Alert: User #78234 cart abandoned 2 hours ago - send reminder! 🛒"
            },
            step8: {
                title: "DBT - The Commerce Translator",
                desc: "DBT transforms 'user: 78234, cart: abandoned' into 'John left $127 blue sneakers in cart, 3rd visit today, high intent buyer!' 🎭",
                example: "Customer Lifetime Value ready! User #78234 = $2,847 over 2 years. VIP customer! Offer exclusive early access! 👑"
            },
            step9: {
                title: "Metabase - The Sales Dashboard",
                desc: "Metabase shows real-time sales performance! 📊 Revenue, conversion rates, inventory status - all on one screen!",
                example: "Live dashboard: $847K today! Blue sneakers trending! Cart abandonment down 23%! Alert: Size 10 running low! 🛍️"
            },
            step10: {
                title: "Data Science - The Purchase Predictor",
                desc: "Data Science predicts who will buy! 🔍 Analyzes browsing patterns, time spent, return visits to identify hot leads!",
                example: "Predicted: User #78234 has 89% chance of purchasing within 24 hours. Send 10% discount NOW! → PURCHASED! 💰"
            }
        },
        result: {
            title: "The Conversion Kingdom! 👑",
            desc: "From guessing what customers want to knowing before they do! Rescue abandoned carts, personalize every experience!",
            before: "Why is our conversion rate only 2%?",
            beforeResult: "*Looking at basic analytics* → 'Maybe better photos?' 📸",
            after: "How do we increase sales?",
            afterResult: "*AI Insight* → 'User #78234 hesitating! Send 10% off NOW!' → PURCHASED! 💰"
        }
    },
    datascience: {
        name: "Data Science",
        icon: "📊",
        badge: "AI",
        title: "Meet DataBot 🤖 - Your Data Science Mentor!",
        subtitle: "Learn with DataBot as he transforms raw data into powerful predictions using all 10 tools!",
        speech: "Welcome to the world of Data Science! Let me show you how we turn numbers into superpowers!",
        steps: {
            step1: {
                title: "PostgreSQL - The Data Treasure Chest",
                desc: "Data Science starts with data! 📦 Customer behavior, sales trends, sensor readings - millions of records waiting to tell a story!",
                example: "10 million customer transactions, 500,000 product reviews, 2 million website clicks. All waiting to reveal hidden patterns! 🔍"
            },
            step2: {
                title: "DBeaver - The Data Explorer",
                desc: "DBeaver lets you explore and query your data! 🔎 'Show me all customers who purchased twice last month.' Understand your data first!",
                example: "Explored customer database! Found 23% of customers make repeat purchases within 30 days. Target them for loyalty program! 📋"
            },
            step3: {
                title: "Python - The Pattern Detective",
                desc: "Python is the superpower of Data Science! 🐍 Reads millions of rows, finds correlations, discovers hidden patterns humans miss!",
                example: "Analyzed 5 years of sales data! Ice cream sales spike 340% when temperature exceeds 85°F. Stocked up before heatwave! 🍦"
            },
            step4: {
                title: "AWS DMS - The Data Pipeline Builder",
                desc: "DMS moves data from various sources to your ML environment! 📦 Combine CRM, sales, and web data for complete analysis!",
                example: "Combined data from 5 systems! Now have 360° view of customer: purchases + browsing + support tickets + social! 🔗"
            },
            step5: {
                title: "Terraform - The ML Infrastructure Builder",
                desc: "Need GPUs for model training? Terraform builds ML infrastructure instantly! 🏗️ No waiting for IT provisioning!",
                example: "Building ML infrastructure... Spinning up 8 GPU servers for training... Ready in 13 minutes! 📊"
            },
            step6: {
                title: "Redshift - The Analytics Warehouse",
                desc: "Redshift stores massive datasets for analysis! 📦 10 years of data, finding patterns takes 2 seconds!",
                example: "'What's the correlation between marketing spend and sales?' Searching 5 years of data... Found 0.78 correlation! 📈"
            },
            step7: {
                title: "Airflow - The ML Pipeline Orchestrator",
                desc: "Airflow automates your ML workflow! ⏰ 'Train model daily! Update predictions! Alert if accuracy drops!' Full automation!",
                example: "Daily - Retrain model ✓, Hourly - Generate predictions ✓, Alert: Model accuracy dropped 5% - investigate data drift! 🤖"
            },
            step8: {
                title: "DBT - The Feature Store",
                desc: "DBT creates clean features for your ML models! 🎭 Transforms raw data into 'customer_lifetime_value', 'churn_probability', 'purchase_likelihood'!",
                example: "Feature Store ready! 847 features available: recency, frequency, monetary value, engagement score, sentiment! 📊"
            },
            step9: {
                title: "Metabase - The Insights Dashboard",
                desc: "Metabase visualizes your ML predictions! 📊 Model performance, prediction distributions, business impact - all visible!",
                example: "Live dashboard: Churn model at 92% accuracy! 847 customers flagged at-risk! $2.3M revenue protected! 📈"
            },
            step10: {
                title: "Machine Learning - The Prediction Engine",
                desc: "Machine Learning learns from history to predict the future! 🤖 Customer churn, demand forecasting, recommendation engines!",
                example: "ML model predicts: Customer #4521 has 87% churn probability. Offer 20% discount retention campaign NOW! 🎯"
            }
        },
        result: {
            title: "The Data Science Revolution! 🚀",
            desc: "From guessing to knowing! Predict customer behavior, optimize decisions, solve problems before they happen!",
            before: "Will customers like this new product?",
            beforeResult: "*Market research for months* → 'Maybe? 60% think so?' 🤷",
            after: "Will customers like this new product?",
            afterResult: "*ML Prediction* → '87% will love it! Target: Millennials, urban areas, launch in Q2!' 🎯"
        }
    }
};

// Current story theme
let currentStoryTheme = 'walmart';

// Select story theme
function selectStoryTheme(themeName) {
    if (!storyThemes[themeName]) return;
    
    currentStoryTheme = themeName;
    const theme = storyThemes[themeName];
    
    // Update theme card active state
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.theme === themeName) {
            card.classList.add('active');
        }
    });
    
    // Update DataBot appearance
    const databotHat = document.getElementById('databot-hat');
    const databotBadge = document.getElementById('databot-badge');
    if (databotHat) databotHat.textContent = theme.icon;
    if (databotBadge) databotBadge.textContent = theme.badge;
    
    // Update title and subtitle
    const journeyTitle = document.getElementById('journey-title');
    const journeySubtitle = document.getElementById('journey-subtitle');
    if (journeyTitle) journeyTitle.textContent = theme.title;
    if (journeySubtitle) journeySubtitle.textContent = theme.subtitle;
    
    // Update DataBot speech
    updateDatabotSpeech(theme.speech);
    
    // Update journey steps (all 10 steps)
    const steps = theme.steps;
    const stepLabels = {
        1: 'Real Scenario:',
        2: 'DBeaver reveals:',
        3: 'Python discovers:',
        4: 'DMS in action:',
        5: 'Terraform builds:',
        6: 'Redshift stores:',
        7: 'Airflow schedules:',
        8: 'DBT creates:',
        9: 'Metabase shows:',
        10: 'Data Science predicts:'
    };
    
    // Update all 10 steps dynamically
    for (let stepNum = 1; stepNum <= 10; stepNum++) {
        const stepKey = `step${stepNum}`;
        const titleEl = document.getElementById(`step${stepNum}-title`);
        const descEl = document.getElementById(`step${stepNum}-desc`);
        const exampleEl = document.getElementById(`step${stepNum}-example`);
        
        if (steps[stepKey]) {
            if (titleEl) titleEl.textContent = steps[stepKey].title;
            if (descEl) descEl.textContent = steps[stepKey].desc;
            if (exampleEl) {
                const label = stepLabels[stepNum] || 'Example:';
                exampleEl.innerHTML = `<strong>${label}</strong> "${steps[stepKey].example}"`;
            }
        }
    }
    
    // Update result card
    const result = theme.result;
    const resultTitle = document.getElementById('result-title');
    const resultDesc = document.getElementById('result-desc');
    const finalExample = document.getElementById('final-example');
    
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultDesc) resultDesc.textContent = result.desc;
    if (finalExample) {
        finalExample.innerHTML = `
            <strong>Before:</strong> "${result.before}" → ${result.beforeResult}<br>
            <strong>After:</strong> "${result.after}" → ${result.afterResult}
        `;
    }
    
    // Scroll to journey section
    const journeySection = document.getElementById('data-journey');
    if (journeySection) {
        journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    console.log(`Story theme changed to: ${themeName}`);
}

// Export functions for global access
window.enterCourse = enterCourse;
window.scrollToCourses = scrollToCourses;
window.scrollToCourseCard = scrollToCourseCard;
window.toggleMobileMenu = toggleMobileMenu;
window.openDemo = openDemo;
window.toggleThemeSelector = toggleThemeSelector;
window.setTheme = setTheme;
window.scrollToTop = scrollToTop;
window.selectStoryTheme = selectStoryTheme;
