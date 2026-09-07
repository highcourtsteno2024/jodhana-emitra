// main.js

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Navbar background change on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Auth Navbar State ---
  const authNavLi = document.getElementById('authNavLi');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (authNavLi) {
    if (currentUser) {
      authNavLi.innerHTML = `<a href="user-dashboard.html" class="btn btn-primary" style="padding: 8px 15px; font-weight: bold; margin-left: 10px;">My Dashboard</a>`;
    } else {
      authNavLi.innerHTML = `<a href="login.html" class="btn btn-outline" style="padding: 8px 15px; font-weight: bold; margin-left: 10px;">Login / Signup</a>`;
    }
  }

  // Services Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked button
      btn.classList.add('active');

      // Add active class to corresponding content
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Handle Job Inquiry Buttons
  const jobInquireBtns = document.querySelectorAll('.job-inquire-btn');
  const subjectInput = document.getElementById('subject');

  jobInquireBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const jobTitle = e.target.getAttribute('data-job');
      if (jobTitle && subjectInput) {
        subjectInput.value = `Inquiry regarding: ${jobTitle}`;
      }
    });
  });

  // Form Submission Mockup
  const form = document.getElementById('inquiryForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // --- Inquiry Form Submission (Saving to LocalStorage) ---
  if (form) {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && subjectInput) {
      subjectInput.value = `Inquiry regarding: ${serviceParam}`;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = form.querySelector('input[type="text"]').value;
      const phone = form.querySelector('input[type="tel"]').value;
      const subject = subjectInput.value;
      const message = form.querySelector('textarea').value;
      const date = new Date().toLocaleDateString();
      const userEmail = currentUser ? currentUser.email : "Guest";

      // Save to Firestore
      try {
        await db.collection('inquiries').add({
          date, name, phone, subject, message, email: userEmail, timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (err) {
        console.error("Error saving inquiry to Firebase:", err);
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Send email via formsubmit.co
      fetch("https://formsubmit.co/ajax/highcourtsteno2024@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: name,
          Phone: phone,
          Subject: subject,
          Message: message,
          _subject: "New Inquiry from Jodhana E-Mitra Website!"
        })
      })
      .then(response => response.json())
      .then(data => {
        formSuccess.classList.remove('hidden');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.style.display = 'none';
      })
      .catch(error => {
        console.error(error);
        alert("Sorry, there was an error sending your message. Please try again later.");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = 'block';
        formSuccess.classList.add('hidden');
      });
    }
  }

  // --- Document Modal Logic for Services Page ---
  const interactiveListItems = document.querySelectorAll('.interactive-list li');
  const docModal = document.getElementById('documentModal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalServiceName = document.getElementById('modalServiceName');
  const modalDocList = document.getElementById('modalDocList');
  const modalApplyBtn = document.getElementById('modalApplyBtn');

  // Dummy documents data
  const requiredDocsData = {
    'Caste Certificate': ['Aadhar Card', 'Jan Aadhar Card', 'Ration Card', 'Old Caste Certificate / Jamabandi', 'Passport Size Photo'],
    'Domicile Certificate': ['Aadhar Card', 'Jan Aadhar Card', 'Voter ID / Ration Card', 'Education Marksheet (Last Passed)', 'Passport Size Photo'],
    'Income Certificate': ['Aadhar Card', 'Jan Aadhar Card', 'Salary Slip / ITR (if applicable)', 'Self Declaration Form', 'Passport Size Photo'],
    'New PAN Card': ['Aadhar Card (with full DOB)', 'Passport Size Photo', 'Signature on white paper'],
    'default': ['Aadhar Card', 'Passport Size Photo', 'Relevant existing documents']
  };

  if (interactiveListItems && docModal) {
    interactiveListItems.forEach(item => {
      item.addEventListener('click', () => {
        const serviceName = item.getAttribute('data-service');
        modalServiceName.textContent = serviceName;
        
        const docs = requiredDocsData[serviceName] || requiredDocsData['default'];
        modalDocList.innerHTML = '';
        docs.forEach(doc => {
          const li = document.createElement('li');
          li.textContent = doc;
          modalDocList.appendChild(li);
        });

        modalApplyBtn.href = `index.html?service=${encodeURIComponent(serviceName)}#inquiry`;
        docModal.classList.remove('hidden');
      });
    });

    modalCloseBtn.addEventListener('click', () => {
      docModal.classList.add('hidden');
    });

    docModal.addEventListener('click', (e) => {
      if (e.target === docModal) {
        docModal.classList.add('hidden');
      }
    });
  }

  // --- Dynamic Popup Logic ---
  const welcomePopup = document.getElementById('welcomePopup');
  const popupImageElement = document.querySelector('.popup-image');
  
  if (welcomePopup) {
    const popupData = JSON.parse(localStorage.getItem('admin_popup')) || { enabled: false };
    
    if (popupData.enabled) {
      if (popupImageElement) popupImageElement.src = popupData.image;
      
      setTimeout(() => {
        welcomePopup.classList.remove('hidden');
      }, 1000);
      
      const closePopupBtn = document.getElementById('closePopupBtn');
      if(closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
          welcomePopup.classList.add('hidden');
        });
      }
      
      welcomePopup.addEventListener('click', (e) => {
        if (e.target === welcomePopup) {
          welcomePopup.classList.add('hidden');
        }
      });
    }
  }

  // --- Dynamic Hero Slider Logic ---
  const slidesContainer = document.querySelector('.slides-container');
  
  if (slidesContainer) {
    const slidesData = JSON.parse(localStorage.getItem('admin_slides')) || [];
    
    if (slidesData.length > 0) {
      slidesContainer.innerHTML = ''; // Clear hardcoded slides
      
      slidesData.forEach((slide, index) => {
        const div = document.createElement('div');
        div.className = `slide ${index === 0 ? 'active' : ''}`;
        div.style.background = `linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9)), url('${slide.image}') center/cover`;
        
        div.innerHTML = `
          <div class="container hero-content">
            ${slide.badge ? `<span class="badge">${slide.badge}</span>` : ''}
            <h1>${slide.heading}</h1>
            <p>${slide.desc}</p>
            <div class="hero-buttons">
              <a href="services.html" class="btn btn-primary">Explore Services</a>
              <a href="#inquiry" class="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        `;
        slidesContainer.appendChild(div);
      });
    }

    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length > 0) {
      let currentSlide = 0;
      let slideInterval;
      
      const showSlide = (index) => {
        slides.forEach((slide, i) => {
          slide.classList.remove('active');
          if (i === index) slide.classList.add('active');
        });
      };
      
      const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      };
      
      const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      };
      
      const startSlider = () => {
        slideInterval = setInterval(nextSlide, 5000);
      };
      
      const stopSlider = () => {
        clearInterval(slideInterval);
      };
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          stopSlider();
          nextSlide();
          startSlider();
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          stopSlider();
          prevSlide();
          startSlider();
        });
      }
      
      startSlider();
    }
  }

  // --- Dynamic Jobs Rendering ---
  const recruitmentsContainer = document.getElementById('recruitmentsGrid');
  if (recruitmentsContainer) {
    const jobs = JSON.parse(localStorage.getItem('admin_jobs')) || [];
    recruitmentsContainer.innerHTML = ''; // clear static

    if(jobs.length === 0){
        recruitmentsContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No active jobs found.</p>';
    }

    jobs.forEach(job => {
      const card = document.createElement('div');
      card.className = 'card job-card';
      
      let badgeHtml = '';
      if(job.badge === 'New') {
        badgeHtml = `<span class="job-badge new">NEW</span>`;
      } else if (job.badge === 'Ending Soon') {
        badgeHtml = `<span class="job-badge ending">Ending Soon</span>`;
      }

      card.innerHTML = `
        ${badgeHtml}
        <h3>${job.title}</h3>
        <ul class="job-details">
          <li><span>Department:</span> <strong>${job.dept}</strong></li>
          <li><span>Last Date:</span> <strong>${job.date}</strong></li>
        </ul>
        <div style="display: flex; gap: 10px; margin-top: auto;">
          <a href="job-details.html?id=${job.id}" class="btn btn-primary" style="flex: 1; text-align: center;">View Details</a>
          <button class="btn btn-secondary job-inquire-btn" data-job="${job.title}" onclick="window.location.href='#inquiry'; document.getElementById('subject').value='Inquiry regarding: ${job.title}'">Inquiry</button>
        </div>
      `;
      recruitmentsContainer.appendChild(card);
    });
  }

  // Populate Sarkari Latest Job Lists in recruitments.html and jobs.html
  const sarkariList1 = document.getElementById('sarkariLatestJobList');
  const sarkariList2 = document.getElementById('sarkariLatestJobList2');
  
  if (sarkariList1 || sarkariList2) {
    const jobs = JSON.parse(localStorage.getItem('admin_jobs')) || [];
    
    // Function to render jobs into a list element
    const renderToSarkariList = (listEl) => {
      if (!listEl) return;
      listEl.innerHTML = '';
      
      if (jobs.length === 0) {
        listEl.innerHTML = '<li style="text-align:center;">No new jobs available.</li>';
        return;
      }
      
      // Get only the 5 most recent jobs for the sidebar
      jobs.slice(0, 5).forEach(job => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="job-details.html?id=${job.id}">${job.title}</a>`;
        listEl.appendChild(li);
      });
    };

    renderToSarkariList(sarkariList1);
    renderToSarkariList(sarkariList2);
  }

  // --- Render Job Details Page ---
  const jobDetailsContainer = document.getElementById('jobDetailsContainer');
  if (jobDetailsContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    const jobs = JSON.parse(localStorage.getItem('admin_jobs')) || [];
    const job = jobs.find(j => j.id == jobId);

    if (job) {
      jobDetailsContainer.innerHTML = `
        <div class="sarkari-details-container">
          
          <table class="sarkari-table">
            <tr>
              <td colspan="2" class="center-content">
                <span class="sarkari-heading-1 text-pink">${job.dept}</span>
                <span class="sarkari-heading-2 text-green">${job.title}</span>
                <span class="sarkari-heading-3 text-pink">${job.shortDetails}</span>
                <span class="sarkari-heading-1 text-red">Jodhana E-Mitra & Accountancy</span>
              </td>
            </tr>
            
            <tr>
              <td style="width: 50%;">
                <div class="center-content text-green" style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Important Dates</div>
                <ul class="sarkari-list">
                  <li>Application Begin : <strong>${job.appBegin}</strong></li>
                  <li>Last Date for Apply Online : <strong class="text-red">${job.date}</strong></li>
                  <li>Pay Fee Last Date : <strong>${job.feeLastDate}</strong></li>
                  <li>Exam Date : <strong>${job.examDate}</strong></li>
                </ul>
              </td>
              <td style="width: 50%;">
                <div class="center-content text-green" style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Application Fee</div>
                <ul class="sarkari-list">
                  <li>General / OBC / EWS : <strong>${job.feeGen}</strong></li>
                  <li>SC / ST / PH : <strong>${job.feeSc}</strong></li>
                  <li>Pay the Exam Fee Through Debit Card / Credit Card / Net Banking / UPI Fee Mode Only.</li>
                </ul>
              </td>
            </tr>
            
            <tr>
              <td colspan="2">
                <div class="center-content">
                  <span class="sarkari-heading-2 text-green">${job.dept} Notification 2026 : <span class="text-pink">Age Limit as on ${job.ageAsOn}</span></span>
                </div>
                <ul class="sarkari-list">
                  <li>Minimum Age : <strong>${job.ageMin}</strong></li>
                  <li>Maximum Age : <strong>${job.ageMax}</strong></li>
                  <li>Age Relaxation Extra as per Recruitment Rules 2026.</li>
                </ul>
              </td>
            </tr>
            
            <tr>
              <td class="center-content v-middle text-pink" style="font-size: 20px; font-weight: bold;">Download Admit Card</td>
              <td class="center-content v-middle"><a href="${job.notifLink}" class="sarkari-link text-blue">Click Here</a></td>
            </tr>
            <tr>
              <td class="center-content v-middle text-pink" style="font-size: 20px; font-weight: bold;">Apply Online</td>
              <td class="center-content v-middle"><a href="${job.link}" class="sarkari-link text-blue">Click Here</a></td>
            </tr>
            <tr>
              <td class="center-content v-middle text-pink" style="font-size: 20px; font-weight: bold;">Download Notification</td>
              <td class="center-content v-middle"><a href="${job.notifLink}" class="sarkari-link text-blue">Click Here</a></td>
            </tr>
            <tr>
              <td class="center-content v-middle text-green" style="font-size: 20px; font-weight: bold;">Join Jodhpur Emitra Channel</td>
              <td class="center-content v-middle"><a href="#" class="sarkari-link text-blue">Telegram</a> | <a href="#" class="sarkari-link text-blue">WhatsApp</a></td>
            </tr>
            <tr>
              <td class="center-content v-middle text-pink" style="font-size: 20px; font-weight: bold;">Official Website</td>
              <td class="center-content v-middle"><a href="${job.officialLink}" class="sarkari-link text-blue">Click Here</a></td>
            </tr>
            
          </table>

          <div class="apply-action" style="text-align: center; margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 12px; border: 2px dashed #3b82f6;">
            <h3 style="margin-bottom: 15px; color: #0f172a;">इस भर्ती के लिए ई-मित्र से फॉर्म भरवाएं</h3>
            <p style="margin-bottom: 20px; color: #64748b;">हमारे माध्यम से बिना किसी गलती के फॉर्म भरने के लिए नीचे क्लिक करें।</p>
            <a href="index.html?service=${encodeURIComponent(job.title)}#inquiry" class="btn btn-primary" style="font-size: 1.1rem; padding: 15px 40px;">Apply via Jodhana E-Mitra</a>
          </div>

        </div>
      `;
    } else {
      jobDetailsContainer.innerHTML = '<div style="text-align: center; padding: 50px;"><h3>Job not found.</h3><a href="recruitments.html" class="btn btn-primary">Go Back</a></div>';
    }
  }

  // --- Render Forms Page ---
  const formsTableBody = document.getElementById('formsTableBody');
  const formSearchInput = document.getElementById('formSearchInput');

  if (formsTableBody) {
    const renderPublicForms = (filter = '') => {
      const forms = JSON.parse(localStorage.getItem('admin_forms')) || [];
      formsTableBody.innerHTML = '';
      
      const filteredForms = forms.filter(form => form.name.toLowerCase().includes(filter.toLowerCase()));
      
      if (filteredForms.length === 0) {
        formsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No forms found.</td></tr>';
        return;
      }

      filteredForms.forEach((form, index) => {
        const tr = document.createElement('tr');
        const videoLinkHtml = (form.videoUrl && form.videoUrl !== '#') 
          ? `<a href="${form.videoUrl}" target="_blank" class="sarkari-form-link">Video</a>` 
          : `<span style="color: #999;">-</span>`;

        tr.innerHTML = `
          <td>${index + 1}</td>
          <td style="text-align: left;">${form.name}</td>
          <td><a href="${form.url}" target="_blank" class="sarkari-form-link">Download</a></td>
          <td>${videoLinkHtml}</td>
        `;
        formsTableBody.appendChild(tr);
      });
    };

    renderPublicForms();

    if (formSearchInput) {
      formSearchInput.addEventListener('input', (e) => {
        renderPublicForms(e.target.value);
      });
    }
  }

});
