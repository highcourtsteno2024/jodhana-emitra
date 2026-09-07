

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar Navigation
  const navItems = document.querySelectorAll('.nav-menu li[data-target]');
  const sections = document.querySelectorAll('.content-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(sec => sec.classList.remove('active'));

      // Add active class to clicked
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Default Data Generation if empty
  if (!localStorage.getItem('admin_popup')) {
    localStorage.setItem('admin_popup', JSON.stringify({
      enabled: true,
      image: 'popup-poster.jpg'
    }));
  }

  if (!localStorage.getItem('admin_slides')) {
    localStorage.setItem('admin_slides', JSON.stringify([
      {
        image: 'slide1.jpg',
        badge: 'Trusted by Thousands',
        heading: 'Welcome to <br><span class="highlight">Jodhana E-Mitra & Accountacy</span>',
        desc: 'Your one-stop solution for all E-Mitra services, accurate accountancy, and latest job updates.'
      },
      {
        image: 'slide2.jpg',
        badge: 'Latest Job Updates',
        heading: 'Find Your Dream <span class="highlight">Sarkari Job</span>',
        desc: 'Get instant updates on latest recruitments, admit cards, and results.'
      },
      {
        image: 'slide3.jpg',
        badge: 'Professional Assistance',
        heading: 'Expert <span class="highlight">Accountancy Services</span>',
        desc: 'Hassle-free ITR filing, GST registration, and accounting solutions.'
      }
    ]));
  }

  if (!localStorage.getItem('admin_jobs')) {
    localStorage.setItem('admin_jobs', JSON.stringify([
      { 
        id: 1, 
        title: 'NICL Assistant Recruitment 2026', 
        dept: 'National Insurance Company Limited (NICL)',
        shortDetails: 'NICL Assistant Exam 2026 : Short Details of Notification',
        date: '07/08/2026', 
        badge: 'New', 
        posts: '500',
        appBegin: '18/07/2026',
        feeLastDate: '07/08/2026',
        examDate: '27/08/2026',
        feeGen: '850/-',
        feeSc: '0/-',
        ageAsOn: '01/07/2026',
        ageMin: '21 Years',
        ageMax: '30 Years',
        link: '#',
        notifLink: '#',
        officialLink: '#'
      },
      { 
        id: 2, 
        title: 'SSC CGL 2026', 
        dept: 'Staff Selection Commission (SSC)',
        shortDetails: 'SSC Combined Graduate Level Exam 2026',
        date: '15/10/2026', 
        badge: '', 
        posts: '7500',
        appBegin: '15/09/2026',
        feeLastDate: '15/10/2026',
        examDate: 'December 2026',
        feeGen: '100/-',
        feeSc: '0/-',
        ageAsOn: '01/08/2026',
        ageMin: '18 Years',
        ageMax: '32 Years',
        link: '#',
        notifLink: '#',
        officialLink: '#'
      }
    ]));
  }

  if (!localStorage.getItem('admin_inquiries')) {
    localStorage.setItem('admin_inquiries', JSON.stringify([]));
  }

  // --- POPUP MANAGEMENT ---
  const popupEnabled = document.getElementById('popupEnabled');
  const popupImage = document.getElementById('popupImage');
  const popupImageFile = document.getElementById('popupImageFile');
  const popupImagePreview = document.getElementById('popupImagePreview');
  const popupForm = document.getElementById('popupForm');

  const loadPopupSettings = () => {
    const popupData = JSON.parse(localStorage.getItem('admin_popup'));
    if (popupData) {
      popupEnabled.value = popupData.enabled ? 'true' : 'false';
      popupImage.value = popupData.image;
      if (popupData.image) {
        popupImagePreview.src = popupData.image;
        popupImagePreview.style.display = 'block';
      }
    }
  };
  loadPopupSettings();

  popupImageFile.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        popupImage.value = e.target.result;
        popupImagePreview.src = e.target.result;
        popupImagePreview.style.display = 'block';
      }
      reader.readAsDataURL(file);
    }
  });

  popupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      enabled: popupEnabled.value === 'true',
      image: popupImage.value
    };
    localStorage.setItem('admin_popup', JSON.stringify(data));
    alert('Popup settings saved!');
  });


  // --- SLIDER MANAGEMENT ---
  const addSlideForm = document.getElementById('addSlideForm');
  const slidesTableBody = document.getElementById('slidesTableBody');
  const totalSlidesSpan = document.getElementById('totalSlides');
  const slideImageFile = document.getElementById('slideImageFile');
  const slideImageHidden = document.getElementById('slideImage');

  slideImageFile.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        slideImageHidden.value = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  });

  const renderSlides = () => {
    const slides = JSON.parse(localStorage.getItem('admin_slides'));
    totalSlidesSpan.textContent = slides.length;
    slidesTableBody.innerHTML = '';
    slides.forEach((slide, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${slide.image}" alt="Slide" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
        <td>${slide.heading}</td>
        <td><button class="btn btn-danger" onclick="deleteSlide(${index})">Delete</button></td>
      `;
      slidesTableBody.appendChild(tr);
    });
  };

  addSlideForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const slides = JSON.parse(localStorage.getItem('admin_slides'));
    
    if (!slideImageHidden.value) {
      alert("Please upload a slide image first.");
      return;
    }

    slides.push({
      image: slideImageHidden.value,
      badge: document.getElementById('slideBadge').value,
      heading: document.getElementById('slideHeading').value,
      desc: document.getElementById('slideDesc').value
    });
    localStorage.setItem('admin_slides', JSON.stringify(slides));
    addSlideForm.reset();
    slideImageHidden.value = '';
    renderSlides();
  });

  window.deleteSlide = (index) => {
    if(confirm('Delete this slide?')){
      const slides = JSON.parse(localStorage.getItem('admin_slides'));
      slides.splice(index, 1);
      localStorage.setItem('admin_slides', JSON.stringify(slides));
      renderSlides();
    }
  };
  renderSlides();


  // --- JOBS MANAGEMENT ---
  const addJobForm = document.getElementById('addJobForm');
  const jobsTableBody = document.getElementById('jobsTableBody');
  const totalJobsSpan = document.getElementById('totalJobs');
  const submitJobBtn = addJobForm.querySelector('button[type="submit"]');
  let currentEditJobId = null;

  const renderJobs = () => {
    const jobs = JSON.parse(localStorage.getItem('admin_jobs'));
    totalJobsSpan.textContent = jobs.length;
    jobsTableBody.innerHTML = '';
    jobs.forEach((job) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${job.title} ${job.badge ? `<span style="background:var(--secondary-color); color:white; padding:2px 6px; border-radius:4px; font-size:12px;">${job.badge}</span>` : ''}</td>
        <td>${job.dept}</td>
        <td>${job.date}</td>
        <td>
          <button class="btn" style="background:#3b82f6; color:white; padding:5px 10px; font-size:0.9rem; margin-right:5px;" onclick="editJob(${job.id})">Edit</button>
          <button class="btn btn-danger" onclick="deleteJob(${job.id})">Delete</button>
        </td>
      `;
      jobsTableBody.appendChild(tr);
    });
  };

  window.editJob = (id) => {
    const jobs = JSON.parse(localStorage.getItem('admin_jobs')) || [];
    const job = jobs.find(j => j.id === id);
    if (job) {
      document.getElementById('jobTitle').value = job.title;
      document.getElementById('jobDept').value = job.dept;
      document.getElementById('jobShortDetails').value = job.shortDetails || '';
      document.getElementById('jobDate').value = job.date;
      document.getElementById('jobBadge').value = job.badge || '';
      document.getElementById('jobPosts').value = job.posts || '';
      document.getElementById('jobAppBegin').value = job.appBegin || '';
      document.getElementById('jobFeeLastDate').value = job.feeLastDate || '';
      document.getElementById('jobExamDate').value = job.examDate || '';
      document.getElementById('jobFeeGen').value = job.feeGen || '';
      document.getElementById('jobFeeSc').value = job.feeSc || '';
      document.getElementById('jobAgeAsOn').value = job.ageAsOn || '';
      document.getElementById('jobAgeMin').value = job.ageMin || '';
      document.getElementById('jobAgeMax').value = job.ageMax || '';
      document.getElementById('jobLink').value = job.link || '';
      document.getElementById('jobNotifLink').value = job.notifLink || '';
      document.getElementById('jobOfficialLink').value = job.officialLink || '';
      
      currentEditJobId = id;
      submitJobBtn.textContent = 'Update Job';
      
      // Scroll to form
      document.getElementById('jobs-mgmt').scrollIntoView({ behavior: 'smooth' });
    }
  };

  addJobForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const jobs = JSON.parse(localStorage.getItem('admin_jobs')) || [];
    
    const jobData = {
      title: document.getElementById('jobTitle').value,
      dept: document.getElementById('jobDept').value,
      shortDetails: document.getElementById('jobShortDetails').value || '',
      date: document.getElementById('jobDate').value,
      badge: document.getElementById('jobBadge').value,
      posts: document.getElementById('jobPosts').value || 'Not Specified',
      appBegin: document.getElementById('jobAppBegin').value || '',
      feeLastDate: document.getElementById('jobFeeLastDate').value || '',
      examDate: document.getElementById('jobExamDate').value || 'Notified Soon',
      feeGen: document.getElementById('jobFeeGen').value || '0/-',
      feeSc: document.getElementById('jobFeeSc').value || '0/-',
      ageAsOn: document.getElementById('jobAgeAsOn').value || '',
      ageMin: document.getElementById('jobAgeMin').value || 'NA',
      ageMax: document.getElementById('jobAgeMax').value || 'NA',
      link: document.getElementById('jobLink').value || '#',
      notifLink: document.getElementById('jobNotifLink').value || '#',
      officialLink: document.getElementById('jobOfficialLink').value || '#'
    };
    
    if (currentEditJobId) {
      // Update existing
      const index = jobs.findIndex(j => j.id === currentEditJobId);
      if (index !== -1) {
        jobs[index] = { ...jobs[index], ...jobData };
      }
      currentEditJobId = null;
      submitJobBtn.textContent = 'Add Job';
      alert('Job Updated Successfully!');
    } else {
      // Add new
      jobData.id = Date.now();
      jobs.unshift(jobData);
      alert('New Job Added Successfully!');
    }
    
    localStorage.setItem('admin_jobs', JSON.stringify(jobs));
    addJobForm.reset();
    renderJobs();
  });

  window.deleteJob = (id) => {
    if(confirm('Delete this job?')){
      let jobs = JSON.parse(localStorage.getItem('admin_jobs'));
      jobs = jobs.filter(j => j.id !== id);
      localStorage.setItem('admin_jobs', JSON.stringify(jobs));
      renderJobs();
    }
  };
  renderJobs();


  // --- INQUIRIES & USERS MANAGEMENT ---
  const inquiriesTableBody = document.getElementById('inquiriesTableBody');
  const totalInquiriesSpan = document.getElementById('totalInquiries');
  const totalUsersSpan = document.getElementById('totalUsers');

  const renderInquiries = async () => {
    try {
      const snap = await db.collection('inquiries').orderBy('timestamp', 'desc').get();
      totalInquiriesSpan.textContent = snap.size;
      
      const usersSnap = await db.collection('users').get();
      if(totalUsersSpan) totalUsersSpan.textContent = usersSnap.size;
      
      inquiriesTableBody.innerHTML = '';
      
      if (snap.empty) {
        inquiriesTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">No inquiries yet.</td></tr>';
        return;
      }

      snap.forEach((docSnap) => {
        const inq = docSnap.data();
        const docId = docSnap.id;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${inq.date}</td>
          <td>${inq.name}</td>
          <td>${inq.phone}</td>
          <td>${inq.subject}</td>
          <td>${inq.message}</td>
          <td><button class="btn btn-danger" onclick="deleteInquiry('${docId}')">Delete</button></td>
        `;
        inquiriesTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
    }
  };

  window.deleteInquiry = async (docId) => {
    if(confirm('Delete this inquiry?')){
      try {
        await db.collection('inquiries').doc(docId).delete();
        renderInquiries();
      } catch (err) {
        console.error(err);
      }
    }
  };
  renderInquiries();

  // --- FORMS MANAGEMENT ---
  if (!localStorage.getItem('admin_forms')) {
    localStorage.setItem('admin_forms', JSON.stringify([
      { id: 1, name: 'Bonafied Form 2026 pdf (मूल निवास प्रमाण पत्र फॉर्म राजस्थान के लिए)', url: '#', videoUrl: '#' },
      { id: 2, name: 'SC / ST Cast Certificate Form (अनुसूचित जाति व अनुसूचित जनजाति आवेदन फॉर्म)', url: '#', videoUrl: '#' },
      { id: 3, name: 'OBC Caste Certificate Form State / Center 2026 (अन्य पिछड़ी जाति प्रमाण पत्र)', url: '#', videoUrl: '#' },
      { id: 4, name: 'NEW OBC Caste Certificate Form State / Center 2026', url: '#', videoUrl: '#' },
      { id: 5, name: 'Form for Caste Certificate General (सामान्य वर्ग जाति प्रमाण पत्र के लिए आवेदन पत्र)', url: '#', videoUrl: '#' },
      { id: 6, name: 'अल्पसंख्यक जाति प्रमाण पत्र के लिए आवेदन पत्र (Application form for minority caste certificate)', url: '#', videoUrl: '#' }
    ]));
  }

  const addFormForm = document.getElementById('addFormForm');
  const formsTableBody = document.getElementById('formsTableBody');
  const totalFormsSpan = document.getElementById('totalForms');
  const formPdfFile = document.getElementById('formPdfFile');
  const formPdfBase64 = document.getElementById('formPdfBase64');

  if (formPdfFile) {
    formPdfFile.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          formPdfBase64.value = e.target.result;
        }
        reader.readAsDataURL(file);
      }
    });
  }

  const renderForms = () => {
    const forms = JSON.parse(localStorage.getItem('admin_forms')) || [];
    if(totalFormsSpan) totalFormsSpan.textContent = forms.length;
    if(formsTableBody) {
      formsTableBody.innerHTML = '';
      forms.forEach((form, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${form.name}</td>
          <td>
            <a href="${form.url}" target="_blank" class="btn btn-primary" style="padding:4px 8px; font-size:12px; margin-right:5px; text-decoration:none;">View</a>
            <button class="btn btn-danger" style="padding:4px 8px; font-size:12px;" onclick="deleteForm(${form.id})">Delete</button>
          </td>
        `;
        formsTableBody.appendChild(tr);
      });
    }
  };

  window.deleteForm = (id) => {
    if(confirm('Delete this form?')){
      let forms = JSON.parse(localStorage.getItem('admin_forms')) || [];
      forms = forms.filter(f => f.id !== id);
      localStorage.setItem('admin_forms', JSON.stringify(forms));
      renderForms();
    }
  };

  if(addFormForm) {
    addFormForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const forms = JSON.parse(localStorage.getItem('admin_forms')) || [];
      
      let finalUrl = document.getElementById('formPdfUrl').value;
      if (!finalUrl && formPdfBase64.value) {
        finalUrl = formPdfBase64.value;
      }
      
      if (!finalUrl) {
        alert('Please provide a PDF URL or upload a PDF file.');
        return;
      }

      forms.push({
        id: Date.now(),
        name: document.getElementById('formName').value,
        url: finalUrl,
        videoUrl: document.getElementById('formVideoUrl').value || '#'
      });
      localStorage.setItem('admin_forms', JSON.stringify(forms));
      addFormForm.reset();
      formPdfBase64.value = '';
      renderForms();
      alert('Form Added Successfully!');
    });
  }

  renderForms();

  // --- USERS MANAGEMENT & ADMIN DOC VIEWER ---
  const usersTableBody = document.getElementById('usersTableBody');
  const adminDocModal = document.getElementById('adminDocModal');
  const modalUserName = document.getElementById('modalUserName');
  const adminDocumentList = document.getElementById('adminDocumentList');

  const renderUsers = async () => {
    if (!usersTableBody) return;
    try {
      const usersSnap = await db.collection('users').get();
      usersTableBody.innerHTML = '';
      
      if (usersSnap.empty) {
        usersTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">No users registered yet.</td></tr>';
        return;
      }
      
      usersSnap.forEach(docSnap => {
        const u = docSnap.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>
            <button class="btn btn-outline" style="font-size: 0.8rem; padding: 5px 10px;" onclick="viewUserDocs('${u.email}', '${u.name}')">View Documents</button>
          </td>
        `;
        usersTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
    }
  };

  window.viewUserDocs = async (email, name) => {
    modalUserName.textContent = "Documents: " + name;
    adminDocumentList.innerHTML = '<li style="width: 100%; text-align: center;">Loading...</li>';
    adminDocModal.style.display = 'block';
    
    try {
      const snap = await db.collection('documents').where('email', '==', email).get();
      adminDocumentList.innerHTML = '';
      
      if (snap.empty) {
        adminDocumentList.innerHTML = '<li style="width: 100%; text-align: center; font-size: 1.1rem; color: #64748b; padding: 20px;">No documents uploaded by this user.</li>';
      } else {
        snap.forEach(docSnap => {
          const doc = docSnap.data();
          const li = document.createElement('li');
          li.className = 'doc-item';
          
          let thumbnailHtml = '';
          if (doc.type && doc.type.startsWith('image')) {
            thumbnailHtml = `<img src="${doc.url}" alt="${doc.name}">`;
          } else {
            thumbnailHtml = `<i class="fa-solid fa-file-pdf" style="font-size: 4rem; color: #facc15;"></i>`;
          }

          li.innerHTML = `
            <div class="album-binding"></div>
            <div class="doc-cover">
              ${thumbnailHtml}
              <strong>${doc.name}</strong>
              <small>${doc.date}</small>
            </div>
            <div class="doc-actions">
              <a href="${doc.url}" target="_blank">View / Download</a>
            </div>
          `;
          adminDocumentList.appendChild(li);
        });
      }
    } catch (err) {
      console.error(err);
      adminDocumentList.innerHTML = '<li style="color:red;">Error loading documents.</li>';
    }
  };

  renderUsers();

});
