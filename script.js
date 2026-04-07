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



});
