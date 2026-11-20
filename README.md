# Naeun Choi — Research Website

GitHub Pages: <https://mesilver1218.github.io/Naeun-Choi-website/>

Static HTML portfolio with a home page (`index.html`) and research detail pages (`projects/*.html`).

## Media: one folder per project

Store media in `assets/media/`:

```text
assets/media/
  profile.jpg                 # personal profile photo (keep at root)
  vla/
    cover.png
    01_real_world.mp4
  go2/
    cover.png
    01_simulation.mp4
    02_single_target_tracking.mp4
  door/
    cover.png
    01_hdl_navigation.mp4
    02_moro_navigation.mp4
    03_simulation.png
  recon/
    cover.png
    01_map.png
  grasp/
    cover.png
    01_butterwaffle.mp4
    02_butterwaffle.png
  arm/
    cover.png
    01_init.mp4
  factory/
    cover.png
```

Project folder names must be exactly `vla`, `go2`, `door`, `recon`, `grasp`, `arm`, and `factory`.

- **Cover image:** `cover.png`, `cover.jpg`, `cover.webp`, or `cover.jpeg`. Home cards display the cover.
- **Additional images/videos:** `01_name.png`, `02_name.mp4`, `03_name.mp4`, etc. The galleries discover and sort all files numerically, mixing photos and videos.
- Supported image types: PNG, JPG/JPEG, WebP, GIF. Supported videos: MP4 and WebM; use **H.264/AAC MP4** for broad browser compatibility.
- The viewer uses the public GitHub repository's file listing; after a commit it may briefly show cached results. Root-level legacy images are still recognized during migration, but use the project folders going forward.
- GitHub's website uploader accepts individual files up to **25 MiB**. Keep video files smaller than that for efficient page loads. Do not commit oversized raw originals.
- Only publicly share content approved for release, especially research data, unreleased results, and footage of people.

The project galleries and home-page covers update automatically after files are uploaded. New projects or alternate hosted video platforms require website code changes.

## Update the CV

Replace `assets/naeun_choi_cv.pdf` with the newest PDF, retaining the exact filename. The home page contains a CV preview and a full-PDF link.
