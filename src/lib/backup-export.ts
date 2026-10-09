import { Capacitor } from "@capacitor/core";
import {
  Directory,
  Encoding,
  Filesystem,
} from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export async function downloadOrShareBackup(
  backup: unknown,
): Promise<void> {
  const json = JSON.stringify(backup, null, 2);
  const fileName = `playshelf-backup-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")}.json`;

  if (Capacitor.isNativePlatform()) {
    const file = await Filesystem.writeFile({
      path: fileName,
      data: json,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });

    await Share.share({
      title: "PlayShelf Backup",
      text: "PlayShelf library backup",
      url: file.uri,
      dialogTitle: "Save or share your backup",
    });

    return;
  }

  const blob = new Blob([json], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "playshelf-backup.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}