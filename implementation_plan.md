# Implementation Plan - Enhancing Sound & Atmosphere

## Goal
Create an immersive experience by adding background music and sound effects that respond to interactions, enhancing the "Mystic" vibe.

## Tech Stack
- **Library**: `howler.js` (Robust audio library for web) or Native `Audio` API (Sufficient for simple needs, but Howler handles mobile auto-play issues better). *Decision: Native Audio with proper React State management for simplicity first.*

## Sound Assets
- **BGM**: `mystic-ambient.mp3` (Need to find or generate placeholder) - *Will use existing shuffle sound as placeholder or specific frequency.*
- **SFX**:
    - `shuffle.mp3` (Existing)
    - `card-flip.mp3` (Need to add)
    - `reveal-magic.mp3` (Need to add)
    - `button-click.mp3` (Need to add)

## Components
### 1. `SoundContext` (New)
- Global state for:
    - `isMuted` (Persistent in localStorage)
    - `volume`
    - `playBGM(track)`
    - `playSFX(name)`
- Preload sounds on mount.

### 2. UI Controls
- Add **Note/Sound Toggle** in Top Right (near Dark Mode toggle).
- Icon: `Volume2` / `VolumeX`.

### 3. Integration spots
- **Intro**: Start BGM Fade-in.
- **Shuffle**: Loop `shuffle.mp3`.
- **Draw Card**: Play `card-flip.mp3`.
- **Reveal**: Play `reveal-magic.mp3`.

## Verification
- Toggle mute works.
- Sounds play on mobile (iOS/Android) interaction.
