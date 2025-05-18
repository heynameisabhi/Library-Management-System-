export function setupMemberManagement() {
  const memberForm = document.getElementById('addMemberForm');
  const memberTable = document.getElementById('memberTableBody');
  const searchInput = document.getElementById('searchBar');
  const apiUrl = '/member';
  let editingMemberId = null;

  function fetchMembers() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => renderMembers(data))
      .catch(err => console.error('Error fetching members:', err));
  }

  function renderMembers(members) {
    memberTable.innerHTML = '';
    members.forEach(member => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="border p-2">${member.name}</td>
        <td class="border p-2">${member.address}</td>
        <td class="border p-2">${member.phoneNumber}</td>
        <td class="border p-2">${member.email}</td>
        <td class="border p-2">${member.membershipType}</td>
        <td class="border p-2 flex gap-2">
          <button class="bg-yellow-500 px-2 py-1 rounded text-white" data-id="${member.memberid}" data-action="edit">Edit</button>
          <button class="bg-red-600 px-2 py-1 rounded text-white" data-id="${member.memberid}" data-action="delete">Delete</button>
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

  memberForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newMember = {
      name: memberForm.name.value.trim(),
      address: memberForm.address.value.trim(),
      phoneNumber: memberForm.phoneNumber.value.trim(),
      email: memberForm.email.value.trim(),
      membershipType: memberForm.membershipType.value
    };
  console.log('new Member to be added', newMember)
    if (!Object.values(newMember).every(v => v)) {
      alert('Please fill all the fields.');
      return;
    }

    const method = editingMemberId ? 'PUT' : 'POST';
    const url = editingMemberId ? `${apiUrl}/${editingMemberId}` : apiUrl;
	console.log('apiUrl to be added', apiUrl)
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMember)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save member');
        return res.json();
      })
      .then(() => {
        resetForm();
        fetchMembers();
      })
      .catch(err => alert('Error saving member: ' + err.message));
  });

  memberTable.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === 'edit') {
      fetch(`${apiUrl}/${id}`)
        .then(res => res.json())
        .then(member => {
          editingMemberId = id;
          memberForm.name.value = member.name;
          memberForm.address.value = member.address;
          memberForm.phoneNumber.value = member.phoneNumber;
          memberForm.email.value = member.email;
          memberForm.membershipType.value = member.membershipType;
          memberForm.querySelector('button[type="submit"]').textContent = 'Update Member';
        });
    } else if (action === 'delete') {
      if (!confirm('Delete this member?')) return;
      fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(() => fetchMembers())
        .catch(err => alert('Error deleting member: ' + err));
    }
  });

  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    document.querySelectorAll('#memberTableBody tr').forEach(row => {
      const match = [...row.children].some(td =>
        td.textContent.toLowerCase().includes(keyword)
      );
      row.style.display = match ? '' : 'none';
    });
  });

  // Initial load
  fetchMembers();
}

setupMemberManagement(); // 🔥 Call the function to initialize