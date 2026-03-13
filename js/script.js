
document.addEventListener('DOMContentLoaded', function() {
    const background = document.querySelector('.background-animation');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const codeSnippets = [
        "if (item == null) return NotFound();",
        "var produto = produtos.FirstOrDefault(p => p.Id == id);",
        "if (!ModelState.IsValid) return BadRequest(ModelState);",
        "await _context.SaveChangesAsync();",
        "return Ok(resultado);",
        "if (usuario == null) return Forbid();",
        "var dto = await _service.GetAsync(id);",
        "if (!string.IsNullOrEmpty(nome)) Buscar(nome);",
        "return _mapper.Map<Dto>(entidade);",
        "if (senha != confirmacao) return BadRequest();",
    ];

    const csharpColors = [
        '#512BD4',
        '#007ACC',
        '#8A2BE2',
        '#4F8EF7',
        '#9B4DFF',
    ];

    const blocks = [];
    const maxBlocks = prefersReducedMotion ? 8 : 20;
    const blockInterval = prefersReducedMotion ? 3000 : 1200;

    const codeToggle = document.getElementById('codeToggle');
    const storedCodeEnabled = localStorage.getItem('codeBlocksEnabled');
    // Sempre iniciar desabilitado em mobile (mesmo que já tenha sido habilitado antes)
    let codeBlocksEnabled = isMobile ? false : (storedCodeEnabled === null ? true : storedCodeEnabled === 'true');

    const setCodeToggle = (enabled) => {
        codeBlocksEnabled = enabled;
        if (codeToggle) {
            codeToggle.textContent = enabled ? '🧩' : '🚫';
            codeToggle.setAttribute('aria-pressed', String(enabled));
        }
        localStorage.setItem('codeBlocksEnabled', String(enabled));
        if (!enabled) {
            blocks.forEach(b => b.el.remove());
            blocks.length = 0;
        }
    };

    if (codeToggle) {
        codeToggle.addEventListener('click', () => setCodeToggle(!codeBlocksEnabled));
    }


    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.dataset.theme = savedTheme;
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
        themeToggle.addEventListener('click', () => {
            const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
            document.body.dataset.theme = nextTheme;
            localStorage.setItem('theme', nextTheme);
            themeToggle.textContent = nextTheme === 'light' ? '☀️' : '🌙';
        });
    }

    function createCodeBlock() {
        const block = document.createElement('div');
        block.classList.add('code-block');

        const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        block.textContent = snippet;

        const color = csharpColors[Math.floor(Math.random() * csharpColors.length)];
        block.style.border = `1px solid ${color}`;
        block.style.color = color;


        background.appendChild(block);

        const rect = block.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const x = Math.random() * Math.max(0, window.innerWidth - width);
        const y = (window.innerHeight * 0.25) + Math.random() * (window.innerHeight * 0.15); 

        const vx = prefersReducedMotion ? 0 : (Math.random() - 0.5) * 80; 
        const vy = prefersReducedMotion ? 0 : 80 + Math.random() * 80;
        const rot = Math.random() * 360;
        const vrot = prefersReducedMotion ? 0 : (Math.random() - 0.5) * 180; 

        blocks.push({ el: block, x, y, vx, vy, rot, vrot, w: width, h: height });
    }

    function updateBlocks(dt) {
        for (let i = blocks.length - 1; i >= 0; i--) {
            const b = blocks[i];

            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.rot += b.vrot * dt;

          
            if (b.x < 0) {
                b.x = 0;
                b.vx *= -0.6;
            }
            if (b.x + b.w > window.innerWidth) {
                b.x = window.innerWidth - b.w;
                b.vx *= -0.6;
            }

            b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.rot}deg)`;
            b.el.style.opacity = Math.max(0, 1 - (b.y / (window.innerHeight + b.h)));

            if (b.y > window.innerHeight + b.h) {
                b.el.remove();
                blocks.splice(i, 1);
            }
        }
    }

    let lastTime = null;
    function tick(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        updateBlocks(dt);
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

    const initialCount = prefersReducedMotion ? 4 : 10;
    for (let i = 0; i < initialCount; i++) {
        setTimeout(() => createCodeBlock(), i * 300);
    }

    if (!prefersReducedMotion) {
        setInterval(() => {
            if (codeBlocksEnabled && blocks.length < maxBlocks) createCodeBlock();
        }, blockInterval);
    }
    

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }


            const nav = document.querySelector('.navbar');
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
            }
        });
    });

    const navToggle = document.querySelector('.navbar-toggle');
    const nav = document.querySelector('.navbar');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }
});