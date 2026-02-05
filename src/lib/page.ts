export const buildVolumeCoverUrl = (volume: number) => {
  const volumeStr = volume.toString().padStart(2, "0");
  return `https://bucket.readbagabondo.com/covers/volume-${volumeStr}.jpg`;
};

export const buildPageUrl = ({
  volume,
  chapter,
  page,
}: {
  volume: number;
  chapter: number;
  page: number;
}) => {
  const volumeStr = volume.toString().padStart(2, "0");
  const chapterStr = chapter.toString().padStart(3, "0");
  const pageStr = page.toString().padStart(3, "0");
  return `https://bucket.readbagabondo.com/volume-${volumeStr}/chapter-${chapterStr}/page-${pageStr}.png`;
};
