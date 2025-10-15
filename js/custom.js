(function() {
    function animateCounters() {
        const counters = document.querySelectorAll('.number[data-number]');
        if (!counters.length) {
            return;
        }

        function animateCounter(el) {
            const target = Number(el.dataset.number || 0);
            const duration = 1500;
            let start = 0;
            const step = target / (duration / 16);

            function update() {
                start += step;
                if (start < target) {
                    el.textContent = Math.floor(start);
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target.toLocaleString();
                }
            }
            update();
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => {
            counter.textContent = '0';
            observer.observe(counter);
        });
    }

    function setupBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) {
            return;
        }
        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });
        btn.addEventListener('click', event => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function fillProgressBars() {
        const progressBars = document.querySelectorAll('.proficiency-item .progress-bar');
        if (!progressBars.length) {
            return;
        }

        const applyWidth = () => {
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width') || bar.getAttribute('aria-valuenow') || 0;
                bar.style.width = width + '%';
            });
        };

        if ('IntersectionObserver' in window) {
            const target = document.querySelector('.proficiency-wrap') || document.body;
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        applyWidth();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.3 });
            if (target) {
                observer.observe(target);
            }
        } else {
            applyWidth();
        }
    }

    function initParticles() {
        if (typeof particlesJS === 'undefined') {
            return;
        }
        const targets = ['particles-home', 'particles-about'];
        const config = {
            particles: {
                number: { value: 80 },
                size: { value: 2 },
                move: { speed: 2 },
                color: { value: '#ffffff' },
                line_linked: { enable: true, color: '#ffffff' }
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: 'repulse' }
                }
            }
        };

        targets.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                particlesJS(id, config);
            }
        });
    }

    function setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) {
            return;
        }
        const messageEl = document.getElementById('formMessage');
        form.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            })
                .then(response => {
                    if (response.ok) {
                        if (messageEl) {
                            messageEl.textContent = 'Thank you! Your message has been sent.';
                        }
                        form.reset();
                    } else if (messageEl) {
                        messageEl.textContent = 'Oops! Something went wrong.';
                    }
                })
                .catch(() => {
                    if (messageEl) {
                        messageEl.textContent = 'Oops! Something went wrong.';
                    }
                });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        animateCounters();
        setupBackToTop();
        fillProgressBars();
        setupContactForm();
        initParticles();
    });
})();
