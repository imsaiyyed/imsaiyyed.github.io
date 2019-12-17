//Color Constants
const neutralColor = '#FDE27B';
const neutralBorderColor = '#e8c953';

const happyColor = '#89E894';
const happyBorderColor = '#70ca7b';

const surprisedColor = '#BAE1FF';
const surprisedBorderColor = '#79afd8';

const unhappyColor = '#F1646C';
const unhappyBorderColor = '#d34850';

const backColorArray = [neutralColor, happyColor, unhappyColor];
const borderColorArray = [neutralBorderColor, happyBorderColor, surprisedBorderColor, unhappyBorderColor];
const lineWidth = 2;
const lineChartEmogi = document.getElementById('lineChartEmogi');
const video = document.getElementById('video');
let faceCount = document.getElementById('faceCount');
let chartLabel = document.getElementById('realtimeChartLabel');
let currentEmotion = null;
let emotionCountPreviousData = JSON.parse(localStorage.getItem('pieData'));
//PieChart Object
let emotionCount = {
  'neutral': 0,
  'happy': 0,
  'unhappy': 0,
}
let emotionCountOld = {
  'neutral': 0,
  'happy': 0,
  'unhappy': 0,
}
if (emotionCountPreviousData) {
  emotionCount = emotionCountPreviousData;
}
let currentLineChart = 'happy';
let happiness = [];
let tempHappy = [];
//Time series Onject 
let timeSeriesPreviousData = JSON.parse(localStorage.getItem('timeData'));
let compoundData = {
  labels: [],
  data: []
}
for (let i = 15; i >= 0; i--) {
  compoundData['labels'].push(-i);
  compoundData['data'].push(0);
}
let timeSeries = {
  'timeArray': [],
  'neutral': {
    'avg': [],
    'title': 'Neutral',
    'backgroundcolor': neutralColor,
    'bordercolor': neutralBorderColor,
  },
  'happy': {
    'avg': [],
    'title': 'Happy',
    'backgroundcolor': happyColor,
    'bordercolor': happyBorderColor,
  },
  'unhappy': {
    'avg': [],
    'title': 'Unhappy',
    'backgroundcolor': unhappyColor,
    'bordercolor': unhappyBorderColor,
  }
};
for (let i = 240; i >= 0; i = i - 15) {
  timeSeries['timeArray'].push(-i);
  timeSeries['happy']['avg'].push(0);
  timeSeries['neutral']['avg'].push(0);
  timeSeries['unhappy']['avg'].push(0);
}
if (timeSeriesPreviousData) {
  timeSeries = timeSeriesPreviousData;
}
let emotionDetailsPreviousData = JSON.parse(localStorage.getItem('lineData'));

let emotionDetails = {
  'neutral': {
    'temp': [],
    'avg': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'title': 'Neutral',
    'backgroundcolor': neutralColor,
    'bordercolor': neutralBorderColor,

  },
  'happy': {
    'temp': [],
    'avg': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'title': 'Happy',
    'backgroundcolor': happyColor,
    'bordercolor': happyBorderColor,

  },
  'unhappy': {
    'temp': [],
    'avg': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'title': 'Sad',
    'backgroundcolor': unhappyColor,
    'bordercolor': unhappyBorderColor,

  }
};
if (emotionDetailsPreviousData) {
  emotionDetails = emotionDetailsPreviousData;
}

let ctx = document.getElementById('pieChart').getContext('2d');
let linectx = document.getElementById("lineChart").getContext("2d");
let timectx = document.getElementById('timeChart').getContext('2d');
let compoundctx = document.getElementById('compoundChart').getContext('2d');


