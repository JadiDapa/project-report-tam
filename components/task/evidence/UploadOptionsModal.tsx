import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@/components/ui/modal";
import { Camera, Images } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface UploadOptionsModalProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  onCamera: () => void;
  onGalleryAuto: () => void;
  onGalleryManual: () => void;
}

export function UploadOptionsModal({
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
