import numpy as np
from PIL import Image
import os

# =========================
# USER PARAMETERS
# =========================
# Output folder (Windows path)
out_dir = r"C:\Users\ellinghaus\Desktop\Forschungsprojekte\VEC"
os.makedirs(out_dir, exist_ok=True)

# Gabor / small-stimulus settings
stim_size_px = 256  # square aperture for the Gabor stimuli
mu_cps_aperture = (
    16.0,
    24.0,
)  # low/high spatial freq in cycles per *stimulus aperture*
sigma_fraction = 0.1  # fractional bandwidth: sigma = mu * sigma_fraction
gabor_contrast = 0.30  # Michelson contrast of the target
gabor_sigma_px = stim_size_px / 6  # Gaussian window SD (in px)

# Noise levels (RMS)
noise_levels = {"low": 0.03, "high": 0.05}

# 2×2 composite separator (for the preview grid)
separator = 5
bg_gray = 128

# Fullscreen background noise size (no scaling when canvas is 1920x1080)
bg_width, bg_height = 1920, 1080
n_bg_per_level = 12  # how many background exemplars per level to generate

rng = np.random.default_rng(123)  # reproducibility


# =========================
# HELPERS
# =========================
def fft_bandpass_two_bands_cps_square(size_px, mu_cps, sigma_cps):
    """Square version in cycles-per-stimulus (cps) units (for 256×256 stimuli)."""
    N = size_px
    white = rng.normal(0, 1, (N, N)).astype(np.float32)
    F = np.fft.fft2(white)

    # cycles per pixel → convert to cps by multiplying by N (for old square logic)
    fx_cpp = np.fft.fftfreq(N)  # cycles per pixel (x)
    fy_cpp = np.fft.fftfreq(N)  # cycles per pixel (y)
    FX_cps = np.outer(np.ones(N), fx_cpp) * N
    FY_cps = np.outer(fy_cpp, np.ones(N)) * N
    R_cps = np.sqrt(FX_cps**2 + FY_cps**2)

    mu1, mu2 = mu_cps
    s1, s2 = sigma_cps
    H = np.exp(-0.5 * ((R_cps - mu1) / s1) ** 2) + np.exp(
        -0.5 * ((R_cps - mu2) / s2) ** 2
    )

    x = np.fft.ifft2(F * H).real.astype(np.float32)
    x -= x.mean()
    x /= max(np.sqrt(np.mean(x**2)), 1e-9)
    return x


def fft_bandpass_two_bands_cpp_rect(width, height, mu_cpp, sigma_cpp):
    """
    Rectangular version in cycles-per-pixel (cpp) units (for 1920×1080 backgrounds).
    Using cpp keeps the bands aligned with your Gabor’s frequencies regardless of image size.
    """
    white = rng.normal(0, 1, (height, width)).astype(np.float32)
    F = np.fft.fft2(white)

    fx_cpp = np.fft.fftfreq(width)  # cycles per pixel along x
    fy_cpp = np.fft.fftfreq(height)  # cycles per pixel along y
    FX, FY = np.meshgrid(fx_cpp, fy_cpp, indexing="xy")
    R_cpp = np.sqrt(FX**2 + FY**2)

    mu1, mu2 = mu_cpp
    s1, s2 = sigma_cpp
    H = np.exp(-0.5 * ((R_cpp - mu1) / s1) ** 2) + np.exp(
        -0.5 * ((R_cpp - mu2) / s2) ** 2
    )

    x = np.fft.ifft2(F * H).real.astype(np.float32)
    x -= x.mean()
    x /= max(np.sqrt(np.mean(x**2)), 1e-9)
    return x


def scale_to_rms(img, target_rms):
    x = img - img.mean()
    curr = np.sqrt(np.mean(x**2))
    return x * (target_rms / max(curr, 1e-9))


def to_png(img_float):
    # Map float image (any range) to 8-bit with mild tail clipping (±3σ)
    s = float(np.std(img_float))
    lo, hi = -3 * s, 3 * s
    y = np.clip(img_float, lo, hi)
    y = (y - lo) / (hi - lo + 1e-9)
    y8 = np.uint8(np.round(y * 255.0))
    return Image.fromarray(y8, mode="L")


