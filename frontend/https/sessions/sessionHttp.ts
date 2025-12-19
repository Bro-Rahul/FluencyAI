import { baseURL } from "..";

export const fetchData = async (file: File, callBack: (streamData: string) => void) => {

    const formData = new FormData();
    formData.append("user_id", "rahul")
    formData.append("audio_file", file);


    const response = await fetch(`${baseURL}/v1/api/session/create/`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        console.log(response.statusText);
    } else {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        while (!done) {
            const { done: readerDone, value } = await reader?.read();
            done = readerDone;
            if (value) {
                const chunks = decoder.decode(value, { stream: true })
                callBack(chunks);
            }
        }
    }
}
