import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  usePlaybackState,
  RepeatMode,
  Track,
} from 'react-native-track-player';
import Controls from './Controls';

// Memoized PlaylistItem component to prevent unnecessary re-renders
const PlaylistItem = React.memo(({ index, title, isCurrent, isPlaying, onItemPress }: {
  index: number;
  title: string;
  isCurrent: boolean;
  isPlaying: boolean;
  onItemPress: () => void;
}) => (
  <TouchableOpacity
    className="flex-row items-center px-4 justify-between py-4"
    onPress={onItemPress}
  >
    <Text className="text-white">{title}</Text>
    {isCurrent && (
      <AntDesign
        name={isPlaying ? 'playcircleo' : 'pausecircleo'}
        size={18}
        color="red"
      />
    )}
  </TouchableOpacity>
));

const Playlist: React.FC = () => {
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const playerState = usePlaybackState();

  const loadPlaylist = useCallback(async () => {
    const newQueue = await TrackPlayer.getQueue();
    setQueue(newQueue);
  }, []);

  useEffect(() => {
    loadPlaylist();
    handleRepeat();
  }, [loadPlaylist]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], () => {
    TrackPlayer.getCurrentTrack().then((index) => setCurrentTrack(index));
  });

  const handleShuffle = useCallback(async () => {
    const originalQueue = await TrackPlayer.getQueue();
    const shuffledQueue = [...originalQueue];

    if (!isShuffleOn) {
      shuffledQueue.sort(() => Math.random() - 0.5);
    }

    await TrackPlayer.reset();
    await TrackPlayer.add(shuffledQueue);

    setIsShuffleOn(!isShuffleOn);
  }, [isShuffleOn]);

  const handleRepeat = useCallback(async () => {
    const newRepeatMode = isRepeat ? RepeatMode.Off : RepeatMode.Track;
    setIsRepeat(!isRepeat);
    await TrackPlayer.setRepeatMode(newRepeatMode);
  }, [isRepeat]);

  return (
    <View className="flex-1">
      <FlatList
        data={queue}
        renderItem={({ item, index }) => (
          <PlaylistItem
            index={index}
            title={item.title}
            isCurrent={currentTrack === index}
            isPlaying={currentTrack === index && playerState.state === State.Playing}
            onItemPress={() => {
              if (currentTrack === index && playerState.state === State.Playing) {
                TrackPlayer.pause();
              } else {
                TrackPlayer.skip(index).then(() => TrackPlayer.play());
              }
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <Controls
        onShuffle={handleShuffle}
        onRepeat={handleRepeat}
        isShuffleOn={isShuffleOn}
        isRepeat={isRepeat}
      />
    </View>
  );
};

export default Playlist;
