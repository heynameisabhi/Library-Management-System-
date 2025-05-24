// Enhanced Member Management System
window.setupMemberManagement = function() {
  // DOM Elements
  const memberForm = document.getElementById('addMemberForm');
  const memberTable = document.getElementById('memberTableBody');
  const searchInput = document.getElementById('searchBar');
  const memberTypeFilter = document.getElementById('memberTypeFilter');
  const memberModal = document.getElementById('memberModal');
  const memberDetailsModal = document.getElementById('memberDetailsModal');
  const addMemberBtn = document.getElementById('addMemberBtn');
  const refreshMembersBtn = document.getElementById('refreshMembersBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelMemberBtn = document.getElementById('cancelMemberBtn');
  const closeMemberDetailsBtn = document.getElementById('closeMemberDetailsBtn');
  const closeMemberDetailsBtn2 = document.getElementById('closeMemberDetailsBtn2');
  const editMemberFromDetailsBtn = document.getElementById('editMemberFromDetailsBtn');
  const modalTitle = document.getElementById('modalTitle');
  const submitMemberBtn = document.getElementById('submitMemberBtn');
  const emptyMembersState = document.getElementById('emptyMembersState');

  // Statistics elements
  const totalMembersCount = document.getElementById('totalMembersCount');
  const activeMembersCount = document.getElementById('activeMembersCount');
  const premiumMembersCount = document.getElementById('premiumMembersCount');
  const studentMembersCount = document.getElementById('studentMembersCount');

  const apiUrl = '/member';
  let editingMemberId = null;
  let allMembers = [];
  let currentMemberForDetails = null;

  // Initialize event listeners
  function initializeEventListeners() {
    addMemberBtn.addEventListener('click', () => openMemberModal());
    refreshMembersBtn.addEventListener('click', fetchMembers);
    closeModalBtn.addEventListener('click', closeMemberModal);
    cancelMemberBtn.addEventListener('click', closeMemberModal);
    closeMemberDetailsBtn.addEventListener('click', closeMemberDetailsModal);
    closeMemberDetailsBtn2.addEventListener('click', closeMemberDetailsModal);
    editMemberFromDetailsBtn.addEventListener('click', editMemberFromDetails);

    memberForm.addEventListener('submit', handleMemberSubmit);
    memberTable.addEventListener('click', handleTableActions);
    searchInput.addEventListener('input', filterMembers);
    memberTypeFilter.addEventListener('change', filterMembers);

    // Close modals when clicking outside
    memberModal.addEventListener('click', (e) => {
      if (e.target === memberModal) closeMemberModal();
    });

    memberDetailsModal.addEventListener('click', (e) => {
      if (e.target === memberDetailsModal) closeMemberDetailsModal();
    });
  }

  // Fetch members from API
  function fetchMembers() {
    console.log('Fetching members...');
    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch members');
        return res.json();
      })
      .then(data => {
        allMembers = data;
        renderMembers(data);
        updateStatistics(data);
        console.log('Members fetched successfully:', data.length);
      })
      .catch(err => {
        console.error('Error fetching members:', err);
        showNotification('Failed to load members', 'error');
      });
  }

  // Update statistics cards
  function updateStatistics(members) {
    const total = members.length;
    const premium = members.filter(m => m.membershipType === 'PREMIUM').length;
    const student = members.filter(m => m.membershipType === 'STUDENT').length;
    const regular = members.filter(m => m.membershipType === 'REGULAR').length;

    totalMembersCount.textContent = total;
    activeMembersCount.textContent = total; // For now, all members are considered active
    premiumMembersCount.textContent = premium;
    studentMembersCount.textContent = student;
  }

  // Render members table
  function renderMembers(members) {
    memberTable.innerHTML = '';

    if (members.length === 0) {
      emptyMembersState.classList.remove('hidden');
      return;
    }

    emptyMembersState.classList.add('hidden');

    members.forEach(member => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-gray-50 transition-colors';

      const membershipBadge = getMembershipBadge(member.membershipType);
      const statusBadge = getStatusBadge('Active'); // For now, all members are active

      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-user text-blue-600"></i>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${member.name}</div>
              <div class="text-sm text-gray-500">ID: ${member.memberid}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${member.phoneNumber}</div>
          <div class="text-sm text-gray-500">${member.email}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${membershipBadge}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${statusBadge}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex space-x-2">
            <button class="text-blue-600 hover:text-blue-900 transition" data-id="${member.memberid}" data-action="view" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="text-yellow-600 hover:text-yellow-900 transition" data-id="${member.memberid}" data-action="edit" title="Edit Member">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-900 transition" data-id="${member.memberid}" data-action="delete" title="Delete Member">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      memberTable.appendChild(tr);
    });
  }

  function resetForm() {
    memberForm.reset();
    editingMemberId = null;
    memberForm.querySelector('button[type="submit"]').textContent = 'Add Member';
  }

  // Helper functions for badges
  function getMembershipBadge(type) {
    const badges = {
      'REGULAR': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><i class="fas fa-user mr-1"></i>Regular</span>',
      'PREMIUM': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><i class="fas fa-crown mr-1"></i>Premium</span>',
      'STUDENT': '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><i class="fas fa-graduation-cap mr-1"></i>Student</span>'
    };
    return badges[type] || badges['REGULAR'];
  }

  function getStatusBadge(status) {
    return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-check-circle mr-1"></i>Active</span>';
  }

  // Modal functions
  function openMemberModal(member = null) {
    if (member) {
      // Edit mode
      editingMemberId = member.memberid;
      modalTitle.textContent = 'Edit Member';
      submitMemberBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Update Member';

      // Populate form
      memberForm.name.value = member.name;
      memberForm.address.value = member.address;
      memberForm.phoneNumber.value = member.phoneNumber;
      memberForm.email.value = member.email;
      memberForm.membershipType.value = member.membershipType;
    } else {
      // Add mode
      editingMemberId = null;
      modalTitle.textContent = 'Add New Member';
      submitMemberBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Add Member';
      memberForm.reset();
    }

    memberModal.classList.remove('hidden');
    memberForm.name.focus();
  }

  function closeMemberModal() {
    memberModal.classList.add('hidden');
    memberForm.reset();
    editingMemberId = null;
  }

  function openMemberDetailsModal(member) {
    currentMemberForDetails = member;
    const content = document.getElementById('memberDetailsContent');

    content.innerHTML = `
      <div class="grid grid-cols-1 gap-4">
        <div class="flex items-center space-x-4">
          <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="fas fa-user text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h4 class="text-lg font-semibold text-gray-900">${member.name}</h4>
            <p class="text-sm text-gray-500">Member ID: ${member.memberid}</p>
            ${getMembershipBadge(member.membershipType)}
          </div>
        </div>

        <div class="border-t pt-4">
          <dl class="grid grid-cols-1 gap-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Email Address</dt>
              <dd class="mt-1 text-sm text-gray-900">${member.email}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd class="mt-1 text-sm text-gray-900">${member.phoneNumber}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Address</dt>
              <dd class="mt-1 text-sm text-gray-900">${member.address}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Membership Type</dt>
              <dd class="mt-1">${getMembershipBadge(member.membershipType)}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">${getStatusBadge('Active')}</dd>
            </div>
          </dl>
        </div>
      </div>
    `;

    memberDetailsModal.classList.remove('hidden');
  }

  function closeMemberDetailsModal() {
    memberDetailsModal.classList.add('hidden');
    currentMemberForDetails = null;
  }

  function editMemberFromDetails() {
    if (currentMemberForDetails) {
      closeMemberDetailsModal();
      openMemberModal(currentMemberForDetails);
    }
  }

  // Form submission handler
  function handleMemberSubmit(e) {
    e.preventDefault();

    const formData = new FormData(memberForm);
    const memberData = {
      name: formData.get('name').trim(),
      address: formData.get('address').trim(),
      phoneNumber: formData.get('phoneNumber').trim(),
      email: formData.get('email').trim(),
      membershipType: formData.get('membershipType')
    };

    // Validation
    if (!Object.values(memberData).every(v => v)) {
      showNotification('Please fill all the fields.', 'error');
      return;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(memberData.phoneNumber)) {
      showNotification('Please enter a valid 10-digit phone number.', 'error');
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    const method = editingMemberId ? 'PUT' : 'POST';
    const url = editingMemberId ? `${apiUrl}/${editingMemberId}` : apiUrl;

    // Disable submit button during request
    submitMemberBtn.disabled = true;
    submitMemberBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save member');
        return res.json();
      })
      .then(() => {
        const action = editingMemberId ? 'updated' : 'added';
        showNotification(`Member ${action} successfully!`, 'success');
        closeMemberModal();
        fetchMembers();
      })
      .catch(err => {
        console.error('Error saving member:', err);
        showNotification('Error saving member: ' + err.message, 'error');
      })
      .finally(() => {
        submitMemberBtn.disabled = false;
        submitMemberBtn.innerHTML = editingMemberId ?
          '<i class="fas fa-save mr-2"></i>Update Member' :
          '<i class="fas fa-save mr-2"></i>Add Member';
      });
  }

  // Table actions handler
  function handleTableActions(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;
    const member = allMembers.find(m => m.memberid == id);

    if (!member) {
      showNotification('Member not found', 'error');
      return;
    }

    switch (action) {
      case 'view':
        openMemberDetailsModal(member);
        break;
      case 'edit':
        openMemberModal(member);
        break;
      case 'delete':
        deleteMember(id, member.name);
        break;
    }
  }

  // Delete member function
  function deleteMember(id, name) {
    if (!confirm(`Are you sure you want to delete member "${name}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete member');
        showNotification('Member deleted successfully!', 'success');
        fetchMembers();
      })
      .catch(err => {
        console.error('Error deleting member:', err);
        showNotification('Error deleting member: ' + err.message, 'error');
      });
  }

  // Filter members function
  function filterMembers() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = memberTypeFilter.value;

    let filteredMembers = allMembers;

    // Filter by search term
    if (searchTerm) {
      filteredMembers = filteredMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        member.phoneNumber.toString().includes(searchTerm) ||
        member.address.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by membership type
    if (typeFilter) {
      filteredMembers = filteredMembers.filter(member =>
        member.membershipType === typeFilter
      );
    }

    renderMembers(filteredMembers);
  }

  // Notification function
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
      type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
      'bg-blue-100 text-blue-800 border border-blue-200'
    }`;

    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas ${
          type === 'success' ? 'fa-check-circle' :
          type === 'error' ? 'fa-exclamation-circle' :
          'fa-info-circle'
        } mr-2"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Initialize the system
  initializeEventListeners();
  fetchMembers();
}

// The function will be called from the main HTML page
// window.setupMemberManagement();