import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { checkIcon, randomColor } from "@/constants/Images";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAuthUser from "@/lib/useAuthUser";

export default function CreateHabitForm() {
  const user = useAuthUser();

  const [habitName, setHabitName] = useState("");
  const [icon, setIcon] = useState("🚶");
  const [color, setColor] = useState("randomColor");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [duration, setDuration] = useState("1");
  const [selectedDays, setSelectedDays] = useState([
    { day: "MO", isChecked: true },
    { day: "TU", isChecked: false },
    { day: "WE", isChecked: false },
    { day: "TH", isChecked: false },
    { day: "FR", isChecked: false },
    { day: "SA", isChecked: false },
    { day: "SU", isChecked: false },
  ]);

  const handleCreateHabit = async () => {
    try {
      const habitData = {
        user: user?.uid,
        name: habitName,
        icon: icon,
        color: color,
        description: description,
        quantity: quantity,
        unit: unit,
        days: selectedDays.filter((d) => d.isChecked).map((d) => d.day),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "habits"), habitData);

      alert("Habit Created Successfully!");
    } catch (error) {
      console.error("Error adding habit: ", error);
      alert("Error creating habit!");
    }
  };

  return (
    <View className="gap-4 px-4 mt-6 mb-24">
      <View className="relative">
        <Text className="font-cereal-medium">NAME</Text>
        <TextInput
          placeholder="Habit Name"
          onChangeText={(value) => setHabitName(value)}
          className="w-full mt-2 text-xl border-b font-cereal-medium"
        />
      </View>
      <View className="relative mt-4">
        <Text className="font-cereal-medium">ICON & COLOR</Text>
        <View className="flex-row gap-4 mt-2">
          <View className="flex-row flex-1 gap-4 p-4 bg-white shadow-md rounded-xl">
            <View className="items-center justify-center bg-primary-500/20 rounded-xl size-12">
              <Text>{icon}</Text>
            </View>
            <View>
              <Text className="font-cereal-medium">Walking</Text>
              <Text>Icon</Text>
            </View>
          </View>
          <View className="flex-row flex-1 gap-4 p-4 bg-white shadow-md rounded-xl">
            <View className="items-center justify-center overflow-hidden bg-primary-500/20 rounded-xl size-12">
              <Image source={randomColor} className="w-full h-full" />
            </View>
            <View>
              <Text className="font-cereal-medium">Random</Text>
              <Text>Color</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="relative mt-4">
        <Text className="font-cereal-medium">DESCRIBE</Text>
        <TextInput
          placeholder="Describe Habit Detail"
          onChangeText={(value) => setDescription(value)}
          className="w-full mt-2 border-b font-cereal"
        />
      </View>
      <View className="relative mt-4">
        <Text className="font-cereal-medium">QUANTITY & UNIT</Text>
        <View className="flex flex-row gap-4 p-4 mt-2 bg-white shadow-md rounded-xl">
          <TextInput
            placeholder="Quantity"
            onChangeText={(value) => setQuantity(value)}
            className="flex-1 mt-2 border-b font-cereal"
          />
          <TextInput
            placeholder="Unit"
            onChangeText={(value) => setUnit(value)}
            className="flex-1 mt-2 border-b font-cereal"
          />
        </View>
      </View>
      <View className="relative mt-4">
        <Text className="font-cereal-medium">DURATION</Text>
        <View className="flex flex-row gap-2 mt-2 ">
          <Pressable
            onPress={() => setDuration("1")}
            className={`flex-1 p-4 shadow-md rounded-xl  ${
              duration === "1" ? "bg-primary-500" : "bg-white"
            }`}
          >
            <Text
              className={`text-center font-cereal ${
                duration === "1" && "text-white"
              }`}
            >
              A Day
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setDuration("7")}
            className={`flex-1 p-4 shadow-md rounded-xl  ${
              duration === "7" ? "bg-primary-500" : "bg-white"
            }`}
          >
            <Text
              className={`text-center font-cereal ${
                duration === "7" && "text-white"
              }`}
            >
              7 Days
            </Text>
          </Pressable>
          <View
            className={`flex items-center justify-center flex-1  shadow-md rounded-xl ${
              duration !== "1" && duration !== "7"
                ? "bg-primary-500"
                : "bg-white"
            }`}
          >
            <TextInput
              placeholder="Custom"
              onChangeText={(value) => setDuration(value)}
              className={`w-20 h-12 mx-auto text-center font-cereal ${
                !(duration === "1" || duration === "7" || duration === "")
                  ? "text-black-500"
                  : "text-white"
              }`}
            />
          </View>
        </View>
      </View>
      <View className="relative mt-4">
        <Text className="font-cereal-medium">DAYS</Text>
        <FlatList
          data={selectedDays}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.day}
          renderItem={({ item }) => (
            <Pressable
              key={item.day}
              className={`items-center justify-between w-14 h-20 py-2 mx-1 rounded-xl ${
                item.isChecked ? "bg-primary-500/30" : "bg-white"
              }`}
              onPress={() => {
                setSelectedDays((prevDays) =>
                  prevDays.map((d) =>
                    d.day === item.day ? { ...d, isChecked: !d.isChecked } : d
                  )
                );
              }}
            >
              <Text className="text-lg text-center font-cereal">
                {item.day}
              </Text>
              {item.isChecked && (
                <Image className="size-6" source={checkIcon} />
              )}
            </Pressable>
          )}
        />
      </View>
      <Pressable
        className="w-full py-4 mt-6 rounded-full bg-primary-500"
        onPress={handleCreateHabit}
      >
        <Text className="text-xl text-center text-white font-cereal-bold">
          Create Habit
        </Text>
      </Pressable>
    </View>
  );
}
