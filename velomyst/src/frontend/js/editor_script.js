// Handle Image Selection & Preview
document.getElementById("image").addEventListener("change", function () {
  const image = this.files[0];

  // Check image size (max 2MB)
  if (image && image.size > 2097152) {
    alert("Image size exceeds 2MB!");
    return;
  }

  // Preview image
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById("preview").src = reader.result;
    document.getElementById("preview").style.display = "block";
  };
  reader.readAsDataURL(image);
});

// Initialize Quill Editor
const editor = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline"],
      ["image", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  },
  placeholder: "Type your blog post here...",
  formats: [
    "header",
    "bold",
    "italic",
    "underline",
    "image",
    "code-block",
    "list",
    "indent",
    "color",
    "background",
  ],
});

// Handle Save Button Click
document.getElementById("save-button").addEventListener("click", async function () {
  document.getElementById("loader").style.display = "block"; // Show loader

  const heading = document.getElementById("heading").value;
  const summary = document.getElementById("summary").value;
  const image = document.getElementById("image").files[0];
  const content = editor.root.innerHTML;

  // Summary validation (max 200 chars)
  if (summary.length > 200) {
    alert("Summary exceeds 200 characters!");
    document.getElementById("loader").style.display = "none";
    return;
  }

  let imageUrl = "";

  try {
    if (image) {
      imageUrl = await uploadImage(image);
    }
    await uploadData(heading, summary, imageUrl, content);
  } catch (error) {
    console.error("Error during saving process:", error);
  } finally {
    document.getElementById("loader").style.display = "none"; // Hide loader
  }
});

// Upload Image Function
async function uploadImage(image) {
  try {
    const response = await fetch("https://quack-mama.onrender.com/docs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileType: "image" }),
    });

    if (!response.ok) throw new Error(`Failed to get upload URL: ${response.status}`);

    const { presignedUrl } = await response.json();

    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: image,
    });

    if (!uploadResponse.ok) throw new Error(`Image upload failed: ${uploadResponse.status}`);

    return presignedUrl; // Use the presigned URL as the image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    return ""; // Return empty string if upload fails
  }
}

// Upload Blog Data Function
async function uploadData(heading, summary, imageUrl, content) {
  try {
    const response = await fetch("https://quack-mama.onrender.com/upload-media-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heading, summary, imageUrl, content }),
    });

    if (!response.ok) throw new Error(`Failed to upload data: ${response.status}`);

    console.log("Blog post uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
}
