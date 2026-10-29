// ==========================================================================
// Dr. T.V.G. Shri Prakash - Portfolio JavaScript
// Interactive features: Search, Filters, Citations, Theme, BibTeX Modal
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initWelcomeScreen();
  initTheme();
  initMobileMenu();
  initScrollProgressBar();
  initGraphTheoryCanvas();
  initScrollReveal();
  initCounterAnimation();
  initExperienceFilter();
  initPublicationsSearchAndFilter();
  initCitationButtons();
  initBibtexModal();
  initAiPaperExplainer();
  initAiChatBot();
  initScrollSpy();
  updateFooterYear();
});

// --------------------------------------------------------------------------
// 1. Theme Toggle (Light / Dark Mode)
// --------------------------------------------------------------------------
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('tvg_portfolio_theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('tvg_portfolio_theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');
  if (!icon) return;

  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// --------------------------------------------------------------------------
// 2. Mobile Menu
// --------------------------------------------------------------------------
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = navMenu.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

// --------------------------------------------------------------------------
// 3. Experience Timeline Filters
// --------------------------------------------------------------------------
function initExperienceFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!filterBtns.length || !timelineItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-exp-filter');

      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

// --------------------------------------------------------------------------
// 4. Publications Search & Category Tabs
// --------------------------------------------------------------------------
function initPublicationsSearchAndFilter() {
  const searchInput = document.getElementById('pubSearchInput');
  const clearBtn = document.getElementById('clearPubSearch');
  const categoryTabs = document.querySelectorAll('.pub-tab');
  const pubCards = document.querySelectorAll('.pub-card');
  const noResults = document.getElementById('noPubResults');
  const resetBtn = document.getElementById('resetPubSearch');

  if (!pubCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    let visibleCount = 0;

    pubCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = card.querySelector('.pub-title')?.textContent.toLowerCase() || '';
      const authors = card.querySelector('.pub-authors')?.textContent.toLowerCase() || '';
      const journal = card.querySelector('.pub-journal')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = !searchTerm || 
        title.includes(searchTerm) || 
        authors.includes(searchTerm) || 
        journal.includes(searchTerm) || 
        keywords.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }

    if (clearBtn) {
      clearBtn.style.display = searchTerm.length > 0 ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchTerm = '';
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchTerm = '';
      activeCategory = 'all';
      categoryTabs.forEach(t => t.classList.remove('active'));
      const allTab = document.querySelector('.pub-tab[data-filter="all"]');
      if (allTab) allTab.classList.add('active');
      applyFilters();
    });
  }
}

// --------------------------------------------------------------------------
// 5. One-Click Citation Copying
// --------------------------------------------------------------------------
function initCitationButtons() {
  const copyBtns = document.querySelectorAll('.copy-citation-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const citation = btn.getAttribute('data-citation');
      if (!citation) return;

      copyTextToClipboard(citation, () => {
        showToast('Citation copied to clipboard!');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      });
    });
  });
}

// --------------------------------------------------------------------------
// 6. BibTeX Modal
// --------------------------------------------------------------------------
function initBibtexModal() {
  const modal = document.getElementById('bibtexModal');
  const codeElem = document.getElementById('bibtexContent');
  const copyBtn = document.getElementById('copyBibtexBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const dismissBtn = document.getElementById('dismissModalBtn');
  const overlay = document.getElementById('modalOverlay');

  if (!modal || !codeElem) return;

  function openModal(bibtex) {
    codeElem.textContent = bibtex;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.bibtex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bibtex = btn.getAttribute('data-bibtex');
      if (bibtex) openModal(bibtex);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyTextToClipboard(codeElem.textContent, () => {
        showToast('BibTeX citation copied!');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy BibTeX';
        }, 2000);
      });
    });
  }
}

// --------------------------------------------------------------------------
// 7. Clipboard & Toast Utility
// --------------------------------------------------------------------------
function copyTextToClipboard(text, callback) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(callback).catch(() => fallbackCopy(text, callback));
  } else {
    fallbackCopy(text, callback);
  }
}

