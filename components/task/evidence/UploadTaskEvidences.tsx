<<<<<<< HEAD
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import React, { useState, useRef } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";

import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
=======
import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  FlatList,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import {
  ArrowBigRightDash,
  Camera,
  Images,
  Download,
} from "lucide-react-native";
import * as Location from "expo-location";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker"; // 📌 add this
>>>>>>> 9c52db63e2799ef59beae0032901aad58e8110a3
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
        FileSystem.documentDirectory + filename
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
        prev.map((e) => (e.id === updated.id ? updated : e))
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

<<<<<<< HEAD
      {isUploading && (
        <View className="absolute top-0 bottom-0 left-0 right-0 z-50 items-center justify-center bg-black/60">
          <Text className="mb-2 text-base text-white font-cereal-medium">
            Uploading image...
          </Text>
          <Text className="text-sm text-white/80">Please wait</Text>
        </View>
      )}
=======
      {/* Preview Modal */}
      <Modal isOpen={!!selectedImage} onClose={resetPreviewState}>
        <ModalBackdrop />
        <ModalContent className="w-full h-full bg-black/50">
          <Pressable
            className="items-center justify-center flex-1"
            onPress={resetPreviewState}
          >
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
              <Image
                source={{ uri: selectedImage || "" }}
                style={{ width, height: height * 0.8 }}
                resizeMode="contain"
              />
              {(capturedDate || capturedLocation) && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgb(0,0,0)",
                    padding: 10,
                  }}
                >
                  {capturedDate && (
                    <Text style={{ color: "white", fontSize: 12 }}>
                      Captured: {capturedDate}
                    </Text>
                  )}
                  {capturedLocation && (
                    <>
                      <Text style={{ color: "white", fontSize: 12 }}>
                        Location: {capturedLocation.coords.latitude.toFixed(5)},{" "}
                        {capturedLocation.coords.longitude.toFixed(5)}
                      </Text>
                      {capturedLocation.address && (
                        <Text style={{ color: "white", fontSize: 12 }}>
                          Address: {capturedLocation.address}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              )}
            </ViewShot>
          </Pressable>
>>>>>>> 9c52db63e2799ef59beae0032901aad58e8110a3

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

      {/* Manual Geotag Modal */}
      <ManualGeotagModal
        visible={manualModalVisible}
        imageUri={manualImageUri}
        onClose={() => {
          setManualModalVisible(false);
          setManualImageUri(null);
        }}
        onConfirm={(data) => {
          setSelectedImage(manualImageUri);
          setCapturedDate(data.dateString);
          setCapturedLocation({
            coords: { latitude: data.latitude, longitude: data.longitude },
            address: data.address,
          });
          setIsCapturedImage(true);
          setManualModalVisible(false);
          setManualImageUri(null);
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
<<<<<<< HEAD
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
=======
      <FlatList
        data={uploadedEvidences}
        horizontal
        className="mt-2 ps-6"
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() =>
          isUpload ? (
            <Pressable
              onPress={() => setModalVisible(true)}
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
            onLongPress={() => {
              if (evidence.id) {
                confirmDelete(evidence.id);
              }
            }}
            className="relative items-center justify-center overflow-hidden border-2 size-32 me-2 rounded-xl border-slate-500"
          >
            <Image
              source={{ uri: evidence.image }}
              resizeMode="cover"
              className="w-full h-full"
            />
          </Pressable>
        )}
>>>>>>> 9c52db63e2799ef59beae0032901aad58e8110a3
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
<<<<<<< HEAD
=======

// Upload Options Modal
interface UploadOptionsModalProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  onCamera: () => void;
  onGalleryAuto: () => void;
  onGalleryManual: () => void;
}

function UploadOptionsModal({
  visible,
  setVisible,
  onCamera,
  onGalleryAuto,
  onGalleryManual,
}: UploadOptionsModalProps) {
  return (
    <Modal isOpen={visible} onClose={() => setVisible(false)} size="md">
      <ModalBackdrop />
      <ModalContent className="pb-0 rounded-3xl">
        <ModalHeader className="flex flex-col gap-1">
          <Text className="text-lg text-center font-cereal-medium">
            Upload Evidence
          </Text>
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-[1px] bg-slate-500" />
            <Text className="text-sm text-center font-cereal text-slate-500">
              Choose Source
            </Text>
            <View className="w-8 h-[1px] bg-slate-500" />
          </View>
        </ModalHeader>
        <ModalBody>
          <View className="flex-row justify-between gap-4 pt-2">
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
              label="Gallery (Auto)"
              onPress={() => {
                setVisible(false);
                onGalleryAuto();
              }}
            />
            <UploadOption
              icon={<Images size={32} color="#9196a5" />}
              label="Gallery (Manual)"
              onPress={() => {
                setVisible(false);
                onGalleryManual();
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

// ManualGeotagModal
interface ManualGeotagModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  onConfirm: (data: {
    dateString: string;
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
}

function ManualGeotagModal({
  visible,
  imageUri,
  onClose,
  onConfirm,
}: ManualGeotagModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (visible) {
      setDate(new Date());
      setLatitude("");
      setLongitude("");
      setAddress("");
    }
  }, [visible]);

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
>>>>>>> 9c52db63e2799ef59beae0032901aad58e8110a3
