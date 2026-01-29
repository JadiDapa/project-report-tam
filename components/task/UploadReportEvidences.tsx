import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  useWindowDimensions,
  TextInput,
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
import { ReportEvidenceType } from "@/lib/types/report-evidence";
import * as Location from "expo-location";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { TaskEvidenceImageType } from "@/lib/types/task-evidence-image";

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
  const [showManualModal, setShowManualModal] = useState(false);
<<<<<<< HEAD
  const [selectedImage, setSelectedImage] =
    useState<TaskEvidenceImageType>(null);
=======
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
>>>>>>> 9c52db63e2799ef59beae0032901aad58e8110a3
  const [capturedDate, setCapturedDate] = useState<string | null>(null);
  const [isCapturedImage, setIsCapturedImage] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const { width, height } = useWindowDimensions();
  const [capturedLocation, setCapturedLocation] = useState<{
    coords: { latitude: number; longitude: number };
    address?: string;
  } | null>(null);

  // Manual geotagging input states
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

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
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    // Reverse geocoding
    let address = "";
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const firstResult = reverseGeocode[0];
        address = [
          firstResult.street,
          firstResult.city,
          firstResult.region,
          firstResult.country,
          firstResult.postalCode,
        ]
          .filter(Boolean)
          .join(", ");
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const date = new Date().toLocaleString();
      setCapturedDate(date);
      setCapturedLocation({
        ...location,
        address,
      });
      setSelectedImage(result.assets[0].uri);
      setIsCapturedImage(true);
    }
  };

  const manualGeotagImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      const lat = parseFloat(manualLat);
      const lng = parseFloat(manualLng);

      let address = "";
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (reverseGeocode.length > 0) {
          const first = reverseGeocode[0];
          address = [
            first.street,
            first.city,
            first.region,
            first.country,
            first.postalCode,
          ]
            .filter(Boolean)
            .join(", ");
        }
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
      }

      const dateTime = `${manualDate} ${manualTime}`;

      setCapturedDate(dateTime);
      setCapturedLocation({
        coords: { latitude: lat, longitude: lng },
        address,
      });
      setSelectedImage(result.assets[0].uri);
      setIsCapturedImage(true);
    }
  };

  const saveImageWithOverlay = async () => {
    if (
      viewShotRef.current &&
      typeof viewShotRef.current.capture === "function"
    ) {
      const uri = await viewShotRef.current.capture();
      setUploadedEvidences([
        ...uploadedEvidences,
        {
          image: uri,
          description: `Captured on ${capturedDate}`,
          location: capturedLocation,
          date: capturedDate,
        },
      ]);
      setSelectedImage(null);
      setCapturedDate(null);
      setCapturedLocation(null);
      setIsCapturedImage(false);
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

  const downloadImage = async () => {
    if (!selectedImage) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      await MediaLibrary.saveToLibraryAsync(selectedImage);
      alert("Image saved to gallery successfully!");
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save image to gallery");
    }
  };

  return (
    <View className="relative py-6 mt-4 bg-white">
      {/* Fullscreen Preview */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => {
          setSelectedImage(null);
          setIsCapturedImage(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent className="w-full h-full bg-black/50">
          <Pressable
            className="items-center justify-center flex-1"
            onPress={() => setSelectedImage(null)}
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
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: 10,
                  }}
                >
                  {capturedDate && (
                    <Text style={{ color: "white", fontSize: 12 }}>
                      Captured on: {capturedDate}
                    </Text>
                  )}
                  {capturedLocation && (
                    <>
                      <Text style={{ color: "white", fontSize: 12 }}>
                        Coordinates:{" "}
                        {capturedLocation.coords.latitude.toFixed(5)},{" "}
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

          {!isCapturedImage && (
            <Pressable
              onPress={downloadImage}
              className="absolute items-center justify-between flex-row w-[100vw] px-4 py-4 bg-white top-0"
            >
              <Text className="font-cereal-medium">Save to Gallery</Text>
              <Download size={24} color={"#2d5bff"} />
            </Pressable>
          )}

          {isCapturedImage && (
            <Pressable
              onPress={saveImageWithOverlay}
              className="absolute items-center justify-between flex-row w-[100vw] px-4 py-4 bg-white top-0"
            >
              <Text className="font-cereal-medium">
                Select and Confirm Picture
              </Text>
              <ArrowBigRightDash size={24} color={"#2d5bff"} />
            </Pressable>
          )}
        </ModalContent>
      </Modal>

      {/* Manual Input Modal */}
      <Modal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent className="p-4 rounded-2xl">
          <ModalHeader>
            <Text className="text-lg text-center font-cereal-medium">
              Manual Geotagging
            </Text>
          </ModalHeader>
          <ModalBody>
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              value={manualDate}
              onChangeText={setManualDate}
              className="p-2 mb-2 border rounded"
            />
            <TextInput
              placeholder="Time (HH:MM)"
              value={manualTime}
              onChangeText={setManualTime}
              className="p-2 mb-2 border rounded"
            />
            <TextInput
              placeholder="Latitude"
              value={manualLat}
              onChangeText={setManualLat}
              keyboardType="numeric"
              className="p-2 mb-2 border rounded"
            />
            <TextInput
              placeholder="Longitude"
              value={manualLng}
              onChangeText={setManualLng}
              keyboardType="numeric"
              className="p-2 mb-4 border rounded"
            />

            <Pressable
              onPress={() => {
                manualGeotagImage();
                setShowManualModal(false);
              }}
              className="p-3 bg-blue-500 rounded-xl"
            >
              <Text className="text-center text-white">Select Image</Text>
            </Pressable>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Upload Option Modal */}
      <SelectEmployeeModal
        showModal={showModal}
        setShowModal={setShowModal}
        pickImages={pickImages}
        takePhoto={takePhoto}
        pickFromGoogleDrive={pickFromGoogleDrive}
        openManualModal={() => setShowManualModal(true)}
      />

      {/* Uploaded Preview */}
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
            onPress={() => setSelectedImage(evidence)}
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
    </View>
  );
}

// SelectEmployeeModal
interface SelectEmployeeModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  pickImages: () => void;
  takePhoto: () => void;
  pickFromGoogleDrive: () => void;
  openManualModal: () => void;
}

function SelectEmployeeModal({
  showModal,
  setShowModal,
  pickImages,
  takePhoto,
  pickFromGoogleDrive,
  openManualModal,
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
        <ModalBody>
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

            <Pressable
              onPress={() => {
                openManualModal();
                setShowModal(false);
              }}
              className="items-center justify-center border-2 border-dashed rounded-xl border-slate-500 size-20"
            >
              <Entypo name="location" size={32} color="#9196a5" />
              <Text className="text-center text-slate-500 font-cereal-medium">
                Manual
              </Text>
            </Pressable>
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