function fallbackCopy(text, callback) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    if (callback) callback();
  } catch (err) {
    console.error('Fallback copy error:', err);
  }
  document.body.removeChild(textArea);
}

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// --------------------------------------------------------------------------
// 8. Contact Form Handler (Opens Mail Client)
// --------------------------------------------------------------------------
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('senderName')?.value || '';
  const email = document.getElementById('senderEmail')?.value || '';
  const subject = document.getElementById('subjectSelect')?.value || 'Academic Inquiry';
  const message = document.getElementById('senderMessage')?.value || '';

  const bodyContent = `Dear Dr. T.V.G. Shri Prakash,

${message}

Warm regards,
${name}
Email: ${email}`;
  const mailtoLink = `mailto:tvgshri@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(bodyContent)}`;

  showToast('Opening default email application...');
  window.location.href = mailtoLink;
}

// --------------------------------------------------------------------------
// 9. Scroll Spy & Scroll To Top
// --------------------------------------------------------------------------
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function updateFooterYear() {
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}


// --------------------------------------------------------------------------
// 10. Scroll Progress Bar
// --------------------------------------------------------------------------
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.pageYOffset / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

// --------------------------------------------------------------------------
// 11. Interactive Mathematical Graph Theory Canvas
// Visualizes vertices (nodes) and edges (connections) in the hero section
// --------------------------------------------------------------------------
function initGraphTheoryCanvas() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  const resizeHandler = () => {
    if (!canvas) return;
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  };

  window.addEventListener('resize', resizeHandler);

  // Nodes generator
  const nodeCount = Math.min(Math.floor((width * height) / 18000), 40);
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.5 + 2,
      baseAlpha: Math.random() * 0.4 + 0.3
    });
  }

  // Mouse interaction
  let mouse = { x: -1000, y: -1000, active: false };
  const heroSection = document.getElementById('hero');

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
  }

  function getThemeColors() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    return {
      nodeColor: isDark ? 'rgba(147, 197, 253, ' : 'rgba(59, 130, 246, ',
      edgeColor: isDark ? 'rgba(196, 181, 253, ' : 'rgba(139, 92, 246, '
    };
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const colors = getThemeColors();

    // Update & Draw Nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      // Bounce boundaries
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Mouse gentle repulsion/attraction
      if (mouse.active) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          n.x += dx * 0.012;
          n.y += dy * 0.012;
        }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${colors.nodeColor}${n.baseAlpha})`;
      ctx.fill();

      // Connect with nearby vertices (Graph edges)
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 125) {
          const edgeAlpha = (1 - dist / 125) * 0.35;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `${colors.edgeColor}${edgeAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connect to mouse if active
      if (mouse.active) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const mouseAlpha = (1 - dist / 130) * 0.45;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `${colors.nodeColor}${mouseAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// --------------------------------------------------------------------------
// 12. Animated Numbers Counting Up
// --------------------------------------------------------------------------
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(elem => {
          const target = parseInt(elem.getAttribute('data-target'), 10);
          const hasPlus = elem.innerHTML.includes('+');
          let current = 0;
          const duration = 1400; // ms
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            current = Math.floor(easedProgress * target);

            elem.innerHTML = `${current}${hasPlus ? '<small>+</small>' : ''}`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              elem.innerHTML = `${target}${hasPlus ? '<small>+</small>' : ''}`;
            }
          }

          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }
}

// --------------------------------------------------------------------------
// 13. Smooth Scroll Reveal on Elements
// --------------------------------------------------------------------------
function initScrollReveal() {
  const selectors = [
    '.section-header',
    '.about-card',
    '.timeline-item',
    '.pub-card',
    '.course-card',
    '.edu-card',
    '.conf-item',
    '.contact-info-card',
    '.contact-form-card'
  ];

  const elementsToReveal = document.querySelectorAll(selectors.join(', '));
  elementsToReveal.forEach((el, index) => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elementsToReveal.forEach(el => revealObserver.observe(el));
}


// --------------------------------------------------------------------------
// 14. AI Research Paper Explainer (Plain-English Layman Summaries)
// --------------------------------------------------------------------------
const paperExplanations = {
  'paper-1': {
    title: 'Colouring of S-Valued Graphs',
    authors: 'Dr. T.V.G. Shri Prakash & Dr. M. Chandramouleeswaran (IJPAM, 2017)',
    plainEnglish: 'Imagine assigning colors or frequencies to nodes in a communications network where both nodes and connection lines carry special numerical values (from an algebraic semiring S). This paper develops mathematical rules ensuring that no two directly linked nodes end up with clashing colors while respecting their algebraic values.',
    breakthrough: 'Established foundational theorems governing valid vertex partitionability and color existence on graphs evaluated over general semirings.',
    applications: 'Wireless channel allocation, conflict-free timetable scheduling, and distributed computing network coordination.'
  },
  'paper-2': {
    title: 'K-Colourable on S-Valued Graphs',
    authors: 'Dr. T.V.G. Shri Prakash & Dr. M. Chandramouleeswaran (IJMSEA, 2017)',
    plainEnglish: 'Determines the exact minimum number k of distinct colors needed to paint a network so that adjacent nodes always differ under semiring weights.',
    breakthrough: 'Defined algebraic boundary valuations for k-partite decomposition and chromatic boundedness.',
    applications: 'CPU register allocation during software compilation, scheduling parallel processing cores, and frequency reuse.'
  },
  'paper-3': {
    title: 'Chromatic Number of Some S-Valued Graphs',
    authors: 'Dr. T.V.G. Shri Prakash & Dr. M. Chandramouleeswaran (IJESI, 2017)',
    plainEnglish: 'Calculates the exact chromatic numbers for fundamental graph families such as wheel graphs, cyclic rings, and bipartite lattices when weights take values from semiring algebraic structures.',
    breakthrough: 'Provided closed-form formulas for chromatic invariant \u03c7(G) across standard mathematical topologies.',
    applications: 'Integrated circuit design, structured data center topology planning, and network routing.'
  },
  'paper-4': {
    title: 'Critical Graphs of S-Valued Graphs',
    authors: 'Dr. T.V.G. Shri Prakash & Dr. M. Chandramouleeswaran (IJCAR, 2017)',
    plainEnglish: 'Analyzes \'critical\' networks?structures so sensitive that removing even a single node or connecting edge immediately drops their coloring difficulty.',
    breakthrough: 'Formulated minimal invariant properties and edge-deletion chromatic thresholds under semiring valuations.',
    applications: 'Vulnerability and bottleneck detection in critical infrastructure like power grids and internet backbones.'
  },
  'paper-5': {
    title: 'Edge Coloring of S-Valued Graphs',
    authors: 'Dr. T.V.G. Shri Prakash & Dr. M. Chandramouleeswaran (ICADM\x2718 Proceedings, 2018)',
    plainEnglish: 'Instead of coloring vertices, this paper focuses on coloring the connecting pathways (edges) so that no single node touches two pathways sharing the same color.',
    breakthrough: 'Formalized edge chromatic index \u03c7\x27(G) for networks weighted by semirings.',
    applications: 'Fiber-optic wavelength division multiplexing (WDM), collision-free scheduling, and high-speed packet routing.'
  },
  'paper-6': {
    title: 'Line Graph of S-Valued Graphs',
    authors: 'Dr. T.V.G. Shri Prakash & Dr. M. Chandramouleeswaran (IJMSEA, 2018)',
    plainEnglish: 'Transforms the complex problem of edge colorings into vertex colorings by constructing dual \'line graphs\' L(G) where lines in the original graph become nodes in the new graph.',
    breakthrough: 'Demonstrated isomorphism preserving semiring valuations across topological transformations.',
    applications: 'Dual graph modeling, transportation traffic flow optimization, and graph neural network representations.'
  },
  'paper-7': {
    title: 'Vizing\x27s Theorem for S-Valued Graphs',
    authors: 'Dr. T.V.G. Shri Prakash & Dr. M. Chandramouleeswaran (IJTRD, 2018)',
    plainEnglish: 'Proves a generalized version of mathematician Vadim Vizing\x27s celebrated Edge Coloring Theorem in the modern setting of semiring-weighted graphs.',
    breakthrough: 'Proved the tight theoretical upper bound showing chromatic index never exceeds maximum degree \u0394 plus semiring algebraic offsets.',
    applications: 'Telecommunication network design, switch fabric optimization, and theoretical algorithm complexity bounds.'
  },
  'paper-8': {
    title: 'The Triple Almost Lacunary 3 \u0393 Spaces Sequence Defined by a Modulus Function',
    authors: 'Research Contribution (IJAER, 2015)',
    plainEnglish: 'Investigates 3-dimensional infinite sequences of numbers with sparse, widening gaps (lacunary intervals) using a modulus function to measure convergence.',
    breakthrough: 'Formulated topological vector space completeness and dual spaces for 3D generalized lacunary spaces.',
    applications: 'Digital signal processing, multi-dimensional time series forecasting, and wavelet data compression.'
  },
  'paper-9': {
    title: 'The Strongly Generalized Triple Difference \u0393\u00b3 Sequence Spaces Defined by a Modulus',
    authors: 'Research Contribution (Mathematica Moravica, 2016)',
    plainEnglish: 'Analyzes how multi-dimensional rates of change (difference operators) behave over triple mathematical sequences.',
    breakthrough: 'Proved seminorm convergence criteria and structural completeness for higher-order sequence spaces.',
    applications: 'Numerical discretization of differential equations, dynamical systems modeling, and scientific computing.'
  },
  'paper-10': {
    title: 'The Random of Lacunary Statistical on \u0393\u00b3 Over P-Metric Spaces Defined by Musielak-Orlicz Functions',
    authors: 'Research Contribution (Modern Applied Science, CCSE Canada, 2016)',
    plainEnglish: 'Studies random variable sequences in metric spaces where distances are probabilistic (stochastic) rather than rigid numbers.',
    breakthrough: 'Unified Musielak-Orlicz convergence conditions with probabilistic statistical convergence.',
    applications: 'Financial risk modeling, stochastic simulations, and machine learning error distribution analysis.'
  },
  'paper-11': {
    title: 'Lacunary Triple Sequence 3 of Fibonacci Numbers over Probabilistic p-Metric Spaces',
    authors: 'Research Contribution (IOSR Journal of Mathematics, 2016)',
    plainEnglish: 'Explores how Fibonacci numbers (1, 1, 2, 3, 5, 8...) behave across three-dimensional probabilistic metric spaces with widening lacunary gaps.',
    breakthrough: 'Discovered asymptotic lacunary convergence density for Fibonacci-generated sequence triples.',
    applications: 'Cryptographic sequence generation, recursive algorithm efficiency, and natural growth pattern simulation.'
  }
};

function initAiPaperExplainer() {
  const modal = document.getElementById('aiSummaryModal');
  const overlay = document.getElementById('aiModalOverlay');
  const closeBtn = document.getElementById('closeAiModalBtn');
  const dismissBtn = document.getElementById('dismissAiModalBtn');

  const titleElem = document.getElementById('aiModalTitle');
  const authorsElem = document.getElementById('aiModalAuthors');
  const plainElem = document.getElementById('aiPlainEnglish');
  const breakthroughElem = document.getElementById('aiBreakthrough');
  const appsElem = document.getElementById('aiApplications');

  if (!modal) return;

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function openPaperModal(paperId) {
    const data = paperExplanations[paperId];
    if (!data) return;

    if (titleElem) titleElem.textContent = data.title;
    if (authorsElem) authorsElem.textContent = data.authors;
    if (plainElem) plainElem.textContent = data.plainEnglish;
    if (breakthroughElem) breakthroughElem.textContent = data.breakthrough;
    if (appsElem) appsElem.textContent = data.applications;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.ai-explain-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const paperId = btn.getAttribute('data-paper-id');
      if (paperId) openPaperModal(paperId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
}

// --------------------------------------------------------------------------
// 15. Intelligent AI ScholarBot (Dr. Shri Prakash AI Companion)
// --------------------------------------------------------------------------
function initAiChatBot() {
  const triggerBtn = document.getElementById('aiWidgetToggle');
  const navTrigger = document.getElementById('openAiChatNav');
  const chatWindow = document.getElementById('aiChatWindow');
  const closeBtn = document.getElementById('closeAiChatBtn');
  const chatForm = document.getElementById('aiChatForm');
  const userInput = document.getElementById('aiUserInput');
  const messagesList = document.getElementById('aiMessagesList');
  const chips = document.querySelectorAll('.ai-chip');

  if (!chatWindow) return;

  function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden') && userInput) {
      setTimeout(() => userInput.focus(), 150);
    }
  }

  function openChat() {
    chatWindow.classList.remove('hidden');
    if (userInput) setTimeout(() => userInput.focus(), 150);
  }

  function closeChat() {
    chatWindow.classList.add('hidden');
  }

  if (triggerBtn) triggerBtn.addEventListener('click', toggleChat);
  if (navTrigger) navTrigger.addEventListener('click', openChat);
  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  // Chips click handler
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        addUserMessage(prompt);
        generateAiResponse(prompt);
      }
    });
  });

  // Form submit handler
  window.handleAiChatSubmit = function(e) {
    e.preventDefault();
    if (!userInput) return;
    const query = userInput.value.trim();
    if (!query) return;

    addUserMessage(query);
    userInput.value = '';
    generateAiResponse(query);
  };

  function addUserMessage(text) {
    if (!messagesList) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-message user-message';
    msgDiv.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-user"></i></div>
      <div class="msg-bubble"><p>${escapeHtml(text)}</p></div>
    `;
    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  function addBotMessage(htmlContent) {
    if (!messagesList) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-message bot-message';
    msgDiv.innerHTML = `
      <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="msg-bubble">${htmlContent}</div>
    `;
    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  function generateAiResponse(query) {
    const q = query.toLowerCase();

    // Simulated typing delay for realistic interaction
    setTimeout(() => {
      let response = '';

      if (q.includes('phd') || q.includes('ph.d') || q.includes('research') || q.includes('graph theory') || q.includes('specializ')) {
        response = `<p><strong>Ph.D Research Specialization:</strong></p>
          <p>Dr. T.V.G. Shri Prakash holds his <strong>Ph.D in Mathematics (Viva Voce Completed)</strong> from <strong>Madurai Kamaraj University</strong>, specializing in <strong>Graph Theory &amp; S-Valued Graphs</strong>.</p>
          <p>His doctoral treatise established groundbreaking results on semiring vertex colorings, chromatic numbers, critical graphs, and the generalization of <em>Vizing\'s Theorem</em>.</p>`;
      } 
      else if (q.includes('s-valued') || q.includes('semiring')) {
        response = `<p><strong>What is an S-Valued Graph?</strong></p>
          <p>In standard graph theory, vertices and edges are simple visual connections. In an <strong>S-valued graph</strong>, weights and properties are evaluated over an algebraic structure called a <em>semiring S</em>.</p>
          <p>Dr. Shri Prakash\'s papers study how to color these weighted networks without clashes, which has major applications in <strong>telecommunication frequency allocation, parallel computing, and cryptographic routing</strong>.</p>`;
      }
      else if (q.includes('sastra') || q.includes('experience') || q.includes('career') || q.includes('teaching years') || q.includes('college')) {
        response = `<p><strong>21+ Years of Academic Experience:</strong></p>
          <ul>
            <li><strong>Current (2019-Present):</strong> Associate Professor at Sri Meenakshi Vidiyal Arts &amp; Science College.</li>
            <li><strong>SASTRA Deemed University (2007-2016):</strong> Assistant Professor for <strong>9 continuous years</strong> at one of India\'s premier deemed universities.</li>
            <li><strong>Engineering Colleges:</strong> Kurinji College of Engg (2 yrs) &amp; Mahalakshmi Engg College (8 mos).</li>
            <li><strong>Foundational Teaching (1999-2006):</strong> 5 years in higher secondary schools in Srirangam and Trichy.</li>
          </ul>`;
      }
      else if (q.includes('course') || q.includes('subject') || q.includes('teach') || q.includes('engineering math')) {
        response = `<p><strong>Advanced Subjects Handled:</strong></p>
          <p>Dr. Shri Prakash has taught 8+ specialized curricula to Engineering and Science scholars:</p>
          <ul>
            <li>Engineering Mathematics I, II, &amp; III</li>
            <li>Probability &amp; Queuing Theory</li>
            <li>Random Processes &amp; Stochastic Systems</li>
            <li>Graph Theory &amp; Combinatorics</li>
            <li>Numerical &amp; Statistical Methods</li>
          </ul>`;
      }
      else if (q.includes('paper') || q.includes('publication') || q.includes('journal') || q.includes('vizing')) {
        response = `<p><strong>Publications Overview:</strong></p>
          <p>Dr. Shri Prakash has authored <strong>11 peer-reviewed international publications</strong>:</p>
          <ul>
            <li><strong>7 Papers on Graph Theory:</strong> Covering S-valued graph coloring, k-colorability, chromatic indices, line graphs, and Vizing\'s Theorem (IJPAM, IJMSEA, IJESI, IJCAR, ICADM\'18).</li>
            <li><strong>4 Papers on Sequence Spaces:</strong> Lacunary sequence spaces, modulus functions, and Fibonacci sequences over probabilistic p-metric spaces.</li>
          </ul>
          <p>You can use the <em>"AI Summary"</em> button on each paper card in the Publications section to read plain-English explanations!</p>`;
      }
      else if (q.includes('education') || q.includes('degree') || q.includes('qualification') || q.includes('university') || q.includes('msc') || q.includes('mphil')) {
        response = `<p><strong>Academic Qualifications:</strong></p>
          <ul>
            <li><strong>Ph.D in Mathematics (Graph Theory):</strong> Madurai Kamaraj University</li>
            <li><strong>M.Phil Mathematics:</strong> National College, Bharathidasan University (64%)</li>
            <li><strong>M.Sc Mathematics:</strong> National College, Bharathidasan University (60%, <strong>First Class</strong>)</li>
            <li><strong>B.Ed Mathematics:</strong> Bharathidasan University (<strong>First Class</strong>)</li>
            <li><strong>B.Sc Mathematics:</strong> National College, Bharathidasan University</li>
            <li><strong>Professional:</strong> Life Member, Ramanujan Mathematical Society (RMS)</li>
          </ul>`;
      }
      else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('collaborat') || q.includes('lecture') || q.includes('address')) {
        response = `<p><strong>Contact &amp; Collaboration Info:</strong></p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:tvgshri@gmail.com">tvgshri@gmail.com</a></li>
            <li><strong>Mobile Phone:</strong> <a href="tel:+919486643582">+91 94866 43582</a></li>
            <li><strong>Residence:</strong> B3 Vanajasri Apts, 34 Ammamandapam Road, Srirangam, Trichy - 620006, Tamil Nadu.</li>
          </ul>
          <p>He is available for guest lectures, doctoral research panels, and academic collaborations.</p>`;
      }
      else {
        response = `<p>Thank you for asking! Dr. T.V.G. Shri Prakash is an <strong>Associate Professor of Mathematics</strong> with over <strong>21 years of experience</strong> and a <strong>Ph.D in Graph Theory</strong>.</p>
          <p>You can ask me about his <em>Ph.D research</em>, <em>9 years at SASTRA University</em>, <em>11 published research papers</em>, <em>courses handled</em>, or <em>contact details</em>!</p>`;
      }

      addBotMessage(response);
    }, 450);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}


// --------------------------------------------------------------------------
// 16. Interactive Welcome Intro Screen
// Shows standing portrait of Dr. Shri Prakash with "Click me to explore more"
// --------------------------------------------------------------------------
function initWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcomeScreen');
  const enterBtn = document.getElementById('enterPortfolioBtn');
  const welcomeCard = document.getElementById('welcomeCard');

  if (!welcomeScreen) return;

  // Prevent background scrolling while welcome screen is active
  document.body.style.overflow = 'hidden';

  let hasEntered = false;

  function dismissWelcome() {
    if (hasEntered) return;
    hasEntered = true;

    welcomeScreen.classList.add('fade-out');
    document.body.style.overflow = '';

    setTimeout(() => {
      welcomeScreen.style.display = 'none';
      // Trigger stat counter animations
      const statsContainer = document.querySelector('.hero-stats');
      if (statsContainer && typeof initCounterAnimation === 'function') {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        statNumbers.forEach(elem => {
          const target = parseInt(elem.getAttribute('data-target'), 10);
          const hasPlus = elem.innerHTML.includes('+');
          let current = 0;
          const duration = 1200;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            current = Math.floor(easedProgress * target);
            elem.innerHTML = `${current}${hasPlus ? '<small>+</small>' : ''}`;
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              elem.innerHTML = `${target}${hasPlus ? '<small>+</small>' : ''}`;
            }
          }
          requestAnimationFrame(step);
        });
      }
    }, 550);
  }

  // Interactive Dance Move Switcher
  const danceBtn = document.getElementById('changeDanceBtn');
  const danceBtnText = document.getElementById('danceBtnText');
  const avatarImg = document.getElementById('welcomeAvatarImg');

  const danceMoves = [
    { class: 'dance-groove', label: 'Dance: Rhythm Groove ??' },
    { class: 'dance-bounce', label: 'Dance: Disco Bounce ?' },
    { class: 'dance-spin', label: 'Dance: Victory Spin ??' }
  ];
  let currentDanceIdx = 0;

  function switchDanceMove() {
    if (!avatarImg) return;
    danceMoves.forEach(m => avatarImg.classList.remove(m.class));
    currentDanceIdx = (currentDanceIdx + 1) % danceMoves.length;
    const nextMove = danceMoves[currentDanceIdx];
    avatarImg.classList.add(nextMove.class);
    if (danceBtnText) danceBtnText.textContent = nextMove.label;
    if (typeof showToast === 'function') {
      showToast(`Switched move to ${nextMove.label}`);
    }
  }

  if (danceBtn) {
    danceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      switchDanceMove();
    });
  }

  if (avatarImg) {
    avatarImg.addEventListener('click', (e) => {
      e.stopPropagation();
      switchDanceMove();
    });
  }

  // Dismiss handlers
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissWelcome();
    });
  }

  const welcomeContent = document.querySelector('.welcome-content-box');
  if (welcomeContent) {
    welcomeContent.addEventListener('click', (e) => {
      // If clicking dance button or links, don't dismiss
      if (e.target.closest('#changeDanceBtn')) return;
      dismissWelcome();
    });
  }

  const welcomeBackdrop = document.querySelector('.welcome-backdrop-particles');
  if (welcomeBackdrop) {
    welcomeBackdrop.addEventListener('click', dismissWelcome);
  }

  // Keyboard accessibility (Enter, Space, Escape)
  window.addEventListener('keydown', (e) => {
    if (!hasEntered && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
      dismissWelcome();
    }
  });
}