let compoundChart = new Chart(compoundctx, {
  type: 'line',
  data: {
    labels: compoundData['labels'],
    datasets: [{
      fill: false,
      label: "Neutral",
      borderColor: '#864fe0',
      backgroundColor: '#864fe0',
      data: compoundData['data'],
      borderWidth: lineWidth
    }]
  },
  options: {
    responsive: true,
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0,
      }
    },
    maintainAspectRatio: false,
    fill: false,
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Time (Seconds)",
        },
        ticks: {
          callback: function (value) {
            if (value == 0) {
              return 'Now'
            }
            return (value); // convert it to percentage
          }
        }
      }],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 100,
            min: -100,
            stepSize: 25,
            callback: function (value) {
              return (value) + '%'; // convert it to percentage
            }
          },
          display: true,

        }]
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  }
});


let timeChart = new Chart(timectx, {
  type: 'line',
  data: {
    labels: timeSeries['timeArray'],
    datasets: [{
      fill: false,
      label: "Neutral",
      borderColor: neutralBorderColor,
      backgroundColor: neutralColor,
      data: timeSeries['neutral']['avg'],
      borderWidth: lineWidth

    },
    {
      fill: false,
      label: "Happy",
      borderColor: happyBorderColor,
      backgroundColor: happyColor,
      data: timeSeries['happy']['avg'],
      borderWidth: lineWidth

    },
    {
      fill: false,
      label: "Unhappy",
      borderColor: unhappyBorderColor,
      backgroundColor: unhappyColor,
      data: timeSeries['unhappy']['avg'],
      borderWidth: lineWidth

    }]
  },
  options: {
    responsive: true,
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0
      }
    },
    maintainAspectRatio: false,
    fill: false,
    scales: {
      xAxes: [{
        // type: 'time',
        // time: {
        //   displayFormats: {
        //     'millisecond': 'hh:mm',
        //     'second': 'hh:mm',
        //     'minute': 'hh:mm',
        //     'hour': 'hh:mm',
        //     'day': 'hh:mm',
        //     'week': 'hh:mm',
        //     'month': 'hh:mm',
        //     'quarter': 'hh:mm',
        //     'year': 'hh:mm',
        //   }
        // },
        display: true,
        scaleLabel: {
          display: true,
          labelString: "Time (Minutes)",
        },
        ticks: {
          callback: function (value) {
            if (value == 0) {
              return 'Now';
            }
            return (value); // convert it to percentage
          }
        }
      }],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 100,
            min: 0,
            stepSize: 20,
            callback: function (value) {
              return (value) + '%'; // convert it to percentage
            }
          },
          display: true,
        }]
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  }
});

let lineChart = new Chart(linectx, {
  type: 'line',
  data: {
    labels: [-60, -55, -50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0],
    datasets: [{
      label: currentLineChart[0].toUpperCase() + currentLineChart.slice(1),
      data: emotionDetails[currentLineChart]['avg'],
      backgroundColor: emotionDetails[currentLineChart]['backgroundcolor'],
      borderWidth: lineWidth,
      borderColor: emotionDetails[currentLineChart]['bordercolor'],
      pointBorderColor: 'rgba(10, 183, 199,1)',
      pointBackgroundColor: 'rgba(10, 183, 199,0.8)',
    }]
  },
  options: {
    responsive: true,
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0
      }
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 100,
            min: 0,
            stepSize: 20,
            callback: function (value) {
              return (value) + '%'; // convert it to percentage
            }
          },
          display: true,

        }],
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Time (Seconds)",
          },
          ticks: {
            callback: function (value) {
              if (value == 0) {
                return 'Now';
              }
              return (value); // convert it to percentage
            }
          }
        }
      ]
    },
    legend: {
      display: false
    }
  }
});

let labels = Object.keys(emotionCount);
let data = [];
labels.forEach((key, index) => {
  data[index] = emotionCount[key]
})
let tempLabels = [];
labels.forEach(function (part, index) {
  tempLabels[index] = part[0].toUpperCase() + part.slice(1);
});
let myChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: tempLabels,
    datasets: [{
      label: 'Overall emotion',
      data: data,
      backgroundColor: backColorArray,
      borderColor: '#fff',
      borderWidth: 2
    }]
  },
  options: {
    tooltips: {
      enabled: false
    },

    responsive: true,
    maintainAspectRatio: false,
    events: ['click'],

    legend: {
      display: false
    },
  },

});

