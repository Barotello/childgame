import wave
import struct
import math
import os

colors = [
    'red',     # 1
    'blue',    # 2
    'green',   # 3
    'yellow',  # 4
    'orange',  # 5
    'purple',  # 6
    'pink',    # 7
    'black',   # 8
    'white'    # 9
]

with wave.open('artifacts/mobile/assets/sounds/colors.wav', 'rb') as f:
    frames = f.getnframes()
    rate = f.getframerate()
    channels = f.getnchannels()
    width = f.getsampwidth()
    raw = f.readframes(frames)
    samples = list(struct.unpack(f'<{frames}h', raw))

# Precise time boundaries identified from silence valleys (in seconds)
# Word 1 (red): 0.05s -> 0.73s
# Word 2 (blue): 0.73s -> 1.42s
# Word 3 (green): 1.42s -> 2.25s
# Word 4 (yellow): 2.25s -> 3.02s
# Word 5 (orange): 3.02s -> 3.64s
# Word 6 (purple): 3.64s -> 4.28s
# Word 7 (pink): 4.28s -> 4.80s
# Word 8 (black): 4.80s -> 5.35s
# Word 9 (white): 5.35s -> 6.05s

boundaries = [
    (0.05, 0.73), # red
    (0.73, 1.42), # blue
    (1.42, 2.25), # green
    (2.25, 3.02), # yellow
    (3.02, 3.64), # orange
    (3.64, 4.28), # purple
    (4.28, 4.80), # pink
    (4.80, 5.35), # black
    (5.35, 6.05), # white
]

out_dir = 'artifacts/mobile/assets/sounds/colors'
os.makedirs(out_dir, exist_ok=True)

fade_len = int(rate * 0.005) # 5ms anti-click fade

for idx, color_name in enumerate(colors):
    start_sec, end_sec = boundaries[idx]
    start_frame = int(start_sec * rate)
    end_frame = min(frames, int(end_sec * rate))
    
    chunk = samples[start_frame:end_frame]
    dur = len(chunk) / rate
    
    # Apply soft 5ms fade in and out to prevent pop/click artifacts
    for f in range(min(fade_len, len(chunk))):
        factor = f / float(fade_len)
        chunk[f] = int(chunk[f] * factor)
        chunk[-1 - f] = int(chunk[-1 - f] * factor)
    
    out_path = os.path.join(out_dir, f"{color_name}.wav")
    with wave.open(out_path, 'wb') as out_f:
        out_f.setnchannels(channels)
        out_f.setsampwidth(width)
        out_f.setframerate(rate)
        out_raw = struct.pack(f'<{len(chunk)}h', *chunk)
        out_f.writeframes(out_raw)
    
    print(f"[{idx+1}/9] {color_name:8s}: {start_sec:5.2f}s -> {end_sec:5.2f}s ({dur:.2f}s) -> {out_path}")
