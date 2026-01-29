import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React, { useState, useRef } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";

import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { CreateTaskEvidenceImageType } from "@/lib/types/task-evidence-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTaskEvidenceImage,
  deleteTaskEvidenceImage,
  updateTaskEvidenceImage,
} from "@/lib/network/task-evidence-image";
import { useCustomToast } from "@/lib/useToast";
import { useAccount } from "@/contexts/AccountContexts";
import GeotagModal from "./create/GeotagModal";
import { UploadOptionsModal } from "./UploadOptionsModal";
import PreviewImageModal from "./create/PreviewImageModal";
import EvidenceList from "./EvidenceList";

interface UploadTaskEvidencesProps {
  uploadedEvidences: CreateTaskEvidenceImageType[];
  setUploadedEvidences: React.Dispatch<
    React.SetStateAction<CreateTaskEvidenceImageType[]>
  >;
  isUpload?: boolean;
  evidenceId?: string;
}

export default function UploadTaskEvidence({
  uploadedEvidences,
  setUploadedEvidences,
  isUpload = true,
  evidenceId,
}: UploadTaskEvidencesProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [capturedDate, setCapturedDate] = useState<string | null>(null);
  const [isCapturedImage, setIsCapturedImage] = useState(false);
  const [capturedLocation, setCapturedLocation] = useState<{
    coords: { latitude: number; longitude: number };
    address?: string;
  } | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [editingEvidence, setEditingEvidence] =
    useState<CreateTaskEvidenceImageType | null>(null);

  // new states for manual geotagging flow
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [manualImageUri, setManualImageUri] = useState<string | null>(null);

  const viewShotRef = useRef<ViewShot>(null);
  const { width, height } = useWindowDimensions();
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { account } = useAccount();

  // --- Camera (auto geotag) ---
  const takePhoto = async () => {
    setIsCameraLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      let address = "";

      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const info = reverseGeocode[0];
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
      } catch (error) {
        console.error("Failed to reverse geocode location", error);
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
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
      console.error("Camera or Location Error:", err);
      alert("Failed to open camera or get location.");
    } finally {
      setIsCameraLoading(false);
    }
  };

  // --- Gallery (auto geotag) ---
  const pickFromGalleryAuto = async () => {
    setIsCameraLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required for auto geotag.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      let address = "";

      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const info = reverseGeocode[0];
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
      } catch (error) {
        console.error("Failed reverse geocode:", error);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        setSelectedImage(imageUri);
        setCapturedDate(new Date().toLocaleString());
        setCapturedLocation({ ...location, address });
        setIsCapturedImage(true);
      }
    } catch (err) {
      console.error("Gallery Auto Error:", err);
      alert("Failed to get auto geotag.");
    } finally {
      setIsCameraLoading(false);
    }
  };

  // --- Gallery (manual geotag) ---
  const pickFromGalleryManual = async () => {
    setIsCameraLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setManualImageUri(imageUri);
        setManualModalVisible(true);
      }
    } catch (err) {
      console.error("Gallery Manual Error:", err);
      alert("Failed to pick image.");
    } finally {
      setIsCameraLoading(false);
    }
  };

  const saveImageWithOverlay = async () => {
    if (!viewShotRef.current?.capture || !selectedImage || !capturedDate)
      return;

    const overlayUri = await viewShotRef.current.capture();

    if (editingEvidence) {
      onUpdateImage({
        image: overlayUri,
        date: capturedDate,
        latitude: capturedLocation!.coords.latitude.toFixed(5),
        longitude: capturedLocation!.coords.longitude.toFixed(5),
        address: capturedLocation?.address,
      });
    } else {
      onCreateImage({
        baseImage: selectedImage,
        image: overlayUri,
        date: capturedDate,
        latitude: capturedLocation!.coords.latitude.toFixed(5),
        longitude: capturedLocation!.coords.longitude.toFixed(5),
        description: `Captured on ${capturedDate}`,
        taskEvidenceId: Number(evidenceId),
        accountId: account?.id,
      });
    }

    setEditingEvidence(null);
    resetPreviewState();
  };

  const resetPreviewState = () => {
    setSelectedImage(null);
    setCapturedDate(null);
    setCapturedLocation(null);
    setIsCapturedImage(false);
  };

  const downloadImage = async () => {
    if (!selectedImage) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Media library permission is required.");
      return;
    }

    try {
      const filename = selectedImage.split("/").pop();
      if (!FileSystem.documentDirectory) {
        alert("Cannot access document directory.");
        return;
      }
      const downloadResumable = FileSystem.createDownloadResumable(
        selectedImage,
        FileSystem.documentDirectory + filename,
      );

      const downloadResult = await downloadResumable.downloadAsync();
      if (!downloadResult || !downloadResult.uri) {
        alert("Failed to download image.");
        return;
      }
      const localUri = downloadResult.uri;

      await MediaLibrary.saveToLibraryAsync(localUri);
      alert("Image saved to gallery.");
    } catch (error) {
      console.error("Failed to save image", error);
      alert("Failed to save image.");
    }
  };

  const { mutate: onCreateImage, isPending: isUploading } = useMutation({
    mutationFn: (values: CreateTaskEvidenceImageType) =>
      createTaskEvidenceImage(values),
    onSuccess: (data) => {
      showToast("Success", "Evidence Image Created");
      setUploadedEvidences((prev) => [...prev, data]);
      queryClient.invalidateQueries({
        queryKey: ["evidences", evidenceId],
      });
    },
    onError: (error: any) => {
      let message = "Something went wrong.";
      if (error?.message === "Network Error") {
        message = "Network error. Please check your internet connection.";
      }
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }
      showToast("Error", message);
      console.error("Upload error:", error);
    },
  });

  const { mutate: onUpdateImage } = useMutation({
    mutationFn: (values: CreateTaskEvidenceImageType) =>
      updateTaskEvidenceImage(editingEvidence!.id!.toString(), values), // PUT API
    onSuccess: (updated) => {
      setUploadedEvidences((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e)),
      );
      showToast("Success", "Evidence updated");
      queryClient.invalidateQueries({
        queryKey: ["evidences", evidenceId],
      });
    },
  });

  const { mutate: onDeleteImage } = useMutation({
    mutationFn: (id: number) => deleteTaskEvidenceImage(id.toString()),
    onSuccess: (_, id) => {
      setUploadedEvidences((prev) => prev.filter((e) => e.id !== id));
      showToast("Success", "Image deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["evidences", evidenceId] });
    },
    onError: (error: any) => {
      let message = "Failed to delete image.";
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }
      showToast("Error", message);
    },
  });

  console.log(editingEvidence);

  return (
    <View className="relative py-6 mt-4 bg-white">
      {isCameraLoading && (
        <View className="absolute top-0 bottom-0 left-0 right-0 z-50 items-center justify-center bg-black/50">
          <Text className="text-base text-white font-cereal-medium">
            Fetching Your Location...
          </Text>
        </View>
      )}

      {isUploading && (
        <View className="absolute top-0 bottom-0 left-0 right-0 z-50 items-center justify-center bg-black/60">
          <Text className="mb-2 text-base text-white font-cereal-medium">
            Uploading image...
          </Text>
          <Text className="text-sm text-white/80">Please wait</Text>
        </View>
      )}

      {/* Preview Modal */}
      <PreviewImageModal
        selectedImage={selectedImage}
        capturedDate={capturedDate}
        capturedLocation={capturedLocation}
        width={width}
        height={height}
        viewShotRef={viewShotRef}
        resetPreviewState={resetPreviewState}
        isCapturedImage={isCapturedImage}
        saveImageWithOverlay={saveImageWithOverlay}
        downloadImage={downloadImage}
        isEditing={!!editingEvidence}
        onEdit={() => {
          setManualImageUri(selectedImage); // base image
          setManualModalVisible(true);
        }}
      />

      {/* Manual Geotag Modal */}
      <GeotagModal
        visible={manualModalVisible}
        imageUri={manualImageUri}
        initialData={
          editingEvidence
            ? {
                date: editingEvidence.date,
                latitude: editingEvidence.latitude,
                longitude: editingEvidence.longitude,
              }
            : undefined
        }
        onClose={() => {
          setManualModalVisible(false);
          setManualImageUri(null);
          setEditingEvidence(null);
        }}
        onConfirm={(data) => {
          setSelectedImage(manualImageUri); // BASE IMAGE
          setCapturedDate(data.dateString);
          setCapturedLocation({
            coords: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            address: data.address,
          });
          setIsCapturedImage(true);
          setManualModalVisible(false);
        }}
      />

      <UploadOptionsModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onCamera={takePhoto}
        onGalleryAuto={pickFromGalleryAuto}
        onGalleryManual={pickFromGalleryManual}
      />

      <View className="flex-row items-center justify-between px-6">
        <Text className="text-lg font-cereal-medium">Evidence Images</Text>
        {isUpload && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Entypo name="plus" size={24} color="#2d5bff" />
          </Pressable>
        )}
      </View>
      <EvidenceList
        onDeleteImage={onDeleteImage}
        setSelectedEvidence={(evidence) => {
          setEditingEvidence(evidence);
          setSelectedImage(evidence.image);
        }}
        uploadedEvidences={uploadedEvidences}
        isUpload={isUpload}
        setModalVisible={setModalVisible}
        isUploading={isUploading}
      />

      {uploadedEvidences.length > 0 && (
        <View className="px-6 mt-4">
          <Text className="text-sm text-red-400 font-cereal-regular">
            Long press on an image to delete it.
          </Text>
        </View>
      )}
    </View>
  );
}