const chartEmotions = ['neutral', 'happy', 'unhappy'];

const emotions = ['neutral', 'happy', 'sad', 'angry', 'disgusted', 'fearful', 'surprised', 'disgusted'];
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo())

document.getElementById('pieChart').onclick = function (evt) {
  var activePoints = myChart.getElementsAtEvent(evt);
  if (activePoints.length > 0) {
    let indx = activePoints[0]["_index"];
    currentLineChart = labels[indx];
    switch (currentLineChart) {
      case 'neutral':
        lineChartEmogi.src = 'confused.png';
        chartLabel.innerHTML = 'LIVE Neutral Pulse';
        break;
      case 'happy':
        lineChartEmogi.src = 'happy.png';
        chartLabel.innerHTML = 'LIVE Happiness Pulse';
        break;
      // case 'surprised':
      //   lineChartEmogi.src = 'surprised.png';
      //   break;
      default:
        lineChartEmogi.src = 'sad.png';
        chartLabel.innerHTML = 'LIVE Sadness Pulse';
        break;
    }
    lineChart.data.datasets.forEach((dataset) => {
      dataset.label = currentLineChart[0].toUpperCase() + currentLineChart.slice(1);
      dataset.data = emotionDetails[currentLineChart]['avg'];
      dataset.backgroundColor = emotionDetails[currentLineChart]['backgroundcolor'];
      dataset.borderColor = emotionDetails[currentLineChart]['bordercolor'];
    });
    lineChart.update();
  }
}

function changeLineChart(currentEmotion) {
  currentLineChart = currentEmotion;
  switch (currentLineChart) {
    case 'neutral':
      lineChartEmogi.src = 'confused.png';
      break;
    case 'happy':
      lineChartEmogi.src = 'happy.png';
      break;
    // case 'surprised':
    //   lineChartEmogi.src = 'surprised.png';
    // break;
    default:
      lineChartEmogi.src = 'sad.png';
      break;
  }
  lineChart.data.datasets.forEach((dataset) => {
    dataset.label = currentLineChart[0].toUpperCase() + currentLineChart.slice(1);
    dataset.data = emotionDetails[currentLineChart]['avg'];
    dataset.backgroundColor = emotionDetails[currentLineChart]['backgroundcolor'];
    dataset.borderColor = emotionDetails[currentLineChart]['bordercolor'];
  });
  lineChart.update();
}


