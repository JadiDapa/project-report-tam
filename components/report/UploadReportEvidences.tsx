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

interface UploadedReportEvidencesProps {
  uploadedEvidences: ReportEvidenceType[];
  setUploadedEvidences: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function UploadReportEvidences({
  uploadedEvidences,
  setUploadedEvidences,
}: UploadedReportEvidencesProps) {
  const [showModal, setShowModal] = useState(false);

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
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedEvidences([
        ...uploadedEvidences,
        { image: result.assets[0].uri, description: "just a description" },
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

  console.log(uploadedEvidences);

  return (
    <View className="relative mt-3 ">
      <Text className="px-6 text-lg font-cereal-medium">Evidences</Text>
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
