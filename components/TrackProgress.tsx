import React from 'react';
import { View, Text } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';

const TrackProgress: React.FC = () => {
  const { position, duration } = useProgress(1000); // Update interval for progress

  // Function to format time in mm:ss
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60); // Time in minutes
    const seconds = Math.floor(time % 60); // Remaining seconds
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format as mm:ss
  };

  // Handle slider value change to seek to the track position
  const handleSliderChange = (value: number) => {
    TrackPlayer.seekTo(value); // Seek to the value position in seconds
  };

  return (
    <View className="w-full">
      {/* Time Labels */}
      <View className="flex-row justify-between w-full mb-2">
        <Text className="text-xs text-white font-light">{formatTime(position)}</Text>
        <Text className="text-xs text-white font-light">{formatTime(duration)}</Text>
      </View>

      {/* Track Progress Slider */}
      <Slider
        style={{ width: '100%' }}
        value={position}
        minimumValue={0}
        maximumValue={duration || 0}  
        minimumTrackTintColor="red"   // Color for the played part
        maximumTrackTintColor="#D3D3D3" // Color for the remaining part
        thumbTintColor="white"        // Color of the thumb handle
        onSlidingComplete={handleSliderChange}
      />
    </View>
  );
};

export default TrackProgress;
