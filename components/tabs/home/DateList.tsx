import { Text } from "react-native";
import { FlatList, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { format, getDaysInMonth } from "date-fns";

const today = new Date();
const currentDate = today.getDate();
const currentMonth = format(today, "MMM");
const daysInMonth = getDaysInMonth(today); // Get total days in month
const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

export default function DateList() {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const flatListRef = useRef<FlatList<number>>(null);

  // Get today's index (zero-based)
  const todayIndex = currentDate - 1;

  // Scroll to today's date when the component is mounted
  const scrollToToday = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: todayIndex,
        animated: true,
        viewPosition: 0.5, // Centers the item in the viewport
      });
    }
  };
  return (
    <FlatList
      ref={flatListRef}
      data={days}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.toString()}
      initialScrollIndex={todayIndex} // Helps with initial positioning
      getItemLayout={(data, index) => ({
        length: 64, // Width of each item (adjust according to your design)
        offset: 64 * index,
        index,
      })}
      onLayout={scrollToToday} // Scroll when layout is set
      renderItem={({ item }) => (
        <Pressable
          key={item}
          onPress={() => setSelectedDate(item)}
          className={`items-center justify-center border-2 mt-4 h-20 mx-1.5 bg-white w-14 rounded-xl ${
            selectedDate === item ? "border-primary-300" : "border-slate-200"
          }`}
        >
          <Text className="text-2xl font-cereal-medium">{item}</Text>
          <Text className="text font-cereal">{currentMonth}</Text>
        </Pressable>
      )}
    />
  );
}
