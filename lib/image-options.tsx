import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import { Dispatch, SetStateAction } from "react";

export const pickImage = async (setUpload: Dispatch<SetStateAction<any>>) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: false,
    quality: 1,
  });

  if (!result.canceled && result.assets.length > 0) {
    setUpload(result.assets[0].uri);
  }
};

export const pickImages = async (
  setUpload: Dispatch<SetStateAction<any>>,
  uploads: any
) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    setUpload([
      ...uploads,
      ...result.assets.map((evidence) => ({
        image: evidence.uri,
        description: "just a description",
      })),
    ]);
  }
};

export const takePhotos = async (
  setUpload: Dispatch<SetStateAction<any>>,
  uploads: any
) => {
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
    setUpload([
      ...uploads,
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

export const takePhoto = async (setUpload: Dispatch<SetStateAction<any>>) => {
  // Capture image
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    quality: 1,
    presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
  });

  if (!result.canceled) {
    setUpload({
      image: result.assets[0].uri,
      description: "just a description",
    });
  }
};

export const pickFromGoogleDrive = async (
  setUpload: Dispatch<SetStateAction<any>>,
  uploads: any
) => {
  let result = await DocumentPicker.getDocumentAsync({
    type: "image/*",
    copyToCacheDirectory: true,
  });

  if (result.assets && result.assets?.length > 0) {
    setUpload((prev: any) => [
      ...(prev || []),
      { image: result.assets[0].uri, description: "just a description" },
    ]);
  }
};
