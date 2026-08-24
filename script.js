/* ============================================
   OVAL PALACE RESORT — INTERACTIVE SCRIPTS
   A Nalakath Holdings Venture
   ============================================ */

// ==================== INITIALIZATION ====================
// Page-specific logic continues below...

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlideshow();
    initCalendar();
    initChatbot();
    // common.js handles icons, navbar, and scroll-reveal
});

// ==================== HERO SLIDESHOW ====================
let currentSlide = 0;
let slideInterval;

function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    slideInterval = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 6000);
}

// ==================== CALENDAR ====================
let calendarDate = new Date();
let selectedDate = null;
let selectedTime = null;
let selectedMode = 'in-person';

function initCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('calendarMonth');
    if (!grid || !monthLabel) return;
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('calendarMonth');
    if (!grid || !monthLabel) return;
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    monthLabel.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    grid.innerHTML = '';

    // Empty cells for days before the first
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        grid.appendChild(empty);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('button');
        dayEl.className = 'calendar-day';
        dayEl.textContent = d;

        const thisDate = new Date(year, month, d);

        // Mark today
        if (thisDate.toDateString() === today.toDateString()) {
            dayEl.classList.add('today');
        }

        // Disable past dates
        if (thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            dayEl.classList.add('disabled');
        } else {
            // Disable Sundays
            if (thisDate.getDay() === 0) {
                dayEl.classList.add('disabled');
            } else {
                dayEl.addEventListener('click', () => selectDate(dayEl, thisDate));
            }
        }

        // Highlight selected
        if (selectedDate && thisDate.toDateString() === selectedDate.toDateString()) {
            dayEl.classList.add('selected');
        }

        grid.appendChild(dayEl);
    }

    lucide.createIcons();
}

function selectDate(el, date) {
    selectedDate = date;
    selectedTime = null;

    // Update UI
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');

    // Show time slots
    document.getElementById('timeSlots').style.display = 'block';
    document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
}

function selectTimeSlot(el) {
    selectedTime = el.textContent;
    document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
}

function changeMonth(dir) {
    calendarDate.setMonth(calendarDate.getMonth() + dir);
    renderCalendar();
}

function selectMode(el, mode) {
    selectedMode = mode;
    document.querySelectorAll('.mode-option').forEach(m => m.classList.remove('selected'));
    el.classList.add('selected');
}

