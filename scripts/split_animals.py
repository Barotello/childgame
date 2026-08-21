import wave
import struct
import math
import os

words = [
    'cat', 'dog', 'cow', 'horse', 'rabbit', 'lion', 'elephant', 'bear', 'monkey', 'giraffe',
    'bird', 'chicken', 'duck', 'owl', 'eagle', 'fish', 'dolphin', 'whale', 'swan', 'koala',
    'tiger', 'panda', 'wolf', 'fox', 'pig', 'bee', 'ant', 'worm', 'mouse', 'hamster',
    'deer', 'goat', 'sheep', 'camel', 'donkey', 'zebra', 'snake', 'frog', 'seal', 'goose', 'crab'
]

print("Target words count:", len(words))

with wave.open('artifacts/mobile/assets/sounds/animals.wav', 'rb') as f:
    frames = f.getnframes()
    rate = f.getframerate()
    channels = f.getnchannels()
    width = f.getsampwidth()
    raw = f.readframes(frames)
    samples = struct.unpack(f'<{frames}h', raw)

total_duration = frames / rate
print(f"Duration: {total_duration:.2f}s, Sample Rate: {rate}")

# Calculate RMS in 10ms steps (240 samples per step)
step = int(rate * 0.01) # 10ms
win = int(rate * 0.03)  # 30ms window
rms_list = []
for i in range(0, len(samples) - win, step):
    chunk = samples[i:i+win]
    val = math.sqrt(sum(s*s for s in chunk) / len(chunk))
    rms_list.append(val)

# Find minimum valleys approximately every 0.45-0.65s
# We need exactly 40 split points to divide into 41 words
splits = []
target_step_idx = len(rms_list) / 41.0

# Search for local minima around each estimated boundary
prev_split_idx = 0
for i in range(1, 41):
    estimated_idx = int(i * target_step_idx)
    # Search window +/- 18 steps (180ms)
    search_start = max(prev_split_idx + 25, estimated_idx - 18)
    search_end = min(len(rms_list) - 20, estimated_idx + 18)
    if search_start < search_end:
        min_idx = search_start + min(range(search_end - search_start), key=lambda k: rms_list[search_start + k])
        splits.append(min_idx * step)
        prev_split_idx = min_idx

print(f"Found {len(splits)} split points.")

# Create output directory
out_dir = 'artifacts/mobile/assets/sounds/animals'
os.makedirs(out_dir, exist_ok=True)

split_points = [0] + splits + [frames]

for idx, word in enumerate(words):
    start_frame = split_points[idx]
    end_frame = split_points[idx + 1]
    word_samples = samples[start_frame:end_frame]
    dur = (end_frame - start_frame) / rate
    out_path = os.path.join(out_dir, f"{word}.wav")
    
    with wave.open(out_path, 'wb') as out_f:
        out_f.setnchannels(channels)
        out_f.setsampwidth(width)
        out_f.setframerate(rate)
        out_raw = struct.pack(f'<{len(word_samples)}h', *word_samples)
        out_f.writeframes(out_raw)
    
    print(f"[{idx+1:2d}/41] {word:10s}: {start_frame/rate:.2f}s -> {end_frame/rate:.2f}s ({dur:.2f}s) -> {out_path}")
