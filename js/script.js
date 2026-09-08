(() => {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.site-nav');
    const links = [...document.querySelectorAll('.site-nav a')];
    const sections = [...document.querySelectorAll('main section')];

    function initHeader() {
        const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    function initMobileMenu() {
        if (!menuToggle || !menu) return;

        menuToggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        });

        links.forEach(link => link.addEventListener('click', () => {
            menu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Abrir menu');
        }));
    }

    function initSectionObserver() {
        if (!sections.length || !links.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
                }
            });
        }, { threshold: 0.35 });

        sections.forEach(section => observer.observe(section));
    }

    function initAnimations() {
        const revealItems = document.querySelectorAll('.reveal');
        if (!revealItems.length) return;

        const observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        }), { threshold: 0.12 });

        revealItems.forEach(element => observer.observe(element));
    }

    function initInfiniteCarousel() {
        const carousel = document.querySelector('.services-carousel');
        const track = document.querySelector('.services-track');

        if (!carousel || !track) return;

        const services = [
            {
                title: 'Adultos',
                image: 'assets/adultos.jpg',
                description: 'Exames personalizados com base no seu perfil e histórico de saúde, organizados de forma ágil para otimizar seu tempo e entregar resultados com rapidez.',
                button: 'Pré-checkup'
            },
            {
                title: 'Saúde da mulher',
                image: 'assets/saude-mulher.jpg',
                description: 'Cuidado preventivo e acompanhamento especializado para diferentes fases da saúde da mulher.',
                button: 'Pré-agendamento'
            },
            {
                title: 'Internacional',
                image: 'assets/internacional.jpg',
                description: 'Atendimento e acompanhamento para pessoas que necessitam de suporte em saúde durante sua permanência ou deslocamento internacional.',
                button: 'Pré-agendamento'
            },
            {
                title: 'Prevenção',
                image: 'assets/adultos.jpg',
                description: 'Estratégias personalizadas para detectar riscos precocemente e manter seu cuidado em dia com acompanhamento constante.',
                button: 'Pré-agendamento'
            },
            {
                title: 'Check-up',
                image: 'assets/saude-mulher.jpg',
                description: 'Avaliação completa com foco em prevenção, diagnóstico e orientação para uma rotina de saúde mais segura.',
                button: 'Pré-checkup'
            }
        ];

        const repeatedCards = [...services, ...services, ...services];

        const buildCard = (service) => {
            const article = document.createElement('article');
            article.className = 'service-card';
            article.innerHTML = `
                <img src="${service.image}" alt="${service.title}" loading="lazy">
                <div class="service-title">${service.title}</div>
                <div class="service-overlay">
                    <div class="service-content">
                        <h3>${service.title}</h3>
                        <p>${service.description}</p>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSeRDCTIMWvcsbYafsQsEGWKdosYG_bjASQQwLjuIg9ENn1oWQ/viewform?pli=1" class="service-button" target="_blank">${service.button}</a>
                    </div>
                </div>
            `;
            return article;
        };

        repeatedCards.forEach(service => track.appendChild(buildCard(service)));

        let offset = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartOffset = 0;
        let pointerMoved = false;
        let shouldBlockClick = false;

        const getStep = () => {
            const firstCard = track.querySelector('.service-card');
            if (!firstCard) return 0;
            const gap = parseFloat(getComputedStyle(track).gap || getComputedStyle(track).columnGap || 0) || 0;
            return firstCard.getBoundingClientRect().width + gap;
        };

        const setTransform = (nextOffset) => {
            offset = nextOffset;
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        };

        const normalizeOffset = () => {
            const step = getStep();
            const startOfMiddle = step * services.length;
            const endOfMiddle = startOfMiddle + (step * services.length);

            if (offset < startOfMiddle - step) {
                offset += step * services.length;
            }

            if (offset > endOfMiddle) {
                offset -= step * services.length;
            }

            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        };

        const resetToMiddle = () => {
            const step = getStep();
            setTransform(step * services.length);
        };

        const handleWheel = event => {
            if (!carousel.contains(event.target)) return;

            event.preventDefault();
            const delta = event.deltaY || event.deltaX;
            if (!delta) return;

            const nextOffset = offset + delta * 0.9;
            setTransform(nextOffset);
            normalizeOffset();
        };

        const finishDrag = () => {
            isDragging = false;
            carousel.classList.remove('is-dragging');
            pointerMoved = false;
            shouldBlockClick = false;
        };

        const beginDrag = (clientX) => {
            isDragging = true;
            dragStartX = clientX;
            dragStartOffset = offset;
            pointerMoved = false;
            shouldBlockClick = false;
            carousel.classList.add('is-dragging');
        };

        const moveDrag = (clientX) => {
            if (!isDragging) return;

            const distance = clientX - dragStartX;
            if (Math.abs(distance) > 4) {
                pointerMoved = true;
            }

            if (Math.abs(distance) > 10) {
                shouldBlockClick = true;
            }

            setTransform(dragStartOffset - distance);
            normalizeOffset();
        };

        carousel.addEventListener('pointerdown', event => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            beginDrag(event.clientX);
            if (typeof carousel.setPointerCapture === 'function' && Number.isInteger(event.pointerId)) {
                try {
                    carousel.setPointerCapture(event.pointerId);
                } catch (error) {
                    // Some synthetic or browser-specific pointer sequences do not expose a valid capture target.
                }
            }
        });

        carousel.addEventListener('pointermove', event => moveDrag(event.clientX));
        carousel.addEventListener('pointerup', finishDrag);
        carousel.addEventListener('pointerleave', finishDrag);
        carousel.addEventListener('pointercancel', finishDrag);

        carousel.addEventListener('touchstart', event => {
            if (event.touches.length) {
                beginDrag(event.touches[0].clientX);
            }
        }, { passive: true });

        carousel.addEventListener('touchmove', event => {
            if (!isDragging || !event.touches.length) return;
            event.preventDefault();
            moveDrag(event.touches[0].clientX);
        }, { passive: false });

        carousel.addEventListener('touchend', finishDrag, { passive: true });
        carousel.addEventListener('touchcancel', finishDrag, { passive: true });

        carousel.addEventListener('wheel', handleWheel, { passive: false });

        carousel.addEventListener('click', event => {
            const button = event.target.closest('.service-button');
            if (button && shouldBlockClick) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            if (window.matchMedia('(pointer: coarse)').matches) {
                const card = event.target.closest('.service-card');
                if (card && !button) {
                    card.classList.toggle('is-open');
                }
            }
        });

        window.addEventListener('resize', () => {
            const step = getStep();
            offset = Math.max(step * (services.length - 1), Math.min(offset, step * (services.length * 2 + 1)));
            resetToMiddle();
        });

        resetToMiddle();
    }

    initHeader();
    initMobileMenu();
    initSectionObserver();
    initAnimations();
    initInfiniteCarousel();
})();