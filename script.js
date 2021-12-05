// date setting
var today = moment();
$("#currentDay").text(today.format("dddd, MMMM Do"));

// set task object
var tasks = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
};

var setTasks = function() {
    // add to local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var getTasks = function() {
    
     // get tasks
    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (loadedTasks) {
        tasks = loadedTasks

        //create tasks
        $.each(tasks, function(hour, task) {
            var hourDiv = $("#" + hour);
            createTask(task, hourDiv);
        })
    }

    // show date and time
    auditTasks()
}

var createTask = function(taskText, hourDiv) {
    // make sure task matches date and time

    var taskDiv = hourDiv.find(".task");
    var taskP = $("<p>")
        .addClass("description")
        .text(taskText)
    taskDiv.html(taskP);
}

var auditTasks = function() {
    // update the background of each row based on the time of day //

    var currentHour = moment().hour();
    $(".task-info").each( function() {
        var elementHour = parseInt($(this).attr("id"));

        // handle past, present, and future
        if ( elementHour < currentHour ) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( elementHour === currentHour ) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

var replaceTextarea = function(textareaElement) {
    // persist data in local storeage

    // get elements
    var taskInfo = textareaElement.closest(".task-info");
    var textArea = taskInfo.find("textarea");

    // get date and time
    var time = taskInfo.attr("id");
    var text = textArea.val().trim();

    // persist the data
    tasks[time] = [text];  
    setTasks();

    
    createTask(text, taskInfo);
}

// Click


$(".task").click(function() {

    // save task if clicked
    $("textarea").each(function() {
        replaceTextarea($(this));
    })

    // convert to a textarea element if the time hasn't passed
    var time = $(this).closest(".task-info").attr("id");
    if (parseInt(time) >= moment().hour()) {

        // create a textInput element that includes the current task
        var text = $(this).text();
        var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);

        // add the textInput element to the parent div
        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

// save button click handler
$(".saveBtn").click(function() {
    replaceTextarea($(this));
})

// update task on the hour
timeToHour = 3600000 - today.milliseconds();  
setTimeout(function() {
    setInterval(auditTasks, 3600000)
}, timeToHour);

// get the tasks from local storage .
getTasks();