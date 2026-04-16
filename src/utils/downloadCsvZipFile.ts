import { csvParse, csvFormat } from "d3-dsv";

export const downloadCsv = async (csvUrl: string, mapping: Record<string, string>, tenantUuid: string, anchor?: HTMLAnchorElement) => {
    try {
        const res = await fetch(csvUrl);
        const text = await res.text();
        const data = csvParse(text);

        if (!data.length) throw new Error("CSV empty");

        const reverseMap: Record<string, string> = {};
        Object.entries(mapping).forEach(([clientHeader, dbField]) => { reverseMap[dbField] = clientHeader; });

        const updatedData = data.map((row: any) => {
            const newRow: any = {};
            Object.keys(row).forEach((key) => {
                const newKey = reverseMap[key] || key;
                newRow[newKey] = row[key];
            });
            return newRow;
        });

        const newCsv = csvFormat(updatedData);
        const blob = new Blob([newCsv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = anchor || document.createElement("a");

        a.href = url;
        a.download = `request-report-${tenantUuid}-${Date.now()}.csv`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

        setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 100);
    } catch (err) {
        console.error("CSV download failed:", err);
    }
};

export const downloadZip = async (zipUrl: string, tenantUuid: string, anchor?: HTMLAnchorElement) => {
    const res = await fetch(zipUrl);
    if (!res.ok) throw new Error("Failed to download zip");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = anchor || document.createElement("a");

    a.href = url;
    a.download = `request-report-${tenantUuid}-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // URL.revokeObjectURL(url);
    setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 100);
};

// export const downloadZip = async (fileUrl: string, tenantUuid: string, anchor?: HTMLAnchorElement) => {
//     try {
//         // fetch recording with cookies/auth
//         const res = await fetch(fileUrl, { credentials: "include" });
//         if (!res.ok) { throw new Error(`Recording fetch failed: ${res.status}`); }

//         const blob = await res.blob();
//         if (!blob.size) throw new Error("Recording file empty");

//         // detect extension from content-type or url
//         const contentType = res.headers.get("content-type") || "";
//         let ext = "dat";

//         if (contentType.includes("audio/mpeg")) ext = "mp3";
//         else if (contentType.includes("audio/wav")) ext = "wav";
//         else if (contentType.includes("audio/ogg")) ext = "ogg";
//         else {
//             const urlExt = fileUrl.split(".").pop();
//             if (urlExt) ext = urlExt.split("?")[0];
//         }

//         // create ZIP
//         const zip = new JSZip();
//         zip.file(`recording-${tenantUuid}.${ext}`, blob);

//         const zipBlob = await zip.generateAsync({ type: "blob" });
//         if (!zipBlob.size) throw new Error("Generated ZIP empty");

//         // download ZIP (same pattern as yours)
//         const url = URL.createObjectURL(zipBlob);
//         const a = anchor || document.createElement("a");

//         a.href = url;
//         a.download = `recording-${tenantUuid}-${Date.now()}.zip`;
//         a.style.display = "none";

//         document.body.appendChild(a);
//         a.click();

//         setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 100);
//     } catch (err) {
//         console.error("Recording ZIP download error:", err);
//     }
// };

// export const downloadZip = async (zipUrl: string, tenantUuid: string, anchor?: HTMLAnchorElement) => {
//     try {
//         const res = await fetch(zipUrl, { credentials: "include" });
//         if (!res.ok) { throw new Error(`ZIP fetch failed: ${res.status}`); }

//         const blob = await res.blob();
//         if (!blob.size) throw new Error("ZIP file empty");

//         const url = URL.createObjectURL(blob);
//         const a = anchor || document.createElement("a");

//         a.href = url;
//         a.download = `request-report-${tenantUuid}-${Date.now()}.zip`;
//         a.style.display = "none";

//         document.body.appendChild(a);
//         a.click();

//         setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 100);
//     } catch (err) {
//         console.error("ZIP download error:", err);
//     }
// };