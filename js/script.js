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

    function initPartnersMarquee() {
        const PARTNERS_SPEED = 15;

        const partnerConfig = [
            { name: 'Sr. Vinícius Pires', image: 'assets/viniciusbruno 1 (1).png', alt: 'Sr. Vinícius Pires', type: 'professional', specialty: 'Especialista em Exames Médicos e Anamnese' },
            { name: 'Dra. Maria Ap. Freitas', image: 'assets/mariaaparecida 1.png', alt: 'Dra. Maria Ap. Freitas', type: 'professional', specialty: 'Fonoaudióloga' },
            { name: 'Dr. Euler Kernbichler', image: 'assets/eulerkenrbichler 1.png', alt: 'Dr. Euler Kernbichler', type: 'professional', specialty: 'Pediatra e Neonatologista' },
            { name: 'Dra. Mariana Lima', image: 'assets/marianalima 1.png', alt: 'Dra. Mariana Lima', type: 'professional', specialty: 'Fisioterapeuta' },
            { name: 'Dra. Marcia Arizono', image: 'assets/marciaarizono 1.png', alt: 'Dra. Marcia Arizono', type: 'professional', specialty: 'Ginecologista e Obstetra' },
            { name: 'Dr. Alessio C. Mathias', image: 'assets/alessiomathias 1.png', alt: 'Dr. Alessio C. Mathias', type: 'professional', specialty: 'Medicina Esportiva' },
            { name: 'Sympor', image: 'assets/sympor.png', alt: 'Sympor', type: 'professional', specialty: 'Soroterapia e Terapias Injetáveis' },
            { name: 'Hosp. Sírio Libanês', image: 'assets/siriolibanes 1.png', alt: 'Hospital Sírio Libanês', type: 'professional', specialty: 'Laboratórios, Diagnósticos e Oncologia' },
            { name: 'Enjoy Institute', image: 'assets/enjoie.png', alt: 'Enjoy Institute', type: 'professional', specialty: 'Medicina Esportiva, Longevidade e Estética' }
        ];

        const forwardTrack = document.getElementById('partners-track-forward');
        const reverseTrack = document.getElementById('partners-track-reverse');

        if (!forwardTrack || !reverseTrack) return;

        const buildPartnerCard = (partner) => {
            const article = document.createElement('article');
            article.className = 'partner-item';
            const specialtyMarkup = partner.specialty
                ? `<span class="partner-specialty">${partner.specialty}</span>`
                : '<span class="partner-specialty" aria-hidden="true"></span>';

            article.innerHTML = `
                <div class="partner-image-wrap">
                    <img src="${partner.image}" alt="${partner.alt}" loading="lazy" class="${partner.type === 'institutional' ? 'partner-logo' : 'partner-photo'}">
                </div>
                <div class="partner-copy">
                    <strong class="partner-name">${partner.name}</strong>
                    ${specialtyMarkup}
                </div>
            `;
            return article;
        };

        const buildSequence = (items) => {
            const sequence = document.createElement('div');
            sequence.className = 'partners-sequence';
            items.forEach(partner => sequence.appendChild(buildPartnerCard(partner)));
            return sequence;
        };

        const firstSequence = buildSequence(partnerConfig);
        const secondSequence = buildSequence(partnerConfig);

        forwardTrack.appendChild(firstSequence);
        forwardTrack.appendChild(secondSequence.cloneNode(true));

        const reverseFirstSequence = buildSequence(partnerConfig);
        const reverseSecondSequence = buildSequence(partnerConfig);

        reverseTrack.appendChild(reverseFirstSequence);
        reverseTrack.appendChild(reverseSecondSequence);

        const normalizePartnerCards = () => {
            document.querySelectorAll('#parceiros .partner-item').forEach(item => {
                item.style.width = '150px';
                item.style.minWidth = '150px';
                item.style.height = '200px';
                item.style.display = 'flex';
                item.style.flexDirection = 'column';
                item.style.alignItems = 'center';
                item.style.justifyContent = 'flex-start';
                item.style.textAlign = 'center';
                item.style.gap = '10px';
                item.style.padding = '12px 8px 8px';
                item.style.flexShrink = '0';
                item.style.overflow = 'hidden';

                const imageWrap = item.querySelector('.partner-image-wrap');
                if (imageWrap) {
                    imageWrap.style.width = '72px';
                    imageWrap.style.height = '72px';
                    imageWrap.style.display = 'flex';
                    imageWrap.style.alignItems = 'center';
                    imageWrap.style.justifyContent = 'center';
                    imageWrap.style.overflow = 'hidden';
                    imageWrap.style.borderRadius = '50%';
                }

                const copy = item.querySelector('.partner-copy');
                if (copy) {
                    copy.style.width = '100%';
                    copy.style.height = '100px';
                    copy.style.display = 'flex';
                    copy.style.flexDirection = 'column';
                    copy.style.alignItems = 'center';
                    copy.style.justifyContent = 'flex-start';
                    copy.style.textAlign = 'center';
                    copy.style.gap = '8px';
                    copy.style.overflow = 'hidden';
                }

                const name = item.querySelector('.partner-name');
                if (name) {
                    name.style.width = '100%';
                    name.style.minHeight = '42px';
                    name.style.display = 'flex';
                    name.style.alignItems = 'center';
                    name.style.justifyContent = 'center';
                    name.style.lineHeight = '1.3';
                }

                const specialty = item.querySelector('.partner-specialty');
                if (specialty) {
                    specialty.style.width = '100%';
                    specialty.style.minHeight = '48px';
                    specialty.style.display = 'flex';
                    specialty.style.alignItems = 'center';
                    specialty.style.justifyContent = 'center';
                    specialty.style.lineHeight = '1.35';
                    specialty.style.overflow = 'hidden';
                }
            });
        };

        normalizePartnerCards();

        forwardTrack.classList.add('partners-track-right');
        reverseTrack.classList.add('partners-track-left');

        const applyPartnersSpeed = () => {
            const tracks = [forwardTrack, reverseTrack];

            tracks.forEach(track => {
                const sequence = track.querySelector('.partners-sequence');
                if (!sequence) return;

                const sequenceWidth = sequence.getBoundingClientRect().width;
                const duration = sequenceWidth / PARTNERS_SPEED;
                track.style.setProperty('--partners-duration', `${duration.toFixed(2)}s`);
            });
        };

        applyPartnersSpeed();
        window.addEventListener('load', applyPartnersSpeed, { once: true });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(applyPartnersSpeed, 80);
        });
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
                image: 'assets/prevencao.jpg',
                description: 'Estratégias personalizadas para detectar riscos precocemente e manter seu cuidado em dia com acompanhamento constante.',
                button: 'Pré-agendamento'
            },
            {
                title: 'Check-up',
                image: 'assets/checkup.jpg',
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
    initPartnersMarquee();
    initInfiniteCarousel();
})();