function startVideo() {
  startPlotting();
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
      inputSize: 800
    })).withFaceLandmarks().withFaceExpressions();
    faceCount.innerHTML = detections.length;
    currentEmotion = detections;

    let sumOfConfidence = 0;
    for (let j = 0; j < detections.length; j++) {
      let overProb = 0;
      let emotion = detections[j] ? detections[0]['expressions'] : undefined;
      if (emotion) {
        let faceDetection = detections[j]['detection'];
        sumOfConfidence = sumOfConfidence + faceDetection['classScore'];
        if (emotion) {
          let emotionProb = Object.values(emotion);
          let max = emotionProb[0];
          let maxIndex = 0;
          for (let i = 1; i < emotionProb.length; i++) {
            if (max < emotionProb[i]) {
              max = emotionProb[i];
              maxIndex = i;
            }
          }
          let emotionName = emotions[maxIndex];
          let count = 0;
          switch (emotionName) {
            case 'neutral':
              count = emotionCount[emotionName];
              count = count + 1;
              emotionCount[emotionName] = count;
              break;
            case 'happy':
              count = emotionCount[emotionName];
              count = count + 1;
              emotionCount[emotionName] = count;
              break;
            case 'surprised':
              let happyProb = emotion['happy'];
              let angryProb = emotion['angry'];
              let emotionToChange = 'unhappy';
              if (happyProb > angryProb) {
                emotionToChange = 'happy'
              }
              count = emotionCount[emotionToChange];
              count = count + 1;
              emotionCount[emotionToChange] = count;
              break;
            default:
              count = emotionCount['unhappy'];
              count = count + 1;
              emotionCount['unhappy'] = count;
              break;
          }
          let unhappyAvg = 0;
          emotions.forEach((val, index) => {
            switch (val) {
              case 'neutral':
                if (emotionDetails[val]['temp'].length > 12) {
                  emotionDetails[val]['temp'].shift();
                }
                if (!Number.isNaN(emotion[val]))
                  emotionDetails[val]['temp'].push(emotion[val] * 100);
                break;
              case 'happy':
                if (emotionDetails[val]['temp'].length > 12) {
                  emotionDetails[val]['temp'].shift();
                }
                if (!Number.isNaN(emotion[val]))
                  emotionDetails[val]['temp'].push(emotion[val] * 100);
                break;
              case 'surprised':
                //   let happyProb=emotion['happy'];
                //   let angryProb=emotion['angry'];
                //   emotionToChange='unhappy';
                //   if(happyProb>angryProb){
                //     emotionToChange='happy'
                //   }
                // if (emotionDetails[emotionToChange]['temp'].length > 12) {
                //   emotionDetails[emotionToChange]['temp'].shift();
                // }
                // if (!Number.isNaN(emotion[val]))
                //   emotionDetails[emotionToChange]['temp'].push(emotion[val] * 100);
                break;
              default:
                unhappyAvg = unhappyAvg + (emotion[val] * 100);
                break;
            }
          })
          if (emotionDetails['unhappy']['temp'].length > 12) {
            emotionDetails['unhappy']['temp'].shift();
          }
          emotionDetails['unhappy']['temp'].push(unhappyAvg / 2);
          let happyAvg = (emotionDetails['happy']['temp'][12] + emotionDetails['neutral']['temp'][12]) / 2;
          unhappyAvg = emotionDetails['unhappy']['temp'][12];
          let compoundScore = 0;
          if (unhappyAvg > happyAvg) {
            if (unhappyAvg > 40) {
              compoundScore = -100;
            }
            else {
              compoundScore = -50;
            }
          }
          else {
            if (happyAvg > 40) {
              compoundScore = 100;
            }
            else {
              compoundScore = 50;
            }
          }
          if (compoundData['data'].length > 15) {
            compoundData['data'].shift();
          }
          compoundData['data'].push(compoundScore);
          updateCompundChart();

        }
      }
      else {
        chartEmotions.forEach((val, index) => {
          if (emotionDetails[val]['temp'].length > 12) {
            emotionDetails[val]['temp'].shift();
          }
          if (!Number.isNaN(emotion[val]))
            emotionDetails[val]['temp'].push(0);
        })
      }
    }
    if (detections.length > 0) {
      let temp = sumOfConfidence / detections.length;
      temp = temp * 100;
      // confidence.innerHTML = temp.toFixed(2) + '%'
    } else {
      if (compoundData['data'].length > 15) {
        compoundData['data'].shift();
      }
      compoundData['data'].push(0);
      updateCompundChart();
      chartEmotions.forEach((val, index) => {
        if (emotionDetails[val]['temp'].length > 12) {
          emotionDetails[val]['temp'].shift();
        }
        emotionDetails[val]['temp'].push(0);
      })
    }
  }, 1000)
}
function updateCompundChart() {
  compoundChart.data.datasets.forEach((dataset) => {
    dataset.data = compoundData['data'];
  });
  compoundChart.update();
}
setInterval(() => {
  let unhappysum = 0;
  if (currentEmotion) {
    for (let j = 0; j < currentEmotion.length; j++) {
      let emotion = currentEmotion[j] ? currentEmotion[0]['expressions'] : undefined;
      if (emotion) {
        emotions.forEach((val, index) => {
          switch (val) {
            case 'neutral':
              if (timeSeries[val]['avg'].length > 16) {
                timeSeries[val]['avg'].shift();
              }
              timeSeries[val]['avg'].push(emotion[val] * 100);
              break;
            case 'happy':
              if (timeSeries[val]['avg'].length > 16) {
                timeSeries[val]['avg'].shift();
              }
              timeSeries[val]['avg'].push(emotion[val] * 100);
              break;
            case 'surprised':
              let happyProb = emotion['happy'];
              let angryProb = emotion['angry'];
              let emotionToChange = 'unhappy';
              if (happyProb > angryProb) {
                emotionToChange = 'happy'
              }
              if (timeSeries[emotionToChange]['avg'].length > 16) {
                timeSeries[emotionToChange]['avg'].shift();
              }
              timeSeries[emotionToChange]['avg'].push(emotion[val] * 100);
              break;
            default:
              unhappysum = unhappysum + (emotion[val] * 100);
              break;
          }
        })
        if (timeSeries['unhappy']['avg'].length > 16) {
          timeSeries['unhappy']['avg'].shift();
        }
        timeSeries['unhappy']['avg'].push(unhappysum / 4);
      }
    }
  }
  timeChart.data.labels = timeSeries['timeArray'],
    timeChart.data.datasets.forEach((dataset) => {
      dataset.data = timeSeries[dataset.label.toLowerCase()]['avg'];
    });
  timeChart.update();
  localStorage.setItem('timeData', JSON.stringify(timeSeries));
}, 900000);

