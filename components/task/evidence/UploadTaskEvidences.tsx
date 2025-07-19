import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
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
import {
  ArrowBigRightDash,
  Camera,
  Download,
  Images,
} from "lucide-react-native";
import * as Location from "expo-location";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { CreateTaskEvidenceImageType } from "@/lib/types/task-evidence-image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTaskEvidenceImage,
  deleteTaskEvidenceImage,
} from "@/lib/network/task-evidence-image";
import { useCustomToast } from "@/lib/useToast";
import { useAccount } from "@/contexts/AccountContexts";

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

  const viewShotRef = useRef<ViewShot>(null);
  const { width, height } = useWindowDimensions();
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const { account } = useAccount();

  const pickFromGallery = async () => {
    setIsCameraLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        // Get location
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
          console.error("Reverse geocode failed:", error);
        }

        setSelectedImage(imageUri);
        setCapturedDate(new Date().toLocaleString());
        setCapturedLocation({ ...location, address });
        setIsCapturedImage(true);
      }
    } catch (err) {
      console.error("Gallery or Location Error:", err);
      alert("Failed to pick image or get location.");
    } finally {
      setIsCameraLoading(false);
    }
  };

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

  const pickFromDrive = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const imageUri = result.assets[0].uri;

      onCreateImage({
        image: imageUri,
        taskEvidenceId: Number(evidenceId),
        accountId: account?.id || undefined,
      });
    }
  };

  const saveImageWithOverlay = async () => {
    if (viewShotRef.current?.capture) {
      const uri = await viewShotRef.current.capture();

      onCreateImage({
        image: uri,
        description: `Captured on ${capturedDate}`,
        taskEvidenceId: Number(evidenceId),
        accountId: account?.id || undefined,
      });

      resetPreviewState();
    }
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
      // Download the remote image to a local file
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

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(localUri);
      alert("Image saved to gallery.");
    } catch (error) {
      console.error("Failed to save image", error);
      alert("Failed to save image.");
    }
  };

  const { mutate: onCreateImage } = useMutation({
    mutationFn: (values: CreateTaskEvidenceImageType) =>
      createTaskEvidenceImage(values),

    onSuccess: (data) => {
      showToast("Success", "Evidence Image Created");

      setUploadedEvidences((prev) => [...prev, data]);

      // optionally revalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["evidences", evidenceId],
      });
    },

    onError: (error: any) => {
      // Default error message
      let message = "Something went wrong.";

      // Handle network error (no response from server)
      if (error?.message === "Network Error") {
        message = "Network error. Please check your internet connection.";
      }

      // If the server responded with a message (e.g. validation error)
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      }

      // Show error message
      showToast("Error", message);
      console.error("Upload error:", error);
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

  const confirmDelete = (id: number) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDeleteImage(id),
      },
    ]);
  };

  return (
    <View className="relative py-6 mt-4 bg-white">
      {isCameraLoading && (
        <View className="absolute top-0 bottom-0 left-0 right-0 z-50 items-center justify-center bg-black/50">
          <Text className="text-base text-white font-cereal-medium">
            Fetching Your Location...
          </Text>
        </View>
      )}

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

          <Pressable
            onPress={isCapturedImage ? saveImageWithOverlay : downloadImage}
            className="absolute top-0 flex-row items-center justify-between w-[100vw] px-4 py-4 bg-white"
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

      <UploadOptionsModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onCamera={takePhoto}
        onGallery={pickFromGallery}
        onDrive={pickFromDrive}
      />

      <View className="flex-row items-center justify-between px-6">
        <Text className="text-lg font-cereal-medium">Evidence Images</Text>
        {isUpload && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Entypo name="plus" size={24} color="#2d5bff" />
          </Pressable>
        )}
      </View>
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
              console.log("Long pressed:", evidence.id);
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

// Upload Options Modal
interface UploadOptionsModalProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  onCamera: () => void;
  onGallery: () => void;
  onDrive: () => void;
}

function UploadOptionsModal({
  visible,
  setVisible,
  onCamera,
  onGallery,
  onDrive,
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