// ==================== APPOINTMENT FORM ====================
function submitAppointment(e) {
    e.preventDefault();

    if (!selectedDate) {
        alert('Please select a date from the calendar.');
        return;
    }
    if (!selectedTime) {
        alert('Please select a time slot.');
        return;
    }

    const data = {
        name: document.getElementById('apptName').value,
        email: document.getElementById('apptEmail').value,
        phone: document.getElementById('apptPhone').value,
        mode: selectedMode,
        message: document.getElementById('apptMessage').value,
        date: selectedDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: selectedTime,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    let appointments = JSON.parse(localStorage.getItem('ovalPalace_appointments') || '[]');
    appointments.push(data);
    localStorage.setItem('ovalPalace_appointments', JSON.stringify(appointments));

    // Save as lead + Email
    saveLead(data.name, data.email, data.phone, 'appointment', {
        'Appointment Date': data.date,
        'Time Slot': data.time,
        'Mode': data.mode,
        'Notes': data.message || 'None'
    });

    // Show success
    const confirmText = document.getElementById('appointmentConfirmText');
    confirmText.textContent = `Your appointment with our sales manager has been booked for ${data.date} at ${data.time} (${data.mode}). A confirmation will be sent to ${data.email}.`;

    document.getElementById('appointmentSuccessModal').classList.add('active');

    // Reset form
    document.getElementById('appointmentForm').reset();
    selectedDate = null;
    selectedTime = null;
    document.getElementById('timeSlots').style.display = 'none';
    renderCalendar();
}

function closeAppointmentSuccess() {
    document.getElementById('appointmentSuccessModal').classList.remove('active');
}

// ==================== INVESTMENT SLOT BOOKING ====================
let selectedPlan = '';

function openBookingModal(planName, total) {
    selectedPlan = planName;
    document.getElementById('modalPlanName').textContent = planName;
    document.getElementById('modalPlanTotal').textContent = `Total Investment: ${total}`;
    document.getElementById('bookingFormView').style.display = 'block';
    document.getElementById('bookingSuccessView').style.display = 'none';
    document.getElementById('bookingModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('bookingForm').reset();
}

function submitBooking(e) {
    e.preventDefault();

    const data = {
        plan: selectedPlan,
        name: document.getElementById('bookName').value,
        email: document.getElementById('bookEmail').value,
        phone: document.getElementById('bookPhone').value,
        paymentMode: document.getElementById('bookPayment').value,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    let bookings = JSON.parse(localStorage.getItem('ovalPalace_bookings') || '[]');
    bookings.push(data);
    localStorage.setItem('ovalPalace_bookings', JSON.stringify(bookings));

    // Save as lead + Email
    saveLead(data.name, data.email, data.phone, 'slot-booking', {
        'Investment Plan': data.plan,
        'Payment Mode': data.paymentMode
    });

    // Show success with professional transition
    const modalContent = document.querySelector('#bookingModal .modal');
    if (modalContent) {
        modalContent.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            document.getElementById('bookingFormView').style.display = 'none';
            document.getElementById('bookingSuccessView').style.display = 'block';
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
            lucide.createIcons();
        }, 300);
    } else {
        document.getElementById('bookingFormView').style.display = 'none';
        document.getElementById('bookingSuccessView').style.display = 'block';
        lucide.createIcons();
    }
}

// ==================== GALLERY / LIGHTBOX ====================
const galleryImages = [
    'images/hero-1.jpg',
    'images/hero-2.jpg',
    'images/hero-3.jpg',
    'images/hero-4.jpg',
    'images/hero-5.jpg'
];
let currentLightbox = 0;

function openLightbox(index) {
    currentLightbox = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImage');
    img.src = galleryImages[index];
    img.alt = `Oval Palace Resort - Image ${index + 1}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    currentLightbox = (currentLightbox + dir + galleryImages.length) % galleryImages.length;
    const img = document.getElementById('lightboxImage');
    img.src = galleryImages[currentLightbox];
    img.alt = `Oval Palace Resort - Image ${currentLightbox + 1}`;
}

// Close lightbox on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeBookingModal();
        closeAppointmentSuccess();
    }
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ==================== TESTIMONIALS CAROUSEL ====================
let currentTestimonial = 0;

function showTestimonial(index) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');

    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentTestimonial = index;
    cards[index].classList.add('active');
    dots[index].classList.add('active');
}

// Auto-rotate testimonials
setInterval(() => {
    const total = document.querySelectorAll('.testimonial-card').length;
    if (total === 0) return;
    showTestimonial((currentTestimonial + 1) % total);
}, 5000);

// ==================== CONTACT FORM ====================
function submitContact(e) {
    e.preventDefault();

    const data = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        interest: document.getElementById('contactInterest').value,
        message: document.getElementById('contactMessage').value,
        timestamp: new Date().toISOString()
    };

    let contacts = JSON.parse(localStorage.getItem('ovalPalace_contacts') || '[]');
    contacts.push(data);
    localStorage.setItem('ovalPalace_contacts', JSON.stringify(contacts));

    saveLead(data.name, data.email, data.phone, 'contact-form', {
        'Interest': data.interest || 'General',
        'Message': data.message || 'No message'
    });

    alert('Thank you! Your message has been sent. Our team will get back to you shortly.');
    document.getElementById('contactForm').reset();
}

// ==================== NEWSLETTER ====================
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail').value;
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    let subscribers = JSON.parse(localStorage.getItem('ovalPalace_newsletter') || '[]');
    subscribers.push({ email, timestamp: new Date().toISOString() });
    localStorage.setItem('ovalPalace_newsletter', JSON.stringify(subscribers));

    saveLead('Newsletter Subscriber', email, 'N/A', 'newsletter');

    alert('Thank you for subscribing! You\'ll receive construction updates and investment news.');
    document.getElementById('newsletterEmail').value = '';
}

// ==================== LEAD MANAGEMENT + EMAIL ====================
// ⚡ CONFIGURATION — Replace with your Web3Forms access key
// Get your FREE key at: https://web3forms.com (enter your email → get key)
const WEB3FORMS_KEY = 'b5673e55-45d0-487d-a14a-ea76fb64b770';

/**
 * Central lead handler: saves to localStorage AND emails via Web3Forms.
 * @param {string} name - Lead name
 * @param {string} email - Lead email
 * @param {string} phone - Lead phone
 * @param {string} source - Source (chatbot, contact-form, appointment, slot-booking, newsletter)
 * @param {object} extra - Extra data fields (optional)
 */
function saveLead(name, email, phone, source, extra = {}) {
    const timestamp = new Date().toISOString();
    const readableTime = new Date().toLocaleString('en-IN', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    // 1. Save to localStorage
    let leads = JSON.parse(localStorage.getItem('ovalPalace_leads') || '[]');
    leads.push({ name, email, phone, source, ...extra, timestamp });
    localStorage.setItem('ovalPalace_leads', JSON.stringify(leads));

    // 1.5 Fire GA4 conversion event so leads can be attributed by source/page/campaign
    if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
            lead_source: source,
            page_path: window.location.pathname
        });
    }

    // 2. Send email via Web3Forms
    if (WEB3FORMS_KEY === 'YOUR_ACCESS_KEY_HERE') {
        console.warn('[Oval Palace] Web3Forms key not set. Email not sent. Get your key at https://web3forms.com');
        return;
    }

    // Build the email body with all details
    const sourceLabels = {
        'chatbot': '🤖 Chatbot Lead',
        'contact-form': '📩 Contact Form',
        'appointment': '📅 Appointment Booking',
        'slot-booking': '💰 Investment Slot Booking',
        'newsletter': '📰 Newsletter Subscription'
    };

    let messageBody = `
--- NEW LEAD from Oval Palace Resort ---

Source: ${sourceLabels[source] || source}
Time: ${readableTime}

👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone}
`;

    // Append extra fields
    if (Object.keys(extra).length > 0) {
        messageBody += '\n--- Additional Details ---\n';
        for (const [key, value] of Object.entries(extra)) {
            messageBody += `${key}: ${value}\n`;
        }
    }

    messageBody += '\n---\nOval Palace Resort | Nalakath Holdings\nhttps://nalakathholdings.com';

    // Send via Web3Forms API
    const formData = {
        access_key: WEB3FORMS_KEY,
        subject: `🔔 New ${sourceLabels[source] || source} — Oval Palace Resort`,
        from_name: 'Oval Palace Resort',
        name: name,
        email: email,
        phone: phone,
        source: source,
        message: messageBody,
        ...extra
    };

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log(`✅ Lead emailed successfully [${source}]: ${name}`);
        } else {
            console.error('❌ Email failed:', data.message);
        }
    })
    .catch(err => {
        console.error('❌ Email error:', err);
    });
}

// ==================== 24/7 CHATBOT ====================
let chatState = {
    step: 0,
    name: '',
    interest: '',
    email: '',
    phone: '',
    initialized: false
};

const chatFlow = {
    greeting: {
        messages: [
            "Welcome to Oval Palace Resort! 🏡",
            "I'm your virtual assistant, available 24/7 to help you explore investment opportunities.",
            "May I know your name?"
        ],
        expectsInput: true,
        next: 'interest'
    },
    interest: {
        getMessage: (name) => [
            `Nice to meet you, ${name}! 😊`,
            "How can I help you today?"
        ],
        options: [
            { label: '💰 Investment Plans', value: 'investment' },
            { label: '📅 Book Appointment', value: 'appointment' },
            { label: '🏗️ Construction Status', value: 'construction' },
            { label: 'ℹ️ General Info', value: 'info' }
        ],
        next: 'capture'
    },
    investment: {
        messages: [
            "Great choice! Oval Palace offers 6 flexible investment plans:",
            "🥈 1 Unit — ₹5,000/month (Total: ₹5 Lakh)\n🥇 2 Units — ₹10,000/month (Total: ₹10 Lakh)\n💎 4 Units — ₹20,000/month (Total: ₹20 Lakh)\n🏆 10 Units — ₹50,000/month (Total: ₹50 Lakh)\n👑 15 Units — ₹75,000/month (Total: ₹75 Lakh)\n💫 20 Units — ₹1,00,000/month (Total: ₹1 Crore)",
            "All plans are built on our Institutional Standard of architectural excellence and secure capital preservation!",
            "Would you like to book a slot or speak with our sales manager?"
        ],
        options: [
            { label: '✅ Book a Slot', value: 'bookslot' },
            { label: '📞 Talk to Sales', value: 'appointment' }
        ]
    },
    appointment: {
        messages: [
            "I'd love to connect you with our sales manager! 📞",
            "You can call us directly at:",
            "📱 +91 799 497 1100",
            "Or scroll down to book an appointment through our calendar. Can I get your email and phone to schedule a callback?"
        ],
        expectsInput: true,
        next: 'getEmail'
    },
    construction: {
        messages: [
            "Oval Palace is currently in the Foundation & Structure phase! 🏗️",
            "✅ Land Acquisition — Complete\n✅ Design & Architecture — Complete\n🔨 Foundation & Structure — In Progress\n⏳ Interior & Finishing — Q1 2027\n🎉 Grand Opening — Q2 2028",
            "Want to explore investment plans or visit the site?"
        ],
        options: [
            { label: '💰 See Plans', value: 'investment' },
            { label: '📅 Schedule Visit', value: 'appointment' }
        ]
    },
    info: {
        messages: [
            "Oval Palace Resort is a premium luxury resort by Nalakath Holdings LLP. 🌴",
            "Key Highlights:\n🏡 Premium Luxury Property\n💰 12% p.a. Returns\n🔄 Buyback Guarantee\n📈 Capital Appreciation\n🌊 Infinity Pool, Spa, Restaurant & more!",
            "Visit www.nalakathholdings.com for more details.",
            "Interested in investing?"
        ],
        options: [
            { label: '💰 Investment Plans', value: 'investment' },
            { label: '📞 Contact Sales', value: 'appointment' }
        ]
    },
    getEmail: {
        messages: ["Please share your email address so we can send you the brochure and investment details:"],
        expectsInput: true,
        next: 'getPhone'
    },
    getPhone: {
        messages: ["And your phone number for a quick callback:"],
        expectsInput: true,
        next: 'thankyou'
    },
    thankyou: {
        getMessage: (name) => [
            `Thank you, ${name}! 🎉`,
            "Our investment advisor will reach out to you within 24 hours.",
            "In the meantime, feel free to explore the investment plans on this page or call us at +91 799 497 1100.",
            "Is there anything else I can help with?"
        ],
        options: [
            { label: '💰 See Plans', value: 'investment' },
            { label: '👋 That\'s all', value: 'bye' }
        ]
    },
    bookslot: {
        messages: [
            "To book a slot, please scroll up to the Investment Plans section and click 'Book This Slot' on your preferred plan! ⬆️",
            "Or I can capture your details and our team will call you. Would you like that?"
        ],
        options: [
            { label: '✅ Yes, capture my details', value: 'getEmail' },
            { label: '⬆️ I\'ll book above', value: 'bye' }
        ]
    },
    bye: {
        messages: [
            "Thank you for your interest in Oval Palace Resort! 🌟",
            "Feel free to reach out anytime. We're here 24/7.",
            "Have a wonderful day! 😊"
        ]
    }
};

function initChatbot() {
    // Chatbot markup only exists on index.html — skip on pages that don't have it
    if (!document.getElementById('chatMessages')) return;

    // Delay the first message for natural feel
    setTimeout(() => {
        if (!chatState.initialized) {
            chatState.initialized = true;
            showBotMessages(chatFlow.greeting.messages);
            chatState.step = 'greeting';
        }
    }, 2000);
}

function toggleChatbot() {
    const window_ = document.getElementById('chatbotWindow');
    const trigger = document.getElementById('chatbotTrigger');
    if (!window_ || !trigger) return;
    const notification = trigger.querySelector('.chatbot-notification');

    window_.classList.toggle('active');

    if (notification) notification.style.display = 'none';

    if (window_.classList.contains('active') && !chatState.initialized) {
        chatState.initialized = true;
        showBotMessages(chatFlow.greeting.messages);
        chatState.step = 'greeting';
    }

    // Focus input
    if (window_.classList.contains('active')) {
        setTimeout(() => document.getElementById('chatInput').focus(), 300);
    }
}

function showBotMessages(messages, options = null) {
    const container = document.getElementById('chatMessages');
    let delay = 0;

    messages.forEach((msg, i) => {
        delay += 800;
        setTimeout(() => {
            // Show typing indicator first
            const typingEl = document.createElement('div');
            typingEl.className = 'chat-message bot';
            typingEl.innerHTML = `
                <div class="chat-avatar-small">
                    <img src="images/assistant-avatar.png" alt="Assistant">
                </div>
                <div class="typing-indicator"><span></span><span></span><span></span></div>
            `;
            container.appendChild(typingEl);
            lucide.createIcons();
            scrollChatToBottom();

            // Replace with actual message
            setTimeout(() => {
                typingEl.innerHTML = `
                    <div class="chat-avatar-small">
                        <img src="images/assistant-avatar.png" alt="Assistant">
                    </div>
                    <div class="chat-bubble">${msg.replace(/\n/g, '<br>')}</div>
                `;
                // Only re-scan specific elements for performance
                if (window.lucide) lucide.createIcons({attrs: {"stroke-width": 2}, nameAttr: "data-lucide"}); 
                scrollChatToBottom();

                // Show options after last message
                if (i === messages.length - 1 && options) {
                    setTimeout(() => {
                        const optionsEl = document.createElement('div');
                        optionsEl.className = 'chat-options';
                        optionsEl.style.marginLeft = '38px';
                        options.forEach(opt => {
                            const btn = document.createElement('button');
                            btn.className = 'chat-option-btn';
                            btn.textContent = opt.label;
                            btn.addEventListener('click', () => handleChatOption(opt.value));
                            optionsEl.appendChild(btn);
                        });
                        container.appendChild(optionsEl);
                        scrollChatToBottom();
                    }, 300);
                }
            }, 1000);
        }, delay);
    });
}

function handleChatOption(value) {
    // Remove option buttons
    document.querySelectorAll('.chat-options').forEach(el => el.remove());

    // Show user's selection
    const labels = {
        'investment': '💰 Investment Plans',
        'appointment': '📅 Book Appointment',
        'construction': '🏗️ Construction Status',
        'info': 'ℹ️ General Info',
        'bookslot': '✅ Book a Slot',
        'getEmail': '✅ Yes, capture my details',
        'bye': '👋 That\'s all'
    };

    addUserMessage(labels[value] || value);

    const flow = chatFlow[value];
    if (flow) {
        chatState.step = value;

        const msgs = flow.getMessage ? flow.getMessage(chatState.name) : flow.messages;
        showBotMessages(msgs, flow.options || null);

        if (flow.expectsInput) {
            chatState.step = value;
        }
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    addUserMessage(message);
    input.value = '';

    // Process based on current step
    processUserInput(message);
}

function handleChatKeypress(e) {
    if (e.key === 'Enter') sendChatMessage();
}

function processUserInput(message) {
    switch (chatState.step) {
        case 'greeting':
            const invalidNames = ['yes', 'no', 'hi', 'hello', 'hey', 'ok', 'okay', 'yep', 'nope', 'yeah', 'sure'];
            const cleanMsg = message.trim().toLowerCase();
            
            if (cleanMsg.length < 2 || invalidNames.includes(cleanMsg) || !/^[a-zA-Z\s.-]+$/.test(cleanMsg)) {
                showBotMessages(["Please enter a valid name so I know who I'm talking to! 😊"]);
                return;
            }
            
            chatState.name = message.charAt(0).toUpperCase() + message.slice(1);
            chatState.step = 'interest';
            const flow = chatFlow.interest;
            const msgs = flow.getMessage(chatState.name);
            showBotMessages(msgs, flow.options);
            break;

        case 'appointment':
        case 'getEmail':
            if (message.includes('@')) {
                chatState.email = message;
                chatState.step = 'getPhone';
                showBotMessages(chatFlow.getPhone.messages);
            } else {
                showBotMessages(["That doesn't look like a valid email. Please enter your email address:"]);
            }
            break;

        case 'getPhone':
            chatState.phone = message;
            chatState.step = 'thankyou';

            // Save lead + Email
            saveLead(chatState.name, chatState.email, chatState.phone, 'chatbot', {
                'Interest': chatState.interest || 'General inquiry',
                'Captured Via': '24/7 Chatbot Assistant'
            });

            const thankFlow = chatFlow.thankyou;
            const thankMsgs = thankFlow.getMessage(chatState.name);
            showBotMessages(thankMsgs, thankFlow.options);
            break;

        default:
            // Generic response
            showBotMessages([
                "Thanks for your message! Let me help you with that.",
                "Here are some things I can help with:"
            ], [
                { label: '💰 Investment Plans', value: 'investment' },
                { label: '📅 Book Appointment', value: 'appointment' },
                { label: '🏗️ Construction Status', value: 'construction' }
            ]);
            break;
    }
}

function addUserMessage(text) {
    const container = document.getElementById('chatMessages');
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-message user';
    msgEl.innerHTML = `
        <div class="chat-avatar-small"><i data-lucide="user"></i></div>
        <div class="chat-bubble">${text}</div>
    `;
    container.appendChild(msgEl);
    lucide.createIcons();
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const container = document.getElementById('chatMessages');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});

// ==================== COUNTER ANIMATION ====================
function animateCounter(el, target, suffix = '') {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}

// ==================== NRI INVESTMENT CALCULATOR ====================
const CALC_MIN = 500000;
const CALC_MAX = 10000000;

const CALC_PLANS = [
    { units: 1, monthly: 5000, total: 500000, label: '1 Unit — ₹5,000/month', totalLabel: '₹5 Lakh' },
    { units: 2, monthly: 10000, total: 1000000, label: '2 Units — ₹10,000/month', totalLabel: '₹10 Lakh' },
    { units: 4, monthly: 20000, total: 2000000, label: '4 Units — ₹20,000/month', totalLabel: '₹20 Lakh' },
    { units: 10, monthly: 50000, total: 5000000, label: '10 Units — ₹50,000/month', totalLabel: '₹50 Lakh' },
    { units: 15, monthly: 75000, total: 7500000, label: '15 Units — ₹75,000/month', totalLabel: '₹75 Lakh' },
    { units: 20, monthly: 100000, total: 10000000, label: '20 Units — ₹1,00,000/month', totalLabel: '₹1 Crore' }
];

let calcDebounce;

function updateCalculatorDisplay(rawValue) {
    const input = document.getElementById('calcAmount');
    let amount = parseInt(rawValue, 10);
    if (isNaN(amount)) amount = CALC_MIN;
    amount = Math.min(CALC_MAX, Math.max(CALC_MIN, amount));

    const monthly = amount * 0.12 / 12;
    const annualLow = amount * 0.12;
    const annualHigh = amount * 0.18;

    document.getElementById('calcMonthly').textContent = '₹' + Math.round(monthly).toLocaleString('en-IN');
    document.getElementById('calcAnnual').textContent = '₹' + Math.round(annualLow).toLocaleString('en-IN');
    document.getElementById('calcCombined').textContent = '₹' + Math.round(annualLow).toLocaleString('en-IN') + ' – ₹' + Math.round(annualHigh).toLocaleString('en-IN');

    document.querySelectorAll('.calc-quick-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.amount, 10) === amount);
    });

    clearTimeout(calcDebounce);
    calcDebounce = setTimeout(() => {
        if (typeof gtag === 'function') {
            gtag('event', 'calculator_used', { investment_amount: amount });
        }
    }, 600);
}

function setCalcAmount(amount) {
    const input = document.getElementById('calcAmount');
    input.value = amount;
    updateCalculatorDisplay(amount);
}

function findClosestPlan(amount) {
    let closest = CALC_PLANS[0];
    let minDiff = Math.abs(amount - closest.total);
    CALC_PLANS.forEach(p => {
        const diff = Math.abs(amount - p.total);
        if (diff < minDiff) {
            minDiff = diff;
            closest = p;
        }
    });
    return closest;
}

function bookFromCalculator() {
    const input = document.getElementById('calcAmount');
    let amount = parseInt(input.value, 10);
    if (isNaN(amount)) amount = CALC_MIN;
    amount = Math.min(CALC_MAX, Math.max(CALC_MIN, amount));

    const plan = findClosestPlan(amount);

    if (typeof gtag === 'function') {
        gtag('event', 'calculator_to_booking', { investment_amount: amount, matched_plan: plan.totalLabel });
    }

    openBookingModal(plan.label, plan.totalLabel);
}

// ==================== GCC CURRENCY DISPLAY ====================
// Approximate mid-market rates (INR per 1 unit of currency) — reference only,
// not used for any actual transaction. Update periodically.
const GCC_RATES = {
    INR: { rate: 1, symbol: '₹' },
    AED: { rate: 26.0, symbol: 'AED ' },
    QAR: { rate: 26.3, symbol: 'QAR ' },
    SAR: { rate: 25.5, symbol: 'SAR ' },
    KWD: { rate: 311.0, symbol: 'KWD ' },
    OMR: { rate: 249.0, symbol: 'OMR ' },
    BHD: { rate: 254.0, symbol: 'BHD ' }
};

function formatGccAmount(inrValue, currency) {
    const info = GCC_RATES[currency];
    if (!info || currency === 'INR') return null;
    const converted = inrValue / info.rate;
    const formatted = converted >= 1000
        ? Math.round(converted).toLocaleString('en-US')
        : converted.toFixed(converted < 100 ? 1 : 0);
    return info.symbol + formatted;
}

function updatePlanCurrency(currency) {
    const disclaimer = document.getElementById('currencyDisclaimer');
    if (disclaimer) disclaimer.style.display = currency === 'INR' ? 'none' : 'block';

    document.querySelectorAll('.plan-monthly[data-inr]').forEach(el => {
        if (!el.dataset.origSuffix) {
            const span = el.querySelector('span');
            el.dataset.origSuffix = span ? span.outerHTML : '';
        }
        const inrValue = parseFloat(el.dataset.inr);
        const suffix = el.dataset.origSuffix;
        if (currency === 'INR') {
            el.innerHTML = '₹' + inrValue.toLocaleString('en-IN') + ' ' + suffix;
        } else {
            const amount = formatGccAmount(inrValue, currency);
            el.innerHTML = amount + ' <span style="font-size:0.7em;opacity:0.6;">(₹' + inrValue.toLocaleString('en-IN') + ')</span> ' + suffix;
        }
    });

    document.querySelectorAll('.plan-total strong[data-inr]').forEach(el => {
        const inrValue = parseFloat(el.dataset.inr);
        if (currency === 'INR') {
            el.textContent = el.dataset.inrLabel || el.textContent;
        } else {
            if (!el.dataset.inrLabel) el.dataset.inrLabel = el.textContent;
            const amount = formatGccAmount(inrValue, currency);
            el.textContent = amount + ' (' + el.dataset.inrLabel + ')';
        }
    });

    if (typeof gtag === 'function') {
        gtag('event', 'currency_switch', { currency: currency });
    }
}