def generate_gabor(stim_size_px, freq_cps, contrast, sigma_px):
    N = stim_size_px
    x = np.linspace(-0.5, 0.5, N, endpoint=False)
    X, Y = np.meshgrid(x, x)
    grating = np.cos(
        2 * np.pi * freq_cps * X
    )  # vertical Gabor; rotate by swapping X/Y or add orientation if needed
    gauss = np.exp(-(X**2 + Y**2) / (2 * (sigma_px / N) ** 2))
    return (contrast * grating * gauss).astype(np.float32)


# =========================
# PART A: 2×2 STIMULI @ 256×256 (+ composite with separator)
# =========================
# Bands for the 256×256 stimuli are defined in cps units (relative to the aperture width)
mu1_cps, mu2_cps = mu_cps_aperture
s1_cps, s2_cps = mu1_cps * sigma_fraction, mu2_cps * sigma_fraction

# Generate each noise level once for the 2×2 example (one exemplar per level)
images = {}
for nl, rms in noise_levels.items():
    noise_256 = fft_bandpass_two_bands_cps_square(
        stim_size_px, (mu1_cps, mu2_cps), (s1_cps, s2_cps)
    )
    noise_256 = scale_to_rms(noise_256, rms)
    for freq in mu_cps_aperture:
        gabor = generate_gabor(stim_size_px, freq, gabor_contrast, gabor_sigma_px)
        combined = noise_256 + gabor
        # Avoid global normalization that would distort contrasts; just rescale to 8-bit for saving
        img = to_png(combined)
        fname = rf"{out_dir}\stim_{nl}_{freq:.1f}cps.png"
        img.save(fname)
        images[(nl, freq)] = img

# Make 2×2 composite with small separator
comp_size = stim_size_px * 2 + separator
composite = Image.new("L", (comp_size, comp_size), color=bg_gray)
low_noise, high_noise = "low", "high"
low_freq, high_freq = mu_cps_aperture

# Top row: low noise
composite.paste(images[(low_noise, low_freq)], (0, 0))
composite.paste(images[(low_noise, high_freq)], (stim_size_px + separator, 0))
# Bottom row: high noise
composite.paste(images[(high_noise, low_freq)], (0, stim_size_px + separator))
composite.paste(
    images[(high_noise, high_freq)],
    (stim_size_px + separator, stim_size_px + separator),
)

composite.save(rf"{out_dir}\stimuli_2x2_grid.png")

print("Saved 2×2 stimuli (and composite) to:", out_dir)

# =========================
# PART B: OVERSIZED BACKGROUND NOISE @ 1920×1080
# =========================
# IMPORTANT: Match band centers to your Gabor frequencies using cycles-per-pixel (cpp)
# Convert from cps (per 256px aperture) to cpp:
#   cpp = (cycles per stimulus aperture) / (aperture_px)
mu_cpp = tuple(m / stim_size_px for m in mu_cps_aperture)
sigma_cpp = tuple(m * sigma_fraction for m in mu_cpp)  # keeps same fractional bandwidth

bg_dir_low = os.path.join(out_dir, f"bg_noise_low_{bg_width}x{bg_height}")
bg_dir_high = os.path.join(out_dir, f"bg_noise_high_{bg_width}x{bg_height}")
os.makedirs(bg_dir_low, exist_ok=True)
os.makedirs(bg_dir_high, exist_ok=True)

for level_name, target_rms in noise_levels.items():
    level_dir = bg_dir_low if level_name == "low" else bg_dir_high
    for i in range(n_bg_per_level):
        noise_bg = fft_bandpass_two_bands_cpp_rect(
            bg_width, bg_height, mu_cpp, sigma_cpp
        )
        noise_bg = scale_to_rms(noise_bg, target_rms)
        img_bg = to_png(noise_bg)
        img_bg.save(os.path.join(level_dir, f"bg_{level_name}_{i:03d}.png"))

print(f"Saved {n_bg_per_level} background PNGs per level to:")
print(" ", bg_dir_low)
print(" ", bg_dir_high)

# ===== END =====
