import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface SelectDailyReportDateProps {
  date: Date;
  setDate: any;
}

export default function SelectDailyReportDate({
  date,
  setDate,
}: SelectDailyReportDateProps) {
  const [openStart, setOpenStart] = useState(false);

  return (
    <View className="gap-4 px-6 py-3 ">
      <Pressable
        onPress={() => setOpenStart(true)}
        className="justify-center w-full px-3 py-3.5 border rounded-md border-slate-400"
      >
        <Text className="text-gray-600 font-cereal-regular">
          {date.toDateString()}
        </Text>
      </Pressable>
      {openStart && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setOpenStart(false);
            if (selectedDate) setDate("date", selectedDate);
          }}
        />
      )}
    </View>
  );
}
