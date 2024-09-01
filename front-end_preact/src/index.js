import { h, render } from "preact";
import { useEffect, useState } from "preact/hooks";
import VideoPlayer from "./components/VideoPlayer";
import CodeEditor from "./components/CodeEditor";
import "video.js/dist/video-js.css";
import styles from "./style/index.css";
import avatarImage from "./assets/images/avatar.svg";
import designerImage from "./assets/images/designer.svg";
import logoImage from "./assets/images/logo.svg";
import facebookIcon from "./assets/images/facebook-icon.png";
import youtubeIcon from "./assets/images/youtube-icon.png";
import InfoBox from "./components/InfoBox";

const App = () => {
  const [isCollapsibleVisible, setCollapsibleVisible] = useState(true);
  const toggleCollapsible = () => {
    setCollapsibleVisible(!isCollapsibleVisible);
  };
  const src = "http://192.168.1.71:8000"
  // const video_src = src + "/hls/index.m3u8"
  const video_src = 'http://192.168.1.71:8081/0/stream/'
  const default_src = src + "/api/code/get_default"
  const run_code_src = src + "/api/code/execute"
  const save_code_src = src + "/api/code/save"
  const [programs, setPrograms] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(exercises[0] || null)
  const [activeTab, setActiveTab] = useState("0")
  const handleExerciseSelect = (exerciseClicked) => {
    const isAlreadyOpen = exercises.find(
      (exercise) => exercise.id === exerciseClicked.id,
    )?.isOpen;
    if (isAlreadyOpen) return;
    setExercises(
      exercises.map((exercise) => ({
        ...exercise,
        isOpen: exercise.id === exerciseClicked.id,
      })),
    );
    setSelectedExercise(exerciseClicked);
    setPrograms(exerciseClicked.programs);
    setActiveTab(exerciseClicked.programs[0].fileId);
  };
  const handleTabChange = (tab) => setActiveTab(tab);
  const getCurrentFile = () =>
    programs.filter((program) => program.fileId === activeTab)[0];
  const handleCodeChange = (event) => {
    console.log("activeTab: ", activeTab);
    getCurrentFile().code = event.target.value;
    setPrograms([...programs]);
  };
  const getCode = () => {
    let current_file = programs.filter(
      (file) => file.fileId === activeTab + "",
    )[0];
    if (current_file) return current_file.code;
    return "";
  };
  const saveCode = () => {
    const body_data = {
      exerciseId: selectedExercise.id + "",
      programId: activeTab,
      code: getCode().replaceAll("\n", "{new_line}"),
    };
    console.log("Sending code...", JSON.stringify(body_data));
    fetch(save_code_src, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body_data),
      mode: "no-cors",
    })
      .then((r) => r.json())
      .catch((err) => {
        console.log(err);
        // enable(false);
      });
  };
  const sendCode = () => {
    const body_data = {
      exerciseId: selectedExercise.id + "",
      programId: activeTab,
      code: getCode().replaceAll("\n", "{new_line}"),
    };
    console.log("Sending code...", JSON.stringify(body_data));
    fetch(run_code_src, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body_data),
      mode: "no-cors",
    })
      .then((r) => r.json())
      .catch((err) => {
        console.log(err);
        // enable(false);
      });
  };
  const addNewProgram = () => {
    // TODO: make request to add new file
    const newFileId = (programs.length + 1).toString();
    const newFile = {
      fileId: newFileId,
      name: "New File",
      code: "Code, here...",
    };
    setPrograms([...programs, newFile]);
    setActiveTab(newFileId);
  };
  const deleteProgram = (fileId) => {
    // TODO: make request to delete file
    if (programs.length <= 1) return;
    const updatedPrograms = programs.filter((file) => file.fileId !== fileId);
    setPrograms(updatedPrograms);
    if (activeTab === fileId) {
      setActiveTab(updatedPrograms.length > 0 ? updatedPrograms[0].fileId : "");
    }
  };
  useEffect(() => {
    fetch(default_src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`,
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data fetched successfully:", data);
        const fetched_programs = data.programs.map((program) => {
          return {
            fileId: program.fileId + "",
            name: program.name,
            code: program.code,
            exerciseId: program.exercise_id,
          };
        });
        const fetched_exercises = data.exercises.map((exercise) => {
          return {
            id: exercise.exercise_id,
            name: exercise.name,
            programs: fetched_programs.filter(
              (program) => program.exerciseId === exercise.exercise_id,
            ),
            content: exercise.content || "Exercise content here...",
            isOpen: exercise.exerciseId == 1 ? true : false, // used for the accordion
          };
        });
        setExercises(fetched_exercises);
        setSelectedExercise(exercises[0] || null);
        setPrograms(selectedExercise.programs);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  useEffect(() => {
    if (exercises) setSelectedExercise(exercises[0] || null);
  }, [exercises, selectedExercise]);
  // console.log(selectedExercise)
  return (
    <div className="bg-slate-900 text-gray-100 flex flex-col">
      <header className="mx-auto max-w-screen-lg px-3 py-6">
        <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
          <a href="/">
            <div class="flex items-center bg-gradient-to-br from-sky-500 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
              <img
                class="h-12 w-12 m-2"
                src={logoImage}
                alt="logo"
                loading="lazy"
              />
              <h1>Educatronic</h1>
            </div>
          </a>
        </div>
        <nav>
          <ul class="flex gap-x-3 font-medium text-gray-200">
            <li class="hover:text-white">
              <a href="/">HOME</a>
            </li>
            <li class="hover:text-white">
              <a href="/educational-robotics">Educational Robotics</a>
            </li>
            <li class="hover:text-white">
              <a href="https://github.com/almanzamarfrancisco/compiler">
                GitHub
              </a>
            </li>
            <li class="hover:text-white">
              <a href="/about-us">About us</a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow">
        <div class="mx-auto max-w-screen-lg px-3 py-6">
          <div class="flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
            <div>
              <h1 class="text-3xl font-bold">Hi there!👋 </h1>
              <p class="mt-6 text-xl leading-9">
                <span class="bg-gradient-to-br from-sky-500 to-cyan-400 bg-clip-text text-transparent">
                  Welcome to Educatrónica!{" "}
                </span>
                Here you can code little programs to approach the exersices and learn
                about electronics and programming. The best part! You will be
                able to see the results of your code execution in streamed in live! ⊂(◉‿◉)つ. <br/>
                In this ocasion, we will be using an elevator; to code your programs you can use the following sintax:
              </p>
              <ul>
                <li> =&gt; Start: S or s </li>
                <li> =&gt; Up: U or u </li>
                <li> =&gt; Down: D or d </li>
                <li> =&gt; Open/Close: O or o [wating seconds] </li>
                <li> =&gt; Wait: W or w [waiting seconds] </li>
                <li> =&gt; End: E or e </li>
              </ul>
              <div class="mt-3 flex gap-1">
                <a href="../facebook">
                  <img
                    class="h-12 w-12 hover:translate-y-1"
                    src={facebookIcon}
                    alt="Facebook icon"
                    loading="lazy"
                  />
                </a>
                <a href="../youtube">
                  <img
                    class="h-12 w-12 hover:translate-y-1"
                    src={youtubeIcon}
                    alt="Youtube icon"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
            <div class="shrink-0">
              <img
                class="h-80 w-64"
                src={designerImage}
                alt="Avatar image"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div class="mx-auto max-w-screen-lg px-3 py-6 flex flex-col md:flex-row md:gap-x-4">
          <div className="w-full md:w-1/3 bg-gray-700 text-white mb-4 md:mb-0 rounded-md">
            <InfoBox exercises={exercises} onSelectExercise={handleExerciseSelect} />
          </div>
          <div className="w-full md:w-2/3 flex-grow bg-gray-700 text-white p-4 rounded-md">
            {selectedExercise && (
              <CodeEditor
                programs={programs}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                getCurrentFile={getCurrentFile}
                handleCodeChange={handleCodeChange}
                getCode={getCode}
                addNewProgram={addNewProgram}
                deleteProgram={deleteProgram}
                sendCode={sendCode}
                saveCode={saveCode}
              />
            )}
          </div>
        </div>
        <div class="mx-auto max-w-screen-lg px-3 py-6 flex flex-col md:flex-row md:gap-x-4">
          <button
            onClick={toggleCollapsible}
            className="mt-4 mx-auto bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isCollapsibleVisible ? "Hide" : "Show"} live video
          </button>
        </div>
        <div class="mx-auto max-w-screen-lg px-3 py-6 flex flex-col md:flex-row md:gap-x-4">
          {isCollapsibleVisible && (
            <div className="mt-4 p-4 bg-gray-800 rounded w-full">
              <h3 className="text-lg font-bold mb-2 mx-auto max-w-screen-lg">
                Live video
              </h3>
              {/* <img src={video_src} border="0" width="95%" class="rotate-180"/> */}
              <VideoPlayer streamUrl={video_src} />
              {/* <VideoPlayer src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8" /> */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

render(<App />, document.getElementById("root"));
