import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator'; // Or your chosen library

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      controllerRef.current = new AbortController();
      try {
        let photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true, // for passing to external library
          exif: true
        }, {signal: controllerRef.current.signal});

        // Process Image
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 500, height: 500 }}],
          { compress: 0.5, base64: true },
          { signal: controllerRef.current.signal }
        );
        setPhoto(manipulatedImage);
      } catch (error) {
        if(error.name !== 'AbortError') {
          console.error('Camera error:', error);
        }
      } finally {
        controllerRef.current = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      //Abort any outstanding operation
      if(controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  if (hasPermission === null) {
    return <View />; //Loading...
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <Button title="Take Picture" onPress={takePicture} />
        {photo && <Image source={{ uri: `data:image/jpeg;base64,${photo.base64}` }} style={{ width: 200, height: 200 }}/>}
      </Camera>
    </View>
  );
};

export default CameraScreen;