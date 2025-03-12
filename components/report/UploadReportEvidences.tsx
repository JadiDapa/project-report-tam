import { View, Text, FlatList, Pressable, Image } from "react-native";
import React, { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { Camera, Images } from "lucide-react-native";
import { ReportEvidenceType } from "@/lib/types/report-evidence";
import * as Location from "expo-location";
import { useWindowDimensions } from "react-native";

interface UploadedReportEvidencesProps {
  uploadedEvidences: ReportEvidenceType[];
  setUploadedEvidences: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function UploadReportEvidences({
  uploadedEvidences,
  setUploadedEvidences,
}: UploadedReportEvidencesProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Add this state
  const { width, height } = useWindowDimensions();

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedEvidences([
        ...uploadedEvidences,
        ...result.assets.map((evidence) => ({
          image: evidence.uri,
          description: "just a description",
        })),
      ]);
    }
  };

  const takePhoto = async () => {
    // Request location permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    // Get current location
    let location = await Location.getCurrentPositionAsync({});

    // Capture image
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
    });

    if (!result.canceled) {
      setUploadedEvidences([
        ...uploadedEvidences,
        {
          image: result.assets[0].uri,
          description: "just a description",
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
      ]);
    }
  };

  const pickFromGoogleDrive = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets?.length > 0) {
      setUploadedEvidences((prev) => [
        ...(prev || []),
        { image: result.assets[0].uri, description: "just a description" },
      ]);
    }
  };

  return (
    <View className="relative mt-3 ">
      {/* Add Full Screen Image Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        <ModalBackdrop />
        <ModalContent className="w-full h-full bg-transparent">
          <Pressable
            className="items-center justify-center flex-1"
            onPress={() => setSelectedImage(null)}
          >
            <Image
              source={{ uri: selectedImage || "" }}
              style={{ width, height: height * 0.8 }}
              resizeMode="contain"
            />
          </Pressable>
        </ModalContent>
      </Modal>

      {/* Existing Modal */}
      <SelectEmployeeModal
        showModal={showModal}
        setShowModal={setShowModal}
        pickImages={pickImages}
        takePhoto={takePhoto}
        pickFromGoogleDrive={pickFromGoogleDrive}
      />

      <FlatList
        data={uploadedEvidences}
        horizontal
        className="mt-2 ps-6"
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() => (
          <Pressable
            onPress={() => setShowModal(true)}
            className="items-center justify-center gap-2 border-2 border-dashed rounded-xl border-slate-500 size-32"
          >
            <Entypo name="plus" size={24} color="#56585f" />
            <Text className="font-cereal-medium">Upload</Text>
          </Pressable>
        )}
        renderItem={({ item: evidence }) => (
          <Pressable
            onPress={() => setSelectedImage(evidence.image)} // Add this onPress
            onLongPress={() =>
              setUploadedEvidences(
                uploadedEvidences.filter((e) => e !== evidence)
              )
            }
            className="relative items-center justify-center overflow-hidden border-2 size-32 me-2 rounded-xl border-slate-500"
          >
            <Image
              source={{ uri: evidence.image }}
              resizeMode="cover"
              className="w-full h-full"
            />
          </Pressable>
        )}
      />
    </View>
  );
}

interface SelectEmployeeModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  pickImages: () => void;
  takePhoto: () => void;
  pickFromGoogleDrive: () => void;
}

function SelectEmployeeModal({
  showModal,
  setShowModal,
  pickImages,
  takePhoto,
  pickFromGoogleDrive,
}: SelectEmployeeModalProps) {
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
      <ModalBackdrop />
      <ModalContent className="pb-0 rounded-3xl">
        <ModalHeader className="flex flex-col gap-1">
          <Text className="text-lg text-center font-cereal-medium">
            Upload Report Evidence
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-[1px] bg-slate-500" />
            <Text className="text-sm text-center font-cereal text-slate-500">
              Select Image From
            </Text>
            <View className="w-8 h-[1px] bg-slate-500" />
          </View>
        </ModalHeader>
        <ModalBody className="">
          <View className="flex-row justify-between gap-4 pt-2">
            <Pressable
              onPress={() => {
                takePhoto();
                setShowModal(false);
              }}
              className="items-center justify-center border-2 border-dashed rounded-xl border-slate-500 size-20"
            >
              <Camera size={32} color="#9196a5" />
              <Text className="text-center text-slate-500 font-cereal-medium">
                Camera
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                pickImages();
                setShowModal(false);
              }}
              className="items-center justify-center border-2 border-dashed rounded-xl border-slate-500 size-20"
            >
              <Images size={32} color="#9196a5" />
              <Text className="text-center text-slate-500 font-cereal-medium">
                Gallery
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                pickFromGoogleDrive();
                setShowModal(false);
              }}
              className="items-center justify-center border-2 border-dashed rounded-xl border-slate-500 size-20"
            >
              <Entypo name="google-drive" size={32} color="#9196a5" />
              <Text className="text-center text-slate-500 font-cereal-medium">
                Drive
              </Text>
            </Pressable>
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
