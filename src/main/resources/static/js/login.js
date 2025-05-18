document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    console.log("Trying to login with:", email);

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

      if (data.role === "member") {
        window.location.href = "member-dashboard.html";
      } else if (data.role === "staff") {
        window.location.href = "staff-dashboard.html";
      } else {
        alert("Unknown role: " + data.role);
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Login error: " + err.message);
    }
  });
});