function startPlotting() {
  setInterval(() => {

    chartEmotions.forEach((val, index) => {
      let avg = 0;
      let tempLen=emotionDetails[val]['temp'].length;
      for(let i=(tempLen-1);i>=(tempLen=5);i--){
        avg = avg+emotionDetails[val]['temp'][i];
      }
      avg = avg / 5;
      if (emotionDetails[val]['avg'].length > 12) {
        emotionDetails[val]['avg'].shift();
      }
      if (!Number.isNaN(avg))
        emotionDetails[val]['avg'].push(avg);
    })

    let labels = Object.keys(emotionCount)
    let tempLabels = [];
    let data = [];
    labels.forEach((key, index) => {
      data[index] = emotionCount[key];
    })
    labels.forEach(function (part, index) {
      tempLabels[index] = part[0].toUpperCase() + part.slice(1);
    });
    myChart.data.labels = tempLabels;
    myChart.data.datasets.forEach((dataset) => {
      dataset.data = data;
    });
    lineChart.data.datasets.forEach((dataset) => {

      dataset.data = emotionDetails[currentLineChart]['avg'];

    });
    lineChart.update();
    myChart.update();
    localStorage.setItem('lineData', JSON.stringify(emotionDetails));
    localStorage.setItem('pieData', JSON.stringify(emotionCount));

  }, 5000)
}

setInterval(() => {
  let happyCount = emotionCount['happy'] - emotionCountOld['happy'];
  let neutralCount = emotionCount['neutral'] - emotionCountOld['neutral'];
  let unhappyCount = emotionCount['unhappy'] - emotionCountOld['unhappy'];

  emotionCountOld['happy'] = emotionCount['happy'];
  emotionCountOld['neutral'] = emotionCount['neutral'];
  emotionCountOld['unhappy'] = emotionCount['unhappy'];

  var data = JSON.stringify({
    "sessionId": "8",
    "parentConnnectId": "2019-12-16T10:26:17.846Z",
    "neutral__c": neutralCount,
    "happy__c": happyCount,
    "surprised__c": 0,
    "unhappy__c": unhappyCount
  });

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
    }
  });
  xhr.open("POST", "https://espl-emotionrecognition.herokuapp.com/heroku/saveResults");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("accept", "application/json");
  xhr.send(data);

}, 60000)
