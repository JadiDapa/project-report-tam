import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import ViewShot from "react-native-view-shot";

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import {
  Camera,
  Images,
  Download,
  ArrowBigRightDash,
} from "lucide-react-native";
import { ReportEvidenceType } from "@/lib/types/report-evidence";

interface UploadedReportEvidencesProps {
  uploadedEvidences: ReportEvidenceType[];
  setUploadedEvidences: React.Dispatch<React.SetStateAction<any[]>>;
  isUpload?: boolean;
}

export default function UploadReportEvidences({
  uploadedEvidences,
  setUploadedEvidences,
  isUpload = true,
}: UploadedReportEvidencesProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [capturedDate, setCapturedDate] = useState<string | null>(null);
  const [isCapturedImage, setIsCapturedImage] = useState(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState(false);

  const [capturedLocation, setCapturedLocation] = useState<{
    coords: { latitude: number; longitude: number };
    address?: string;
  } | null>(null);

  const viewShotRef = useRef<ViewShot>(null);
  const { width, height } = useWindowDimensions();

  const takePhoto = async () => {
    setIsLoadingCamera(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      let address = "";

      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverse.length > 0) {
          const info = reverse[0];
          address = [
            info.street,
            info.city,
            info.region,
            info.country,
            info.postalCode,
          ]
            .filter(Boolean)
            .join(", ");
        }
      } catch (err) {
        console.warn("Reverse geocoding failed:", err);
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        presentationStyle:
          ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setCapturedDate(new Date().toLocaleString());
        setCapturedLocation({ ...location, address });
        setIsCapturedImage(true);
      }
    } catch (err) {
      console.error(err);
      alert("Camera error occurred.");
    } finally {
      setIsLoadingCamera(false);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedEvidences((prev) => [
        ...prev,
        ...result.assets.map((asset) => ({
          image: asset.uri,
          description: "Uploaded from Gallery",
        })),
      ]);
    }
  };

  const pickFromGoogleDrive = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setUploadedEvidences((prev) => [
        ...prev,
        { image: result.assets[0].uri, description: "Uploaded from Drive" },
      ]);
    }
  };

  const saveImageWithOverlay = async () => {
    if (viewShotRef.current?.capture) {
      const uri = await viewShotRef.current.capture();
      setUploadedEvidences((prev) => [
        ...prev,
        {
          image: uri,
          description: `Captured on ${capturedDate}`,
          date: capturedDate,
          location: capturedLocation,
        },
      ]);
      resetPreview();
    }
  };

  const downloadImage = async () => {
    if (!selectedImage) return;
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      alert("Media Library permission required");
      return;
    }

    try {
      await MediaLibrary.saveToLibraryAsync(selectedImage);
      alert("Image saved to gallery.");
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to save image.");
    }
  };

  const resetPreview = () => {
    setSelectedImage(null);
    setCapturedDate(null);
    setCapturedLocation(null);
    setIsCapturedImage(false);
  };

  const confirmDelete = (evidence: ReportEvidenceType) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setUploadedEvidences((prev) => prev.filter((e) => e !== evidence)),
      },
    ]);
  };

  return (
    <View className="relative py-6 mt-4 bg-white">
      {/* Preview modal */}
      {isLoadingCamera && (
        <View className="absolute top-0 bottom-0 left-0 right-0 z-50 items-center justify-center bg-black/50">
          <Text className="mb-2 text-lg text-white font-cereal-medium">
            Opening Camera...
          </Text>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Modal isOpen={!!selectedImage} onClose={resetPreview}>
        <ModalBackdrop />
        <ModalContent className="w-full h-full bg-black/50">
          <Pressable
            className="items-center justify-center flex-1"
            onPress={resetPreview}
          >
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
              <Image
                source={{ uri: selectedImage || "" }}
                style={{ width, height: height * 0.8 }}
                resizeMode="contain"
              />
              {(capturedDate || capturedLocation) && (
                <View className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
                  {capturedDate && (
                    <Text className="text-xs text-white">
                      Captured: {capturedDate}
                    </Text>
                  )}
                  {capturedLocation && (
                    <>
                      <Text className="text-xs text-white">
                        Location: {capturedLocation.coords.latitude.toFixed(5)},{" "}
                        {capturedLocation.coords.longitude.toFixed(5)}
                      </Text>
                      {capturedLocation.address && (
                        <Text className="text-xs text-white">
                          Address: {capturedLocation.address}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              )}
            </ViewShot>
          </Pressable>

          <Pressable
            onPress={isCapturedImage ? saveImageWithOverlay : downloadImage}
            className="absolute top-0 flex-row items-center justify-between w-full px-4 py-4 bg-white"
          >
            <Text className="font-cereal-medium">
              {isCapturedImage ? "Confirm Picture" : "Save to Gallery"}
            </Text>
            {isCapturedImage ? (
              <ArrowBigRightDash size={24} color="#2d5bff" />
            ) : (
              <Download size={24} color="#2d5bff" />
            )}
          </Pressable>
        </ModalContent>
      </Modal>

      {/* Upload option modal */}
      <SelectUploadModal
        visible={showModal}
        setVisible={setShowModal}
        onCamera={takePhoto}
        onGallery={pickImages}
        onDrive={pickFromGoogleDrive}
      />

      {/* Header and upload button */}
      <View className="flex-row items-center justify-between px-6">
        <Text className="text-lg font-cereal-medium">Report Evidences</Text>
        {isUpload && (
          <Pressable onPress={() => setShowModal(true)}>
            <Entypo name="plus" size={24} color="#2d5bff" />
          </Pressable>
        )}
      </View>

      {/* Image list */}
      <FlatList
        data={uploadedEvidences}
        horizontal
        className="mt-2 ps-6"
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() =>
          isUpload ? (
            <Pressable
              onPress={() => setShowModal(true)}
              className="items-center justify-center gap-2 border-2 border-dashed rounded-xl border-slate-500 size-32"
            >
              <Entypo name="plus" size={24} color="#56585f" />
              <Text className="font-cereal-medium">Upload</Text>
            </Pressable>
          ) : null
        }
        renderItem={({ item: evidence }) => (
          <Pressable
            onPress={() => setSelectedImage(evidence.image)}
            onLongPress={() => confirmDelete(evidence)}
            className="relative items-center justify-center overflow-hidden border-2 size-32 me-2 rounded-xl border-slate-500"
          >
            <Image
              source={{ uri: evidence.image }}
              resizeMode="cover"
              className="w-full h-full"
            />
            {evidence.location?.address && (
              <View className="absolute bottom-0 left-0 right-0 p-1 bg-black/50">
                <Text className="text-xs text-white" numberOfLines={1}>
                  {evidence.location.address.split(",")[0]}
                </Text>
              </View>
            )}
          </Pressable>
        )}
      />

      {/* Deletion tip */}
      {uploadedEvidences.length > 0 && isUpload && (
        <View className="px-6 mt-4">
          <Text className="text-sm text-red-400 font-cereal-regular">
            Long press on an image to delete it.
          </Text>
        </View>
      )}
    </View>
  );
}

// Reusable modal for upload source
interface SelectUploadModalProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  onCamera: () => void;
  onGallery: () => void;
  onDrive: () => void;
}

function SelectUploadModal({
  visible,
  setVisible,
  onCamera,
  onGallery,
  onDrive,
}: SelectUploadModalProps) {
  return (
    <Modal isOpen={visible} onClose={() => setVisible(false)} size="md">
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
        <ModalBody className="pt-2">
          <View className="flex-row justify-between gap-4">
            <UploadOption
              icon={<Camera size={32} color="#9196a5" />}
              label="Camera"
              onPress={() => {
                setVisible(false);
                onCamera();
              }}
            />
            <UploadOption
              icon={<Images size={32} color="#9196a5" />}
              label="Gallery"
              onPress={() => {
                setVisible(false);
                onGallery();
              }}
            />
            <UploadOption
              icon={<Entypo name="google-drive" size={32} color="#9196a5" />}
              label="Drive"
              onPress={() => {
                setVisible(false);
                onDrive();
              }}
            />
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const UploadOption = ({
  icon,
  label,
  onPress,
}: {
  icon: JSX.Element;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className="items-center justify-center border-2 border-dashed rounded-xl border-slate-500 size-20"
  >
    {icon}
    <Text className="text-center text-slate-500 font-cereal-medium">
      {label}
    </Text>
  </Pressable>
);
