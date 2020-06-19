var json_data = data.today;
var navLabel = ["TODAY", "1W", "2W", "3W", "1M", "THIS YEAR"];
var dataLabel = [
  "today",
  "first_week",
  "second_week",
  "third_week",
  "first_month",
  "this_year"
];
updateValue();
//--------------------------------------navbar-----------------------------------------------------
$(document).ready(function() {
  $("#navbar_select").select2({ dropdownAutoWidth: true });
  $(".dashboard_container > .navbar .nav-item").click(function() {
    json_data =
      data[
        dataLabel[
          navLabel.indexOf(
            $(this)
              .text()
              .trim()
          )
        ]
      ];
    updateValue();
    $(".rounded_box_header .date_range .value").text(
      $(this)
        .text()
        .trim()
    );
    $(".dashboard_container > .navbar .nav-item").removeClass("active");
    $(this).addClass("active");
  });
});

function updateValue() {
  //------------------------------- clinic visit activity------------------------------------------
  var clinic = {
    bar: {
      scheduled: json_data.activity.bar.schedule,
      rescheduled: json_data.activity.bar.reschedule,
      walk_ins: json_data.activity.bar.walkins,
      failed: json_data.activity.bar.failed
    },
    chart: {
      total_visit: json_data.activity.chart.total,
      time: {
        avg_visit: json_data.activity.chart.average,
        wait: json_data.activity.chart.wait
      },
      health: json_data.activity.chart.ooc,
      outside_cost: json_data.activity.chart.cost
    }
  };
  //// time chart
  var timeBackgroundData = {
    datasets: [
      {
        data: [100, 0],
        hoverBackgroundColor: ["#3ec556", "rgba(0,0,0,0)"],
        label: "1"
      },
      {
        data: [100, 0],
        hoverBackgroundColor: ["#3ec556", "rgba(0,0,0,0)"],
        label: "2"
      }
    ]
  };

  var timeBackgroundOpt = {
    cutoutPercentage: 67,
    animation: {
      animationRotate: true,
      duration: 0
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    responsive: true
  };

  new Chart($("#timeCanvas1"), {
    type: "doughnut",
    data: timeBackgroundData,
    options: timeBackgroundOpt
  });

  Chart.defaults.RoundedDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
  Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
    draw: function(ease) {
      var ctx = this.chart.chart.ctx;

      var easingDecimal = ease || 1;
      Chart.helpers.each(this.getMeta().data, function(arc, index) {
        arc.transition(easingDecimal).draw();

        var vm = arc._view;
        var radius = (vm.outerRadius + vm.innerRadius) / 2;
        var thickness = (vm.outerRadius - vm.innerRadius) / 2;
        var angle = Math.PI - vm.endAngle - Math.PI / 2;

        ctx.save();
        ctx.fillStyle = vm.backgroundColor;
        ctx.translate(vm.x, vm.y);
        ctx.beginPath();
        ctx.arc(
          radius * Math.sin(angle),
          radius * Math.cos(angle),
          thickness,
          0,
          2 * Math.PI
        );
        ctx.arc(
          radius * Math.sin(Math.PI),
          radius * Math.cos(Math.PI),
          thickness,
          0,
          2 * Math.PI
        );
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    }
  });

  var timeDeliveredData = {
    labels: ["Value"],
    datasets: [
      {
        data: [clinic.chart.time.avg_visit, 100 - clinic.chart.time.avg_visit],
        backgroundColor: ["#009ada", "rgba(0,0,0,0)"],
        hoverBackgroundColor: ["#009ada", "rgba(0,0,0,0)"],
        borderWidth: [1, 0]
      },
      {
        data: [clinic.chart.time.wait, 100 - clinic.chart.time.wait],
        backgroundColor: ["#ef4136", "rgba(0,0,0,0)"],
        hoverBackgroundColor: ["#ef4136", "rgba(0,0,0,0)"],
        borderWidth: [1, 0]
      }
    ]
  };

  var timeDeliveredOpt = {
    cutoutPercentage: 67,
    animation: {
      animationRotate: true,
      duration: 2000
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    responsive: true
  };

  new Chart($("#timeCanvas2"), {
    type:
      timeDeliveredData.datasets[0].data[0] == 0
        ? "doughnut"
        : "RoundedDoughnut",
    data: timeDeliveredData,
    options: timeDeliveredOpt
  });

  //// health chart
  var healthBackgroundData = {
    datasets: [
      {
        data: [100, 0],
        hoverBackgroundColor: ["#3ec556", "rgba(0,0,0,0)"],
        label: "1"
      }
    ]
  };

  var healthBackgroundOpt = {
    cutoutPercentage: 67,
    animation: {
      animationRotate: true,
      duration: 0
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    responsive: true
  };

  new Chart($("#healthCanvas1"), {
    type: "doughnut",
    data: healthBackgroundData,
    options: healthBackgroundOpt
  });

  var healthDeliveredData = {
    labels: ["Value"],
    datasets: [
      {
        data: [clinic.chart.health, 100 - clinic.chart.health],
        backgroundColor: ["#009ada", "rgba(0,0,0,0)"],
        hoverBackgroundColor: ["#009ada", "rgba(0,0,0,0)"],
        borderWidth: [1, 0]
      }
    ]
  };

  var healthDeliveredOpt = {
    cutoutPercentage: 67,
    animation: {
      animationRotate: true,
      duration: 2000
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    responsive: true
  };

  new Chart($("#healthCanvas2"), {
    type:
      healthDeliveredData.datasets[0].data[0] == 0
        ? "doughnut"
        : "RoundedDoughnut",
    data: healthDeliveredData,
    options: healthDeliveredOpt
  });
  //// input value
  $(".clinic_container .total_visit .total_visit_value").text(
    clinic.chart.total_visit
  );
  $(
    ".clinic_container .chart_bar .time_chart .chart > .chart_center > .center_up"
  ).text(clinic.chart.time.avg_visit);
  $(
    ".clinic_container .chart_bar .time_chart .chart > .chart_center > .center_down"
  ).text(clinic.chart.time.wait);
  $(
    ".clinic_container .chart_bar .health_chart .chart > .chart_center > .center_value"
  ).text(clinic.chart.health);
  $(
    ".clinic_container .chart_bar .outside_cost .chart > .chart_in .chart_center .value"
  ).text(clinic.chart.outside_cost);
  $(".clinic_container .mark_bar .scheduled").text(clinic.bar.scheduled);
  $(".clinic_container .mark_bar .rescheduled").text(clinic.bar.rescheduled);
  $(".clinic_container .mark_bar .walk_ins").text(clinic.bar.walk_ins);
  $(".clinic_container .mark_bar .failed").text(clinic.bar.failed);

  //----------------------------------------------Visit Types---------------------------------------------
  var visit = {
    marker: {
      surveillance: json_data.visit.surveillance,
      injuries: json_data.visit.injures,
      pre_placement: json_data.visit.placement,
      other: json_data.visit.other
    },
    chart: {
      surveillance: json_data.visit.chart[0].data,
      injuries: json_data.visit.chart[1].data,
      pre_placement: json_data.visit.chart[2].data,
      other: json_data.visit.chart[3].data
    }
  };

  var visitData = {
    labels: [
      "1/1/20",
      "1/2/20",
      "1/3/20",
      "1/4/20",
      "1/5/20",
      "1/6/20",
      "1/7/20"
    ],
    datasets: [
      {
        label: "Prime and Fibonacci",
        borderColor: "#ededed",
        backgroundColor: "transparent",
        pointColor: "#ededed",
        data: visit.chart.surveillance,
        tension: 0
      },
      {
        label: "My Second dataset",
        borderColor: "#009ada",
        backgroundColor: "transparent",
        pointColor: "#009ada",
        data: visit.chart.injuries,
        tension: 0
      },
      {
        label: "Prime and Fibonacci",
        borderColor: "#ededed",
        backgroundColor: "transparent",
        pointColor: "#ededed",
        data: visit.chart.pre_placement,
        tension: 0
      },
      {
        label: "My Second dataset",
        borderColor: "#ededed",
        backgroundColor: "transparent",
        pointColor: "#ededed",
        data: visit.chart.other,
        tension: 0
      }
    ]
  };
  var visitOptions = {
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false
          },
          angleLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            min: 0,
            max: 30,
            stepSize: 10
          },
          gridLines: {
            borderDash: [1, 5],
            color: "#dfdfdf"
          }
        }
      ]
    },
    responsive: true, 
    maintainAspectRatio: false
  };
  var visit_chart = new Chart($("#visit_canvas"), {
    type: "line",
    data: visitData,
    options: visitOptions
  });
  $(".visit_container .marker.surveillance > .value").text(
    visit.marker.surveillance
  );
  $(".visit_container .marker.injuries > .value").text(visit.marker.injuries);
  $(".visit_container .marker.pre_placement > .value").text(
    visit.marker.pre_placement
  );
  $(".visit_container .marker.other > .value").text(visit.marker.other);

  $(document).ready(function() {
    $(".visit_container .marker").click(function(e) {
      $(".visit_container .marker").removeClass("active");
      $(this).addClass("active");
    });
    $(".visit_container .marker.surveillance").click(function() {
      visitData.datasets[0].borderColor = "#009ada";
      visitData.datasets[0].pointColor = "#009ada";
      visitData.datasets[1].borderColor = "#ededed";
      visitData.datasets[1].pointColor = "#ededed";
      visitData.datasets[2].borderColor = "#ededed";
      visitData.datasets[2].pointColor = "#ededed";
      visitData.datasets[3].borderColor = "#ededed";
      visitData.datasets[3].pointColor = "#ededed";
      visit_chart.update();
    });
    $(".visit_container .marker.injuries").click(function() {
      visitData.datasets[0].borderColor = "#ededed";
      visitData.datasets[0].pointColor = "#ededed";
      visitData.datasets[1].borderColor = "#009ada";
      visitData.datasets[1].pointColor = "#009ada";
      visitData.datasets[2].borderColor = "#ededed";
      visitData.datasets[2].pointColor = "#ededed";
      visitData.datasets[3].borderColor = "#ededed";
      visitData.datasets[3].pointColor = "#ededed";
      visit_chart.update();
    });
    $(".visit_container .marker.pre_placement").click(function() {
      visitData.datasets[0].borderColor = "#ededed";
      visitData.datasets[0].pointColor = "#ededed";
      visitData.datasets[1].borderColor = "#ededed";
      visitData.datasets[1].pointColor = "#ededed";
      visitData.datasets[2].borderColor = "#009ada";
      visitData.datasets[2].pointColor = "#009ada";
      visitData.datasets[3].borderColor = "#ededed";
      visitData.datasets[3].pointColor = "#ededed";
      visit_chart.update();
    });
    $(".visit_container .marker.other").click(function() {
      visitData.datasets[0].borderColor = "#ededed";
      visitData.datasets[0].pointColor = "#ededed";
      visitData.datasets[1].borderColor = "#ededed";
      visitData.datasets[1].pointColor = "#ededed";
      visitData.datasets[2].borderColor = "#ededed";
      visitData.datasets[2].pointColor = "#ededed";
      visitData.datasets[3].borderColor = "#009ada";
      visitData.datasets[3].pointColor = "#009ada";
      visit_chart.update();
    });
  });

  //---------------------------------------------Services / Tests Provided------------------------------------
  var services = {
    full: 140,
    audiometry: json_data.service.audiometry,
    spirometry: json_data.service.spirometry,
    drug_screen: json_data.service.drug,
    respirator: json_data.service.respirator,
    dot: json_data.service.dot,
    other: json_data.service.other
  };

  $(".progress.audiometry .progress-bar > span:nth-child(2)").text(
    services.audiometry
  );
  $(".progress.audiometry .progress-bar").css(
    "width",
    (services.audiometry / services.full) * 100 + "%"
  );
  $(".progress.spirometry .progress-bar > span:nth-child(2)").text(
    services.spirometry
  );
  $(".progress.spirometry .progress-bar").css(
    "width",
    (services.spirometry / services.full) * 100 + "%"
  );
  $(".progress.drug_screen .progress-bar > span:nth-child(2)").text(
    services.drug_screen
  );
  $(".progress.drug_screen .progress-bar").css(
    "width",
    (services.drug_screen / services.full) * 100 + "%"
  );
  $(".progress.respirator .progress-bar > span:nth-child(2)").text(
    services.respirator
  );
  $(".progress.respirator .progress-bar").css(
    "width",
    (services.respirator / services.full) * 100 + "%"
  );
  $(".progress.dot .progress-bar > span:nth-child(2)").text(services.dot);
  $(".progress.dot .progress-bar").css(
    "width",
    (services.dot / services.full) * 100 + "%"
  );
  $(".progress.other .progress-bar > span:nth-child(2)").text(services.other);
  $(".progress.other .progress-bar").css(
    "width",
    (services.other / services.full) * 100 + "%"
  );

  //-----------------------------------OCCUPATIONAL INJURY / ILLNESS ACTIVITY-----------------------------------
  var injury = {
    lost: json_data.occupational.lost,
    cases: json_data.occupational.cases,
    osha: json_data.occupational.osha,
    total: json_data.occupational.total
  };
  $(".injury_container .marker.lost .value").text(injury.lost);
  $(".injury_container .marker.cases .value").text(injury.cases);
  $(".injury_container .marker.osha .value").text(injury.osha);
  $(".injury_container .marker.total .value").text(injury.total);

  //-----------------------------------------DISABILITY / CASE MANAGEMENT ACTIVITY---------------------------------------
  var disability = {
    lost: json_data.disability.lost,
    cases: json_data.disability.cases,
    total: json_data.disability.total,
    days: json_data.disability.days
  };
  $(".disability_container .marker.lost .value").text(disability.lost);
  $(".disability_container .marker.cases .value").text(disability.cases);
  $(".disability_container .marker.total .value").text(disability.total);
  $(".disability_container .marker.days .value").text(disability.days);

  //-------------------------------------MEDICAL / HEALTH SURVEILLANCE ACTIVITY-------------------------------------------
  var medical = {
    bar: {
      exams: json_data.medical.date,
      compliance: json_data.medical.incompliance,
      past: json_data.medical.past,
      out: json_data.medical.outcompliance
    },
    progress: {
      asbestos: {
        value: json_data.medical.asbestos,
        label: "39 (72%)"
      },
      cadmium: {
        value: json_data.medical.cadmium,
        label: "23 (92%)"
      },
      lead: {
        value: json_data.medical.lead,
        label: "7 (100%)"
      },
      other: {
        value: json_data.medical.other,
        label: "19 (84%)"
      }
    }
  };
  $(".medical_container .marker.exams .value").text(medical.bar.exams);
  $(".medical_container .marker.compliance .value").text(
    medical.bar.compliance
  );
  $(".medical_container .marker.past .value").text(medical.bar.past);
  $(".medical_container .marker.exams .out").text(medical.bar.out);

  $(".medical_container .progress.asbestos .progress-bar").css(
    "width",
    medical.progress.asbestos.value + "%"
  );
  $(".medical_container .progress_wrapper > .progress.asbestos > span").text(
    medical.progress.asbestos.label
  );
  $(".medical_container .progress.cadmium .progress-bar").css(
    "width",
    medical.progress.cadmium.value + "%"
  );
  $(".medical_container .progress_wrapper > .progress.cadmium > span").text(
    medical.progress.cadmium.label
  );
  $(".medical_container .progress.lead .progress-bar").css(
    "width",
    medical.progress.lead.value + "%"
  );
  $(".medical_container .progress_wrapper > .progress.lead > span").text(
    medical.progress.lead.label
  );
  $(".medical_container .progress.other .progress-bar").css(
    "width",
    medical.progress.other.value + "%"
  );
  $(".medical_container .progress_wrapper > .progress.other > span").text(
    medical.progress.other.label
  );

  //----------------------------- PORTAL ACTIVITY ----------------------------------
  var portal = {
    appointment: {
      center: json_data.portal.appointment.value,
      saved: json_data.portal.appointment.description
    },
    question: {
      center: json_data.portal.questionnaires.value,
      saved: json_data.portal.questionnaires.description
    }
  };

  $(".activity_container .appointment .center .value").text(
    portal.appointment.center
  );
  $(
    ".activity_container .appointment .center .label_wrapper .label_value"
  ).text(portal.appointment.saved);
  $(".activity_container .question .center .value").text(
    portal.question.center
  );
  $(".activity_container .question .center .label_wrapper .label_value").text(
    portal.question.saved
  );
}

/////////////////////////////////// Common Function ///////////////////////////////////////////////////////////
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
