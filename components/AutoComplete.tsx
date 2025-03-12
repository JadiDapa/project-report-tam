import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

const AutoComplete = ({
  data,
  onSelect,
}: {
  data: string[];
  onSelect: (item: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<string[]>(data); // Show all by default

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Show all when input is empty
    }
  };

  const handleSelect = (item: string) => {
    setQuery(item);
    setFilteredData(data); // Reset to show all after selection
    onSelect(item);
  };

  return (
    <View className="w-full">
      <TextInput
        className="h-10 px-3 border border-gray-300 rounded-md"
        placeholder="Search serial number..."
        value={query}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item}
        className="mt-2 bg-white border border-gray-300 rounded-md max-h-48"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            className="p-3 border-b border-gray-200"
          >
            <Text className="text-gray-800">{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AutoComplete;
