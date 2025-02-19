# Expo Camera Crash: Unmounted Component with Image Processing

This repository demonstrates a bug in Expo's Camera API when combined with asynchronous image processing. The issue occurs when a component using the Camera API is unmounted before an image processing task (using a library like OpenCV.js) completes. This leads to a silent crash, making debugging challenging.

## Bug Description

The problem lies in the asynchronous nature of image processing. If the image processing takes longer than the component's unmounting, the library tries to access resources linked to the unmounted component, resulting in a crash or undefined behavior.

## Solution

The solution involves using React's lifecycle methods and the `AbortController` API to manage the asynchronous processing.  This ensures the processing task is cancelled if the component unmounts before completion, avoiding the crash.

## How to reproduce

1. Clone this repository.
2. Run `npm install`.
3. Run `expo start`.
4. Take a photo.  Notice the crash when quickly navigating away from the camera view.

## Additional Notes

This issue highlights the importance of handling asynchronous tasks carefully within React components, especially when using external libraries with potentially long processing times.