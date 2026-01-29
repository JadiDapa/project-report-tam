import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { CreateTaskEvidenceImageType } from "@/lib/types/task-evidence-image";
import { ArrowBigRightDash, Download } from "lucide-react-native";
import { Image, Pressable, Text, View } from "react-native";
import ViewShot from "react-native-view-shot";

interface PreviewImageModalProps {
  selectedImage: string | null;
  capturedDate: string | null;
  capturedLocation: {
    coords: { latitude: number; longitude: number };
    address?: string | undefined;
  } | null;
  width: number;
  height: number;
  viewShotRef: any;
  resetPreviewState: () => void;
  isCapturedImage: boolean;
  saveImageWithOverlay: () => void;
  downloadImage: () => void;
  isEditing?: boolean;
  onEdit?: () => void;
}

export default function PreviewImageModal({
  selectedImage,
  capturedDate,
  capturedLocation,
  width,
  height,
  viewShotRef,
  resetPreviewState,
  isCapturedImage,
  saveImageWithOverlay,
  downloadImage,
  isEditing = false,
  onEdit,
}: PreviewImageModalProps) {
  return (
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

        <View className="absolute top-12 flex-row items-center justify-between w-[100vw] bg-white">
          <Pressable className="flex-1 px-4 py-4 " onPress={onEdit}>
            <Text className="text-blue-500 font-cereal-medium">Edit</Text>
          </Pressable>

          <Pressable
            onPress={isCapturedImage ? saveImageWithOverlay : downloadImage}
            className="flex-row items-center flex-1 gap-2 px-4 py-4 bg-primary-500 "
          >
            <Text className="text-white font-cereal-medium">
              {isCapturedImage ? "Confirm Picture" : "Save to Gallery"}
            </Text>
            {isCapturedImage ? (
              <ArrowBigRightDash size={24} color="#fff" />
            ) : (
              <Download size={24} color="#fff" />
            )}
          </Pressable>
        </View>
      </ModalContent>
    </Modal>
  );
}
