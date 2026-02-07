export const analyzeCV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://127.0.0.1:8000/analyze-cv", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const startInterviewApi = async (file: File, tech: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("selected_tech", tech);

  const res = await fetch("http://127.0.0.1:8000/start-interview", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
