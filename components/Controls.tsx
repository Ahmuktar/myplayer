import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import TrackPlayer, { Event, State, usePlaybackState, useTrackPlayerEvents, Track } from 'react-native-track-player';
import TrackProgress from './TrackProgress';

// Define the props type for the Controls component
interface ControlsProps {
  onShuffle: () => void;
  onRepeat: () => void;
  isShuffleOn: boolean;
  isRepeat: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onShuffle, onRepeat, isShuffleOn, isRepeat }) => {
  const playerState = usePlaybackState();
  const [info, setInfo] = useState<Track | null>(null);

  // Using useCallback to prevent unnecessary re-renders
  const setTrackInfo = useCallback(async () => {
    const trackId = await TrackPlayer.getCurrentTrack();
    if (trackId !== null) {
      const track = await TrackPlayer.getTrack(trackId);
      setInfo(track);
    } else {
      setInfo(null);
    }
  }, []);

  useEffect(() => {
    setTrackInfo();
  }, [setTrackInfo]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], () => {
    setTrackInfo();
  });

  // Combined play/pause logic into a single function
  const handlePlayPress = async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  const renderPlayPauseButton = () => {
    switch (playerState.state) {
      case State.Loading:
        return <ActivityIndicator size="small" color="white" />;
      case State.Playing:
        return <Ionicons name="pause" size={32} color="white" />;
      default:
        return <Ionicons name="play-sharp" size={32} color="white" />;
    }
  };

  return (
    <View className="flex items-center px-4 backdrop-blur bg-primary border-t border-gray-400">
      <View className="flex py-1 text-left w-full">
        <Text className="text-xs text-white font-normal">
          {info?.title || 'No Track Playing'}
        </Text>
      </View>
      {/* Player Controls */}
      <View className="flex-row justify-around items-center w-4/5">
        <TouchableOpacity onPress={onShuffle}>
          <Feather name="shuffle" size={20} color={isShuffleOn ? 'white' : '#9ab0a6'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
          <Ionicons name="play-skip-back-sharp" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPress}>
          {renderPlayPauseButton()}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
          <Ionicons name="play-skip-forward-sharp" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRepeat}>
          <MaterialIcons name="repeat" size={20} color={isRepeat ? 'white' : '#9ab0a6'} />
        </TouchableOpacity>
      </View>
      <TrackProgress />
    </View>
  );
};

export default Controls;
