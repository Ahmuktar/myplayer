import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, Text, ImageBackground } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { setupPlayer, addTracks } from '@/service';
import Playlist from '@/components/Playlist';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importing background image statically for better performance
const backgroundImage = require('@/assets/images/mosque.jpg');

const App: React.FC = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // UseCallback to memoize the setup function to avoid recreating it on every render
  const initializePlayer = useCallback(async () => {
    const isSetup = await setupPlayer();

    if (isSetup) {
      const queue = await TrackPlayer.getQueue();
      if (queue.length === 0) {
        await addTracks();
      }
      setIsPlayerReady(true); // Set player ready after setup
    }
  }, []);

  useEffect(() => {
    initializePlayer();
  }, [initializePlayer]);

  if (!isPlayerReady) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary justify-start h-full">
      <ImageBackground source={backgroundImage} resizeMode="cover" className="h-full">
        <View className="h-full justify-between bg-primary/40">
          <View className="p-4 bg-primary">
            <Text className="text-lg text-white font-bold">مصباح الراوي في علم الحديث</Text>
          </View>
          <Playlist />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default App;
