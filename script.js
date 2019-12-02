const video = document.getElementById('video')
let faceCount = document.getElementById('faceCount')
let confidence = document.getElementById('confidence')

let emotionCount = {
  'neutral': 0,
  'happy': 0,
  'sad': 0,
  'angry': 0,
  'disgusted': 0,
  'fearful': 0,
  'surprised': 0
}
let currentLineChart='happy'
let happiness = []
let tempHappy = []
let emotionDetails = {
  'neutral': {
    'temp': [],
    'avg': []
  },
  'happy': {
    'temp': [],
    'avg': []
  },
  'sad': {
    'temp': [],
    'avg': []
  },
  'angry': {
    'temp': [],
    'avg': []
  },
  'disgusted': {
    'temp': [],
    'avg': []
  },
  'fearful': {
    'temp': [],
    'avg': []
  },
  'surprised': {
    'temp': [],
    'avg': []
  },
}


var ctx = document.getElementById('pieChart').getContext('2d');
var linectx = document.getElementById("lineChart").getContext("2d");
// var gaugectx = document.getElementById('myChart').getContext('2d');


// var gaugeChart = new Chart(gaugectx, {
//   // The type of chart we want to create
//   type: 'doughnut',

//   // The data for our dataset
//   data: {
//       labels: ["January", "February", "March", "April", "May"],
//       datasets: [{
//           label: "My First dataset",
//           backgroundColor: ['rgb(0, 99, 132)', 'green', 'red', 'yellow', 'orange'],
//           borderColor: '#fff',
//           data: [5, 10, 5, 2, 20],
//       }]
//   },

//   // Configuration options go here
//   options: {
//       circumference: 1 * Math.PI,
//       rotation: 1 * Math.PI,
//       cutoutPercentage: 90
//   }
// });

var lineChart = new Chart(linectx, {
  type: 'line',
  data: {
    labels: [0, 5, 10, 15, 20, 25, 30, 35],
    datasets: [{
      label: currentLineChart[0].toUpperCase()+currentLineChart.slice(1),
      data: emotionDetails[currentLineChart]['avg'],
      backgroundColor: 'rgba(10, 183, 199,0.8)',
      pointRadius: 5,
      borderColor: 'rgba(10, 183, 199,1)',
      pointBorderColor: 'rgba(10, 183, 199,1)',
      pointBackgroundColor: 'rgba(10, 183, 199,0.8)',
    }]
  },
  options: {}
})


let labels = Object.keys(emotionCount)
let data = []
labels.forEach((key, index) => {
  data[index] = emotionCount[key]
})

var myChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: labels,
    datasets: [{
      label: 'Overall emotion',
      data: data,
      backgroundColor: [
        'rgba(131, 130, 135,0.8)',
        'rgba(26, 214, 32, 0.8)',
        'rgba(63, 26, 214, 0.8)',
        'rgba(217, 26, 32, 0.8)',
        'rgba(214, 26, 211, 0.8)',
        'rgba(181, 212, 28, 0.8)',
        'rgba(245, 161, 27, 0.8)'

      ],
      borderColor: [
        'rgba(131, 130, 135,1)',
        'rgba(26, 214, 32, 1)',
        'rgba(63, 26, 214, 1)',
        'rgba(217, 26, 32, 1)',
        'rgba(214, 26, 211, 1)',
        'rgba(181, 212, 28, 1)',
        'rgba(245, 161, 27, 1)'

      ],
      borderWidth: 1
    }]
  },
  options: {
    events: ['click'],
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});


const emotions = ['neutral', 'happy', 'sad', 'angry', 'disgusted', 'fearful', 'surprised', 'disgusted'];
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo())

document.getElementById('pieChart').onclick=function(evt){
  var activePoints = myChart.getElementsAtEvent(evt);
  if(activePoints.length > 0)
  {
    let indx=activePoints[0]["_index"]
    currentLineChart=labels[indx]
    lineChart.data.datasets.forEach((dataset) => {    
      dataset.label= currentLineChart[0].toUpperCase()+currentLineChart.slice(1)
      dataset.data = emotionDetails[currentLineChart]['avg']
    });
    lineChart.update();
  }
}
// pieChart.onClick(function(evt){
//   console.log('here')
//   var activePoints = myChart.getSegmentsAtEvent(evt);
  
// })

function startVideo() {

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
      inputSize: 800
    })).withFaceLandmarks().withFaceExpressions()
    faceCount.innerHTML = detections.length
    // console.log(detections)
    let sumOfConfidence = 0
    for (let j = 0; j < detections.length; j++) {
      let emotion = detections[j]['expressions']
      let faceDetection = detections[j]['detection']
      sumOfConfidence = sumOfConfidence + faceDetection['classScore']
      if (emotion) {
        let emotionProb = Object.values(emotion);
        let max = emotionProb[0]
        let maxIndex = 0;
        for (let i = 1; i < emotionProb.length; i++) {
          if (max < emotionProb[i]) {
            max = emotionProb[i];
            maxIndex = i;
          }
        }
        emotionName = emotions[maxIndex]
        let count = emotionCount[emotionName]
        count = count + 1
        emotionCount[emotionName] = count

        emotions.forEach((val, index) => {
          if (emotionDetails[val]['temp'].length > 7) {
            emotionDetails[val]['temp'].shift()
          }
          emotionDetails[val]['temp'].push(emotion[val])
        })
        if (tempHappy.length > 7) {
          tempHappy.shift()
        }
        tempHappy.push(emotion['happy'])
        // console.log(tempHappy)
      }
    }
    if (detections.length > 0) {
      let temp = sumOfConfidence / detections.length;
      temp = temp * 100;
      confidence.innerHTML = temp.toFixed(2) + '%'
    } else
      confidence.innerHTML = 0 + '%'

  }, 1000)
}

setInterval(() => {

  emotions.forEach((val, index) => {
    let avg = 0;
    emotionDetails[val]['temp'].forEach((val) => {
      avg = avg + val
    })

    avg = avg / emotionDetails[val]['temp'].length;
    if (emotionDetails[val]['avg'].length > 7) {
      emotionDetails[val]['avg'].shift()
    }
    emotionDetails[val]['avg'].push(avg)
    console.log('Data',emotionDetails[val]['avg'])

  })
  avg = 0;
  tempHappy.forEach((val) => {
    avg = avg + val
  })
  avg = avg / tempHappy.length;
  if (happiness.length > 7) {
    happiness.shift()
  }
  happiness.push(avg * 100)
  let labels = Object.keys(emotionCount)
  let data = []
  labels.forEach((key, index) => {
    data[index] = emotionCount[key]
  })
  myChart.data.labels = labels;
  myChart.data.datasets.forEach((dataset) => {
    dataset.data = data
  });
  lineChart.data.datasets.forEach((dataset) => {
    console.log(currentLineChart)
    dataset.data = emotionDetails[currentLineChart]['avg']
  });
  lineChart.update();
  myChart.update();

}, 5000)