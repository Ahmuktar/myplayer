// Importing dependencies and setting up TrackPlayer configuration.
import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
    Event
  } from 'react-native-track-player';
import { audioList } from './constants/audioList';
  
  export async function setupPlayer() {
    let isSetup = false;
    try {
      await TrackPlayer.getCurrentTrack();
      isSetup = true;
    } catch {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
        progressUpdateEventInterval: 2,
      });
  
      isSetup = true;
    } finally {
      return isSetup;
    }
  }
  
  // Function to add tracks
  export async function addTracks() {
    try {
      await TrackPlayer.add(audioList);
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);
      console.log("Tracks added to the player.");
    } catch (error) {
      console.error("Error adding tracks:", error);
    }
  }
  
  
  // Register playback service
  export async function playbackService() {
    TrackPlayer.addEventListener(Event.RemotePause, () => {
      TrackPlayer.pause();
    });
  
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      TrackPlayer.play();
    });
  
    TrackPlayer.addEventListener(Event.RemoteNext, () => {
      TrackPlayer.skipToNext();
    });
  
    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      TrackPlayer.skipToPrevious();
    });
  }