import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { useState, useEffect } from "react";
import {
  TextInput,
  KeyboardAvoidingView,
  Platform,
  View,
  Pressable,
  Text,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // 📌 add this
import * as Location from "expo-location";

interface GeotagModalProps {
  visible: boolean;
  imageUri: string | null;
  initialData?: {
    date: string;
    latitude: number;
    longitude: number;
    address?: string;
  };
  onClose: () => void;
  onConfirm: (data: {
    dateString: string;
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
}

export default function GeotagModal({
  visible,
  imageUri,
  onClose,
  onConfirm,
  initialData,
}: GeotagModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (visible && initialData) {
      setDate(new Date(initialData.date));
      setLatitude(String(initialData.latitude));
      setLongitude(String(initialData.longitude));
      setAddress(initialData.address ?? "");
    }
  }, [visible, initialData]);

  // 🔥 Fetch address when lat/lon are updated
  useEffect(() => {
    const fetchAddressFromCoords = async () => {
      if (!latitude || !longitude) return;

      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lon)) return;

      try {
        const results = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lon,
        });

        if (results.length > 0) {
          const info = results[0];
          const formatted = [
            info.street,
            info.city,
            info.region,
            info.country,
            info.postalCode,
          ]
            .filter(Boolean)
            .join(", ");
          setAddress(formatted);
        }
      } catch (err) {
        console.error("Reverse geocode error:", err);
      }
    };

    fetchAddressFromCoords();
  }, [latitude, longitude]);

  return (
    <Modal isOpen={visible} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent className="pb-4 rounded-3xl">
        <ModalHeader>
          <Text className="text-lg text-center font-cereal-medium">
            Enter Geotag Information
          </Text>
        </ModalHeader>
        <ModalBody>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View className="gap-2">
              <Text>Date:</Text>
              <Pressable
                className="p-2 border rounded-md"
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{date.toLocaleDateString()}</Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selected) => {
                    setShowDatePicker(false);
                    if (selected) setDate(selected);
                  }}
                />
              )}

              <Text>Time:</Text>
              <Pressable
                className="p-2 border rounded-md"
                onPress={() => setShowTimePicker(true)}
              >
                <Text>{date.toLocaleTimeString()}</Text>
              </Pressable>
              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  onChange={(event, selected) => {
                    setShowTimePicker(false);
                    if (selected) setDate(selected);
                  }}
                />
              )}

              <Text>Latitude:</Text>
              <TextInput
                className="p-2 border rounded-md"
                keyboardType="numeric"
                value={latitude}
                onChangeText={setLatitude}
              />

              <Text>Longitude:</Text>
              <TextInput
                className="p-2 border rounded-md"
                keyboardType="numeric"
                value={longitude}
                onChangeText={setLongitude}
              />

              <Text>Address (auto-fetched):</Text>
              <TextInput
                className="p-2 border rounded-md"
                value={address}
                editable={false}
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <Pressable
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onPress={onClose}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                className="px-4 py-2 bg-blue-500 rounded-lg"
                onPress={() => {
                  onConfirm({
                    dateString: date.toLocaleString(),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    address,
                  });
                }}
              >
                <Text className="text-white">Confirm</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
