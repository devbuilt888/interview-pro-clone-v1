// SoundEffects.ts - Utility for playing sound effects in the application

const playSoundEffect = (soundUrl: string): void => {
  try {
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
      console.error('Error playing sound effect:', error);
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

// Sound effect utility functions
export const playTransformersSound = (): void => {
  playSoundEffect('/transformers-sound.mp3');
};

export const playGameEndSound = (): void => {
  playSoundEffect('/game-end.mp3');
};

// Named object for default export
const SoundEffects = {
  playTransformersSound,
  playGameEndSound
}; 

export default SoundEffects; 