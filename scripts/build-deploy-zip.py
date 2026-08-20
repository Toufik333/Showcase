import os
import zipfile

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_zip = os.path.join(project_root, "namecheap-deploy.zip")

# Individual files to include
include_files = [
    "package.json",
    "package-lock.json",
    "server.js",
    ".env.example",
    "schema.sql",
    "next.config.mjs",
    "tsconfig.json",
    "postcss.config.mjs",
]

# Folders to include recursively
include_dirs = [
    ".next",
    "src",
]

if os.path.exists(os.path.join(project_root, "public")):
    include_dirs.append("public")

print("Building deployment ZIP with POSIX permissions (0755 dirs, 0644 files)...")

if os.path.exists(output_zip):
    os.remove(output_zip)

with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zf:
    # Add root files
    for fname in include_files:
        fpath = os.path.join(project_root, fname)
        if os.path.exists(fpath):
            zinfo = zipfile.ZipInfo(fname)
            zinfo.compress_type = zipfile.ZIP_DEFLATED
            zinfo.create_system = 3  # Unix system identifier
            zinfo.external_attr = 0o100644 << 16  # -rw-r--r--
            with open(fpath, "rb") as f:
                zf.writestr(zinfo, f.read())
            print(f"  + file: {fname}")

    # Add directories recursively
    for dname in include_dirs:
        dir_path = os.path.join(project_root, dname)
        if not os.path.exists(dir_path):
            continue

        for root, dirs, files in os.walk(dir_path):
            # Exclude cache and standalone from .next
            if ".next" in root:
                dirs[:] = [d for d in dirs if d not in ["cache", "standalone"]]

            rel_root = os.path.relpath(root, project_root).replace("\\", "/")

            # Add directory entry with 0755 permissions
            if rel_root != ".":
                zinfo_dir = zipfile.ZipInfo(rel_root + "/")
                zinfo_dir.create_system = 3  # Unix system identifier
                zinfo_dir.external_attr = (0o040755 << 16) | 0x10  # directory + rwxr-xr-x
                zf.writestr(zinfo_dir, "")

            # Add file entries with 0644 permissions
            for file in files:
                file_path = os.path.join(root, file)
                rel_file = os.path.relpath(file_path, project_root).replace("\\", "/")
                
                zinfo_file = zipfile.ZipInfo(rel_file)
                zinfo_file.compress_type = zipfile.ZIP_DEFLATED
                zinfo_file.create_system = 3  # Unix system identifier
                zinfo_file.external_attr = 0o100644 << 16  # -rw-r--r--
                
                with open(file_path, "rb") as f:
                    zf.writestr(zinfo_file, f.read())

zip_size_mb = os.path.getsize(output_zip) / (1024 * 1024)
print(f"\nSUCCESS: Created {output_zip} ({zip_size_mb:.2f} MB)")
