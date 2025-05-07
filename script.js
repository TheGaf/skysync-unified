document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));

  // Fetch latest Bluesky posts
  fetch("/api/bluesky/feed")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("bluesky-feed");
      container.innerHTML = "";

      if (!data.posts || data.posts.length === 0) {
        container.innerHTML = "<p>No posts found.</p>";
        return;
      }

      data.posts.slice(0, 5).forEach(post => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        postDiv.innerHTML = `
          <a href="https://bsky.app/profile/${post.uri}" target="_blank" style="color:#0ff; font-weight:bold;">
            ${post.text}
          </a><br>
          <small style="color:#ccc;">
            ${new Date(post.createdAt).toLocaleString()}
          </small>
        `;

        container.appendChild(postDiv);
      });
    })
    .catch(err => {
      document.getElementById("bluesky-feed").innerText = "Failed to load feed.";
      console.error("Feed error:", err);
    });

  document.getElementById("save-to-notion").innerText = "[Post list with save buttons — WIP]";
  document.getElementById("notion-drafts").innerText = "[Drafts pulled from Notion — WIP]";
  document.getElementById("labeler-status").innerText = "[Labels from labels.json — WIP]";
});
