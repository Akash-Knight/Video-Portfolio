/*
   --------------------------------------------------
   JavaScript Interactive Logic for Video Portfolio
   --------------------------------------------------
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor physics ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    let cursorX = 0, cursorY = 0; // target position
    let followerX = 0, followerY = 0; // actual position (with lag)
    
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        // Move the small dot immediately
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
    });
    
    // Smooth follower tracking (animation loop)
    function animateFollower() {
        // Linear interpolation: follower moves 15% of the distance each frame
        followerX += (cursorX - followerX) * 0.15;
        followerY += (cursorY - followerY) * 0.15;
        
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Add hover states for interactive elements
    const hoverables = document.querySelectorAll('a, button, .play-showreel-btn, .portfolio-card, .thumbnail-card, .filter-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            follower.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            follower.classList.remove('hovered');
        });
    });


    // --- 2. Header Style on Scroll ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- 3. Mobile Navigation Drawer ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // --- 5. Portfolio Category Filter ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to current
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hidden');
                } else {
                    if (item.classList.contains(filterValue)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });


    // --- 6. Fullscreen Video Lightbox Modal ---
    const videoModal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const iframeWrapper = document.getElementById('iframe-wrapper');
    const videoWrapper = document.getElementById('video-wrapper');
    const modalVideo = document.getElementById('modal-video');
    const modalClose = document.getElementById('modal-close');
    const playShowreelBtns = document.querySelectorAll('.play-showreel-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-item');
    const modalContent = document.querySelector('.modal-content');
    
    // Helper to open modal with url
    function openVideoModal(url) {
        // Reset modal content aspect ratio classes
        modalContent.classList.remove('portrait', 'landscape');
        
        if (url.endsWith('.mp4')) {
            // Local video playback
            iframeWrapper.classList.add('video-hidden');
            videoWrapper.classList.remove('video-hidden');
            modalIframe.src = '';
            
            modalVideo.src = url;
            modalVideo.load();
            
            // Detect portrait based on video filename (our standard reels)
            const isPortrait = url.includes('G12.mp4') || 
                               url.includes('G7.mp4') || 
                               url.includes('In_2.mp4') || 
                               url.includes('V6_1.mp4') || 
                               url.includes('V_1.mp4');
                               
            if (isPortrait) {
                modalContent.classList.add('portrait');
            } else {
                modalContent.classList.add('landscape');
            }
            
            modalVideo.play().catch(err => {
                console.log("Auto-play blocked, showing controls:", err);
            });
        } else {
            // External YouTube iframe playback
            videoWrapper.classList.add('video-hidden');
            iframeWrapper.classList.remove('video-hidden');
            modalVideo.src = '';
            modalVideo.load();
            
            let embedUrl = url;
            if (embedUrl.includes('youtube.com/embed/')) {
                const separator = embedUrl.includes('?') ? '&' : '?';
                embedUrl = `${embedUrl}${separator}autoplay=1&rel=0`;
            }
            modalIframe.src = embedUrl;
            modalContent.classList.add('landscape');
        }
        
        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock scroll
    }
    
    // Helper to close modal
    function closeVideoModal() {
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        modalIframe.src = ''; // Clear source to stop video playback
        modalVideo.src = ''; // Clear video source
        modalVideo.load();
        document.body.style.overflow = ''; // Unlock scroll
    }
    
    // Bind Showreel Buttons (opens default cinematic reel)
    playShowreelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openVideoModal('assets/optimized/Eng_3.mp4');
        });
    });
    
    // Bind Portfolio Item Card clicks
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoUrl = card.getAttribute('data-video-url');
            if (videoUrl) {
                openVideoModal(videoUrl);
            }
        });
    });

    // --- 6.1 Dynamic Hover Video Previews ---
    const imgContainers = document.querySelectorAll('.portfolio-img-container');
    imgContainers.forEach(container => {
        const card = container.closest('.portfolio-item');
        if (!card) return;
        
        const previewUrl = card.getAttribute('data-preview-url');
        if (!previewUrl) return;

        let hoverVideo = null;
        let playTimeout = null;

        card.addEventListener('mouseenter', () => {
            // 150ms debounce prevents video loading during fast-scrolling
            playTimeout = setTimeout(() => {
                hoverVideo = document.createElement('video');
                hoverVideo.className = 'hover-video';
                hoverVideo.muted = true;
                hoverVideo.loop = true;
                hoverVideo.playsinline = true;
                hoverVideo.setAttribute('preload', 'auto');
                
                const source = document.createElement('source');
                source.src = previewUrl;
                source.type = 'video/mp4';
                hoverVideo.appendChild(source);
                
                container.appendChild(hoverVideo);
                
                hoverVideo.addEventListener('playing', () => {
                    hoverVideo.classList.add('playing');
                });
                
                hoverVideo.play().catch(err => {
                    console.log("Hover video play error:", err);
                });
            }, 150);
        });

        card.addEventListener('mouseleave', () => {
            if (playTimeout) {
                clearTimeout(playTimeout);
                playTimeout = null;
            }
            if (hoverVideo) {
                const videoToDestroy = hoverVideo;
                hoverVideo = null;
                videoToDestroy.classList.remove('playing');
                videoToDestroy.pause();
                
                // Allow transition to complete before removing from DOM
                setTimeout(() => {
                    videoToDestroy.remove();
                }, 300);
            }
        });
    });
    
    // Close triggers
    modalClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
        // Close if click is outside the modal content container
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });


    // --- 8. Contact Form Client-side Submission (EmailJS Integration) ---
    // Initialize EmailJS with your Public Key
    emailjs.init("MCMZqb4dIcxqwYyH2");

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('form-submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            // Visual loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending Message... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>';
            formStatus.className = 'form-status';
            formStatus.textContent = '';
            
            // TODO: Replace these placeholders with your actual EmailJS credentials
            const serviceID = "service_rfj3i57";   // Put your Service ID here
            const templateID = "template_blqcy0d"; // Put your Template ID here
            
            emailjs.sendForm(serviceID, templateID, contactForm)
                .then(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    const name = document.getElementById('name').value;
                    
                    // Form Success Visual Response
                    formStatus.classList.add('success');
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your inquiry has been sent. I'll get back to you within 24 hours.`;
                    
                    // Reset form inputs
                    contactForm.reset();
                    
                    // Clear success message after 6 seconds
                    setTimeout(() => {
                        formStatus.style.opacity = '0';
                        formStatus.style.transition = 'opacity 1s ease';
                        setTimeout(() => {
                            formStatus.innerHTML = '';
                            formStatus.style.opacity = '1';
                        }, 1000);
                    }, 5000);
                }, (error) => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    // Form Error Visual Response
                    formStatus.classList.add('error');
                    formStatus.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Oops! Something went wrong. Please try again later.`;
                    console.error("EmailJS Error:", error);
                });
        });
    }



});
