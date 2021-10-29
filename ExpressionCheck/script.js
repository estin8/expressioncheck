const video = document.getElementById('video');
const moodResponse = document.getElementById('mood');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
  faceapi.nets.faceExpressionNet.loadFromUri('../models'),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);

  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    resizedDetections.forEach((detection) => {
      if (detection.expressions.angry >= 0.7) {
        console.log('calm down bro');
        mood.textContent = 'calm down bro';
      } else if (detection.expressions.happy >= 0.7) {
        console.log('It looks like youre happy');
        mood.textContent = 'It looks like youre happy';
      } else if (detection.expressions.neutral >= 0.7) {
        console.log('Just meh eh?');
        mood.textContent = 'Just meh eh?';
      } else if (detection.expressions.sad >= 0.7) {
        console.log("Awww what's wrong buh-babbyy?");
        mood.textContent = 'Awww whats wrong buh-babbyy?';
      }
    });
  }, 1000);
});
