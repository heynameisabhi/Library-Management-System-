document.addEventListener("DOMContentLoaded", () => {
  console.log("Login page loaded");

  // Get DOM elements
  const staffLoginTab = document.getElementById("staffLoginTab");
  const studentLoginTab = document.getElementById("studentLoginTab");
  const staffLoginForm = document.getElementById("staffLoginForm");
  const studentLoginForm = document.getElementById("studentLoginForm");

  console.log("Elements found:", {
    staffLoginTab: !!staffLoginTab,
    studentLoginTab: !!studentLoginTab,
    staffLoginForm: !!staffLoginForm,
    studentLoginForm: !!studentLoginForm
  });

  // Tab switching functionality
  if (staffLoginTab && studentLoginTab && staffLoginForm && studentLoginForm) {
    staffLoginTab.addEventListener("click", () => {
      console.log("Staff tab clicked");
      // Update tab appearance
      staffLoginTab.classList.add("bg-white", "bg-opacity-30");
      studentLoginTab.classList.remove("bg-white", "bg-opacity-30");

      // Show/hide forms
      staffLoginForm.classList.remove("hidden");
      studentLoginForm.classList.add("hidden");
    });

    studentLoginTab.addEventListener("click", () => {
      console.log("Student tab clicked");
      // Update tab appearance
      studentLoginTab.classList.add("bg-white", "bg-opacity-30");
      staffLoginTab.classList.remove("bg-white", "bg-opacity-30");

      // Show/hide forms
      studentLoginForm.classList.remove("hidden");
      staffLoginForm.classList.add("hidden");
    });
  } else {
    console.error("Some elements not found!");
  }

  // Staff login form handler
  staffLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("staffEmail").value.trim();
    const password = document.getElementById("staffPassword").value.trim();
    console.log("Trying staff login with:", email);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      console.log("Status:", response.status);

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Response JSON:", data);

      if (data.role === "staff") {
        window.location.href = "staff-dashboard.html";
      } else {
        alert("Invalid staff credentials");
      }

    } catch (err) {
      console.error("Staff login error:", err);
      alert("Login error: " + err.message);
    }
  });

  // Student login form handler
  studentLoginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("studentEmail").value.trim();
    const memberId = document.getElementById("studentMemberId").value.trim();
    console.log("Trying student login with:", email, "Member ID:", memberId);

    try {
      // For student login, we'll verify against the members database
      const response = await fetch("/api/members");

      if (!response.ok) {
        throw new Error("Failed to verify student credentials");
      }

      const members = await response.json();
      console.log("Members data:", members);

      // Find member by email and member ID
      const student = members.find(member =>
        member.email.toLowerCase() === email.toLowerCase() &&
        member.memberid.toString() === memberId.toString()
      );

      if (!student) {
        throw new Error("Invalid student credentials");
      }

      // Check if it's a student member
      if (student.membershipType !== 'STUDENT') {
        throw new Error("This login is only for student members");
      }

      console.log("Student login successful:", student);

      // Store student data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(student));
      localStorage.setItem('currentStudent', JSON.stringify(student)); // Keep for backward compatibility

      // Redirect to users portal
      window.location.href = "users-portal.html";

    } catch (err) {
      console.error("Student login error:", err);
      alert("Login error: " + err.message);
    }
  });
});
