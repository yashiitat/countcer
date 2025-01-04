import librosa
import librosa.display
import matplotlib.pyplot as plt
import json

# Load your audio file
audio_file = '/Users/yashitatanwar/Downloads/uw kahaani bhangra draft1_instrumental.m4a'  # Replace with your file path
y, sr = librosa.load(audio_file)

# Estimate tempo and beat frames
tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
print(f"Estimated Tempo: {float(tempo):.2f} BPM")

# Convert beat frames to time
beat_times = librosa.frames_to_time(beat_frames, sr=sr)
print("Beat Times:", beat_times)

# Save beat times to JSON
output_file = "beat_times.json"
with open(output_file, "w") as f:
    json.dump({"beat_times": beat_times.tolist()}, f)

print(f"Beat times saved to {output_file}")

# Visualize the waveform and beats
plt.figure(figsize=(10, 6))
librosa.display.waveshow(y, sr=sr, alpha=0.5)
plt.vlines(beat_times, ymin=-1, ymax=1, color='r', linestyle='--', label='Beats')
plt.title('Waveform with Detected Beats')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.legend()
plt.show()
