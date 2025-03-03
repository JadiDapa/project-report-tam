import { loginIllust1, loginIllust2, loginIllust3 } from "@/constants/Images";
import { useState, useRef, useEffect } from "react";
import { View, Text, Image, FlatList, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const slides = [
  {
    id: "1",
    image: loginIllust1,
    title: "Monitor All \nYour Doing",
    description:
      "Giving The Ability To Track the Progress of The Whole Projects",
  },
  {
    id: "2",
    image: loginIllust2,
    title: "Improving Data Analysis",
    description: "Providing The Ability To Analyze Data Easily And Accurately",
  },
  {
    id: "3",
    image: loginIllust3,
    title: "Better \nPresentation",
    description: "Because It's Easy To Use, It's Easy To Understand",
  },
];

export default function AuthCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === slides.length - 1 ? 0 : prevIndex + 1;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="mt-6">
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View className="relative h-72 w-96">
              <Image
                source={item.image}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

            <Text className="pt-1 text-5xl text-white font-cereal-bold">
              {item.title}
            </Text>
            <Text className="mt-1 text-white max-w-80 font-cereal">
              {item.description}
            </Text>
          </View>
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
      />

      <View className="flex flex-row gap-2 mt-6">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
